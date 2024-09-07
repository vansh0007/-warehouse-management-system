import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import axios from 'axios';

jest.mock('axios', () => {
  return {
    get: jest.fn(),
  };
});

describe('App component', () => {
  it('renders loading state initially', () => {
    render(<App />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error message when fetching data fails', async () => {
    axios.get.mockRejectedValue(new Error('Error fetching data'));
    render(<App />);
    await waitFor(() => expect(screen.getByText('An error occurred while fetching data. Please try again later.')).toBeInTheDocument());
  });

  it('renders picking list and packing list when data is fetched successfully', async () => {
    const pickingListResponse = [
      { name: 'Product 1', quantity: 2 },
      { name: 'Product 2', quantity: 3 },
    ];
    const packingListResponse = [
      {
        orderId: 'ORD001',
        orderDate: '2023-09-15',
        lineItems: [
          {
            productName: 'Product 1',
            components: [
              { name: 'Component 1', quantity: 2 },
            ],
          },
        ],
        shipsTo: {
          name: 'John Doe',
          address: '123 Main St',
        },
      },
    ];
    axios.get.mockResolvedValueOnce({ data: pickingListResponse });
    axios.get.mockResolvedValueOnce({ data: packingListResponse });
    render(<App />);
    await waitFor(() => expect(screen.getByText('Picking List')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Packing List')).toBeInTheDocument());
  });

  it('renders correct picking list items', async () => {
    const pickingListResponse = [
      { name: 'Product 1', quantity: 2 },
      { name: 'Product 2', quantity: 3 },
    ];
    const packingListResponse = [
      // ... packing list response data ...
    ];
    axios.get.mockResolvedValueOnce({ data: pickingListResponse });
    axios.get.mockResolvedValueOnce({ data: packingListResponse });
    render(<App />);
    await waitFor(() => expect(screen.getByText('Product 1')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('2')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Product 2')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('3')).toBeInTheDocument());
    axios.get.mockClear();
  });
  
  it('renders correct packing list items', async () => {
    const pickingListResponse = [
      // ... picking list response data ...
    ];
    const packingListResponse = [
      {
        orderId: 'ORD001',
        orderDate: '2023-09-15',
        lineItems: [
          {
            productName: 'Product 1',
            components: [
              { name: 'Component 1', quantity: 2 },
            ],
          },
        ],
        shipsTo: {
          name: 'John Doe',
          address: '123 Main St',
        },
      },
    ];
    axios.get.mockResolvedValueOnce({ data: pickingListResponse });
    axios.get.mockResolvedValueOnce({ data: packingListResponse });
    render(<App />);
    await waitFor(() => expect(screen.getByText('Order #ORD001')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Order Date: 2023-09-15')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Product 1')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Component 1 x 2')).toBeInTheDocument());
    axios.get.mockClear();
  });
});