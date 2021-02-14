const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Register User...

router.post("/", async (req, res) => {
  try {
    const { email, password, passwordVerify } = req.body;
    //Validation
    if (!email || !password || !passwordVerify)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });
    if (password.length < 6)
      return res.status(400).json({
        errorMessage: "Please enter a password with more than six characters.",
      });
    if (password !== passwordVerify)
      return res.status(400).json({
        errorMessage: "Please enter a the same password twice.",
      });
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        errorMessage: "An account with this email already exists.",
      });
    //Hash the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    //Save new user to database
    const newUser = new User({
      email,
      passwordHash,
    });
    const savedUser = await newUser.save();
    //Sign the token
    const token = jwt.sign(
      {
        user: savedUser._id,
      },
      process.env.JWT_SECRET
    );
    //Send the token in a http-only cookie
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

//Log User into account...

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //Validation
    if (!email || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });
    const exisitingUser = await User.findOne({ email });
    if (!exisitingUser)
      return res.status(401).json({ errorMessage: "Wrong email or password." });
    const passwordCorrect = await bcrypt.compare(
      password,
      exisitingUser.passwordHash
    );
    if (!passwordCorrect)
      return res.status(400).json({ errorMessage: "Wrong email or password." });
    //Sign the token
    const token = jwt.sign(
      {
        user: exisitingUser._id,
      },
      process.env.JWT_SECRET
    );
    //Send the token in a HTTP-only cookie
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

//Logout User...

router.get("/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send();
});

module.exports = router;
