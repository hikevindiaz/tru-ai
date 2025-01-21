"use client";

import { useState } from "react";

const tabs = ["LinkRep", "LLM", "Call", "Actions and Integrations", "Advanced Settings"];

export default function LinkRepConfigurationPage() {
    const [activeTab, setActiveTab] = useState("LinkRep");
    const [linkReps, setLinkReps] = useState([
        { id: "1", name: "Lead Generator", status: "Live" },
        { id: "2", name: "Support Assistant", status: "Draft" },
    ]);
    const [selectedLinkRep, setSelectedLinkRep] = useState(linkReps[0]);

    const handleSelectLinkRep = (linkRep) => {
        setSelectedLinkRep(linkRep);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-1/4 p-4 bg-gray-100 border-r">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">LinkReps</h2>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                        + Create New
                    </button>
                </div>
                <hr className="mb-4" />
                <ul className="space-y-2">
                    {linkReps.map((linkRep) => (
                        <li
                            key={linkRep.id}
                            className={`p-3 rounded-md cursor-pointer hover:bg-gray-200 ${
                                selectedLinkRep.id === linkRep.id ? "bg-blue-100" : ""
                            }`}
                            onClick={() => handleSelectLinkRep(linkRep)}
                        >
                            <div className="flex justify-between items-center">
                                <span>{linkRep.name}</span>
                                <button className="text-gray-500 hover:text-black">...</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content */}
            <div className="w-3/4 p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">{selectedLinkRep.name}</h1>
                        <p className="text-gray-500 text-sm">ID: {selectedLinkRep.id}</p>
                    </div>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                        Test LinkRep
                    </button>
                </div>
                <hr className="mb-6" />

                {/* Tabs */}
                <div className="flex space-x-6 border-b mb-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`pb-2 ${
                                activeTab === tab
                                    ? "border-b-2 border-blue-500 text-blue-500"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === "LinkRep" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Display Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter display name"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                <p className="text-gray-500 text-sm mt-1">The name that will identify your LinkRep.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Welcome Message</label>
                                <input
                                    type="text"
                                    placeholder="Enter welcome message"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                <p className="text-gray-500 text-sm mt-1">The welcome message sent to users.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Default Prompt</label>
                                <textarea
                                    placeholder="Enter default prompt"
                                    rows={4}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                ></textarea>
                                <p className="text-gray-500 text-sm mt-1">This gives purpose and identity to your LinkRep.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Chatbot Error Message</label>
                                <textarea
                                    placeholder="Enter chatbot error message"
                                    rows={2}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                ></textarea>
                                <p className="text-gray-500 text-sm mt-1">The message displayed when the chatbot encounters an error.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Language</label>
                                <select className="w-full p-2 border border-gray-300 rounded-md">
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                </select>
                                <p className="text-gray-500 text-sm mt-1">Select the language for your LinkRep.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === "LLM" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">OpenAI Model</label>
                                <select className="w-full p-2 border border-gray-300 rounded-md">
                                    <option value="gpt-4">GPT-4</option>
                                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                                </select>
                                <p className="text-gray-500 text-sm mt-1">Choose the AI model for your LinkRep.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Choose Brain File</label>
                                <select className="w-full p-2 border border-gray-300 rounded-md">
                                    <option value="file1">File1.pdf</option>
                                    <option value="file2">File2.pdf</option>
                                </select>
                                <p className="text-gray-500 text-sm mt-1">
                                    Select the file for content retrieval. If no files are listed, upload files in the files section.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Tokens Per Response</label>
                                <input
                                    type="number"
                                    placeholder="Enter max tokens"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                <p className="text-gray-500 text-sm mt-1">
                                    Specify the maximum tokens for each response.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Temperature</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    className="w-full"
                                />
                                <p className="text-gray-500 text-sm mt-1">
                                    Adjust creativity in responses (higher values = more creative).
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === "Call" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Phone Number</label>
                                <select className="w-full p-2 border border-gray-300 rounded-md">
                                    <option value="123">+123456789</option>
                                    <option value="456">+987654321</option>
                                </select>
                                <p className="text-gray-500 text-sm mt-1">
                                    Select or buy a phone number for your LinkRep.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Voice</label>
                                <select className="w-full p-2 border border-gray-300 rounded-md">
                                    <option value="voice1">Voice1</option>
                                    <option value="voice2">Voice2</option>
                                </select>
                                <p className="text-gray-500 text-sm mt-1">Choose the voice for your LinkRep.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Response Rate</label>
                                <select className="w-full p-2 border border-gray-300 rounded-md">
                                    <option value="rapid">Rapid</option>
                                    <option value="normal">Normal</option>
                                    <option value="patient">Patient</option>
                                </select>
                                <p className="text-gray-500 text-sm mt-1">
                                    Adjust the response rate for your LinkRep.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
