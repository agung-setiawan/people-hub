const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const config = require("config");
const { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let code = Math.random()
      .toString(20)
      .substring(7);

    const refCode = code;
    const avatar = `http://www.gravatar.com/avatar/${code}?s=200&r=pg&d=mm`;
    const { name, email, password, hostname } = req.body;
    const regFrom = "native";

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name,
        email,
        avatar,
        password,
        refCode,
        regFrom
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Send Emaill
      let contentBody =
        "<p>Thanks for the regristration, you almost a step into the final, please click this link or copy this link into browser to activate your account</p>" +
        "<p><a href='" +
        hostname +
        "/activation?" +
        refCode +
        "'>Activate My Account</a></p>";

      sgMail.setApiKey(config.get("sendGridKey"));
      const msg = {
        to: email,
        from: "noreply@people-hub.com",
        subject: "Your Registration Process",
        text: "Thanks for the regristration",
        html: contentBody
      };
      sgMail.send(msg);

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ sts: "passed", code: code });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send(err.message);
    }
  }
);

// @route    POST api/users/fb/register
// @desc     Register user via Facebook
// @access   Public
router.post(
  "/fb/signup",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid emails").isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let code = Math.random()
      .toString(20)
      .substring(7);

    const { name, email, picture } = req.body;
    const avatar = picture;
    const password = code;
    const refCode = "";
    const regFrom = "sosmed";

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name,
        email,
        avatar,
        password,
        refCode,
        regFrom
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ sts: "passed", uid: password });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send(err.message);
    }
  }
);

module.exports = router;
