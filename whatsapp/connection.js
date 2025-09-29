const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const P = require('pino');
const fs = require('fs');
const path = require('path');

class WAConnection {
    constructor() {
        this.socket = null;
        this.qrCode = null;
        this.isConnected = false;
        this.authPath = './auth_info';
        this.logger = P({ timestamp: () => `,"time":"${new Date().toJSON()}"` }, P.destination('./wa-logs.txt'));
    }

    async initialize() {
        try {
            const { state, saveCreds } = await useMultiFileAuthState(this.authPath);
            const { version, isLatest } = await fetchLatestBaileysVersion();

            console.log(`Using WA v${version.join('.')}, isLatest: ${isLatest}`);

            this.socket = makeWASocket({
                version,
                logger: this.logger,
                printQRInTerminal: true,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, this.logger),
                },
                generateHighQualityLinkPreview: true,
            });

            this.setupEventHandlers(saveCreds);

            return new Promise((resolve, reject) => {
                this.socket.ev.on('connection.update', (update) => {
                    const { connection, lastDisconnect, qr } = update;

                    if (qr) {
                        this.qrCode = qr;
                        console.log('QR Code generated. Scan it with your phone.');
                        qrcode.generate(qr, { small: true });
                    }

                    if (connection === 'close') {
                        const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
                        console.log('Connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);

                        if (shouldReconnect) {
                            this.initialize();
                        } else {
                            reject(new Error('Logged out'));
                        }
                    } else if (connection === 'open') {
                        console.log('WhatsApp connection opened successfully');
                        this.isConnected = true;
                        this.qrCode = null;
                        resolve();
                    }
                });
            });
        } catch (error) {
            console.error('Error initializing WhatsApp connection:', error);
            throw error;
        }
    }

    setupEventHandlers(saveCreds) {
        this.socket.ev.on('creds.update', saveCreds);

        this.socket.ev.on('messages.upsert', (m) => {
            console.log('Received message:', JSON.stringify(m, undefined, 2));
        });
    }

    async sendMessage(jid, message) {
        if (!this.isConnected) {
            throw new Error('WhatsApp not connected');
        }

        try {
            const result = await this.socket.sendMessage(jid, message);
            return result;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    async getProfilePicture(jid) {
        try {
            const profilePic = await this.socket.profilePictureUrl(jid, 'image');
            return profilePic;
        } catch (error) {
            return null;
        }
    }

    async disconnect() {
        if (this.socket) {
            await this.socket.logout();
            this.socket = null;
            this.isConnected = false;
        }
    }

    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            qrCode: this.qrCode
        };
    }
}

module.exports = { WAConnection };