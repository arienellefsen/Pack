// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create Place schema
var PlaceSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        default: "any" //park or coffeeshop etc
    },
    pictureURL: {
        type: String
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    zipcode: {
        type: String
    },
    country: {
        type: String
    },
    officialWebsite: {
        type: String
    },
    googlePlaceId: {
        type: String//,
       // unique: true cannot be useed as we might not be able to have google place id
    }
});

/*Defining indexes at the schema level is necessary when creating compound indexes.*/
PlaceSchema.index({name: 1, lat: 1, lng: 1}, {name: 'myplace_index', unique: true }); // schema level

// Create the Place model with the PlaceSchema
var Place = mongoose.model("Place", PlaceSchema);

// Export the model
module.exports = Place;