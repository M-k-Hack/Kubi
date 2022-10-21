
exports.checkAdmin = (req, res, next) => {
    if (req.body.token === process.env.ADMIN_TOKEN) {
        next();
    } else {
        res.status(403).json({ "error": "Forbidden" });
    }
}