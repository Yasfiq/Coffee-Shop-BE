// Imports
const express = require('express') // Express Js
const app = express() // Express Js
const { urlencoded, json } = require('express') // Middleware urlencoded,json
const cors = require('cors') // cors
require('dotenv').config() // dotenv package
// eslint-disable-next-line no-undef
const { PORT, CORS_ACCESS, API_VERSION } = process.env // Enviroment Variable
const router = require(`./src/${API_VERSION}/routes/route`) // route home
app.use(urlencoded({ extended: false })) // Middleware urlencoded
app.use(json()) // Middleware json
app.use(express.static('public')) // Middleware static folder


// CORS Middleware
app.use(cors({
    origin: CORS_ACCESS
}))


// Route prefix root
app.use(`/api/${API_VERSION}`, router)


// Error Handling 404:Page not found
app.use('/*', (req, res) => {
    return res.status(404).send({
        Status: 404,
        Message: 'Page not found!'
    })
})

// Listening on port
app.listen(PORT, () => {
    console.log(`Success Listening on http://localhost:${PORT}`);
})