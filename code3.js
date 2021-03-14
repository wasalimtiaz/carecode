const express = require('express');
const cheerio = require('cheerio');
const normalizeUrl = require('normalize-url');
const request = require('request');
const RSVP = require('rsvp');

const port = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');

app.get('/I/want/Title/', function (req, res) {
	var titles = [];
	var addresses = [];
	var prom = [];

	if(typeof req.query.address !== 'undefined'){
		if(typeof req.query.address ==='string'){
			addresses.push(req.query.address);
		}		
		else{
			addresses = req.query.address;
		}

		addresses.forEach(function(address) {
            prom.push(
				new RSVP.Promise(function(resolve, reject){

					address = address?normalizeUrl(address):address;
                    var title;

					request(address,function(error, resp, body) {
						if(error){
							title = "NO RESPONSE";
						}
						else if (resp.statusCode !== 200) {
							title = "NO RESPONSE";
						}
						else{
							var $ = cheerio.load(body);
							title = '"'+$("title").text()+'"';
						}

						resolve({address:address,title:title});
					});
				})
			); 
		});

		RSVP.all(prom).then(function(titles) {
    		res.render('home',{titles:titles});
		});
	}
	else{
		res.render('home',{titles:titles});
	}
});

app.all('*', function(req, res){
	res.render('error');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});