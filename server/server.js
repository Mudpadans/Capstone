const express = require("express");
const cors = require("cors");
require("dotenv").config()
const path = require('path')
const { PORT } = process.env;
const { seed, createMember, authenticateMember } = require('./controller.js')

const app = express();

app.use(express.json());
app.use(cors());
app.use('/', express.static(path.join(__dirname, '../client')))

app.post('/seed', seed)

app.post('/members', createMember)
app.post('/authenticateMember', authenticateMember)



app.listen(PORT, () => console.log(`server running on ${PORT}`))