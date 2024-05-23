const express = require('express');
const router = express.Router();
const appController = require('../controllers/appControllers');
const multer  = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/users/last7days', appController.getUsersLast7Days);
router.get('/orders/last7days', appController.getOrdersLast7Days);
router.get('/users/tableData', appController.getUsersTableData);
router.get('/orders/tableData', appController.getOrdersTableData);
router.get('/users/all', appController.getAllUsers);
router.get('/orders/all', appController.getAllOrders);
router.get('/temples/all', appController.getAllTemples);
router.get('/support/all', appController.getAllSupports);
router.get('/services/all', appController.getAllServices);


router.post('/orders/update', appController.updateOrder);
router.post('/services/update', appController.updateServices);
router.post('/sendMessage', upload.single('file'), appController.sendMessage);
router.post('/admin-login', appController.loginAdmin);

module.exports = router;