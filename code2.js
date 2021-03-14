const express = require('express');
const cheerio = require('cheerio');
const normalizeUrl = require('normalize-url');
const request = require('request');
const async = require("async");

const port = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');

app.get('/I/want/Title/', function (req, res) {
	var titles = [];
	var addresses = [];

	if(typeof req.query.address !== 'undefined'){
		if(typeof req.query.address ==='string'){
			addresses.push(req.query.address);
		}		
		else{
			addresses = req.query.address;
		}
		async.map(addresses,func,function(err, titles){
			res.render('home',{titles:titles});
    	});
	}
	else{
		res.render('home',{titles:titles});
	}
});

var func = function(address,callback){

	address =  address?normalizeUrl(address):address;
	request(address,function(err, resp, body) {

		var title;

		if(err){
			title = "NO RESPONSE";
		}
		else if (resp.statusCode !== 200) {
			title = "NO RESPONSE";
		}
		else{
			var $ = cheerio.load(body);
			title = '"'+$("title").text()+'"';
		}

		callback(null,{address:address,title:title});
	});
}

app.all('*', function(req, res){
	res.render('error');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});