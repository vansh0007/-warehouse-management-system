const packingListService = require('../services/packingListService');

/**
 * Get the packing list
 * @param {Request} req
 * @param {Response} res
 */
async function getPackingList(req, res) {
  try {
    const packingList = await packingListService.generatePackingList();
    res.json(packingList);
  } catch (error) {
    console.error('Error processing packing list:', error);
    res.status(500).json({ error: 'Error processing packing list', details: error.message });
  }
}

module.exports = { getPackingList };