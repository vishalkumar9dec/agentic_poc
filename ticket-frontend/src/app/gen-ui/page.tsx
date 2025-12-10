'use client';

import { useState } from 'react';
import { getTicketsWithAIConfig, createTicketWithAIConfig, type Ticket, type CardConfig } from './actions/aiConfigActions';
import { DynamicCard } from './components/DynamicCard';

export default function GenUIPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [config, setConfig] = useState<CardConfig | null>(null);
  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);
  const [successConfig, setSuccessConfig] = useState<{ theme: 'green' | 'blue' | 'purple'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    status: 'Open',
    operation: 'task',
    requester: ''
  });

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setIsLoading(true);
    try {
      if (chatMessage.toLowerCase().includes('create')) {
        setShowCreateForm(true);
        setIsLoading(false);
        return;
      }

      const result = await getTicketsWithAIConfig(chatMessage);
      if (result.error) {
        alert('Error: ' + result.error);
      } else {
        setTickets(result.tickets);
        setConfig(result.config);
        setCreatedTicket(null);
        setSuccessConfig(null);
      }
      setChatMessage('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await createTicketWithAIConfig(
        formData.title,
        formData.status,
        formData.operation,
        formData.requester
      );
      if (result.error) {
        alert('Error: ' + result.error);
      } else if (result.ticket && result.successConfig) {
        setCreatedTicket(result.ticket);
        setSuccessConfig(result.successConfig);
        setTickets([]);
        setConfig(null);
      }
      setShowCreateForm(false);
      setFormData({ title: '', status: 'Open', operation: 'task', requester: '' });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950">
      {/* Header */}
      <div className="flex-none bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 7H7v6h6V7z" />
                  <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  AI-Configured Generative UI
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Level 2 • Configuration Generation</p>
              </div>
            </div>
            <a
              href="/"
              className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-300 dark:border-gray-600"
            >
              ← AI-Driven UI
            </a>
          </div>
        </div>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Success Screen */}
          {createdTicket && successConfig && (
            <div className="mb-6 animate-fade-in">
              <div className={`bg-gradient-to-br ${
                successConfig.theme === 'green' ? 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30' :
                successConfig.theme === 'blue' ? 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30' :
                'from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30'
              } rounded-2xl shadow-xl border ${
                successConfig.theme === 'green' ? 'border-emerald-200 dark:border-emerald-800' :
                successConfig.theme === 'blue' ? 'border-blue-200 dark:border-blue-800' :
                'border-purple-200 dark:border-purple-800'
              } overflow-hidden backdrop-blur-sm`}>
                <div className={`${
                  successConfig.theme === 'green' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                  successConfig.theme === 'blue' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                  'bg-gradient-to-r from-purple-500 to-pink-500'
                } p-6`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className={`w-8 h-8 ${
                        successConfig.theme === 'green' ? 'text-emerald-500' :
                        successConfig.theme === 'blue' ? 'text-blue-500' :
                        'text-purple-500'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white">Ticket Created!</h2>
                      <p className="text-white/90 text-sm">{successConfig.message}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Ticket ID</span>
                    <span className={`text-3xl font-black ${
                      successConfig.theme === 'green' ? 'text-emerald-600 dark:text-emerald-400' :
                      successConfig.theme === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                      'text-purple-600 dark:text-purple-400'
                    }`}>#{createdTicket.id}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">Title</span>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{createdTicket.title}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Status</span>
                      <p className="font-semibold text-gray-900 dark:text-white">{createdTicket.status}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Type</span>
                      <p className="font-semibold text-gray-900 dark:text-white">{createdTicket.operation}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Requester</span>
                      <p className="font-semibold text-gray-900 dark:text-white">{createdTicket.requester}</p>
                    </div>
                  </div>
                  <div className={`p-3 ${
                    successConfig.theme === 'green' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                    successConfig.theme === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    'bg-purple-100 dark:bg-purple-900/30'
                  } rounded-xl flex items-center space-x-2`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 7H7v6h6V7z" />
                      <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-semibold">AI configured theme: {successConfig.theme}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tickets Display */}
          {tickets.length > 0 && config && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {tickets.length} Ticket{tickets.length !== 1 ? 's' : ''}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    AI configured: <span className="font-semibold text-purple-400">{config.layout}</span> layout
                  </p>
                </div>
                <span className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold border border-purple-500/30">
                  🤖 AI Configured
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tickets.map((ticket) => {
                  // Get icon based on ticket operation
                  const getIconForTicket = (operation: string) => {
                    const opLower = operation.toLowerCase();
                    if (opLower.includes('bug') || opLower.includes('fix')) return '🐛';
                    if (opLower.includes('feature')) return '✨';
                    if (opLower.includes('doc')) return '📝';
                    if (opLower.includes('access') || opLower.includes('gitlab') || opLower.includes('key')) return '🔑';
                    if (opLower.includes('task')) return '📋';
                    return '📌';
                  };

                  // Deduplicate fields by name and limit to 2 fields
                  const uniqueFields = Array.from(
                    new Map(config.fields.map(field => [field.name, field])).values()
                  ).slice(0, 2);

                  const populatedConfig = {
                    ...config,
                    icon: getIconForTicket(ticket.operation),
                    fields: uniqueFields.map(field => ({
                      ...field,
                      value: ticket[field.name as keyof Ticket] || field.value
                    })),
                    badge: config.badge ? {
                      ...config.badge,
                      text: ticket.status
                    } : undefined
                  };
                  return (
                    <DynamicCard
                      key={ticket.id}
                      config={populatedConfig}
                      data={ticket}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {tickets.length === 0 && config && !createdTicket && (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Tickets Found</h2>
              <p className="text-gray-600 dark:text-gray-400">AI configured this empty state based on your request.</p>
            </div>
          )}

          {/* Initial State */}
          {!config && !createdTicket && !showCreateForm && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/30">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 7H7v6h6V7z" />
                  <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Ready to Generate UI</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                Type a command below. AI will analyze your request and generate an optimized layout configuration.
              </p>
              <div className="flex justify-center space-x-3">
                <div className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-xl text-sm font-semibold">
                  ✨ Dynamic Config
                </div>
                <div className="px-4 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-xl text-sm font-semibold">
                  🎨 Flexible Component
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Interface - Fixed at Bottom */}
      <div className="flex-none bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <form onSubmit={handleChatSubmit} className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder='Try: "show all tickets" or "create a ticket"'
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 font-medium shadow-inner"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Generate'
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-300 dark:border-gray-600"
              disabled={isLoading}
            >
              + Create
            </button>
          </form>
        </div>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in border border-gray-200 dark:border-gray-800">
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🎫</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Create New Ticket</h2>
                    <p className="text-white/80 text-sm">AI will configure success screen</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-white hover:bg-white/20 rounded-xl p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white font-medium"
                  placeholder="e.g., Fix login timeout issue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white font-medium"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Type</label>
                  <select
                    required
                    value={formData.operation}
                    onChange={(e) => setFormData({ ...formData, operation: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white font-medium"
                  >
                    <option value="bug_fix">Bug Fix</option>
                    <option value="feature">Feature</option>
                    <option value="task">Task</option>
                    <option value="documentation">Documentation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Requester</label>
                <input
                  type="text"
                  required
                  value={formData.requester}
                  onChange={(e) => setFormData({ ...formData, requester: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white font-medium"
                  placeholder="Your name"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create Ticket'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-4 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
