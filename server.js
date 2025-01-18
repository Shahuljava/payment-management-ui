const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the `dist/payment-management-ui/browser` directory
app.use(express.static(path.join(__dirname, 'dist/payment-management-ui/browser')));

// Redirect all other routes to `index.html` for Angular routing
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/payment-management-ui/browser/index.html'));
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Frontend server running on port ${PORT}`);
});
