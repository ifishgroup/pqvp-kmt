// Test checking wether Insight API is responding or not
const request = require('./includes/request');

test('Insight API server is responding', async () => {
  expect.assertions(1);
  const data = await request.getRawOutput('');
  expect(data).toEqual('Insight API "api_v1" has been setup successfully.');
});
