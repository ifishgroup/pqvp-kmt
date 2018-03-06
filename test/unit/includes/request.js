// Request engine

// request.js
const http = require('http');
const config = require('./config');

const request = {
  make(host, port, endpoint) {
    return new Promise(resolve => {
      const options = this.getOptions(host, port, endpoint);

      http.get(options, response => {
        let data = '';
        response.on('data', _data => {
          data += _data;
        });
        response.on('end', () => resolve(data));
      });
    });
  },
  getRawOutput(path) {
    // returns a raw string
    const fullPath = config.api + path;
    return this.make(config.host, config.port, fullPath).then(output => output);
  },
  getParsedOutput(path) {
    // returns a Javascript Object
    const result = this.getRawOutput(path);
    return Promise.resolve(result).then(JSON.parse);
  },
  getOptions(host, portnumber, endpoint) {
    return {
      protocol: 'http:',
      host,
      port: portnumber,
      path: endpoint,
    };
  },
};

module.exports = request;
