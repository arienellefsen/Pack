function addActiveClass() {
    console.log('clicked');

}
document.getElementById("nav-Link").addEventListener("click", function() {
    console.log('clicke');
});


// When the delete icon of the comment is clicked
$(document).on("click", "#updateprofile", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the comment, using what's entered in the inputs
    //TODO "DELETE" delete not working when try to refresh even though data is deleted
    $.ajax({
            method: "PUT",
            url: "/user/",
            data: {
            	user: {
            		userid: $(this).attr("user-id"),
            		firstname: $("#firstname").val(),
                    // Value taken from comment textarea
                    lastname: $("#lastname").val()
            	}
            }
        })
        // With that done
        .done(function(data) {
            refreshComments(data);
        });
});