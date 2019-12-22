const http = require("http");
const url = require("url");

const httpServer = http.createServer(function(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const trimmedPath = pathname.replace(/^\/+|\/+$/g, "");

  let handlerChosenRoute = routes[trimmedPath];
  handlerChosenRoute =
    (typeof handlerChosenRoute === "function" && handlerChosenRoute) ||
    routes.notFound;

  handlerChosenRoute(null, function(statusCode, payload) {
    res.setHeader("Content-type", "application/json");
    res.writeHead(statusCode);
    res.end(JSON.stringify(payload));
  });
});

const port = 5015;

httpServer.listen(port, function() {
  console.log("listen on port " + port);
});

const routes = {
  hello: function(data, callback) {
    callback(200, { message: "hello world" });
  },
  notFound: function(data, callback) {
    callback(404, "nothing found");
  }
};
