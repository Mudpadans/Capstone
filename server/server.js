const express = require("express");
const cors = require("cors");
require("dotenv").config()
const path = require('path')

const app = express();

app.use(express.json());
app.use(cors());
app.use('/', express.static(path.join(__dirname, '../client')))

const { PORT } = process.env;


app.listen(PORT, () => console.log(`server running on ${PORT}`))