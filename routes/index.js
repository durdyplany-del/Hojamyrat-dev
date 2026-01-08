var express = require('express');
var router = express.Router();

const fs = require("fs")


let routes = fs.readdirSync(__dirname);

for (let route of routes) {
  if (route.includes(".js") && route != "index.js") {
    router.use("/"+route.replace(".js", ""), require('./'+route));
  } 
}


// const config = require("../config")
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'bu yerde titleni ender etdirya', config });
// });

module.exports = router;


// api cagyrjak url bu yerde yazylya index.js faylinda
