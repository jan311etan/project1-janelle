function addRecipe() {
    let response = "";
    let jsonData = new Object();
    jsonData.recipeName = document.getElementById("recipeName").value;
    jsonData.description = document.getElementById("description").value;
    jsonData.ingredients = document.getElementById("ingredients").value;
    jsonData.steps = document.getElementById("steps").value;
    jsonData.imageLink = document.getElementById("imageLink").value;

    // Validation check for empty fields
    //const imageUrlPattern = /*/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg)(?:\?.*)?$*//^data:image\/(?:png|jpg|jpeg|gif|svg);base64,[A-Za-z0-9+/=]+$)/i;
    const imageUrlPattern = /^(https?:\/\/.*(?:png|jpg|jpeg|gif|svg|tbn).*(?:\?.*)?$|^data:image\/(?:png|jpg|jpeg|gif|svg);base64,[A-Za-z0-9+/=]+$)/i;


    if (jsonData.recipeName === "" || jsonData.description === "" || jsonData.ingredients === "" || jsonData.steps === "" || !imageUrlPattern.test(jsonData.imageLink)) {
        document.getElementById("message").innerHTML = "All fields are required! and a valid image link is needed!";
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }

    // Create and configure XMLHttpRequest
    const request = new XMLHttpRequest();
    request.open("POST", "/addRecipe", true);
    request.setRequestHeader("Content-Type", "application/json");

    // Handle the response from the server
    request.onload = function() {
        response = JSON.parse(request.responseText);
        console.log(response);

        if (response.message === undefined) {
            document.getElementById("message").innerHTML = "Added Recipe: " + jsonData.recipeName;
            document.getElementById("message").setAttribute("class", "text-success");

            // Clear input fields after successful submission
            document.getElementById("recipeName").value = "";
            document.getElementById("description").value = "";
            document.getElementById("ingredients").value = "";
            document.getElementById("steps").value = "";
            document.getElementById("imageLink").value = "";

            // Optionally redirect to another page, such as the main page
            window.location.href = "viewRecipe.html";
        } else {
            document.getElementById("message").innerHTML = "Unable to add recipe!";
            document.getElementById("message").setAttribute("class", "text-danger");
        }
    };

    // Send the JSON data to the server
    request.send(JSON.stringify(jsonData));
}
