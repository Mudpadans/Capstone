const express = require("express");
const session = require('express-session')
const cors = require("cors");
require("dotenv").config()
const path = require('path')
const { PORT } = process.env;
const { seed, createMember, authenticateMember, logout, checkAuthentication } = require('./controller.js')

const app = express();

app.use(express.json());
app.use(cors());
app.use('/', express.static(path.join(__dirname, '../client')))
app.use(session({
    secret: 'layers of onions',
    resave: false,
    saveUninitialized: true
}))

app.post('/seed', seed)

app.post('/members', createMember)
app.post('/authenticateMember', authenticateMember)
app.post('/logout', logout)
app.get("/checkAuthentication", checkAuthentication, (req, res) => {
    res.json({status: "Authenticated"})
})





app.listen(PORT, () => console.log(`server running on ${PORT}`))