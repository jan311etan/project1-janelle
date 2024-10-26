function addRecipe() {
    var response = "";
    var jsonData = new Object();
    jsonData.recipeName = document.getElementById("recipeName").value;
    jsonData.description = document.getElementById("description").value;
    jsonData.ingredients = document.getElementById("ingredients").value;
    jsonData.steps = document.getElementById("steps").value;
    jsonData.imageUrl = document.getElementById("imageUrl").value;

    if (jsonData.recipeName === "" || jsonData.description === "" || jsonData.ingredients === "" || jsonData.steps === "" || jsonData.imageUrl === "") {
        document.getElementById("message").innerHTML = 'All fields are required!';
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }

    var request = new XMLHttpRequest();
    request.open("POST", "/addRecipe", true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        response = JSON.parse(request.responseText);
        console.log(response);

        if (response.message === undefined) {
            document.getElementById("message").innerHTML = 'Added Resource: ' + jsonData.name + '!';
            document.getElementById("message").setAttribute("class", "text-success");
            document.getElementById("recipeName").value = "";
            document.getElementById("description").value = "";
            document.getElementById("ingredients").value = "";
            document.getElementById("steps").value = "";
            document.getElementById("imageUrl").value = "";
            window.location.href = 'viewRecipe.html';
        } else {
            document.getElementById("message").innerHTML = 'Unable to add resource!';
            document.getElementById("message").setAttribute("class", "text-danger");
        }
    };

    request.send(JSON.stringify(jsonData));
}
