function retrieveFeedback() {
    const email = document.getElementById("email").value;

    if (!email) {
        alert('Please enter your email.');
        return;
    }

    var request = new XMLHttpRequest();
    request.open("GET", `/feedback/${email}`, true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
            const response = JSON.parse(request.responseText);
            if (response) {
                document.getElementById("feedback").value = response.feedbackText;
            } else {
                alert('No feedback found for this email.');
            }
        } else {
            alert('Error retrieving feedback.');
        }
    };
    request.onerror = function () {
        alert('Request failed. Please check your network connection.');
    };
    request.send();
}

function updateFeedback() {
    const email = document.getElementById("email").value;
    const feedback = document.getElementById("feedback").value;

    if (!feedback) {
        alert('Feedback is required!');
        return;
    }

    var request = new XMLHttpRequest();
    request.open("PUT", `/update-feedback/${email}`, true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
            const response = JSON.parse(request.responseText);
            alert(response.message);
        } else {
            const response = JSON.parse(request.responseText);
            alert(response.message);
        }
    };

    request.onerror = function () {
        alert('Request failed. Please check your network connection.');
    };

    request.send(JSON.stringify({ feedback }));
}

