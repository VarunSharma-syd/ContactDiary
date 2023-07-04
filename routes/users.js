const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");

const { check, validationResult } = require("express-validator");

const User = require("../models/User");

// @route POST api/users
// @desc   Register a user
// @access Public

router.post(
  "/",
  [
    check("name", "name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please Enter a password with atleast 6 or more character"
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    /* Make this on asynchrous becuase using await in line 28 */
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    /*Get the name email and password from body for the user */

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email: email });

      if (user) {
        console.log(user);
        return res.status(400).json({ msg: "User is already registered" });
      }
      /* created a new instance of the User */
      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10); // Return promise so use await

      user.password = await bcrypt.hash(password.toString(), salt); // Return promise so use await

      await user.save(); // Return promise so use await

      /* Creating a JWT */

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
      res.status(400).send("Server Error");
    }
  }
);

module.exports = router;
