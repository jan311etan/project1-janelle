// async function submitFeedback() {
//     // Capture values from input fields
//     const email = document.getElementById('email').value;
//     const feedbackText = document.getElementById('feedback').value;

//     // Basic validation to ensure fields are filled
//     if (!email || !feedbackText) {
//         alert("Both email and feedback are required.");
//         return;
//     }

//     // Create a JSON object with the feedback data
//     const feedbackData = { email, feedback: feedbackText };

//     try {
//         // Send POST request to the backend route for creating feedback
//         const response = await fetch('/create-feedback', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(feedbackData)
//         });

//         // Check if the response is successful
//         if (response.ok) {
//             alert("Feedback submitted successfully!");
//             document.getElementById('feedbackForm').reset(); // Reset form fields
//         } else {
//             alert("Failed to submit feedback.");
//         }
//     } catch (error) {
//         // Handle any errors that occur during the request
//         console.error("Error submitting feedback:", error);
//     }
// }

// public/js/feedback.js

async function submitFeedback() {
    const email = document.getElementById('email').value;
    const feedbackText = document.getElementById('feedback').value;

    if (!email || !feedbackText) {
        alert("Both email and feedback are required.");
        return;
    }

    const feedbackData = { email, feedback: feedbackText };

    try {
        const response = await fetch('/create-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feedbackData)
        });

        if (response.status === 201) {
            // If feedback creation is successful
            alert("Feedback submitted successfully!");
            document.getElementById('createFeedbackForm').reset();

        } else if (response.status === 409) {
            // If feedback already exists, redirect to the Update Feedback page
            alert("Feedback already exists for this email. Redirecting to update page.");
            window.location.href = 'updateFeedback.html'; // Redirects to the Update Feedback page

        } else {
            alert("Failed to submit feedback.");
        }
    } catch (error) {
        console.error("Error submitting feedback:", error);
    }
}


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

