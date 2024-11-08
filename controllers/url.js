const shortid = require("shortid");  // No need to destructure here
const Url = require('../models/url');  // Use the correct import

async function generateNewShortUrl(req, res) {
    const body = req.body;

    // Validate that the URL is present in the request body
    if (!body.url) return res.status(400).json({ error: 'URL is required' });

    // Generate a unique short ID
    const shortId = shortid.generate();

    // Create a new URL document in the database
    const newUrl = await Url.create({
        shortId: shortId,            // Correct the field name
        redirectURL: body.url,        // Correct the field name
        visitHistory: []
    });

    // Return the newly created short URL ID
    return res.render('home',{
        id:shortId,
    })
}
async function handleGetAnalytics(req,res){
    const shortId=req.params.shortId;
    const result=await Url.findOne({shortId}); 
    return res.json({totalClicks:result.visitHistory.length,
        analytics:result.visitHistory});
}


module.exports = {
    generateNewShortUrl,
    handleGetAnalytics,
};
