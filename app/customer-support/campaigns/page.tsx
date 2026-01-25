"use client"
import { useEffect, useRef, useState } from "react";

type Campaign = {
    _id: string;
    name: string;
    type: 'voice' | 'sms' | 'email' | 'multi-channel';
    status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
    targetAudience: string;
    totalContacts: number;
    contacted: number;
    successful: number;
    failed: number;
    pending: number;
    startDate?: string;
    endDate?: string;
    aiFeatures: {
        smartScheduling: boolean;
        abTesting: boolean;
        sentimentAnalysis: boolean;
        performancePrediction: boolean;
        autoOptimization: boolean;
    };
    performance: {
        conversionRate: number;
        avgSentiment: number;
        engagementScore: number;
        predictedROI: number;
    };
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    content?: {
        voiceAgentId?: string;
    };
    millisAI?: {
        agentId?: string;
    };
};

type FilterStatus = 'all' | 'active' | 'scheduled' | 'completed' | 'draft' | 'paused';

function CampaignCard({ campaign, onView, onEdit, onToggle, onLaunch, isLaunching }: { 
    campaign: Campaign;
    onView: () => void;
    onEdit: () => void;
    onToggle: () => void;
    onLaunch: () => void;
    isLaunching?: boolean;
}) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700 border-green-300';
            case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'completed': return 'bg-gray-100 text-gray-700 border-gray-300';
            case 'paused': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            default: return 'bg-purple-100 text-purple-700 border-purple-300';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'voice': return '📞';
            case 'sms': return '💬';
            case 'email': return '📧';
            case 'multi-channel': return '🌐';
            default: return '📢';
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 transition-all duration-300 hover:shadow-xl hover:border-blue-400">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{getTypeIcon(campaign.type)}</span>
                            <h3 className="text-xl font-bold text-gray-900">{campaign.name}</h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold border-2 ${getStatusColor(campaign.status)}`}>
                                {campaign.status.toUpperCase()}
                            </span>
                            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 border-2 border-blue-300">
                                {campaign.type}
                            </span>
                        </div>
                    </div>

                    {/* Toggle Active/Pause */}
                    {campaign.status === 'active' || campaign.status === 'paused' ? (
                        <button
                            onClick={onToggle}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${campaign.status === 'active'
                                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                        >
                            {campaign.status === 'active' ? '⏸ Pause' : '▶ Resume'}
                        </button>
                    ) : null}
                </div>

                {/* AI Features Badge */}
                {Object.values(campaign.aiFeatures).some(v => v) && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">🤖</span>
                            <span className="text-sm font-bold text-blue-700">AI-Powered Customer Support</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {campaign.aiFeatures.smartScheduling && (
                                <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-semibold">Smart Scheduling</span>
                            )}
                            {campaign.aiFeatures.abTesting && (
                                <span className="px-2 py-1 bg-cyan-600 text-white rounded text-xs font-semibold">A/B Testing</span>
                            )}
                            {campaign.aiFeatures.sentimentAnalysis && (
                                <span className="px-2 py-1 bg-teal-600 text-white rounded text-xs font-semibold">Sentiment AI</span>
                            )}
                            {campaign.aiFeatures.performancePrediction && (
                                <span className="px-2 py-1 bg-indigo-600 text-white rounded text-xs font-semibold">Performance Prediction</span>
                            )}
                            {campaign.aiFeatures.autoOptimization && (
                                <span className="px-2 py-1 bg-green-600 text-white rounded text-xs font-semibold">Auto-Optimization</span>
                            )}
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border-2 border-blue-200">
                        <div className="text-xs text-blue-700 font-semibold mb-1">Total Contacts</div>
                        <div className="text-2xl font-black text-blue-900">{campaign.totalContacts.toLocaleString()}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border-2 border-green-200">
                        <div className="text-xs text-green-700 font-semibold mb-1">Successful</div>
                        <div className="text-2xl font-black text-green-900">{campaign.successful.toLocaleString()}</div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-3 border-2 border-cyan-200">
                        <div className="text-xs text-cyan-700 font-semibold mb-1">Pending</div>
                        <div className="text-2xl font-black text-cyan-900">{campaign.pending.toLocaleString()}</div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3 border-2 border-red-200">
                        <div className="text-xs text-red-700 font-semibold mb-1">Failed</div>
                        <div className="text-2xl font-black text-red-900">{campaign.failed.toLocaleString()}</div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 mb-4 border-2 border-blue-200">
                    <h4 className="text-sm font-bold text-blue-700 mb-3 flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Performance Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <div className="text-xs text-gray-600 mb-1">Conversion Rate</div>
                            <div className="text-lg font-bold text-gray-900">{campaign.performance.conversionRate.toFixed(1)}%</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-600 mb-1">Engagement Score</div>
                            <div className="text-lg font-bold text-gray-900">{campaign.performance.engagementScore.toFixed(1)}/10</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-600 mb-1">Avg Sentiment</div>
                            <div className="text-lg font-bold text-gray-900">{campaign.performance.avgSentiment > 0 ? '😊' : campaign.performance.avgSentiment < 0 ? '😞' : '😐'} {campaign.performance.avgSentiment.toFixed(2)}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-600 mb-1">Predicted ROI</div>
                            <div className="text-lg font-bold text-green-600">{campaign.performance.predictedROI.toFixed(0)}%</div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-col">
                    {/* Launch button for draft campaigns */}
                    {campaign.status === 'draft' && (
                        <button
                            onClick={onLaunch}
                            disabled={isLaunching}
                            className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-bold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLaunching ? '⏳ Launching...' : '🚀 Launch Campaign'}
                        </button>
                    )}

                    <div className="flex gap-2">
                        <button
                            onClick={onView}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-semibold text-sm"
                        >
                            📊 View
                        </button>
                        <button
                            onClick={onEdit}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg hover:from-cyan-700 hover:to-teal-700 transition-all font-semibold text-sm"
                        >
                            ✏️ Edit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CustomerSupportCampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [launching, setLaunching] = useState(false);
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Create Campaign Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [campaignName, setCampaignName] = useState('');
    const [campaignType, setCampaignType] = useState<'voice' | 'sms' | 'email' | 'multi-channel'>('voice');
    const [targetAudience, setTargetAudience] = useState('');
    const [agentId, setAgentId] = useState('');
    const [contacts, setContacts] = useState<Array<{ name: string, phone: string, email?: string }>>([]);
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [uploadStep, setUploadStep] = useState<'form' | 'upload' | 'review'>('form');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch campaigns - using localStorage for demo (no login required)
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                setLoading(true);
                
                // Check localStorage for saved campaigns
                const savedCampaigns = localStorage.getItem('customerSupportCampaigns');
                if (savedCampaigns) {
                    const parsed = JSON.parse(savedCampaigns);
                    setCampaigns(parsed);
                } else {
                    // Demo data for new users
                    const demoCampaigns: Campaign[] = [
                        {
                            _id: '1',
                            name: 'Q1 Customer Outreach',
                            type: 'voice',
                            status: 'active',
                            targetAudience: 'Premium Customers',
                            totalContacts: 5000,
                            contacted: 2340,
                            successful: 2082,
                            failed: 158,
                            pending: 2660,
                            aiFeatures: { smartScheduling: true, abTesting: true, sentimentAnalysis: true, performancePrediction: true, autoOptimization: true },
                            performance: { conversionRate: 89, avgSentiment: 0.72, engagementScore: 8.5, predictedROI: 245 },
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        },
                        {
                            _id: '2',
                            name: 'Product Feedback Survey',
                            type: 'voice',
                            status: 'active',
                            targetAudience: 'Recent Purchasers',
                            totalContacts: 2000,
                            contacted: 1200,
                            successful: 1104,
                            failed: 96,
                            pending: 800,
                            aiFeatures: { smartScheduling: true, abTesting: false, sentimentAnalysis: true, performancePrediction: false, autoOptimization: true },
                            performance: { conversionRate: 92, avgSentiment: 0.65, engagementScore: 7.8, predictedROI: 180 },
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        },
                        {
                            _id: '3',
                            name: 'Support Follow-up Campaign',
                            type: 'voice',
                            status: 'draft',
                            targetAudience: 'Support Ticket Customers',
                            totalContacts: 1500,
                            contacted: 0,
                            successful: 0,
                            failed: 0,
                            pending: 1500,
                            aiFeatures: { smartScheduling: true, abTesting: false, sentimentAnalysis: true, performancePrediction: true, autoOptimization: false },
                            performance: { conversionRate: 0, avgSentiment: 0, engagementScore: 0, predictedROI: 0 },
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        },
                    ];
                    setCampaigns(demoCampaigns);
                    localStorage.setItem('customerSupportCampaigns', JSON.stringify(demoCampaigns));
                }
            } catch (error) {
                console.error('Error loading campaigns:', error);
                setCampaigns([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    // Filter campaigns
    useEffect(() => {
        let filtered = campaigns;

        if (filterStatus !== 'all') {
            filtered = filtered.filter(c => c.status === filterStatus);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(c =>
                c.name.toLowerCase().includes(term) ||
                c.type.toLowerCase().includes(term) ||
                c.targetAudience.toLowerCase().includes(term)
            );
        }

        setFilteredCampaigns(filtered);
    }, [campaigns, filterStatus, searchTerm]);

    // Stats
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalContacts = campaigns.reduce((sum, c) => sum + c.totalContacts, 0);
    const avgConversion = campaigns.length > 0
        ? campaigns.reduce((sum, c) => sum + c.performance.conversionRate, 0) / campaigns.length
        : 0;

    // Save campaigns to localStorage
    const saveCampaigns = (updatedCampaigns: Campaign[]) => {
        setCampaigns(updatedCampaigns);
        localStorage.setItem('customerSupportCampaigns', JSON.stringify(updatedCampaigns));
    };

    // Handle campaign actions
    const handleToggleCampaign = (campaignId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'paused' : 'active';
        const updated = campaigns.map(c => 
            c._id === campaignId ? { ...c, status: newStatus as Campaign['status'] } : c
        );
        saveCampaigns(updated);
        alert(`✅ Campaign ${newStatus === 'active' ? 'resumed' : 'paused'} successfully!`);
    };

    const handleViewCampaign = (campaignId: string) => {
        const campaign = campaigns.find(c => c._id === campaignId);
        if (campaign) {
            alert(`📊 Campaign Details\n\nName: ${campaign.name}\nStatus: ${campaign.status}\nContacts: ${campaign.totalContacts}\nSuccessful: ${campaign.successful}\nConversion: ${campaign.performance.conversionRate}%`);
        }
    };

    const handleEditCampaign = (campaignId: string) => {
        alert(`✏️ Edit Campaign: ${campaignId}\n\nCampaign editor coming soon!`);
    };

    const handleLaunchCampaign = (campaignId: string) => {
        const campaign = campaigns.find(c => c._id === campaignId);
        if (!campaign) return;

        if (campaign.type === 'voice' && !campaign.content?.voiceAgentId) {
            alert('❌ Cannot launch!\n\nPlease add an AI Agent ID to this voice campaign first.');
            return;
        }

        if (!confirm(`🚀 Launch "${campaign.name}"?\n\nThis will start making ${campaign.totalContacts} calls.`)) {
            return;
        }

        setLaunching(true);
        
        setTimeout(() => {
            const updated = campaigns.map(c => 
                c._id === campaignId ? { ...c, status: 'active' as Campaign['status'] } : c
            );
            saveCampaigns(updated);
            setLaunching(false);
            alert(`✅ Campaign launched successfully!`);
        }, 1500);
    };

    // CSV Upload Handler
    const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.csv')) {
            alert('❌ Please upload a CSV file!');
            return;
        }

        setCsvFile(file);
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                const lines = text.split('\n').filter(line => line.trim());
                const dataLines = lines.slice(1);

                const parsedContacts = dataLines.map(line => {
                    const [name, phone, email] = line.split(',').map(v => v.trim());
                    return { name, phone, email: email || '' };
                }).filter(c => c.name && c.phone);

                setContacts(parsedContacts);
                setUploadStep('review');
                alert(`✅ Loaded ${parsedContacts.length} contacts!`);
            } catch {
                alert('❌ Failed to parse CSV. Please check the format.');
            }
        };

        reader.readAsText(file);
    };

    // Manual Contact Add
    const handleAddManualContact = () => {
        const name = prompt('Enter contact name:');
        const phone = prompt('Enter phone number:');
        if (name && phone) {
            const email = prompt('Enter email (optional):') || '';
            setContacts([...contacts, { name, phone, email }]);
        }
    };

    // Create Campaign Handler
    const handleCreateCampaign = () => {
        if (!campaignName || !targetAudience || contacts.length === 0) {
            alert('❌ Please fill all required fields and add contacts!');
            return;
        }

        if (campaignType === 'voice' && !agentId) {
            alert('❌ AI Agent ID is required for voice campaigns!');
            return;
        }

        setCreating(true);

        setTimeout(() => {
            const newCampaign: Campaign = {
                _id: Date.now().toString(),
                name: campaignName,
                type: campaignType,
                status: 'draft',
                targetAudience,
                totalContacts: contacts.length,
                contacted: 0,
                successful: 0,
                failed: 0,
                pending: contacts.length,
                aiFeatures: { smartScheduling: true, abTesting: false, sentimentAnalysis: true, performancePrediction: false, autoOptimization: true },
                performance: { conversionRate: 0, avgSentiment: 0, engagementScore: 0, predictedROI: 0 },
                content: { voiceAgentId: agentId },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            saveCampaigns([newCampaign, ...campaigns]);

            // Reset form
            setShowCreateModal(false);
            setCampaignName('');
            setTargetAudience('');
            setAgentId('');
            setContacts([]);
            setCsvFile(null);
            setUploadStep('form');
            setCreating(false);

            alert(`✅ Campaign "${campaignName}" created with ${contacts.length} contacts!`);
        }, 1000);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div>
                    </div>
                    <p className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">Loading Campaigns...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-300 rounded-xl px-4 py-2 mb-3">
                            <span className="text-2xl">🎧</span>
                            <span className="text-sm font-bold text-blue-700">Customer Support Campaign Manager</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-slate-900 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                            Campaign Management
                        </h1>
                        <p className="text-slate-600 text-sm sm:text-base">
                            AI-powered customer support campaigns • Multi-channel • Smart automation
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-bold shadow-lg hover:scale-105"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Campaign
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-6 hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-slate-600 font-semibold mb-1 text-sm">Total Campaigns</p>
                    <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{totalCampaigns}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border-2 border-green-200 p-6 hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-slate-600 font-semibold mb-1 text-sm">Active Campaigns</p>
                    <p className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{activeCampaigns}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border-2 border-cyan-200 p-6 hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 shadow-lg">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-slate-600 font-semibold mb-1 text-sm">Total Reach</p>
                    <p className="text-3xl font-black bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">{totalContacts.toLocaleString()}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-200 p-6 hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-slate-600 font-semibold mb-1 text-sm">Avg Conversion</p>
                    <p className="text-3xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{avgConversion.toFixed(1)}%</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-200 p-4">
                <div className="flex flex-col gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="🔍 Search campaigns..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-6 py-4 pl-12 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all text-lg text-slate-800 placeholder-slate-500 font-medium"
                        />
                        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {[
                            { value: 'all', label: 'All', color: 'bg-slate-100 text-slate-700 border-slate-300', active: 'bg-gradient-to-r from-blue-500 to-cyan-600' },
                            { value: 'active', label: 'Active', color: 'bg-green-50 text-green-700 border-green-300', active: 'bg-gradient-to-r from-green-500 to-emerald-600' },
                            { value: 'scheduled', label: 'Scheduled', color: 'bg-blue-50 text-blue-700 border-blue-300', active: 'bg-gradient-to-r from-blue-500 to-cyan-600' },
                            { value: 'paused', label: 'Paused', color: 'bg-yellow-50 text-yellow-700 border-yellow-300', active: 'bg-gradient-to-r from-yellow-500 to-orange-600' },
                            { value: 'completed', label: 'Completed', color: 'bg-gray-50 text-gray-700 border-gray-300', active: 'bg-gradient-to-r from-gray-500 to-slate-600' },
                            { value: 'draft', label: 'Draft', color: 'bg-purple-50 text-purple-700 border-purple-300', active: 'bg-gradient-to-r from-purple-500 to-indigo-600' }
                        ].map(filter => (
                            <button
                                key={filter.value}
                                onClick={() => setFilterStatus(filter.value as FilterStatus)}
                                className={`px-4 py-2 rounded-lg font-bold transition-all text-sm border-2 ${filterStatus === filter.value
                                    ? filter.active + ' text-white shadow-lg'
                                    : filter.color
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Campaigns Grid */}
            <div className="grid gap-6">
                {filteredCampaigns.length === 0 ? (
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl shadow-2xl border-2 border-blue-300 p-16 text-center">
                        <div className="text-blue-500 mb-6">
                            <svg className="mx-auto h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                            {searchTerm || filterStatus !== 'all' ? 'No campaigns match your filters' : 'No campaigns yet'}
                        </h3>
                        <p className="text-gray-600 text-lg mb-6">
                            {searchTerm || filterStatus !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Create your first customer support campaign!'
                            }
                        </p>
                        {!searchTerm && filterStatus === 'all' && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl transition-all flex items-center justify-center gap-2 font-bold shadow-lg hover:scale-105 mx-auto"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create Your First Campaign
                            </button>
                        )}
                    </div>
                ) : (
                    filteredCampaigns.map((campaign) => (
                        <CampaignCard
                            key={campaign._id}
                            campaign={campaign}
                            onView={() => handleViewCampaign(campaign._id)}
                            onEdit={() => handleEditCampaign(campaign._id)}
                            onToggle={() => handleToggleCampaign(campaign._id, campaign.status)}
                            onLaunch={() => handleLaunchCampaign(campaign._id)}
                            isLaunching={launching}
                        />
                    ))
                )}
            </div>

            {/* Count */}
            <div className="text-center py-4">
                <p className="text-gray-600">
                    Showing <span className="font-bold text-blue-600">{filteredCampaigns.length}</span> of <span className="font-bold text-blue-600">{totalCampaigns}</span> campaigns
                </p>
            </div>

            {/* Create Campaign Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-3xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-black">🎧 Create Support Campaign</h2>
                                    <p className="text-blue-100 mt-1">Launch AI-powered customer support campaign</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setUploadStep('form');
                                        setContacts([]);
                                        setCsvFile(null);
                                    }}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-all"
                                >
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-6">
                            {/* Step 1: Campaign Details */}
                            {uploadStep === 'form' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Campaign Name *</label>
                                        <input
                                            type="text"
                                            value={campaignName}
                                            onChange={(e) => setCampaignName(e.target.value)}
                                            placeholder="e.g., Customer Feedback Campaign"
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Campaign Type *</label>
                                        <div className="grid grid-cols-4 gap-3">
                                            {(['voice', 'sms', 'email', 'multi-channel'] as const).map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => setCampaignType(type)}
                                                    className={`p-4 rounded-xl border-2 font-semibold transition-all ${campaignType === type
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-gray-300 hover:border-blue-300'
                                                    }`}
                                                >
                                                    {type === 'voice' && '📞'}
                                                    {type === 'sms' && '💬'}
                                                    {type === 'email' && '📧'}
                                                    {type === 'multi-channel' && '🌐'}
                                                    <div className="text-xs mt-1 capitalize">{type}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Target Audience *</label>
                                        <input
                                            type="text"
                                            value={targetAudience}
                                            onChange={(e) => setTargetAudience(e.target.value)}
                                            placeholder="e.g., Premium Customers, Support Tickets"
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                        />
                                    </div>

                                    {campaignType === 'voice' && (
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">AI Agent ID * (Required)</label>
                                            <input
                                                type="text"
                                                value={agentId}
                                                onChange={(e) => setAgentId(e.target.value)}
                                                placeholder="e.g., -OXrv5021Ddq4NGGbG0h"
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Get this from your AI Voice Agent dashboard</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setUploadStep('upload')}
                                        disabled={!campaignName || !targetAudience}
                                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        Next: Upload Contacts →
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Upload Contacts */}
                            {uploadStep === 'upload' && (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold mb-2">📋 Upload Contact List</h3>
                                        <p className="text-gray-600">Upload CSV or add contacts manually</p>
                                    </div>

                                    <div className="border-4 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-all">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".csv"
                                            onChange={handleCSVUpload}
                                            className="hidden"
                                        />
                                        <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                                        >
                                            Choose CSV File
                                        </button>
                                        <p className="text-sm text-gray-500 mt-3">Format: name, phone, email</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                        <span className="text-gray-500 font-semibold">OR</span>
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                    </div>

                                    <button
                                        onClick={handleAddManualContact}
                                        className="w-full py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all"
                                    >
                                        ➕ Add Contact Manually
                                    </button>

                                    {contacts.length > 0 && (
                                        <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
                                            <p className="text-green-700 font-bold">✅ {contacts.length} contacts ready!</p>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setUploadStep('form')}
                                            className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50"
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            onClick={() => setUploadStep('review')}
                                            disabled={contacts.length === 0}
                                            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold disabled:opacity-50"
                                        >
                                            Review →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Review */}
                            {uploadStep === 'review' && (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold mb-2">✅ Review & Create</h3>
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-2xl p-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600 font-semibold">Campaign Name</p>
                                                <p className="text-lg font-bold text-gray-900">{campaignName}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 font-semibold">Type</p>
                                                <p className="text-lg font-bold text-gray-900 capitalize">{campaignType}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 font-semibold">Target Audience</p>
                                                <p className="text-lg font-bold text-gray-900">{targetAudience}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 font-semibold">Total Contacts</p>
                                                <p className="text-lg font-bold text-blue-600">{contacts.length}</p>
                                            </div>
                                            {agentId && (
                                                <div className="col-span-2">
                                                    <p className="text-sm text-gray-600 font-semibold">AI Agent ID</p>
                                                    <p className="text-lg font-bold text-gray-900">{agentId}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-3">Contacts Preview</h4>
                                        <div className="max-h-60 overflow-y-auto border-2 border-gray-200 rounded-xl">
                                            <table className="w-full">
                                                <thead className="bg-gray-100 sticky top-0">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Name</th>
                                                        <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Phone</th>
                                                        <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Email</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {contacts.slice(0, 20).map((contact, idx) => (
                                                        <tr key={idx} className="border-t border-gray-200">
                                                            <td className="px-4 py-2 text-sm">{contact.name}</td>
                                                            <td className="px-4 py-2 text-sm">{contact.phone}</td>
                                                            <td className="px-4 py-2 text-sm">{contact.email || '-'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {contacts.length > 20 && (
                                                <div className="p-3 bg-gray-50 text-center text-sm text-gray-600">
                                                    ... and {contacts.length - 20} more
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setUploadStep('upload')}
                                            disabled={creating}
                                            className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            onClick={handleCreateCampaign}
                                            disabled={creating}
                                            className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
                                        >
                                            {creating ? '⏳ Creating...' : '🚀 Create Campaign'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
