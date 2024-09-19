const pdf = require('pdfkit');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Function to generate PDF ticket
const generateTicketPDF = (ticketDetails) => {
  return new Promise((resolve, reject) => {
    const doc = new pdf();
    const filePath = path.join(__dirname, 'tickets', `${ticketDetails.ticketId}.pdf`);
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(16).text('*** TICKET ***', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`**Ticket ID**: ${ticketDetails.ticketId}`);
    doc.text(`**Name**: ${ticketDetails.name}`);
    doc.text(`**Booking Date**: ${ticketDetails.bookingDate}`);
    doc.text(`**Visit Date**: ${ticketDetails.visitDate}`);
    doc.text(`**Monument**: ${ticketDetails.monument}`);
    doc.text(`**Entry Time**: ${ticketDetails.entryTime}`);
    doc.text(`**Number of Visitors**: ${ticketDetails.numVisitors}`);
    doc.text(`**Ticket Type**: ${ticketDetails.ticketType}`);
    doc.text(`**Price**: ₹${ticketDetails.price}`);
    doc.text(`**Payment Status**: Paid (Razorpay Payment ID: ${ticketDetails.razorpayPaymentId})`);
    doc.moveDown();
    doc.text('**Visitor Instructions**:');
    doc.text('- Please arrive 15 minutes before the entry time.');
    doc.text('- Carry a valid photo ID for verification.');
    doc.text('- No outside food or beverages allowed inside the monument.');
    doc.moveDown();
    doc.text('**For Assistance**:');
    doc.text('- Contact the Ministry of Culture helpdesk.');
    doc.text('- Call: +91-1800-123-4567');
    doc.text('- Email: support@tourism.gov.in');
    doc.moveDown();
    doc.text('**Payment Method**: Razorpay');
    doc.text(`**Transaction ID**: ${ticketDetails.transactionId}`);
    doc.text('**Booking Platform**: Ministry of Culture Online Chatbot');
    doc.end();

    doc.on('end', () => resolve(filePath));
    doc.on('error', (err) => reject(err));
  });
};

// Function to send email with PDF attachment
const sendTicketEmail = async (email, filePath) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: 'noreply@tourism.gov.in',
    to: email,
    subject: 'Your Ticket for Monument Visit',
    text: 'Please find attached your ticket for the monument visit.',
    attachments: [{ filename: path.basename(filePath), path: filePath }]
  };

  return transporter.sendMail(mailOptions);
};

// Endpoint to handle ticket generation
exports.generateTicket = async (req, res) => {
  const { ticketDetails, userEmail } = req.body;

  try {
    const pdfFilePath = await generateTicketPDF(ticketDetails);
    await sendTicketEmail(userEmail, pdfFilePath);
    res.json({ message: 'Ticket generated and sent successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error generating ticket', error });
  }
};
