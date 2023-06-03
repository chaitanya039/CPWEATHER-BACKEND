const express = require('express');
const bodyParser = require("body-parser");
const env = require("dotenv");
const connect = require("./config/db");
const colors = require("colors");
const cors = require('cors');

// Routers mdoules
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const profileRoutes = require("./routes/profileRoutes");
const pinRoutes = require("./routes/pinRoutes");


// creating the express js app 
const app = express();

// environmental variable setup
env.config();

// set value of port if we have domain or not
const port = process.env.PORT || 5000;

// connection to mongodb atlas databases
connect();

// Essential middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));


// when there is any type of http request on the index page "/" we are going to call our routers as a middleware..
app.use("/", userRoutes);
app.use("/", postRoutes);
app.use("/", profileRoutes);
app.use("/", pinRoutes);



app.get("/", (req, res)=>{
    res.send("hello mern blog");
});


// Listening the server
app.listen(port, () => {
    console.log("[SUCCESS]".green.bold + " Server listening on port : " .green + port .green);
});


