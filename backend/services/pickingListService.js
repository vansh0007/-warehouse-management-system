const fileReader = require('../utils/fileReader');

/**
 * Generate the picking list
 * @returns {Promise<Object[]>}
 */
async function generatePickingList() {
  const orders = await fileReader.readJsonFile('orders.json');
  const productMapping = await fileReader.readJsonFile('productMapping.json');

  if (!orders || !productMapping) {
    throw new Error('Orders or product mapping data is missing');
  }

  const pickingList = {};

  orders.forEach(order => {
    order.lineItems.forEach(item => {
      const components = productMapping[item.productId].components;
      if (!components) {
        throw new Error(`Product mapping not found for product ID ${item.productId}`);
      }
      components.forEach(component => {
        if (!pickingList[component.productId]) {
          pickingList[component.productId] = { name: component.name, quantity: 0 };
        }
        pickingList[component.productId].quantity += component.quantity;
      });
    });
  });

  return Object.values(pickingList);
}

module.exports = { generatePickingList };