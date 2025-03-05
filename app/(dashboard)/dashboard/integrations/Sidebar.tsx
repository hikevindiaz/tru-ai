import React from 'react';

const agents = [
  { name: 'Agent 1', id: 1 },
  { name: 'Agent 2', id: 2 },
  { name: 'Agent 3', id: 3 },
  // Add more agents as needed
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-100 dark:bg-gray-800 p-4">
      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">Agents</h2>
      <ul className="mt-4 space-y-2">
        {agents.map((agent) => (
          <li key={agent.id} className="text-sm text-gray-700 dark:text-gray-300">
            {agent.name}
          </li>
        ))}
      </ul>
    </div>
  );
} 