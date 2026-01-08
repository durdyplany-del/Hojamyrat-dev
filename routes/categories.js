var express = require('express');
var router = express.Router();

router.all("*",  (req, res, next) => {
    if (isAuthhenticated) {
        next()
    } else {
        res.json({success: false, error: "Not Authhenticated"})
    }
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({success: true});
});

module.exports = router;
