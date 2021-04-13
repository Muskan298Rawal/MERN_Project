const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

require("../database/connection");
const User = require("../models/userSchema");

router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, confirmpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !confirmpassword) {
    return res.status(422).json({ error: "kindly fill each field properly" });
  }
  //console.log(req.body);
  try {
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(422).json({ error: "User Already Exists" });
    } else if (password != confirmpassword) {
      return res.status(422).json({ error: "Password not matching" });
    } else {
      const user = new User({
        name,
        email,
        phone,
        work,
        password,
        confirmpassword,
      });

      await user.save();
      return res.status(201).json({ message: "User Registered Successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if ((!email, !password)) {
      return res.status(422).json({ error: "kindly fill each field properly" });
    }
    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      let token = await userLogin.generateAuthToken();
      console.log(token);
       
      res.cookie("jwtoken", token, {
          expires : new Date(Date.now() + 2592000000),
          httpOnly : true
      })

      if (isMatch) {
        return res.status(200).json({ message: "User Loggedin Successfully" });
      } else {
        return res.status(400).json({ error: "Invalid Credentials" });
      }
    }
    else {
      return res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
