const { MessageHandler } = require('../whatsapp/messageHandler');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

function setupRoutes(app, waConnection) {
    const messageHandler = new MessageHandler(waConnection);

    app.get('/status', (req, res) => {
        const status = waConnection.getConnectionStatus();
        res.json({
            success: true,
            data: status
        });
    });

    app.post('/send-text', async (req, res) => {
        try {
            const { phoneNumber, message } = req.body;

            if (!phoneNumber || !message) {
                return res.status(400).json({
                    success: false,
                    error: 'Phone number and message are required'
                });
            }

            const result = await messageHandler.sendTextMessage(phoneNumber, message);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    app.post('/send-image', upload.single('image'), async (req, res) => {
        try {
            const { phoneNumber, caption } = req.body;
            const imageBuffer = req.file?.buffer;

            if (!phoneNumber || !imageBuffer) {
                return res.status(400).json({
                    success: false,
                    error: 'Phone number and image are required'
                });
            }

            const result = await messageHandler.sendImageMessage(phoneNumber, imageBuffer, caption || '');

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    app.post('/send-document', upload.single('document'), async (req, res) => {
        try {
            const { phoneNumber, fileName } = req.body;
            const documentBuffer = req.file?.buffer;
            const mimetype = req.file?.mimetype;

            if (!phoneNumber || !documentBuffer || !fileName) {
                return res.status(400).json({
                    success: false,
                    error: 'Phone number, document, and fileName are required'
                });
            }

            const result = await messageHandler.sendDocumentMessage(phoneNumber, documentBuffer, fileName, mimetype);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    app.post('/send-audio', upload.single('audio'), async (req, res) => {
        try {
            const { phoneNumber } = req.body;
            const audioBuffer = req.file?.buffer;

            if (!phoneNumber || !audioBuffer) {
                return res.status(400).json({
                    success: false,
                    error: 'Phone number and audio are required'
                });
            }

            const result = await messageHandler.sendAudioMessage(phoneNumber, audioBuffer);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    app.post('/send-location', async (req, res) => {
        try {
            const { phoneNumber, latitude, longitude, address } = req.body;

            if (!phoneNumber || !latitude || !longitude) {
                return res.status(400).json({
                    success: false,
                    error: 'Phone number, latitude, and longitude are required'
                });
            }

            const result = await messageHandler.sendLocationMessage(phoneNumber, latitude, longitude, address || '');

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    app.post('/send-contact', async (req, res) => {
        try {
            const { phoneNumber, contactName, contactNumber } = req.body;

            if (!phoneNumber || !contactName || !contactNumber) {
                return res.status(400).json({
                    success: false,
                    error: 'Phone number, contact name, and contact number are required'
                });
            }

            const result = await messageHandler.sendContactMessage(phoneNumber, contactName, contactNumber);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    app.post('/send-button', async (req, res) => {
        try {
            const { phoneNumber, text, buttons, footer } = req.body;

            if (!phoneNumber || !text || !buttons || !Array.isArray(buttons)) {
                return res.status(400).json({
                    success: false,
                    error: 'Phone number, text, and buttons array are required'
                });
            }

            const result = await messageHandler.sendButtonMessage(phoneNumber, text, buttons, footer || '');

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    app.post('/send-list', async (req, res) => {
        try {
            const { phoneNumber, text, buttonText, sections, footer } = req.body;

            if (!phoneNumber || !text || !buttonText || !sections || !Array.isArray(sections)) {
                return res.status(400).json({
                    success: false,
                    error: 'Phone number, text, buttonText, and sections array are required'
                });
            }

            const result = await messageHandler.sendListMessage(phoneNumber, text, buttonText, sections, footer || '');

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    app.get('/profile-picture/:phoneNumber', async (req, res) => {
        try {
            const { phoneNumber } = req.params;
            const jid = messageHandler.formatPhoneNumber(phoneNumber);

            const profilePic = await waConnection.getProfilePicture(jid);

            res.json({
                success: true,
                data: {
                    profilePicture: profilePic
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    app.post('/logout', async (req, res) => {
        try {
            await waConnection.disconnect();

            res.json({
                success: true,
                message: 'Successfully logged out'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    app.get('/', (req, res) => {
        res.json({
            success: true,
            message: 'WhatsApp API using Baileys',
            endpoints: {
                'GET /status': 'Get connection status and QR code',
                'POST /send-text': 'Send text message',
                'POST /send-image': 'Send image message (multipart/form-data)',
                'POST /send-document': 'Send document (multipart/form-data)',
                'POST /send-audio': 'Send audio message (multipart/form-data)',
                'POST /send-location': 'Send location message',
                'POST /send-contact': 'Send contact message',
                'POST /send-button': 'Send button message',
                'POST /send-list': 'Send list message',
                'GET /profile-picture/:phoneNumber': 'Get profile picture URL',
                'POST /logout': 'Logout from WhatsApp'
            }
        });
    });
}

module.exports = { setupRoutes };