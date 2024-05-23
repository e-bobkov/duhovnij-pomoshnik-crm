const sqlite3 = require('sqlite3').verbose();

class Db {
    constructor() {
        this.db = new sqlite3.Database('../bot.db', (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('Connected to the CRM database.');
                this.db.run("PRAGMA journal_mode=WAL;", err => {
                    if (err) {
                        console.error("Failed to set PRAGMA journal_mode:", err);
                    }
                });
            }
        });
    }


    getUsersLast7Days() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT strftime('%d/%m', created_at) as date, COUNT(DISTINCT chat_id) as count
                         FROM users
                         WHERE created_at >= date ('now', '-6 days')
                         GROUP BY date
                         ORDER BY date`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    getOrdersLast7Days() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT strftime('%d/%m', created_at) as date, COUNT(id) as count
                         FROM orders
                         WHERE created_at >= date ('now', '-6 days')
                         GROUP BY date
                         ORDER BY date`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    getUsersTableData() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT (SELECT COUNT(DISTINCT chat_id) FROM users) as totalUsers,
                       (SELECT COUNT(DISTINCT chat_id) FROM users WHERE DATE(created_at) = DATE('now')) as newUsersToday, (
                SELECT COUNT (DISTINCT chat_id)
                FROM users
                GROUP BY DATE (created_at)
                ORDER BY COUNT (DISTINCT chat_id) DESC LIMIT 1) as recordNewUsers,
                    (
                SELECT DATE (created_at)
                FROM users
                GROUP BY DATE (created_at)
                ORDER BY COUNT (DISTINCT chat_id) DESC LIMIT 1) as recordDate
            `;
            this.db.get(sql, [], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    getOrdersTableData() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT (SELECT COUNT(*) FROM orders)          as totalOrders,
                       (SELECT SUM(order_amount) FROM orders) as totalAmount,
                       (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = DATE('now')) as newOrdersToday, (
                SELECT SUM (order_amount)
                FROM orders
                WHERE DATE (created_at) = DATE ('now')) as totalAmountToday
                    , (
                SELECT COUNT (*)
                FROM orders
                WHERE status = 'waiting') as ordersInWaiting
                    , (
                SELECT COUNT (*)
                FROM orders
                WHERE status = 'completed') as ordersCompleted
            `;
            this.db.get(sql, [], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    getAllUsers() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT *
                         FROM users`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    getAllOrders() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT *
                         FROM orders`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    getAllTemples() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT *
                         FROM temples`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    getAllSupports() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT *
                         FROM faq`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    getAllServices() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT *
                         FROM services`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }


    updateOrder(id, status, created_at, started_at, completed_at) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE orders
                         SET status       = ?,
                             created_at   = ?,
                             started_at   = ?,
                             completed_at = ?
                         WHERE id = ?`;
            this.db.run(sql, [status, created_at, started_at, completed_at, id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({status: 'success'});
                }
            });
        });
    }

    updateServices(id, note_once_price, note_month_price, note_half_year_price, note_year_price, candle_once_price, candle_month_price, candle_half_year_price, candle_year_price) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE services
                         SET note_once_price        = ?,
                             note_month_price       = ?,
                             note_half_year_price   = ?,
                             note_year_price        = ?,
                             candle_once_price      = ?,
                             candle_month_price     = ?,
                             candle_half_year_price = ?,
                             candle_year_price      = ?
                         WHERE id = ?`;
            this.db.run(sql, [note_once_price, note_month_price, note_half_year_price, note_year_price, candle_once_price, candle_month_price, candle_half_year_price, candle_year_price, id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({status: 'success'});
                }
            });
        });
    }

    getUserChatId(id) {
        return new Promise((resolve, reject) => {
            console.log('id', id)
            const sql = `SELECT chat_id
                         FROM users
                         WHERE id = ?`;
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.chat_id);
                }
            });
        });
    }

    checkAdminLogin(username, password) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM admin WHERE login = ? AND pass = ?';
            this.db.get(query, [username, password], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

}

module.exports = new Db();
