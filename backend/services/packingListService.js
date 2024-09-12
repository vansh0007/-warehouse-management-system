const fileReader = require('../utils/fileReader');

/**
 * Generate the packing list
 * @returns {Promise<Object[]>}
 */
async function generatePackingList() {
  const orders = await fileReader.readJsonFile('../data/orders.json');
  const productMapping = await fileReader.readJsonFile('../data/productMapping.json');

  if (!orders || !productMapping) {
    throw new Error('Orders or product mapping data is missing');
  }

  const packingList = orders.map(order => ({
    orderId: order.orderId,
    orderDate: order.orderDate,
    lineItems: order.lineItems.map(item => ({
      ...item,
      components: productMapping[item.productId].components
    })),
    shipsTo: {
      name: order.customerName,
      address: order.shippingAddress
    }
  }));

  return packingList;
}

module.exports = { generatePackingList };