const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeaders = req.headers.authorization;
    const token = authHeaders.split(" ")[1];
    try
    {
        jwt.verify(token, process.env.SECRET_KEY);
        next();
        return;
    }
    catch(error)
    {
        return res.status(400).json({ errors : [ { msg : "Login failed : Authorization is required !" } ] });
    }
}