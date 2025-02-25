"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const apiRouter_1 = __importDefault(require("./routes/apiRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT);
const mongoDB = "mongodb://127.0.0.1:27017/TodoDB";
mongoose_1.default.connect(mongoDB);
mongoose_1.default.Promise = Promise;
const db = mongoose_1.default.connection;
db.on("connected", console.log.bind(console, "Connected to MongoDB"));
db.on("error", console.error.bind(console, "Connection to MongoDB failed"));
if (process.env.NODE_ENV === "development") {
    const corsOptions = {
        origin: "http://127.0.0.1:3000/",
        optionsSuccessStatus: 200
    };
    app.use((0, cors_1.default)(corsOptions));
}
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, morgan_1.default)("dev"));
app.use("/", apiRouter_1.default);
app.use("/user", userRouter_1.default);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
