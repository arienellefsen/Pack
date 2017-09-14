var express = require('express');
var apirouter = express.Router();
var Pac = require("./../models/Pac.js");
var Place = require("./../models/Place.js");
var User = require("./../models/User.js");

// Add a User
// user id required in req (validated: add new user)
apirouter.post("/user/", function(req, res) {

    var reqEmailAddress = req.body.user.emailAddress;
    //Find user by email
    User.findOne({
        emailAddress: reqEmailAddress
    }).populate({
        path: "pacs",
        options: {
            sort: [{
                "createdAt": -1
            }]
        }
    }).exec(function(error, existinguser) {
        if (error) {
            console.log(error);
        } else {
            //Check if user exist
            if (!existinguser) {
                console.log("add: " + reqEmailAddress);
                var entry = new User(req.body.user);
                // Now, save that entry to the db
                entry.save(function(err, newuser) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json(newuser);
                    }
                });
            } else {
                res.json(existinguser);
            }
        }
    });
});

// Update a User
apirouter.put("/user/", function(req, res) {
    var reqEmailAddress = req.body.user.emailAddress;
    User.findOneAndUpdate({
            _id: user.id
        })
        .exec(function(err, doc) {
            // Log any errors
            if (err) {
                res.send(err);
            } else {
                res.json(doc);
            }
        });
});

apirouter.get("/users/:id", function(req, res) {
    console.log("get: " + req);
    User.findOne({
            "_id": req.params.id
        })
        .populate({
            path: "pacs",
            options: {
                sort: [{
                    "createdAt": -1
                }]
            }
        })
        .exec(function(error, userwpacs) {
            if (error) {
                console.log(error);
            } else {
                res.json(userwpacs);
            }
        });
});


//OK This will get the Pacs from the mongoDB
//validated with user who does not have any pac
/*http://localhost:3000/api/users/59b4659335c77b446c612608/pacs
[]
*/
apirouter.get("/users/:id/pacs", function(req, res) {
    // Grab at most 15 Pacs orded with the most recent first from DB
    Pac.find({ createdBy: req.params.id }).sort({
        createdAt: -1
    }).limit(15).exec(function(error, arrayofpacs) {
        if (error) {
            console.log(error);
        } else {
            res.json(arrayofpacs);
        }
    });
});

// This will get the Pac including place details from the mongoDB
apirouter.get("/pacs/:id", function(req, res) {
    Pac.findOne({
            "_id": req.params.id
        })
        .populate({
            path: "places",
            options: {
                sort: [{
                    "createdAt": 1
                }]
            }
        }).exec(function(error, pac) {
            if (error) {
                console.log(error);
            } else {
                res.json(pac);
            }
        });
});

// This will get the Place details from the mongoDB
apirouter.get("/places/:id", function(req, res) {
    Place.findOne({
        "_id": req.params.id
    }).exec(function(error, doc) {
        if (error) {
            console.log(error);
        } else {
            res.json(doc);
        }
    });
});

//Add a Pac, Pac.createdBy is required to be set with the userid
//Note: no unique check if update a pac have to use the post pocs/:id
apirouter.post("/pac", function(req, res) {
    console.log("add: " + JSON.stringify(req.body.pac));
    console.log("to: " + req.user.pacappuserid);
    var arrayOfPlaceIds = [];
    var promises = [];
    for (var placeIndex in req.body.pac.places) {
        promises.push(asynSavePlace(arrayOfPlaceIds, req.body.pac.places[placeIndex]));
    }

    Promise.all(promises).then(() => {
            console.log("save places done");
            var pac = req.body.pac;
            pac.places = arrayOfPlaceIds;
            pac.category = "place";
            pac.pictureURL = "";
            pac.createdBy = req.user.pacappuserid;
            var entry = new Pac(pac);

            // Now, save that entry to the db
            entry.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    return error
                } else {
                    console.log("new pac doc: " + doc);
                    // Use the user id to find and update it's pacs
                    User.findOneAndUpdate({
                        "_id": pac.createdBy
                    }, {
                        $push: {
                            "pacs": doc._id
                        }
                    }).exec(function(err, doc) {
                        // Log any errors
                        if (err) {
                            res.send(err);
                            return err
                        } else {
                            console.log(doc);
                            res.send(doc);
                        }
                    });
                }
            });

        })
        .catch((e) => {
            console.log(e);
        });
});

//this return a promise which can be .then
//To provide a function with promise functionality
function asynSavePlace(placeIdArray, place) {
    console.log(JSON.stringify(place));
    console.log("to add place " + place);
    console.log("to add: " + place.name + " with " +
        place.lat + " " + place.lng);
    return new Promise((resolve, reject) => {
        Place.findOne({
            name: place.name,
            lat: place.lat,
            lng: place.lng
        }).exec(function(error, doc) {
            if (error) {
                console.log(error);
            } else {
                if (!doc) { //cannot use doc.length===0 for findOne function
                    //save the User
                    console.log("No place found with " + place.name + " with " +
                        place.lat + " " + place.lng);
                    var entry = new Place(place);

                    // Now, save that entry to the db
                    entry.save(function(err, newdoc) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(place.name + " added");
                            placeIdArray.push(newdoc._id);
                            resolve("Success!");
                        }
                    });
                } else {
                    console.log("find existing place " + place.name +
                        " with " + place.lat + " " + place.lng);
                    placeIdArray.push(doc._id);
                    resolve("Success!");
                }
            }
        }); //end lookup storyId and save record if it is a new story
    }); //return Promise
}


//OK save the pac to the DB and add to the User pacs ref
function addPac(pac, placeIds, userid) {
    pac.places = placeIds;
    var entry = new Pac(pac);

    // Now, save that entry to the db
    entry.save(function(err, doc) {
        if (err) {
            console.log(err);
            return error
        } else {
            // Use the user id to find and update it's pacs
            User.findOneAndUpdate({
                    "_id": userid
                }, {
                    $push: {
                        "pacs": doc._id
                    }
                })
                // Execute the above query
                .exec(function(err, doc) {
                    // Log any errors
                    if (err) {
                        console.log(err);
                        return err
                    } else {
                        return doc
                    }
                });
        }
    });
}

// Update a PAC
// user id required in req
// pac id required in req
apirouter.put("/pac", function(req, res) {
    console.log("update: " + JSON.stringify(req.body.pac));
    console.log("update: " + JSON.stringify(req.body.id));
    var updatedPac = req.body.pac;
    var arrayOfPlaceIds = [];
    var promises = [];

    Pac.findById(req.body.id, function(err, pac) {
        if (err) {
            res.send(err);
        } else {
            if (!pac) {
                res.send("not found pac with:" + req.body.id);
            } else {
                for (var placeIndex in req.body.pac.places) {
                    promises.push(asynSavePlace(arrayOfPlaceIds, req.body.pac.places[placeIndex]));
                }

                Promise.all(promises).then(() => {
                        console.log("save places done");
                        pac.title = updatedPac.title;
                        pac.category = updatedPac.category;
                        pac.pictureURL = updatedPac.pictureURL;
                        pac.places = arrayOfPlaceIds;
                        pac.createdBy = updatedPac.createdBy;
                        pac.save(function(err, savedPac) {
                            if (err) {
                                res.send(err);
                            } else {
                                res.json(savedPac);
                            }
                        });
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            }
        }
    });
});


module.exports = apirouter;