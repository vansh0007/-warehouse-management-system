const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

async function readJsonFile(filename) {
  try {
    const data = await fs.readFile(path.join(__dirname, filename), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error);
    throw error;
  }
}

app.get('/api/picking-list', async (req, res) => {
  try {
    const orders = await readJsonFile('orders.json');
    const productMapping = await readJsonFile('productMapping.json');

    const pickingList = {};

    orders.forEach(order => {
      order.lineItems.forEach(item => {
        const components = productMapping[item.productId].components;
        components.forEach(component => {
          if (!pickingList[component.productId]) {
            pickingList[component.productId] = { name: component.name, quantity: 0 };
          }
          pickingList[component.productId].quantity += component.quantity;
        });
      });
    });

    res.json(Object.values(pickingList));
  } catch (error) {
    console.error('Error processing picking list:', error);
    res.status(500).json({ error: 'Error processing picking list', details: error.message });
  }
});

app.get('/api/packing-list', async (req, res) => {
  try {
    const orders = await readJsonFile('orders.json');
    const productMapping = await readJsonFile('productMapping.json');

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

    res.json(packingList);
  } catch (error) {
    console.error('Error processing packing list:', error);
    res.status(500).json({ error: 'Error processing packing list', details: error.message });
  }
});

// 404 handler for non-existent routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;