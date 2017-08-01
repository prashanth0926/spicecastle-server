// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var restaurantSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    category: {
        type: String
    },
    reviews: {
        type: Number
    },
    rating: {
        type: Number
    },
    distance: {
        type: Number
    },
    place: {
        type: String
    },
    rat_revs: {
        type: Number
    }
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Restaurants = mongoose.model('Restaurant', restaurantSchema);

// make this available to our Node applications
module.exports = Restaurants;