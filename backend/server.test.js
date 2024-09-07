const request = require('supertest');
const path = require('path');
const app = require('./server');

// Mock fs.promises.readFile
const fs = require('fs');
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
}));
describe('API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/picking-list', () => {
    it('should return the correct picking list', async () => {
      const mockOrders = [
        {
          lineItems: [
            { productId: 'BDAY001' },
            { productId: 'VAL001' },
          ],
        },
      ];
      const mockProductMapping = {
        BDAY001: {
          components: [
            { productId: 'BDAY_CUPCAKE', name: 'Birthday cupcake', quantity: 1 },
          ],
        },
        VAL001: {
          components: [
            { productId: 'RED_ROSES', name: 'Red Roses Bouquet', quantity: 1 },
          ],
        },
      };

      fs.promises.readFile
        .mockResolvedValueOnce(JSON.stringify(mockOrders))
        .mockResolvedValueOnce(JSON.stringify(mockProductMapping));

      const res = await request(app).get('/api/picking-list');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([
        { name: 'Birthday cupcake', quantity: 1 },
        { name: 'Red Roses Bouquet', quantity: 1 },
      ]);
    });

    it('should handle file read errors', async () => {
      fs.promises.readFile.mockRejectedValue(new Error('File read error'));

      const res = await request(app).get('/api/picking-list');
      
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('Error processing picking list');
    });

    it('should handle invalid JSON data', async () => {
      fs.promises.readFile.mockResolvedValue('Invalid JSON');

      const res = await request(app).get('/api/picking-list');
      
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('Error processing picking list');
    });
  });

  describe('GET /api/packing-list', () => {
    it('should return the correct packing list', async () => {
      const mockOrders = [
        {
          orderId: 'ORD001',
          orderDate: '2023-09-15',
          customerName: 'John Doe',
          shippingAddress: '123 Main St',
          lineItems: [
            { productId: 'BDAY001', productName: 'Birthday Box' },
          ],
        },
      ];
      const mockProductMapping = {
        BDAY001: {
          components: [
            { productId: 'BDAY_CUPCAKE', name: 'Birthday cupcake', quantity: 1 },
          ],
        },
      };

      fs.promises.readFile
        .mockResolvedValueOnce(JSON.stringify(mockOrders))
        .mockResolvedValueOnce(JSON.stringify(mockProductMapping));

      const res = await request(app).get('/api/packing-list');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toHaveProperty('orderId', 'ORD001');
      expect(res.body[0]).toHaveProperty('orderDate', '2023-09-15');
      expect(res.body[0].lineItems[0]).toHaveProperty('components');
      expect(res.body[0].lineItems[0].components).toHaveLength(1);
      expect(res.body[0].shipsTo).toEqual({
        name: 'John Doe',
        address: '123 Main St',
      });
    });

    it('should handle file read errors', async () => {
      fs.promises.readFile.mockRejectedValue(new Error('File read error'));

      const res = await request(app).get('/api/packing-list');
      
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('Error processing packing list');
    });

    it('should handle invalid JSON data', async () => {
      fs.promises.readFile.mockResolvedValue('Invalid JSON');

      const res = await request(app).get('/api/packing-list');
      
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('Error processing packing list');
    });
  });

  describe('Error handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const res = await request(app).get('/api/non-existent-route');
      
      expect(res.statusCode).toBe(404);
    });
  });
});