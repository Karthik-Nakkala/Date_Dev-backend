const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDb = require("./config/database");
const cookieParser = require("cookie-parser");
require("./helpers/cronjobs");
const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const connectReqRouter = require("./routers/connectReq");
const userRouter = require("./routers/user");
const paymentRouter = require("./routers/payment");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectReqRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

//First database should be connected and then only server should start listen for requests
connectDb()
  .then(() => {
    console.log("Database connected succesfully😅🥰🥰");
    app.listen(process.env.PORT, () => {
      console.log("Server started serving😤😤😤😤");
    });
  })
  .catch((err) => {
    console.error("Database connection failed😞😞😞😞");
  });
