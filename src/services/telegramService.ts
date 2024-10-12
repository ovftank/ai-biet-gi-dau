import axios from 'axios';

import DataStore from '../database/dataStore.js';

interface TelegramResponse {
    ok: boolean;
    result?: {
        message_id: number;
    };
}

class TelegramService {
    private readonly databaseService: DataStore;
    private apiToken: string;
    private chatId: string;

    constructor() {
        this.databaseService = new DataStore();
    }

    async initialize() {
        const telegramConfig = await this.databaseService.getTelegramConfig();
        await this.setMyDescription();
        if (!telegramConfig) {
            this.apiToken = '';
            this.chatId = '';
            await this.databaseService.updateTelegramConfig({
                token: '',
                chatId: '',
            });
        } else {
            this.apiToken = telegramConfig.token;
            this.chatId = telegramConfig.chatId;
        }
    }

    async setMyDescription() {
        await axios.post(
            `https://api.telegram.org/bot${this.apiToken}/setMyDescription`,
            {
                description: 'Liên hệ hỗ trợ: https://t.me/ovftank',
            },
        );
    }

    async sendMessage(message: string): Promise<string> {
        const response = await axios.post<TelegramResponse>(
            `https://api.telegram.org/bot${this.apiToken}/sendMessage`,
            {
                chat_id: this.chatId,
                text: message,
            },
        );
        const messageId = response.data.result?.message_id;
        if (typeof messageId !== 'number') {
            throw new Error('Failed to get message ID from Telegram API');
        }
        return messageId.toString();
    }

    async editMessage(messageId: string, message: string): Promise<void> {
        await axios.post(
            `https://api.telegram.org/bot${this.apiToken}/editMessageText`,
            {
                chat_id: this.chatId,
                message_id: messageId,
                text: message,
            },
        );
    }

    async deleteMessage(messageId: string) {
        await axios.post(
            `https://api.telegram.org/bot${this.apiToken}/deleteMessage`,
            {
                chat_id: this.chatId,
                message_id: messageId,
            },
        );
    }

    async sendPhoto(photo: string) {
        await axios.post(
            `https://api.telegram.org/bot${this.apiToken}/sendPhoto`,
            {
                chat_id: this.chatId,
                photo: photo,
            },
        );
    }
}
export default TelegramService;
