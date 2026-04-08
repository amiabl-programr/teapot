// RFC 2324 compliant: all coffee requests result in immediate rejection.
let selectedTea = 'Earl Grey';
let attempts = 0;
let startTime = Date.now();
let brewing = false;

// Uptime counter
setInterval(() => {
  const secs = Math.floor((Date.now() - startTime) / 1000);
  const el = document.getElementById('uptime');
  if (secs < 60) el.textContent = secs + 's';
  else if (secs < 3600) el.textContent = Math.floor(secs / 60) + 'm';
  else el.textContent = Math.floor(secs / 3600) + 'h';
}, 1000);

function selectTea(btn) {
  document
    .querySelectorAll('.tea-btn')
    .forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  selectedTea = btn.dataset.tea;
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function attemptBrew() {
  if (brewing) return;
  brewing = true;

  const brewBtn = document.getElementById('brewBtn');
  const progressSteps = document.getElementById('progressSteps');
  const responseCard = document.getElementById('responseCard');

  brewBtn.disabled = true;
  brewBtn.textContent = 'Brewing...';
  responseCard.classList.remove('visible');
  progressSteps.classList.add('visible');

  // Start the actual fetch call in the background
  let apiResponse = null;
  let responseData = null;
  try {
    apiResponse = await fetch('/api/v1/brew', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Teapot-Key': 'teamaster',
      },
      body: JSON.stringify({ teaType: selectedTea }),
    });
    responseData = await apiResponse.json();
  } catch (error) {
    console.error('Fetch error:', error);
    responseData = { message: 'Failed to contact the enterprise teapot', status: 'error' };
  }

  const steps = [
    {
      id: 'step1',
      result: 'success',
      label: 'Tea request validated successfully',
    },
    {
      id: 'step2',
      result: 'success',
      label: 'Kettle temperature: 18°C (way too cold)',
    },
    {
      id: 'step3',
      result: 'success',
      label: 'Water level: 0% (critically empty)',
    },
    { id: 'step4', result: 'success', label: 'Geneva Convention consulted' },
    { id: 'step5', result: 'fail', label: apiResponse?.status === 429 ? 'Brew failed: The kettle needs time to cool down.' : 'Brew failed: I am a teapot' },
  ];

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    const el = document.getElementById(s.id);
    el.classList.add('visible', 'running');
    el.querySelector('.step-icon').textContent = '⟳';
    await delay(550);
    el.classList.remove('running');
    if (s.result === 'success') {
      el.classList.add('success');
      el.querySelector('.step-icon').textContent = '✓';
    } else {
      el.classList.add('fail');
      el.querySelector('.step-icon').textContent = '✗';
      document.getElementById('teapot').classList.add('shaking');
      setTimeout(
        () => document.getElementById('teapot').classList.remove('shaking'),
        700,
      );
    }
    el.querySelector('.step-icon').nextSibling.textContent = ' ' + s.label;
    await delay(180);
  }

  await delay(400);
  showResponse(responseData, apiResponse?.status || 500);
  if (apiResponse?.status === 418) launchConfetti();

  attempts++;
  document.getElementById('totalAttempts').textContent = attempts;
  brewing = false;
}

function showResponse(data, status) {
  const responseCard = document.getElementById('responseCard');
  const jsonBlock = document.getElementById('jsonBlock');

  // Pretty print the actual API response
  const stringified = JSON.stringify(data, null, 2);
  let highlighted = stringified
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Simple syntax highlighting regex
  highlighted = highlighted.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    let cls = 'json-str';
    if (/^"/.test(match)) {
        if (/:$/.test(match)) {
            cls = 'json-key';
        }
    } else if (/true|false/.test(match)) {
        cls = 'json-bool';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });

  jsonBlock.innerHTML = `<span class="json-ts">HTTP ${status}</span>\n` + highlighted;

  responseCard.classList.add('visible');
  document.getElementById('brewBtn').textContent = '☕ BREW';
}

function resetForm() {
  document.getElementById('progressSteps').classList.remove('visible');
  document.getElementById('responseCard').classList.remove('visible');
  document.querySelectorAll('.step').forEach((s) => {
    s.classList.remove('visible', 'running', 'success', 'fail');
  });
  document.getElementById('brewBtn').disabled = false;
  document.getElementById('brewBtn').textContent = '☕ BREW';
}

function launchConfetti() {
  const colors = ['#C8821A', '#7A4E10', '#F5C97A', '#3B2010', '#D4A04A'];
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.bottom = '0';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.animationDuration = 1.2 + Math.random() * 1.2 + 's';
      el.style.animationDelay = Math.random() * 0.5 + 's';
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2500);
    }, i * 40);
  }
}

async function tryBrew418Coffee() {
  try {
    // Actually hit the backend to enforce the rejection metric
    await fetch('/api/v1/brew/coffee', { method: 'POST', headers: { 'X-Teapot-Key': 'teamaster' } });
  } catch (e) {
    console.error(e);
  }
  document.getElementById('explosion').classList.add('visible');
  attempts++;
  document.getElementById('totalAttempts').textContent = attempts;
}

function closeExplosion() {
  document.getElementById('explosion').classList.remove('visible');
}
