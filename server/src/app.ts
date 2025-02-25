import express, {Express} from "express"
import morgan from "morgan"
import mongoose, {connect, Connection} from "mongoose"
import dotenv from "dotenv"
import cors, {CorsOptions} from "cors"

// import routes
import apiRouter from "./routes/apiRouter"
import userRouter from "./routes/userRouter"

dotenv.config()

const app: Express = express()
const port: number = parseInt(process.env.PORT as string)


// Database
const mongoDB: string = "mongodb://127.0.0.1:27017/TodoDB"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection

db.on("connected", console.log.bind(console, "Connected to MongoDB"))
db.on("error", console.error.bind(console, "Connection to MongoDB failed"))


// Cors
if (process.env.NODE_ENV === "development") {
    const corsOptions: CorsOptions = {
        origin: "http://127.0.0.1:3000/",
        optionsSuccessStatus: 200
    };
    app.use(cors(corsOptions));
}


// APP
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan("dev"));


// routes
app.use("/", apiRouter)
app.use("/user", userRouter)


// startup
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
