var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'bu yerde titleni ender etdirya' });
});

module.exports = router;


// api cagyrjak url bu yerde yazylya index.js faylinda
