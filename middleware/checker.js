
require('dotenv').config({path: '/vars/.env'});

exports.checkAdmin = (req, res, next) => {
    console.log(req.body.token);
    if (req.body.token === process.env.ADMIN_TOKEN) {
        next();
    } else {
        res.status(403).json({ "error": "Forbidden" });
    }
}