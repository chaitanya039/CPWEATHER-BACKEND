const Pin = require("../Models/pinSchema");


// Creating new pin.
module.exports.createPin = async (req, res) => 
{
    console.log(req.body);
    const { user, title, ratings, lat, lon, description } = req.body;
    const errors = [];
    if(title === "")
    {
        errors.push({ msg : "Title is required !" });
    }
    if(lat === null || lon === null)
    {
        errors.push({ msg : "Lattitude & Longitude is required !" });
    }
    if(ratings === null)
    {
        errors.push({ msg : "Ratings is required !" });
    }
    if(description === "")
    {
        errors.push({ msg : "Description is required !" });
    }
    
    if(errors.length !== 0)
    {
        console.log("Error of me ", errors);
        return res.status(400).json({ errors });
    }
    const pinCandidate = new Pin({
        user,
        title,
        ratings,
        lat, 
        lon,
        description
    });
    
    try
    {
        const savedPin = await pinCandidate.save((error, pin) => 
        {
            if(error)
            {
                console.log("Error after saving " + error);
                return res.status(400).json({ errors : [{ msg : error.message }] });
            }
            if(pin)
            {
                return res.status(201).json({ msg : "Pin has been created successfully !", pin });
            }
        });
    }
    catch(error)
    {
        console.log("Error in catch " + error);
        return res.status(400).json({ errors : [{ msg : error.message }] });
    }
}

// Get all pins.
module.exports.getPins = async (req, res) =>
{
    try
    {
        const pins = await Pin.find().populate("user", "_id firstName lastName");
        return res.status(200).json({ msg : "All pins loaded successfully !", pins });
    }
    catch(error)
    {
        return res.status(400).json({ errors : [{ msg : error.message }] })
    }
}