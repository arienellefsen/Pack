// Include the axios package for performing HTTP requests (promise based alternative to request)
var axios = require("axios");
// Helper functions for making API Calls
var helper = {
    addUser: function(user) {
        return axios.post('/api/user').then(function(response) {
            console.log(JSON.stringify(response));
            return axios.get('/api/users/' +
                response._id +
                '/pacs').then(function(response) {
                console.log(JSON.stringify(response));
                return response.data
            }).catch(function(error) {
                console.log(error);
            });
        }).catch(function(error) {
            console.log(error);
        });
    },

    //used in ProcEditor
    getPocById: function(id) {
        console.log("getPocById:" + id);
        return axios.get('/pacs/' + id)
            .then(function(response) {
                console.log(JSON.stringify(response));
                return response.data;
            })
            .catch(function(error) {});
    },

    //used in ProcEditor
    addPac: function(pac) {
        return axios.post('/api/pac', {
            pac: pac
        }).then(function(response) {
            console.log(JSON.stringify(response));
            return response.data;
        }).catch(function(error) {
            console.log(LOGPRE + "addPac " + error);
        });
    },

    //used in ProcEditor
    updatePac: function(pac) {
        return axios.put('/pac', {
            pac: pac
        }).then(function(response) {
            console.log(JSON.stringify(response));
            return response.data;
        }).catch(function(error) {
            console.log(LOGPRE + "updatePac " + error);
        });
    }
};

// We export the API helper
module.exports = helper;