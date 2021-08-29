"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const error_middleware_1 = require("./middleware/error.middleware");
const cors = require("cors");
class App {
    constructor(controllers) {
        const allowedOrigins = ['http://localhost:8080'];
        const options = {
            origin: allowedOrigins,
        };
        this.app = express();
        this.app.use(cors(options));
        this.connectToTheDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }
    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }
    getServer() {
        return this.app;
    }
    initializeMiddlewares() {
        this.app.use(express.static('public'));
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
    }
    initializeErrorHandling() {
        this.app.use(error_middleware_1.default);
    }
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }
    connectToTheDatabase() {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
        mongoose.connect('mongodb://admin:Aa123456@157.245.195.153:27017/lol?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
        // console.log((`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`));
        // mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`, {
        //   useNewUrlParser: true,
        //   useUnifiedTopology: true,
        //   useFindAndModify: false
        // });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map