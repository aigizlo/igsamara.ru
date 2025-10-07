#!/usr/bin/env node

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Конфигурация
const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_USERS = process.env.TELEGRAM_USERS.split(',');

if (!BOT_TOKEN) {
    console.error('Ошибка: BOT_TOKEN не найден в .env файле');
    process.exit(1);
}

// Функция отправки сообщения в Telegram
async function sendToTelegram(chatId, message) {
    try {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const response = await axios.post(url, {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        });
        return response.data;
    } catch (error) {
        console.error(`Ошибка отправки сообщения пользователю ${chatId}:`, error.message);
        throw error;
    }
}

// Функция форматирования сообщения
function formatMessage(formData) {
    const { name, phone, email, message, service } = formData;
    
    let text = `<b>🔔 Новая заявка с сайта InvestGroup!</b>\n\n`;
    
    if (name) text += `<b>Имя:</b> ${name}\n`;
    if (phone) text += `<b>Телефон:</b> ${phone}\n`;
    if (email) text += `<b>Email:</b> ${email}\n`;
    if (service) text += `<b>Услуга:</b> ${service}\n`;
    if (message) text += `<b>Сообщение:</b>\n${message}\n`;
    
    text += `\n<i>Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Samara' })}</i>`;
    
    return text;
}

// Обработчик POST запроса для формы
app.post('/submit-form', async (req, res) => {
    try {
        console.log('Получены данные формы:', req.body);
        
        const formData = req.body;
        const message = formatMessage(formData);
        
        // Отправляем сообщение всем указанным пользователям
        const promises = TELEGRAM_USERS.map(userId => 
            sendToTelegram(userId.trim(), message)
        );
        
        await Promise.allSettled(promises);
        
        console.log('Сообщения отправлены всем пользователям');
        
        res.json({ 
            success: true, 
            message: 'Заявка успешно отправлена!' 
        });
        
    } catch (error) {
        console.error('Ошибка при обработке формы:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Произошла ошибка при отправке заявки' 
        });
    }
});

// Проверка работы бота
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Telegram bot is running' });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`📱 Будут отправляться сообщения пользователям: ${TELEGRAM_USERS.join(', ')}`);
});