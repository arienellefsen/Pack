// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create Pac schema
var PacSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: "any" //weekend, vacation,  etc.
    },
    pictureURL: {
        type: String
    },
    places: [{
        type: Schema.Types.ObjectId,
        ref: "Place"
    }], 
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comments: [{
        comment: String,
        date: Date,
        author: String
    }]
},  { timestamps: {}}); //use the default createdAt and updatedAt

/*
comments is array of sub doc { comment: String, date: Date, author: String }
mongoose will automatically convert the object to a schema for you:
{
        comment: String,
        date: Date,
        author: String
    }
Equivalent new Schema({ comment: String, date: Date, author: String })

Sub-docs may also be created without adding them 
to the array by using the create method of MongooseArrays.*/

// Create the Pac model with the PacSchema
var Pac = mongoose.model("Pac", PacSchema);

// Export the model
module.exports = Pac;


//example use
//var pac = new Pac;
//pac.createdBy = new mongoose.Types.ObjectId;
//pac.placeIds.push(new mongoose.Types.ObjectId);
//pac.placeIds.addToSet  ?
//pac.comments.push({comment: 'hi', date: new Date/Date.now, author: 'me'})
/* ----------to add comment
var newcomment = poc.comments.create({ comment: 'hi' , author: 'xw'});
-------------to remove comment
pac.comments.pull(_id);
pac.save(function (err) {
  if (err) return handleError(err);
  console.log('the subdocs were removed');
}); */

//what is  casting updates
/*Parent.update({}, { 'child.name': 'Luke Skywalker' }, function(error) {
  // Works!
});*/

/*
var pac = new Pac({..});
pac.save

or return Pac.create({..}, function (err, pac) {
  if (err) return handleError(err);
  // saved!
  else
  return pac._id
})
*/

/*
Querying
Pac.find({createdBy: ..}).exec(callback);
*/

/*
remove all placesId for pac
Pac.find({_id: ..}).placeIds.remove({ _id: placeid }, function (err) {
  if (err) return handleError(err);
  // removed!
});*/

/*TODO If you want to update a single document 
in the db and return it to your application, use findOneAndUpdate instead.*/
/*
The findAndUpdate/Remove static methods all make a change to at most one document, 
and return it with just one call to the database. */

/*--------------save
var author = new Person({
  _id: new mongoose.Types.ObjectId(),
  name: 'Ian Fleming',
  age: 50
});

author.save(function (err) {
  if (err) return handleError(err);
  
  var story1 = new Story({
    title: 'Casino Royale',
    author: author._id    // assign the _id from the person
  });
  
  story1.save(function (err) {
    if (err) return handleError(err);
    // thats it!
  });
});
Population


MongooseArray.addToSet
console.log(doc.array) // [2,3,4]
var added = doc.array.addToSet(4,5);
console.log(doc.array) // [2,3,4,5]
console.log(added)     // [5]*/