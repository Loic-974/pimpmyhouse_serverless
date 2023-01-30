const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const path = __dirname + "/app/views/";
app.use(express.static(path));

var corsOptions = {
  origin: "http://localhost:8081",
};

var allowedOrigins = ["http://localhost:3000", "http://localhost:8080"];

// const db = require("./app/models");
// ----------- DB connection ---------------- //
// db.mongoose
//   .connect(db.url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to the database!");
//   })
//   .catch((err) => {
//     console.log("Cannot connect to the database!", err);
//     process.exit();
//   });

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
// app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
  // res.sendFile(path + "index.html");
});

app.post("/sendImage", (req, res) => {
  res.json("Bien reçu");
});
// -------- Includes all utilisateurs route
//require("./app/routes/utilisateurs.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
