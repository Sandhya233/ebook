const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/users");
const multer = require("multer");
dotenv.config();
//database connection
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB is connected"))
    .catch((error) => console.log(error));

app.use(express.json());
app.use(userRouter);

app.listen(3000, () => {
    console.log(`server is running`);
});


