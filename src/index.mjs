import express from "express";

import mainRouter from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import Users from "./utils/UsersData.mjs";
import { body, checkSchema, validationResult } from "express-validator";
import {
  createUserValidationSchema,
  validateAuthentication,
} from "./utils/schema.mjs";

import passport from "passport";
import "./stratergies/local-stratergy.mjs";
import mongoose from "mongoose";

import { User } from "./models/users.mjs";

const app = express();

//mongoose is a orm of mongodb and has to connect with the mongodb servicess that was created
export default mongoose
  .connect("mongodb://127.0.0.1:27017/express-tutorial")
  .then(() => {
    console.log("Conected to the Database");
  })
  .catch((err) =>
    console.error({
      Error: err,
    })
  );

const PORT = process.env.PORT || 3000; //defualt port of the process.env.PORT the port given by any hosting web services or our port which is 3000

app.use(express.json()); // as we expect a json , declared once , middleware that parses the post json data
app.use(cookieParser());
app.use(
  session({
    saveUninitialized: false,
    secret: "arjun dev",
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 60,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(mainRouter);

app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id, req.sessionID);
  req.session.visited = true;

  res.status(200).send({
    message: "successful",
  });
});

//setting the app.listen to create a server on that port and to listen to http requests
app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

app.post("/api/auth/", checkSchema(validateAuthentication), (req, res) => {
  const {
    body: { username, password },
  } = req;

  const findUser = Users.find((user) => user.username === username);

  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).send({
      message: " Validation Error ",
      error: result.array(),
    });
  }

  if (!findUser || findUser.password !== password)
    res.status(404).send({
      message: "Bad Credential",
    });

  req.session.user = findUser;

  return res.status(200).send({
    message: "Login Successfull",
    findUser,
  });
});

app.get("/api/auth/status", (req, res) => {
  const session = req.session;

  if (!session.user) {
    return res.status(404).send({
      message: "not authenticated",
    });
  }

  return res.status(200).send({
    message: "Successful",
    user: session.user,
  });
});

app.post("/api/auth/cart", (req, res) => {
  const user = req.session.user;
  const newCartItems = req.body;

  if (!user)
    return res.status(401).send({
      message: "login in to access the cart",
    });

  const currUser = Users.find((curr) => curr.username === user.username);

  currUser.cart.push(newCartItems);

  req.session.user = currUser;

  return res.status(200).send({
    message: "items added to the cart",
    user: currUser,
  });
});

app.get("/api/auth/cart", (req, res) => {
  const user = req.session.user;

  if (!user)
    return res.status(401).send({
      message: "login in to access the cart",
    });

  return res.status(200).send({
    cart: user.cart,
  });
});

app.post("/user/login", passport.authenticate("local"), (req, res) => {
  console.log("inside the user endpoint /user/login");

  const userDetails = req.user; // passport js stored directly inside the req.user

  if (!userDetails) return res.sendStatus(401);

  res.status(200).send(userDetails);
});

app.get("/user/status", (req, res) => {
  console.log("inside the user endpoint /user/status");

  const userDetails = req.user; // passport js stored directly inside the req.user

  if (!userDetails) return res.sendStatus(401);

  res.status(200).send({
    userDetails,
    session: req.session,
  });
});

app.post("/user/logout", (req, res) => {
  if (!req.user)
    return res.status(401).send({
      message: "not logged it",
    });

  req.logOut((err) => {
    if (err) return next(err);
  });

  return res.status(200).send({
    message: "Sucessfully logged out",
  });
});

//manipulating the database basic crud

app.post("/mongo/user/", async (req, res) => {
  const { username, password, displayName, cart } = req.body;

  if (!username || !password) return res.sendStatus(401);

  try {
    const newUser = await User.create({
      username,
      password,
      displayName: displayName || null,
      cart: cart || [],
    });

    await newUser.save();

    if (!newUser) throw new Error("coudnt create user");

    res.status(201).send({
      message: "Successfully created User",
      newUser,
    });
  } catch (err) {
    res.status(500).send({
      error: err,
    });
  }
});

app.get("/mongo/user/", async (req, res) => {
  const allUsers = await User.find();

  res.status(200).send({
    allUsers,
  });
});
