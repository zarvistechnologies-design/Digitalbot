"use client"
import { useState } from "react";
import { PhoneCall, PhoneIncoming, PhoneOutgoing, Clock, CheckCircle, XCircle, Search, Filter, Play, Download } from "lucide-react";

type Call = {
  id: string;
  customerName: string;
  customerPhone: string;
  direction: 'inbound' | 'outbound';
  status: 'completed' | 'missed' | 'in-progress' | 'voicemail';
  duration: number;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  resolution: string;
  campaign?: string;
};

const mockCalls: Call[] = [
  {
    id: "1",
    customerName: "John Smith",
    customerPhone: "+1 (555) 123-4567",
    direction: "inbound",
    status: "completed",
    duration: 245,
    timestamp: "2026-01-25T10:30:00",
    sentiment: "positive",
    resolution: "Issue resolved - Refund processed",
    campaign: "Q1 Customer Outreach"
  },
  {
    id: "2",
    customerName: "Sarah Johnson",
    customerPhone: "+1 (555) 234-5678",
    direction: "outbound",
    status: "completed",
    duration: 180,
    timestamp: "2026-01-25T10:15:00",
    sentiment: "neutral",
    resolution: "Information provided",
    campaign: "Product Feedback Survey"
  },
  {
    id: "3",
    customerName: "Michael Brown",
    customerPhone: "+1 (555) 345-6789",
    direction: "inbound",
    status: "missed",
    duration: 0,
    timestamp: "2026-01-25T10:00:00",
    sentiment: "neutral",
    resolution: "Callback scheduled",
  },
  {
    id: "4",
    customerName: "Emily Davis",
    customerPhone: "+1 (555) 456-7890",
    direction: "outbound",
    status: "in-progress",
    duration: 120,
    timestamp: "2026-01-25T09:45:00",
    sentiment: "positive",
    resolution: "",
    campaign: "Support Follow-up"
  },
  {
    id: "5",
    customerName: "David Wilson",
    customerPhone: "+1 (555) 567-8901",
    direction: "inbound",
    status: "voicemail",
    duration: 45,
    timestamp: "2026-01-25T09:30:00",
    sentiment: "neutral",
    resolution: "Voicemail left - Will callback",
  },
];

export default function CustomerSupportCalls() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDirection, setFilterDirection] = useState<string>("all");

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'missed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'voicemail': return <PhoneCall className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'missed': return 'bg-red-100 text-red-700 border-red-200';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'voicemail': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filteredCalls = mockCalls.filter(call => {
    const matchesSearch = call.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         call.customerPhone.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || call.status === filterStatus;
    const matchesDirection = filterDirection === 'all' || call.direction === filterDirection;
    return matchesSearch && matchesStatus && matchesDirection;
  });

  const stats = {
    total: mockCalls.length,
    completed: mockCalls.filter(c => c.status === 'completed').length,
    inProgress: mockCalls.filter(c => c.status === 'in-progress').length,
    missed: mockCalls.filter(c => c.status === 'missed').length,
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Support Calls</h1>
        <p className="text-gray-600">Monitor and manage all customer support calls</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <PhoneCall className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-500">Total Calls</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md border-2 border-green-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md border-2 border-cyan-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.inProgress}</div>
              <div className="text-xs text-gray-500">In Progress</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md border-2 border-red-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.missed}</div>
              <div className="text-xs text-gray-500">Missed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="missed">Missed</option>
            <option value="voicemail">Voicemail</option>
          </select>

          {/* Direction Filter */}
          <select
            value={filterDirection}
            onChange={(e) => setFilterDirection(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
          >
            <option value="all">All Directions</option>
            <option value="inbound">Inbound</option>
            <option value="outbound">Outbound</option>
          </select>
        </div>
      </div>

      {/* Calls List */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-100">
              <tr>
                <th className="text-left p-4 font-bold text-gray-700">Customer</th>
                <th className="text-left p-4 font-bold text-gray-700">Direction</th>
                <th className="text-left p-4 font-bold text-gray-700">Status</th>
                <th className="text-left p-4 font-bold text-gray-700">Duration</th>
                <th className="text-left p-4 font-bold text-gray-700">Time</th>
                <th className="text-left p-4 font-bold text-gray-700">Sentiment</th>
                <th className="text-left p-4 font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCalls.map((call) => (
                <tr key={call.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                  <td className="p-4">
                    <div>
                      <div className="font-semibold text-gray-900">{call.customerName}</div>
                      <div className="text-sm text-gray-500">{call.customerPhone}</div>
                      {call.campaign && (
                        <div className="text-xs text-blue-600 mt-1">📢 {call.campaign}</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {call.direction === 'inbound' ? (
                        <PhoneIncoming className="h-4 w-4 text-green-500" />
                      ) : (
                        <PhoneOutgoing className="h-4 w-4 text-blue-500" />
                      )}
                      <span className="capitalize text-sm">{call.direction}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(call.status)}`}>
                      {getStatusIcon(call.status)}
                      <span className="capitalize">{call.status}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-gray-700">{formatDuration(call.duration)}</td>
                  <td className="p-4 text-gray-600">{formatTimestamp(call.timestamp)}</td>
                  <td className="p-4">
                    <span className={`font-medium capitalize ${getSentimentColor(call.sentiment)}`}>
                      {call.sentiment === 'positive' && '😊 '}
                      {call.sentiment === 'negative' && '😞 '}
                      {call.sentiment === 'neutral' && '😐 '}
                      {call.sentiment}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {call.status === 'completed' && (
                        <>
                          <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors" title="Play Recording">
                            <Play className="h-4 w-4" />
                          </button>
                          <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors" title="Download">
                            <Download className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {call.status === 'in-progress' && (
                        <span className="text-xs text-blue-600 font-medium animate-pulse">Live</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCalls.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <PhoneCall className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No calls found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
