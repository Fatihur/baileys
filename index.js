const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { WAConnection } = require('./whatsapp/connection');
const { setupRoutes } = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let waConnection = null;

async function initializeApp() {
    try {
        waConnection = new WAConnection();
        await waConnection.initialize();

        setupRoutes(app, waConnection);

        app.listen(PORT, () => {
            console.log(`WhatsApp API Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to initialize WhatsApp API:', error);
        process.exit(1);
    }
}

process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    if (waConnection) {
        await waConnection.disconnect();
    }
    process.exit(0);
});

initializeApp();