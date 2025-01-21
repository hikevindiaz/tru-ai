"use client";

import React from "react";

const orders = [
  { id: "#FWB127364372", date: "20.12.2023", price: "$4,756", status: "Pre-order" },
  { id: "#FWB125467980", date: "11.12.2023", price: "$499", status: "In transit" },
  { id: "#FWB139485607", date: "08.12.2023", price: "$85", status: "Confirmed" },
  { id: "#FWB137364371", date: "16.11.2023", price: "$119", status: "Cancelled" },
];

const OrderStatusBadge = ({ status }: { status: string }) => {
  const statusClasses = {
    "Pre-order": "bg-primary-100 text-primary-800",
    "In transit": "bg-yellow-100 text-yellow-800",
    "Confirmed": "bg-green-100 text-green-800",
    "Cancelled": "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${
        statusClasses[status]
      }`}
    >
      {status}
    </span>
  );
};

const OrdersPage = () => {
  return (
    <section className="bg-background py-8 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground mb-8">My Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Order ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {order.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="button mr-4"
                      onClick={() => console.log(`Viewing details for ${order.id}`)}
                    >
                      View
                    </button>
                    {order.status !== "Cancelled" && (
                      <button
                        className="button"
                        onClick={() => console.log(`Reordering ${order.id}`)}
                      >
                        Reorder
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default OrdersPage;
