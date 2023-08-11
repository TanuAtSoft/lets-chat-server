const express = require("express")
const app = express()
const PORT = 5000;
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

 const AuthRoute  = require("./src/routes/AuthRoute");
const UserRoute = require('./src/routes/UserRoute')
const PostRoute = require('./src/routes/PostRoute')
const UploadRoute = require('./src/routes/UploadRoute')
const  ChatRoute = require('./src/routes/ChatRoute')
const MessageRoute = require('./src/routes/MessageRoute')

app.use('/auth', AuthRoute);
app.use('/user', UserRoute)
app.use('/posts', PostRoute)
app.use('/upload', UploadRoute)
app.use('/chat', ChatRoute)
app.use('/message', MessageRoute)

app.listen(PORT,()=>{
    console.log(`app is running at ${PORT}`)
})