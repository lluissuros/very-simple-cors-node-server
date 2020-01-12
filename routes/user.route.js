const uuid = require("uuid/v1");
const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const db = require("../data/db");

const router = express.Router();

/*=========  create new users, return jwt if success ========= */
router.post("/signup", (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      console.log("invalid username or password on signup");
      res.status(401).json({
        sucess: false,
        token: null,
        err: "Entered Password or Username are not valid"
      });
      return;
    }
   
    if(db.get("users").find({ username }).value()) {
      console.log("user already exists");
      res.status(401).json({
        sucess: false,
        token: null,
        err: "User already exists"
      });
      return;
    }
  
    bcrypt.hash(password, 10, function(err, hash) {
      const id = uuid();
  
      const token = jwt.sign(
          { username },
          config.get("secret_key"),
          { expiresIn: 129600 }
        ); // Signing the token
  
      const newUser = { id, username, password: hash };
      db.get("users")
        .push(newUser)
        .write();
  
      console.log("User created: ", newUser);
      res.json({
          sucess: true,
          err: null,
          token
        });
    });
  });
  
  /* This is the route that the client will be passing the entered credentials for verification to.
   If the credentials match, then the server sends back a json response with a valid json web token for the client to use for identification. */
  router.post("/login", (req, res) => {
    const { username, password } = req.body;
    console.log("User login submitted: ", username, password);
  
    const user = db.get("users").find({ username }).value();
  
    if (!user) {
      console.log("user is not registered");
      res.status(401).json({
        sucess: false,
        token: null,
        err: "Invalid Credentials"
      });
      return;
    }
    console.log("User Found: ", user);
  
    bcrypt.compare(password, user.password, function(err, result) {
      if (result === true) {
        console.log("password correct");
  
        const token = jwt.sign(
          { username: user.username },
          config.get("secret_key"),
          { expiresIn: 129600 }
        ); // Signing the token
  
        res.json({
          sucess: true,
          err: null,
          token
        });
      } else {
        console.log("Entered Password and Hash do not match!");
        res.status(401).json({
          sucess: false,
          token: null,
          err: "Entered Password and Hash do not match!"
        });
      }
    });
  });


module.exports = router;
