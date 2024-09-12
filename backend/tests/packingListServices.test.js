const packingListService = require('./../services/packingListService');
const fileReader = require('../utils/fileReader');
const jest = require('jest');

jest.mock('../utils/fileReader');

describe('packingListService', () => {
  it('should generate a packing list', async () => {
    const orders = [
      {
        orderId: 1,
        orderDate: '2022-01-01',
        customerName: 'John Doe',
        shippingAddress: '123 Main St',
        lineItems: [
          {
            productId: 1,
            quantity: 2
          },
          {
            productId: 2,
            quantity: 3
          }
        ]
      }
    ];
    const productMapping = {
      1: {
        name: 'Product 1',
        components: [
          {
            productId: 101,
            name: 'Component 1',
            quantity: 2
          },
          {
            productId: 102,
            name: 'Component 2',
            quantity: 3
          }
        ]
      },
      2: {
        name: 'Product 2',
        components: [
          {
            productId: 201,
            name: 'Component 3',
            quantity: 1
          },
          {
            productId: 202,
            name: 'Component 4',
            quantity: 2
          }
        ]
      }
    };

    fileReader.readJsonFile.mockResolvedValueOnce(orders);
    fileReader.readJsonFile.mockResolvedValueOnce(productMapping);

    const packingList = await packingListService.generatePackingList();

    expect(packingList).toEqual([
      {
        orderId: 1,
        orderDate: '2022-01-01',
        customerName: 'John Doe',
        shippingAddress: '123 Main St',
        lineItems: [
          {
            productId: 1,
            name: 'Product 1',
            quantity: 2,
            components: [
              {
                productId: 101,
                name: 'Component 1',
                quantity: 4
              },
              {
                productId: 102,
                name: 'Component 2',
                quantity: 6
              }
            ]
          },
          {
            productId: 2,
            name: 'Product 2',
            quantity: 3,
            components: [
              {
                productId: 201,
                name: 'Component 3',
                quantity: 3
              },
              {
                productId: 202,
                name: 'Component 4',
                quantity: 6
              }
            ]
          }
        ]
      }
    ]);
  });

  it('should throw an error if orders data is missing', async () => {
    fileReader.readJsonFile.mockResolvedValueOnce(null);

    await expect(packingListService.generatePackingList()).rejects.toThrowError(
      'Orders data is missing'
    );
  });

  it('should throw an error if product mapping data is missing', async () => {
    fileReader.readJsonFile.mockResolvedValueOnce([
      {
        orderId: 1,
        orderDate: '2022-01-01',
        customerName: 'John Doe',
        shippingAddress: '123 Main St',
        lineItems: [
          {
            productId: 1,
            quantity: 2
          },
          {
            productId: 2,
            quantity: 3
          }
        ]
      }
    ]);
    fileReader.readJsonFile.mockResolvedValueOnce(null);

    await expect(packingListService.generatePackingList()).rejects.toThrowError(
      'Product mapping data is missing'
    );
  });
});