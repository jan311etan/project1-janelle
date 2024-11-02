// Retrieve existing feedback based on email
function retrieveFeedback() {
    const email = document.getElementById("email").value;

    if (!email) {
        document.getElementById("message").innerHTML = 'Please enter your email.';
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }

    var request = new XMLHttpRequest();
    request.open("GET", `/feedback/${email}`, true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
            const response = JSON.parse(request.responseText);
            if (response) {
                document.getElementById("feedback").value = response.feedbackText;
                document.getElementById("rating").value = response.rating;
                document.getElementById("message").innerHTML = '';
            } else {
                document.getElementById("message").innerHTML = 'No feedback found for this email.';
                document.getElementById("message").setAttribute("class", "text-danger");
            }
        } else {
            document.getElementById("message").innerHTML = 'Error retrieving feedback.';
            document.getElementById("message").setAttribute("class", "text-danger");
        }
    };
    request.send();
}

// Update feedback
function updateFeedback() {
    const email = document.getElementById("email").value;
    const feedback = document.getElementById("feedback").value;
    const rating = document.getElementById("rating").value;

    if (!feedback || !rating) {
        document.getElementById("message").innerHTML = 'Feedback and rating are required!';
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }

    var request = new XMLHttpRequest();
    request.open("PUT", `/update-feedback/${email}`, true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
            const response = JSON.parse(request.responseText);
            document.getElementById("message").innerHTML = response.message;
            document.getElementById("message").setAttribute("class", "text-success");
        } else {
            const response = JSON.parse(request.responseText);
            document.getElementById("message").innerHTML = response.message;
            document.getElementById("message").setAttribute("class", "text-danger");
        }
    };

    request.send(JSON.stringify({ feedback, rating }));
}

