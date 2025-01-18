const express = require('express');
const path = require('path');

const app = express();

// Serve the static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist/payment-management-ui')));

// Redirect all other routes to index.html
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/payment-management-ui/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
