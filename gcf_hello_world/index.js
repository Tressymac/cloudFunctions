exports.helloWorld = (req, res) => {
    const userName = req.param('name');
    res.status(200);
    res.send("Hello, " + userName + "!");
};

