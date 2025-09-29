class MessageHandler {
    constructor(waConnection) {
        this.waConnection = waConnection;
    }

    formatPhoneNumber(phoneNumber) {
        let formatted = phoneNumber.replace(/\D/g, '');

        if (!formatted.startsWith('62') && formatted.startsWith('0')) {
            formatted = '62' + formatted.substring(1);
        } else if (!formatted.startsWith('62')) {
            formatted = '62' + formatted;
        }

        return formatted + '@s.whatsapp.net';
    }

    async sendTextMessage(phoneNumber, text) {
        const jid = this.formatPhoneNumber(phoneNumber);
        const message = { text: text };

        return await this.waConnection.sendMessage(jid, message);
    }

    async sendImageMessage(phoneNumber, imageBuffer, caption = '') {
        const jid = this.formatPhoneNumber(phoneNumber);
        const message = {
            image: imageBuffer,
            caption: caption
        };

        return await this.waConnection.sendMessage(jid, message);
    }

    async sendDocumentMessage(phoneNumber, documentBuffer, fileName, mimetype) {
        const jid = this.formatPhoneNumber(phoneNumber);
        const message = {
            document: documentBuffer,
            fileName: fileName,
            mimetype: mimetype
        };

        return await this.waConnection.sendMessage(jid, message);
    }

    async sendAudioMessage(phoneNumber, audioBuffer) {
        const jid = this.formatPhoneNumber(phoneNumber);
        const message = {
            audio: audioBuffer,
            mimetype: 'audio/mp4'
        };

        return await this.waConnection.sendMessage(jid, message);
    }

    async sendLocationMessage(phoneNumber, latitude, longitude, address = '') {
        const jid = this.formatPhoneNumber(phoneNumber);
        const message = {
            location: {
                degreesLatitude: latitude,
                degreesLongitude: longitude,
                name: address
            }
        };

        return await this.waConnection.sendMessage(jid, message);
    }

    async sendContactMessage(phoneNumber, contactName, contactNumber) {
        const jid = this.formatPhoneNumber(phoneNumber);
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contactName}
TEL;type=CELL;type=VOICE;waid=${contactNumber}:+${contactNumber}
END:VCARD`;

        const message = {
            contacts: {
                displayName: contactName,
                contacts: [{ vcard }]
            }
        };

        return await this.waConnection.sendMessage(jid, message);
    }

    async sendButtonMessage(phoneNumber, text, buttons, footer = '') {
        const jid = this.formatPhoneNumber(phoneNumber);
        const message = {
            text: text,
            footer: footer,
            buttons: buttons.map((btn, index) => ({
                buttonId: `btn_${index}`,
                buttonText: { displayText: btn },
                type: 1
            })),
            headerType: 1
        };

        return await this.waConnection.sendMessage(jid, message);
    }

    async sendListMessage(phoneNumber, text, buttonText, sections, footer = '') {
        const jid = this.formatPhoneNumber(phoneNumber);
        const message = {
            text: text,
            footer: footer,
            title: '',
            buttonText: buttonText,
            sections: sections
        };

        return await this.waConnection.sendMessage(jid, message);
    }
}

module.exports = { MessageHandler };