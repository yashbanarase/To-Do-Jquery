const express = require("express");
const mongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const app = express();
const conString = "mongodb://127.0.0.1:27017";
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcome");
  res.end();
});

app.get("/users/:user_id", (req, res) => {
  mongoClient.connect(conString).then((obj) => {
    var database = obj.db("to-do");
    database
      .collection("users")
      .findOne({ user_id: req.params.user_id })
      .then((user) => {
        res.send(user);
        res.end();
      });
  });
});
app.get("/appointments/:user_id", (req, res) => {
  mongoClient.connect(conString).then((obj) => {
    var database = obj.db("to-do");
    database
      .collection("appointments")
      .find({ user_id: req.params.user_id })
      .toArray()
      .then((documents) => {
        res.send(documents);
        res.end();
      });
  });
});
app.get("/appointment/:title", (req, res) => {
  mongoClient.connect(conString).then((obj) => {
    var database = obj.db("to-do");
    database
      .collection("appointments")
      .find({ title: req.params.title })
      .toArray()
      .then((appointment) => {
        res.send(appointment);
        res.end();
      });
  });
});
app.post("/register-user", (req, res) => {
  var newUser = {
    user_id: req.body.user_id,
    user_name: req.body.user_name,
    password: req.body.password,
    mobile: req.body.mobile,
  };

  mongoClient.connect(conString).then((obj) => {
    const database = obj.db("to-do");
    database
      .collection("users")
      .insertOne(newUser)
      .then(() => {
        console.log("User Registered");
        res.end();
      });
  });
});
app.post("/add-appointment", (req, res) => {
  var appointment = {
    appointment_id: parseInt(req.body.appointment_id),
    title: req.body.title,
    date: new Date(req.body.date),
    description: req.body.description,
    user_id: req.body.user_id,
  };
  console.log(req.body);
  mongoClient.connect(conString).then((obj) => {
    var database = obj.db("to-do");
    database
      .collection("appointments")
      .insertOne(appointment)
      .then(() => {
        console.log("appointment Added");
        res.end();
      });
  });
});
app.put("/edit-appointment/:id", (req, res) => {
  var appointment = {
    appointment_id: parseInt(req.body.appointment_id),
    title: req.body.title,
    date: new Date(req.body.date),
    description: req.body.description,
    user_id: req.body.user_id,
  };

  mongoClient.connect(conString).then((obj) => {
    var database = obj.db("to-do");
    database
      .collection("appointments")
      .updateOne({ title: req.params.id }, { $set: appointment })
      .then(() => {
        console.log("Appoinment Updated");
        res.end();
      });
  });
});
app.delete("/delete-appointment/:id", (req, res) => {
  mongoClient.connect(conString).then((obj) => {
    var database = obj.db("to-do");
    database
      .collection("appointments")
      .deleteOne({ title: req.params.id })
      .then(() => {
        console.log("Deleted Successfully");
        res.end();
      });
  });
});
app.listen(4040);

console.log("http://127.0.0.1:4040");
