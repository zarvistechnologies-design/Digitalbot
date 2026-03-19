"use client";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";

type Agent = {
  id: string;
  name: string;
  createdAt: string;
};

const PlusIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const MenuIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const TrashIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CopyIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const BotIcon = () => (
  <svg className="h-16 w-16 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export default function AgentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAgent, setNewAgent] = useState({ id: "", name: "" });
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = () => {
    const stored = localStorage.getItem("millis_agents");
    if (stored) {
      setAgents(JSON.parse(stored));
    }
  };

  const saveAgents = (newAgents: Agent[]) => {
    localStorage.setItem("millis_agents", JSON.stringify(newAgents));
    setAgents(newAgents);
  };

  const addAgent = () => {
    if (!newAgent.id.trim() || !newAgent.name.trim()) {
      alert("Please enter both Agent ID and Name");
      return;
    }
    if (agents.some((a) => a.id === newAgent.id)) {
      alert("This Agent ID already exists");
      return;
    }
    const agent: Agent = {
      id: newAgent.id.trim(),
      name: newAgent.name.trim(),
      createdAt: new Date().toISOString(),
    };
    saveAgents([...agents, agent]);
    setNewAgent({ id: "", name: "" });
    setShowAddModal(false);
  };

  const deleteAgent = (id: string) => {
    if (!confirm("Are you sure you want to remove this agent?")) return;
    saveAgents(agents.filter((a) => a.id !== id));
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-orange-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-purple-100">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-purple-100 transition-colors">
            <MenuIcon />
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            AI Agents
          </h1>
          <div className="w-10" />
        </div>

        <main className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">AI Agents</h1>
                <p className="text-gray-600 mt-1">Manage your AI voice agents for automated calling</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-orange-600 text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg"
              >
                <PlusIcon />
                Add Agent
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-gradient-to-r from-purple-100 to-orange-100 rounded-2xl p-6 mb-8 border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-2">🤖 What are AI Agents?</h3>
            <p className="text-purple-800 text-sm">
              AI Agents are voice bots that handle your automated phone calls. Each agent can be configured with
              different personalities, scripts, and behaviors. Add their IDs here to use them in your campaigns.
            </p>
          </div>

          {/* Agents Grid */}
          {agents.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-purple-100">
              <BotIcon />
              <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">No AI Agents Added</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Add your AI agent IDs here.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-600 text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Add Your First Agent
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center">
                          <span className="text-white text-lg">🤖</span>
                        </div>
                        <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <code className="text-xs text-gray-600 flex-1 truncate">{agent.id}</code>
                        <button
                          onClick={() => copyToClipboard(agent.id)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Copy ID"
                        >
                          {copied === agent.id ? (
                            <span className="text-green-500 text-xs">✓</span>
                          ) : (
                            <CopyIcon />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Added {new Date(agent.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteAgent(agent.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="Remove agent"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tips */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
            <h3 className="font-semibold text-gray-900 mb-4">💡 Tips for Using AI Agents</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                <span>Create different agents for different types of calls (rent reminders, surveys, notifications)</span>
              </li>
             
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                <span>You can use the same agent for multiple campaigns</span>
              </li>
            </ul>
          </div>
        </main>
      </div>

      {/* Add Agent Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Add AI Agent</h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agent Name</label>
                <input
                  type="text"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Rent Reminder Bot"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Millis AI Agent ID</label>
                <input
                  type="text"
                  value={newAgent.id}
                  onChange={(e) => setNewAgent({ ...newAgent, id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                  placeholder="e.g., agt_abc123xyz..."
                />
                <p className="text-xs text-gray-400 mt-2">Find this in your Millis AI dashboard under Agent Settings</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewAgent({ id: "", name: "" });
                }}
                className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addAgent}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-orange-600 text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Add Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
