const express = require('express');
const router = express.Router();
const pickingListController = require('../controllers/pickingListController');
const packingListController = require('../controllers/packingListController');

router.get('/picking-list', pickingListController.getPickingList);
router.get('/packing-list', packingListController.getPackingList);

module.exports = router;