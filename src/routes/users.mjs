import { Router } from "express";
import express from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import {
  createUserValidationSchema,
  querySchemaValidation,
} from "../utils/schema.mjs";

import Users from "../utils/UsersData.mjs";
import { getUserIdmiddleware } from "../utils/middleware.mjs";

const router = Router(); // we use routers to create domain / isolate routes of particular requestes like users etc

router.get("/api/users", checkSchema(querySchemaValidation), (req, res) => {
  const {
    query: { filter, value },
  } = req;

  //the express-validation doesnt throw error on its own we need to do it ourself
  //we get the result of validation from validatioResults

  const valResult = validationResult(req);

  console.log(valResult);

  if (filter && value) {
    const user = Users.filter((user) => user[filter].includes(value));
    return res.status(200).send(user);
  }

  res.status(201).send(Users);
});

// get users from id
router.get("/api/users/:id", getUserIdmiddleware, (req, res) => {
  const { userId } = req;

  const user = Users.find((user) => user.id === userId);

  if (!user) return res.sendStatus(404);

  res.status(201).send({
    message: "Get Request Successful",
    user,
  });
});

//adding new users

router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (req, res) => {
    const data = matchedData(req);
    const valResult = validationResult(req);

    if (valResult.notEmpty) {
      res.status(400).send({
        error: valResult.array(),
      });
    }

    console.log(valResult);

    if (!data) {
      return res.send({
        message: "POST cant be made without body",
      });
    }

    const newUser = {
      id: Users.length + 1,
      ...data,
    };

    Users.push(newUser);

    return res.status(201).send({
      message: "User added",
    });
  }
);

//deleting a user

router.delete("/api/users/:id", getUserIdmiddleware, (req, res) => {
  const { userId } = req;

  Users = Users.filter((user) => user.id !== userId);
  return res.send({
    message: `Deleted user with id ${userId}} `,
  });
});

//updating the object based on id

router.patch(
  "/api/users/:id",
  checkSchema(createUserValidationSchema),
  getUserIdmiddleware,
  (req, res) => {
    const { userId } = req;

    const updatedData = req.body;
    const result = validationResult(req);

    if (result.notEmpty()) return res.status(404).send({ message: "error" });

    let userIndex = Users.findIndex((user) => user.id === userId); // as we are replacing the whole object and not just an attribute we need to get the index number of the obejct in the array

    if (userIndex === -1) return res.statusCode(404);

    Users[userIndex] = {
      ...Users[userIndex],
      ...updatedData,
    };

    return res.status(200).send({
      message: "Successfull Updated User Details",
    });
  }
);

export default router;
