// Server file is the middleware of node to create the node server standalone 

const app = require("./backend/app");  // adding the path of the request routes
const debug = require("debug")("node-angular"); // debug the node-angular coming from the deafult of npm
const http = require("http"); // import the http package of node
// Port Check
const normalizePort = val => {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
};
// Configuration of OnError Callback
const onError = error => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof port === "string" ? "pipe " + port : "port " + port;
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
};
// Configuring the OnListener events
const onListening = () => {
    const addr = server.address();
    const bind = typeof port === "string" ? "pipe " + port : "port " + port;
    debug("Listening on " + bind);
};

//Declaring the Port
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port); // setting the port accorss the app backend

const server = http.createServer(app); // to create the server
server.on("error", onError); // on event for error
server.on("listening", onListening); // on event for listening
server.listen(port); // final listening the port
