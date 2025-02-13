require("dotenv").config();
const express = require("express");
const connectdb = require("./database/db");
const app = express();
const port = process.env.PORT;

connectdb();


app.use(express.json());









app.listen(port, () => {
  console.log(`listening to the ${port}`);
});
