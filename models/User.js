// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create User schema
var UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true
    },
    profileStatement: {
        type: String
    },   // one Chat has many comment's ObjectId, ref refers to the Comment model
    pacs: [{
        type: Schema.Types.ObjectId,
        ref: "Pac"
    }]
});

// Create the User model with the UserSchema
var User = mongoose.model("User", UserSchema);

// Export the model
module.exports = User;