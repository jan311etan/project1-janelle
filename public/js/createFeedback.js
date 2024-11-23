async function submitFeedback() {
    const email = document.getElementById('email').value;
    const feedbackText = document.getElementById('feedback').value;

    // Email format validation using a regular expression
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return; // Stop the function if the email format is incorrect
    }

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
            alert("Feedback submitted successfully!");
            document.getElementById('createFeedbackForm').reset();
        } else if (response.status === 409) {
            alert("Feedback already exists for this email. Redirecting to update page.");
            window.location.href = 'updateFeedback.html';
        } else {
            alert("Failed to submit feedback.");
        }
    } catch (error) {
        console.error("Error submitting feedback:", error);
    }
}
