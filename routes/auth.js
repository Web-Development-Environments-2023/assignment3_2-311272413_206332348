var express = require("express");
var router = express.Router();
const MySql = require("../routes/utils/MySql");
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcrypt");
const { getLastWatchedRecipes } = require("./utils/user_utils");

var onlineUser = null;
let watchedRecipes = [];

router.post("/Register", async (req, res, next) => {
  try {
    const {
      username,
      firstname,
      lastname,
      country,
      password,
      confirmPassword,
      email,
    } = req.body;

    // Check if the username is valid
    if (username.length < 3 || username.length > 8 || !/^[a-zA-Z]+$/.test(username)) {
      throw { status: 400, message: "Invalid username" };
    }

    // Check if the password is valid 
    if (password.length < 5 || password.length > 10 || !/\d/.test(password) || !/[!@#$%^&*()]/.test(password)) {
      throw { status: 400, message: "Invalid password" };
    }
    
    // Check if the password matches the confirmation
    if (password !== confirmPassword) {
      throw { status: 400, message: "Password confirmation does not match" };
    }

    // Check if username already exists
    const existingUser = await DButils.execQuery(`SELECT username FROM users WHERE username = '${username}'`);
    if (existingUser.length > 0) {
      throw { status: 409, message: "Username taken" };
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.bcrypt_saltRounds));

    // Insert the new user into the DB
    await DButils.execQuery(
      `INSERT INTO users (username, firstname, lastname, country, password, email) VALUES ('${username}', '${firstname}', '${lastname}', '${country}', '${hashedPassword}', '${email}')`
    );

    res.status(201).send({ message: "User created", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/Login", async (req, res, next) => {
  try {
    if(onlineUser !== null)
      throw { status: 400, message: "You are already logged in." };
    
    // check that username exists
    const users = await DButils.execQuery("SELECT username FROM users");
    if (!users.find((x) => x.username === req.body.username))
      throw { status: 401, message: "Username or Password incorrect" };

    // check that the password is correct
    const user = (
      await DButils.execQuery(
        `SELECT * FROM users WHERE username = '${req.body.username}'`
      )
    )[0];

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.user_id = user.user_id;
    watchedRecipes = getLastWatchedRecipes(user.user_id);
    req.session.watchedRecipes= watchedRecipes;

    // return cookie
    res.status(200).send({ message: "login succeeded", success: true });
    onlineUser = req.body.username;
  } catch (error) {
    next(error);
  }
});

router.post("/Logout", function (req, res) {
  markRecipeAsWatched(req.session.user_id, watchedRecipes);
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
  watchedRecipes = [];
  onlineUser = null;
});

module.exports = router;