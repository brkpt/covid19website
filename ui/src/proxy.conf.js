const PROXY_CONFIG = {
  "**": {
    "target": "http://ec2-3-95-10-127.compute-1.amazonaws.com:9000",
    "secure": false,
    "bypass": function (req) {
      if (req && req.headers && req.headers.accept && req.headers.accept.indexOf("html") !== -1) {
        console.log("Skipping proxy for browser request.");
        return "/index.html";
      }
    }
  }
};

module.exports = PROXY_CONFIG;
