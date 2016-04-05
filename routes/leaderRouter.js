var express = require('express');
var bodyParser = require('body-parser');
var leaderRouter = express.Router();
var Leaders = require('../models/leadership');

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get(function(req,res,next){
    Leaders.find({}, function(err, leader){
        if(err) throw err;
        res.json(leader);
    });
})

.post(function(req, res, next){
    Leaders.create(req.body, function(err, leader){
        if(err) throw err;
        console.log('Created leadership!');
        var id = leader._id;
        
        res.writeHead(200, {
            'Content-type': 'text/plain'
        });
        res.end('Added leadership with id: ' + id);
    });
})

.delete(function(req, res, next){
    Leaders.remove({}, function(err, resp){
        if(err) throw err;
        res.json(resp);
    });
});

leaderRouter.route('/:leaderId')
.get(function(req,res,next){
    Leaders.findById(req.params.leaderId, function(err, leader){
        if(err) throw err;
        res.json(leader);
    })
})

.put(function(req, res, next){
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, {
        new: true
    }, function(err, leader){
        if(err) throw err;
        res.json(leader);
    });
})

.delete(function(req, res, next){
    Leaders.findByIdAndRemove(req.params.leaderId, function(err, resp){
        if(err) throw err;
        res.json(resp);
    });
});
    
module.exports = leaderRouter;