// async function submitFeedback() {
//     const email = document.getElementById('email').value;
//     const feedbackText = document.getElementById('feedback').value;

//     if (!email || !feedbackText) {
//         alert('Both email and feedback are required.');
//         return;
//     }

//     // Email format validation using a regular expression
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailPattern.test(email)) {
//         alert('Please enter a valid email address.');
//         return;
//     }

//     const feedbackData = { email, feedback: feedbackText };

//     try {
//         const response = await fetch('/create-feedback', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(feedbackData),
//         });

//         if (response.status === 201) {
//             alert('Feedback submitted successfully!');
//             document.getElementById('createFeedbackForm').reset();
//         } else if (response.status === 409) {
//             alert('Feedback already exists for this email. Redirecting to update page.');
//             window.location.href = 'updateFeedback.html';
//         } else {
//             alert('Failed to submit feedback.');
//         }
//     } catch (error) {
//         alert('An unexpected error occurred while submitting feedback.');
//         console.error('Error submitting feedback:', error);
//     }
// }

async function submitFeedback() {
    const email = document.getElementById('email').value;
    const feedbackText = document.getElementById('feedback').value;

    if (!email || !feedbackText) {
        alert('Both email and feedback are required.');
        return;
    }

    // Email format validation using a regular expression
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    const feedbackData = { email, feedback: feedbackText };

    try {
        const response = await fetch('/create-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feedbackData),
        });

        console.log(response)

        if (response.status === 201) {
            alert('Feedback submitted successfully!');
            document.getElementById('createFeedbackForm').reset();
        } else {
            alert('Feedback already exists for this email.');
            // window.location.href = 'updateFeedback.html';
        }
    } catch (error) {
        alert('An unexpected error occurred while submitting feedback.');
        console.error('Error submitting feedback:', error);
    }
}
