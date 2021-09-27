const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

// DB connection
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, () =>
    console.log("Db connection succesful")
);

app.use(express.json())

const authRoutes = require("./routes/auth");

app.use("/api/user", authRoutes);

app.listen(8000, () => {
    console.log("Running on 8000");
});
