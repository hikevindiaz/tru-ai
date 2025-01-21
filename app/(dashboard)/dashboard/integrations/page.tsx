"use client";

import React, { useState } from "react";
import IntegrationCard from "@/components/integrations/IntegrationCard";
import "@/styles/integrations.css";

const integrationsList = [
  {
    id: "openai",
    name: "OpenAI",
    description: "Connect your OpenAI API key to enable chatbot functionality.",
    logo: "/openai.svg",
  },
  {
    id: "twilio",
    name: "Twilio",
    description: "Enable telephony features like voice calls and SMS.",
    logo: "/twilio.svg",
  },
  {
    id: "example",
    name: "Example Integration",
    description: "This is a placeholder for a third integration.",
    logo: "/twilio.svg",
  },
];

export default function IntegrationsPage() {
  const [connectedStatus, setConnectedStatus] = useState({
    openai: false,
    twilio: false,
    example: false,
  });

  return (
    <div className="integrations-container">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Integrations</h1>
        <p className="page-subtitle">
          Manage and configure your global integrations for platform features.
        </p>
      </div>

      {/* Integrations Grid */}
      <div className="integrations-grid">
        {integrationsList.map((integration) => (
          <IntegrationCard
            key={integration.id}
            id={integration.id}
            name={integration.name}
            description={integration.description}
            logo={integration.logo}
            isConnected={connectedStatus[integration.id]}
            setConnectedStatus={setConnectedStatus}
          />
        ))}
      </div>
    </div>
  );
}
