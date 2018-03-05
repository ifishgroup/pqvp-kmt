// Configuration options for all tests, such as URL for the Insight API, Insight user, Insight articles, etc.
//
//

function getHostNameFromEnv() {
  const env = process.env.NODE_ENV;
  let api;

  switch (env) {
    case 'production':
      api = 'insight.ifglabs.com';
      break;
    case 'dev':
    case 'test':
    default:
      api = 'localhost';
      break;
  }

  return api;
}

const config = {
  host: getHostNameFromEnv(),
  port: '3003',
  api: '/api/',
  sysadmin: 'ssined@insight-kmt.com',
  author: 'pjacobs@insight-kmt.com',
  cmanager: 'csmith@insight-kmt.com',
  executive: 'bboss@insight-kmt.com',
  password: 'abcd1234!',
};

module.exports = config;
