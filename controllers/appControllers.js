require('dotenv').config();
const Db = require('../database/Db');
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
const bot = new TelegramBot(token, {polling: false});
const multer = require('multer');
const upload = multer();

exports.getUsersLast7Days = (req, res) => {
    Db.getUsersLast7Days()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({error: err.message}));
};

exports.getOrdersLast7Days = (req, res) => {
    Db.getOrdersLast7Days()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({error: err.message}));
}

exports.getUsersTableData = (req, res) => {
    Db.getUsersTableData()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({error: err.message}));
}

exports.getOrdersTableData = (req, res) => {
    Db.getOrdersTableData()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({error: err.message}));
}

exports.getAllUsers = (req, res) => {
    Db.getAllUsers()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({error: err.message}));
}

exports.getAllOrders = (req, res) => {
    Db.getAllOrders()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({error: err.message}));
}

exports.getAllTemples = (req, res) => {
    Db.getAllTemples()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({error: err.message}));
}

exports.getAllSupports = (req, res) => {
    Db.getAllSupports()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({error: err.message}));
}

exports.getAllServices = (req, res) => {
    console.log('working');

    Db.getAllServices()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({error: err.message}));
}

exports.updateOrder = (req, res) => {
    const {id, status, created_at, started_at, completed_at} = req.body;
    Db.updateOrder(id, status, created_at, started_at, completed_at)
        .then(data => res.json(data))
        .catch(err => res.status(500).json({error: err.message}));
}

exports.updateServices = (req, res) => {
    const {
        id,
        note_once_price,
        note_month_price,
        note_half_year_price,
        note_year_price,
        candle_once_price,
        candle_month_price,
        candle_half_year_price,
        candle_year_price
    } = req.body;
    Db.updateServices(id, note_once_price, note_month_price, note_half_year_price, note_year_price, candle_once_price, candle_month_price, candle_half_year_price, candle_year_price)
        .then(data => res.json(data))
        .catch(err => res.status(500).json({error: err.message}));

}

exports.sendMessage = (req, res) => {
    const {message, currentUserId} = req.body;
    console.log(currentUserId);

    Db.getUserChatId(currentUserId)
        .then(chatId => {
            if (req.file) {
                bot.sendPhoto(chatId, req.file.buffer, {caption: message})
                    .then(() => {
                        res.json({success: true});
                    })
                    .catch(err => {
                        res.status(500).json({error: err.message});
                    });
            } else {
                bot.sendMessage(chatId, message)
                    .then(() => {
                        res.json({success: true});
                    })
                    .catch(err => {
                        res.status(500).json({error: err.message});
                    });
            }
        })
        .catch(err => {
            res.status(500).json({error: err.message});
        });
};

exports.loginAdmin = (req, res) => {
    const { username, password } = req.body;

    Db.checkAdminLogin(username, password)
        .then(admin => {
            if (admin) {
                res.json({ success: true });
            } else {
                res.status(401).json({ error: 'Неверный логин или пароль' });
            }
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).json({ error: err.message });
        });
};
