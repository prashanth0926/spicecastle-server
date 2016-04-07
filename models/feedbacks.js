// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-type-email');

// create a schema
var feedbackSchema = new Schema({
    mychannel: {
        type: String,
        default: "Email"
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    agree: {
        type: Boolean,
        default: true
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true
    },
    tel: {
        areaCode: {
            type: Number,
            required: true
        },
        number: {
            type: Number,
            required: true
        }
    },
    comments: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Feedbacks = mongoose.model('Feedback', feedbackSchema);

// make this available to our Node applications
module.exports = Feedbacks;