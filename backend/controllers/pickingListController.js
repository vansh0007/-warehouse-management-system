const pickingListService = require('../services/pickingListService');

/**
 * Get the picking list
 * @param {Request} req
 * @param {Response} res
 */
async function getPickingList(req, res) {
  try {
    const pickingList = await pickingListService.generatePickingList();
    res.json(pickingList);
  } catch (error) {
    console.error('Error processing picking list:', error);
    res.status(500).json({ error: 'Error processing picking list', details: error.message });
  }
}

module.exports = { getPickingList };