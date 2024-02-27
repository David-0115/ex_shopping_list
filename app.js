const express = require('express');
const ExpressError = require('./expressError');
const itemRoutes = require('./itemRoutes')
const app = express();

app.use(express.json());
app.use("/items", itemRoutes);

app.use((req, res, next) => {
    return new ExpressError("Not Found", 404)
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);

    return res.json({
        error: err.message
    });
});


module.exports = app