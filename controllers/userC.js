const bodyparser = require("body-parser");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function signUp(req, res) {
  try {
    const { name, email, mobile, password } = req.body;
    console.log("recieved data: ", name, email, mobile, password);
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log("User already Exists");
      return res.status(409).send({ message: "User already exists" });
    }
    const saltrounds = 10;
    bcrypt.hash(password, saltrounds, async (err, hash) => {
      if (err) {
        console.log("sign upp error internal in hashing", err);
      }
      const user = await User.create({ name, email, mobile, password: hash });
      console.log("new user Created : ", user);
      return res.status(201).json({
        name: name,
        message: "User created successfully",
        alert: "User has been created",
      });
    });
  } catch (err) {
    console.log("error:", err);
    return res
      .status(500)
      .send({ message: "Internal server Error, check for the error" });
  }
}

function generateToken(id, name) {

  return jwt.sign({ userId: id, name: name }, "secretkey");
}

async function login(req, res) {
  const { email, password } = req.body;
  console.log("recieved login data: ", email);
  try {
    const user = await User.findAll({ where: { email } });
    if (user) {
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (err) {
          throw new Error("Something went wrong");
        }
        if (result === true) {
          console.log("geenreettaee",generateToken(user[0].id, user[0].name))
          res
            .status(200)
            .json({
              success: true,
              message: "User Logged in successfully",
              token: generateToken(user[0].id, user[0].name),
            });
        } else {
          return res
            .status(400)
            .json({ success: false, message: "Incorrect password" });
        }
      });
    } else {
      return res
        .status(404)
        .send({ success: false, message: "User doesnot exist" });
    }
    if (!user) {
      console.log("user doesnot exist");
      return res.status(401).send({ message: "Invalid email or password" });
    }
  } catch (err) {}
}

module.exports={signUp,login};


