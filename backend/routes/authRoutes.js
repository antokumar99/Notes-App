const router = require('express').Router();

router.get('/', (req, res) => {
    res.send("Auth route");
});

router.post('/register', (req, res) => {
    // Registration logic here
    res.send("User registered");
});

module.exports = router;