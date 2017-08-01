var express = require('express');
var bodyParser = require('body-parser');
var restaurantRouter = express.Router();
var Restaurants = require('../models/restaurants');
var fetch = require('fetch').fetchUrl;
var _ = require('lodash');

restaurantRouter.use(bodyParser.json());

var in_url = 'https://api.yelp.com/v3/businesses/search?';
var auth_url = 'https://api.yelp.com/oauth2/token';
var options = {
    headers: {
        "authorization": "Bearer iucJbePuYt6bE57FHL7Fu71TbQJ6tsJPY0sN_S0JUwbtERCJ7utwS0_J6r9r-w0e9J5PjwDvilxo2-wtICQxRLhLCXarVjzEz4hMnAgFOXmoy-YdSR5JFBuiiV5_WXYx"
    }
};

function refreshToken(req, callback) {
    fetch(auth_url+'?grant_type=client_credentials&client_id=7w4xb8aKckD0yiRLE5nhcw&client_secret=3WLxT7iQE4oQYSsPZrUrKEfQZcXnJqcz6GMqJKx0QqiwhqJnPGmIKINhEcYRk5Av', {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }, function (err, meta, out) {
        var resp = JSON.parse(out.toString());
        options.headers["authorization"] = "Bearer " + resp.access_token;
        fetch(in_url+'location='+(req.query.location||'chicago')+'&radius='+(req.query.radius||5000)+'&open_now=true&categories='+(synthesizeCategory(req.query.category)||'italian'), {
            headers: {
                "Authorization": "Bearer " + resp.access_token
            }
        }, function (err, meta, out) {
            callback(JSON.parse(out.toString()));
        })
    });
}

function transformModel(arr) {
    return _.orderBy(_.map(arr, function (a) {
        return {
            name: a.name,
            category: _.map(a.categories, 'alias').join(','),
            reviews: a.review_count,
            rating: a.rating,
            distance: parseInt(a.distance),
            place: a.location.city.toLowerCase(),
            rat_revs: (a.rating < 3) ? 0 : parseInt(a.rating * a.review_count)
        }
    }), ['rat_revs', 'distance'], ['desc', 'asc']);
}

function synthesizeCategory(cat) {
    switch (cat) {
        case 'indian': return 'indpak';
        default: return cat;
    }
}

restaurantRouter.route('/')
    .get(function(req,res,next){
        Restaurants.find({place: (req.query.location||'chicago'), category: {$regex: '.*'+(synthesizeCategory(req.query.category)||'italian')+'.*'}}, function (err, rests) {
            if (err) throw err;
            if (_.isEmpty(rests)) {
                fetch(in_url+'location='+(req.query.location||'chicago')+'&radius='+(req.query.radius||5000)+'&open_now=true&categories='+(synthesizeCategory(req.query.category)||'italian'), options, function (err, meta, out) {
                    if (err) throw err;
                    var resp = JSON.parse(out.toString());
                    if (resp.error) {
                        refreshToken(req, function (out) {
                            Restaurants.create(transformModel(out.businesses));
                            res.json(transformModel(out.businesses).slice(0,5));
                        })
                    } else {
                        Restaurants.create(transformModel(resp.businesses));
                        res.json(transformModel(resp.businesses).slice(0,5));
                    }
                });
            } else {
                var outp = rests;
                if (req.query.radius) {
                    outp = _.filter(rests, function (r) {
                        return r.distance <= req.query.radius
                    })
                }
                res.json(outp.slice(0,5));
            }
        });
    })

    .delete(function(req, res, next){
        Restaurants.remove({}, function (err, resp) {
            if(err) throw err;
            res.json(resp);
        });
    });

restaurantRouter.route('/hit')
    .get(function(req,res,next){

        fetch(in_url+'location='+(req.query.location||'chicago')+'&radius='+(req.query.radius||5000)+'&open_now=true&categories='+(synthesizeCategory(req.query.category)||'italian'), options, function (err, meta, out) {
            if (err) throw err;
            var resp = JSON.parse(out.toString());
            if (resp.error) {
                refreshToken(req, function (out) {
                    Restaurants.create(transformModel(out.businesses));
                    res.json(transformModel(out.businesses).slice(0,5));
                })
            } else {
                Restaurants.create(transformModel(resp.businesses));
                res.json(transformModel(resp.businesses).slice(0,5));
            }
        });
    });

module.exports = restaurantRouter;