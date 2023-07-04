const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth"); //When we need to protect route use middleware

const { check, validationResult } = require("express-validator");

const User = require("../models/User");
// @route  Get api/auth
// @desc   Get logged in User
// @access Private

router.get("/", auth, async (req, res) => {
  try {
    console.log("Server :/get/auth");
    const user = await User.findById(req.user.id).select(
      "-password"
    ); /* If token is verified then req obj hold the user obj */
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
  //res.send('Get logged in user');-----------------------------------------------after getting error modified
});

// @route  Get api/auth
// @desc   Auth user and get token
// @access Public

router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      //console.log(password,user.password);
      if (!user) {
        res.status(400).json({ msg: "Email Invalid Cridentials" });
      }

      const isMatch = await bcrypt.compare(password.toString(), user.password);

      if (!isMatch) {
        res.status(400).json({ msg: "Invalid Cridentials" });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 36000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
