var express = require('express');
var bodyParser = require('body-parser');
var feedbackRouter = express.Router();
var Feedbacks = require('../models/feedbacks');

feedbackRouter.use(bodyParser.json());

feedbackRouter.route('/')
.get(function(req,res,next){
    Feedbacks.find({}, function(err, resp){
        if(err) throw err;
        res.json(resp);
    });
})

.post(function(req, res, next){
    Feedbacks.create(req.body, function(err, resp){
        if(err) throw err;
        console.log('Feedback added!');
        var id = resp._id;
        
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the feedback with id: ' + id);
    });
})

.delete(function(req, res, next){
    Feedbacks.remove({}, function(err, resp){
        if(err) throw err;
        res.json(resp);
    });
});

feedbackRouter.route('/:respId')
.get(function(req,res,next){
    Feedbacks.findById(req.params.respId, function(err, resp){
        if(err) throw err;
        res.json(resp);
    });
})

.put(function(req, res, next){
    Feedbacks.findByIdAndUpdate(req.params.respId, {
        $set: req.body
    }, {
        new: true
    }, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
})

.delete(function(req, res, next){
    Feedbacks.findByIdAndRemove(req.params.respId, function (err, resp) {        
        if(err) throw err;
        res.json(resp);
    });
});
    
module.exports = feedbackRouter;