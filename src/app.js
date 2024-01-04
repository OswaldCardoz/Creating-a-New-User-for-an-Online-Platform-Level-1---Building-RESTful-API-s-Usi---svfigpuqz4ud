const fs = require("fs");
const express = require("express");
const app = express();

// Importing products from products.json file
const userDetails = JSON.parse(
  fs.readFileSync(`${__dirname}/data/userDetails.json`)
);

//Middlewares
app.use(express.json());

// Write POST endpoint for registering new user
app.post("/api/v1/details", (req, res) => {
  // Extracting user details from request body
  const { name, mail, number } = req.body;

  // Validating user data
  if (!name || !mail || !number) {
    return res.status(400).json({
      status: "Failed",
      message: "Invalid user data. Please provide name, mail, and number.",
    });
  }

  // Finding the first available gap in the IDs
  let newUserId = 1;
  for (const user of userDetails) {
    if (user.id !== newUserId) {
      break;
    }
    newUserId++;
  }

  // Creating a new user object
  const newUser = {
    id: newUserId,
    name,
    mail,
    number,
  };

  // Adding the new user to the userDetails array
  userDetails.push(newUser);

  // Writing the updated userDetails array to the JSON file
  fs.writeFileSync(`${__dirname}/data/userDetails.json`, JSON.stringify(userDetails, null, 2));

  // Responding with a success message and the newly created user details
  res.status(201).json({
    status: "Success",
    message: "User registered successfully",
    data: {
      newUser,
    },
  });
});

// GET endpoint for sending the details of users
app.get("/api/v1/details", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Detail of users fetched successfully",
    data: {
      userDetails,
    },
  });
});

// GET endpoint for sending the products to client by id
app.get("/api/v1/userdetails/:id", (req, res) => {
  let { id } = req.params;
  id *= 1;
  const details = userDetails.find((details) => details.id === id);
  if (!details) {
    return res.status(404).send({
      status: "failed",
      message: "Product not found!",
    });
  } else {
    res.status(200).send({
      status: "success",
      message: "Details of users fetched successfully",
      data: {
        details,
      },
    });
  }
});

module.exports = app;
