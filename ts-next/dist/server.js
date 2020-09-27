"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
var express_1 = __importDefault(require("express"));
var next_1 = __importDefault(require("next"));
var index_1 = __importDefault(require("./api/index"));
// port
var port = process.env.PORT || 3000;
// environment
var dev = process.env.NODE_ENV !== 'production';
// create next.js app
var app = next_1.default({
    dir: '.',
    dev: dev,
});
// next.js handler
var handle = app.getRequestHandler();
// declare express server
var server;
// prepare next.js app
app
    .prepare()
    .then(function () {
    // instantiate express server
    server = express_1.default();
    // add express routes
    server.use('/api', index_1.default);
    // catch all other routes with next.js handler
    server.all('*', function (req, res) { return handle(req, res); });
    // listen
    server.listen(port, function (err) {
        if (err)
            throw err;
        console.log("Custom Next.js server running on port " + port);
    });
})
    .catch(function (err) {
    console.log(err);
});
