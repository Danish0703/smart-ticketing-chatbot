document.addEventListener('DOMContentLoaded', () => {
    const chatbox = document.getElementById('chatbox');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const feedbackForm = document.getElementById('feedbackForm');
    const ratingInput = document.getElementById('rating');
    const commentsInput = document.getElementById('comments');

    sendButton.addEventListener('click', async () => {
        const message = userInput.value;
        if (message.trim() !== '') {
            addMessageToChatbox('You', message);
            userInput.value = '';

            try {
                const response = await fetch('/api/chatbot', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message })
                });

                const data = await response.json();
                addMessageToChatbox('Bot', data.message);

                if (data.bookingConfirmed) {
                    const ticketDetails = {
                        ticketId: '123456789',
                        name: 'John Doe',
                        bookingDate: new Date().toLocaleDateString(),
                        visitDate: '2024-10-05',
                        monument: 'Taj Mahal, Agra',
                        entryTime: '09:00 AM',
                        numVisitors: 2,
                        ticketType: 'Adult',
                        price: 500,
                        razorpayPaymentId: 'pay_ABC12345XYZ',
                        transactionId: 'txn_987654321'
                    };

                    // Assuming ticket generation is handled server-side
                    await fetch('/api/tickets/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ticketDetails, userEmail: 'john.doe@example.com' })
                    });

                    addMessageToChatbox('Bot', 'Your ticket has been generated and sent to your email.');
                }
            } catch (error) {
                addMessageToChatbox('Bot', 'There was an error processing your request.');
            }
        }
    });

    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const rating = ratingInput.value;
        const comments = commentsInput.value;

        try {
            await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, comments })
            });

            alert('Feedback submitted successfully');
            ratingInput.value = '';
            commentsInput.value = '';
        } catch (error) {
            alert('Error submitting feedback');
        }
    });

    function addMessageToChatbox(user, message) {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<strong>${user}:</strong> ${message}`;
        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight;
    }
});
