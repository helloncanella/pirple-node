const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./lib/config");
const fs = require("fs");
const handlers = require("./lib/handlers");
const helpers = require("./lib/helpers");

const httpServer = http.createServer(unifiedServer);
const httpPort = config.httpPort;
httpServer.listen(httpPort, function(e) {
  console.log(
    "listen on port " + httpPort + " in the " + config.envName + " mode."
  );
});

const httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem")
};

const httpsServer = https.createServer(httpsServerOptions, unifiedServer);
const httpsPort = config.httpsPort;
httpsServer.listen(httpsPort, function(e) {
  console.log(
    "listen on port " + httpsPort + " in the " + config.envName + " mode."
  );
});

function unifiedServer(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  const queryStringObject = parsedUrl.query;

  const method = req.method.toLowerCase();

  const headers = req.headers;

  const decoder = new StringDecoder("utf-8");
  var buffer = "";

  req.on("data", function(data) {
    buffer += decoder.write(data);
  });

  req.on("end", function() {
    buffer += decoder.end();

    var chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    const data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: helpers.parseJSONToObject(buffer)
    };

    chosenHandler(data, function(statusCode, payload) {
      statusCode = typeof (statusCode == "number") ? statusCode : 200;
      payload = typeof payload === "object" ? payload : {};

      const payloadString = JSON.stringify(payload);

      res.setHeader("Content-type", "application/json");
      res.writeHead(statusCode);

      res.end(payloadString);

      console.log("Returning this response: ", statusCode, payloadString);
    });
  });
}

// handlers.end = function

//define a router
var router = {
  ping: handlers.ping,
  users: handlers.users,
  tokens: handlers.tokens
};
