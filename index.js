const express = require('express');
const { connectToMongoDB } = require("./connect")
const app = express();
const port = 8001;
const url = require('./models/url')
const { connect } = require('mongoose');
const urlRoute = require('./routes/url');
connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log("connected")
    );
app.use(express.json())
app.use("/url", urlRoute)
app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    const Entry = await url.findOneAndUpdate({
        shortId

    },
        {
            $push: {
                visitHistory:{
                    timestamp:Date.now(),
                }
            },
        }
    );
    res.redirect(Entry.redirectURL);
});
app.listen(port, () => console.log(`server started as Port: ${port}`)
);