///// Standard header for express, bodyParser, mongoose, ejs and nodemailer/////////
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
var nodemailer = require('nodemailer');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

///////////////connecting, setting up mongoose and the schema///////////////////

mongoose.connect('mongodb://localhost:27017/loginDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const loginSchema = {
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  news: String
}

const Login = mongoose.model("Login", loginSchema);

///////////////////////////// "/" methods //////////////////////////////////////
app.route("/")
  .get(function(req, res) {

    res.render("login");
  })

  .post(function(req, res) {

    const newsMember = new Login({
      name: req.body.name,
      email: req.body.email,
      news: req.body.checkbox
    });

    newsMember.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Sucessfully logged in");
        res.redirect("/");
      }
    });
  });

///////////////////////// "/compose" methods////////////////////////////////////
app.route("/compose")
  .get(function(req, res) {
    res.render("compose");
  })

  .post(function(req, res) {
    Login.find({
      news: "on"
    }, function(err, newsMember) {
      if (err) {
        res.send(err);
      } else {
        newsMember.forEach(function(newsMail) {
          const news = newsMail.email;
          //// nodemailer variables ////
          var transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
              user: 'adryann3@outlook.com',
              pass: 'Titanio123'
            }
          });

          var mailOptions = {
            from: 'adryann3@outlook.com',
            to: news,
            subject: req.body.subject,
            text: req.body.text
          };

          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              res.redirect("/compose");
            }
          });
        })

      }
    });
  });
////////////////////////////////// Server Settings ////////////////////////////
app.listen(3000, function() {
  console.log("server running on port 3000");
});
