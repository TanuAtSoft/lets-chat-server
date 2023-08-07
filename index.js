const express = require("express")
const app = express()
const PORT = 8080;
const mongoose = require("mongoose");
app.use(express.json());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
require("dotenv").config();
const cors = require("cors");

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    // we're connected!
    console.log("we are connected with database");
  });
  app.use(cors())
  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(
    cors({
      methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    })
  );

  const authRoutes = require("./src/routes/authRoutes");
  const chatRoutes = require("./src/routes/chatRoutes");
  const messageRoute = require("./src/routes/messageRoute");
  app.use("/", authRoutes);
  app.use("/", chatRoutes);
  app.use("/", messageRoute);

app.listen(PORT,()=>{
    console.log(`app is running at ${PORT}`)
})