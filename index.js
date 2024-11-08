const express = require('express');
const { connectToMongoDB } = require("./connect")
const path = require('path')
const app = express();
const port = 8001;
const url = require('./models/url')
const staicrouter=require("./routes/staticRouter")
const { connect } = require('mongoose');
const urlRoute = require('./routes/url');
connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log("connected")
    );
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
console.log(path.resolve("./views"));
app.use(express.json())
app.use(express.urlencoded({extended:false}));
app.get("/test", async (req, res) => {
    const allurls = await url.find({});
    return res.render("home",{urls:allurls,});
})
app.use("/url", urlRoute)
app.use("/",staicrouter)
app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const Entry = await url.findOneAndUpdate({
        shortId
    },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                }
            },
        },{
            new:true
        }
    );
    if (Entry) {
        // If Entry is found, redirect to the original URL
        res.redirect(Entry.redirectURL);
    } else {
        // If Entry is not found, send a 404 response
        res.status(404).json({ error: "URL not found" });
    }
});
app.listen(port, () => console.log(`server started as Port: ${port}`)
);
