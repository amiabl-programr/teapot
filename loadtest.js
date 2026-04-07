import autocannon from 'autocannon';

const instance = autocannon({
  url: 'http://localhost:4180/v1/brew',
  connections: 1000,
  pipelining: 1,
  duration: 10, // 10,000 simultaneous refusals usually happen in <1s, 10s is plenty to average
  method: 'POST',
  headers: {
    'X-Teapot-Key': 'guest',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ teaType: 'Chamomile' })
}, (err, result) => {
    if (err) {
        console.error('Error during load test', err);
    } else {
        console.log('Load test completed.');
        console.log(`Req/Sec: ${result.requests.average}`);
        console.log(`p99 Latency: ${result.latency.p99} ms (must be < 50ms)`);
        console.log(`418 Responses: ${result['4xx']}`);
    }
});

process.once('SIGINT', () => {
  instance.stop();
});
console.log('Running 10s load test... Prepare for profound refusal rates.');
