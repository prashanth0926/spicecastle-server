var express = require('express');
var bodyParser = require('body-parser');
var portRouter = express.Router();
var Ports = require('../models/ports');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nodemailer99@gmail.com',
        pass: 'easytohack'
    }
});

portRouter.use(bodyParser.json());

portRouter.route('/')
    .get(function (req, res, next) {
        Ports.find({}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    })

    .post(function (req, res, next) {
        Ports.find({
            query: req.body.query
        }, function (err, resp) {
            if (err) throw err;
            if (resp.length) {
                if (req.body.userMessage && req.body.userMessage.message) {

                    var mailOptions = {
                        from: req.body.userMessage.email || 'anonymoususer@mail.com',
                        to: 'mpnaidu26@gmail.com',
                        subject: req.body.userMessage.email + ' ' + req.body.userMessage.name + ' ' + req.body.userMessage.reason,
                        text: req.body.userMessage.message + ' -sent from ' + req.body.city
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });

                    if (resp[0].userMessage && resp[0].userMessage.length) {
                        req.body.userMessage = resp[0].userMessage.concat(req.body.userMessage);
                    } else {
                        req.body.userMessage = [req.body.userMessage];
                    }
                    Ports.findByIdAndUpdate(resp[0]._id, {
                        $set: req.body
                    }, {
                        new: true
                    }, function (err, resp) {
                        if (err) throw err;
                        res.json(resp);
                    });
                } else {
                    res.end('port already exists!');
                }
            } else {
                Ports.create(req.body, function (err, resp) {
                    if (err) throw err;
                    var id = resp._id;

                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    res.end('Added the port with id: ' + id);
                });
            }
        });
    })

    .delete(function (req, res, next) {
        Ports.remove({}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

portRouter.route('/:respId')
    .get(function (req, res, next) {
        Ports.findById(req.params.respId, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    })

    .put(function (req, res, next) {
        Ports.findByIdAndUpdate(req.params.respId, {
            $set: req.body
        }, {
            new: true
        }, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    })

    .delete(function (req, res, next) {
        Ports.findByIdAndRemove(req.params.respId, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

module.exports = portRouter;