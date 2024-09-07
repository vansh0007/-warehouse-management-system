import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PickingList({ pickingList }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Picking List</h2>
      <ul className="space-y-2">
        {pickingList.map((item, index) => (
          <li key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded">
            <span className="font-medium">{item.name}</span>
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full">{item.quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PackingList({ packingList }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Packing List</h2>
      {packingList.map((order, index) => (
        <div key={index} className="mb-6 border-b pb-6 last:border-b-0">
          <h3 className="text-xl font-semibold mb-2">Order #{order.orderId}</h3>
          <p className="text-gray-600 mb-4">Order Date: {order.orderDate}</p>
          <h4 className="text-lg font-medium mb-2">Line Items:</h4>
          <ul className="space-y-4">
            {order.lineItems.map((item, itemIndex) => (
              <li key={itemIndex} className="bg-gray-100 p-4 rounded">
                <div className="font-medium mb-2">{item.productName}</div>
                <ul className="list-disc list-inside space-y-1">
                  {item.components.map((component, componentIndex) => (
                    <li key={componentIndex} className="text-gray-600">
                      {component.name} x {component.quantity}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <h4 className="text-lg font-medium mt-4 mb-2">Ships to:</h4>
          <p className="text-gray-600">{order.shipsTo.name}</p>
          <p className="text-gray-600">{order.shipsTo.address}</p>
        </div>
      ))}
    </div>
  );
}

function App() {
  const [pickingList, setPickingList] = useState([]);
  const [packingList, setPackingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pickingResponse, packingResponse] = await Promise.all([
          axios.get('http://localhost:3001/api/picking-list'),
          axios.get('http://localhost:3001/api/packing-list')
        ]);
        setPickingList(pickingResponse.data);
        setPackingList(packingResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Warehouse Management System</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PickingList pickingList={pickingList} />
        <PackingList packingList={packingList} />
      </div>
    </div>
  );
}

export default App;