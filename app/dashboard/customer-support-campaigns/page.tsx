"use client"
import Sidebar from "@/components/Sidebar";
import { useEffect, useRef, useState } from "react";

const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}

// Helper to get user info from token
const getUserFromToken = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return {
                    email: payload.email,
                    assignedPhoneNumber: payload.assignedPhoneNumber,
                    userId: payload.userId
                };
            } catch (error) {
                console.error('Error parsing token:', error);
            }
        }
    }
    return null;
}

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

// Icons
const MenuIcon = () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

function CampaignCard({ campaign, onView, onEdit, onToggle, onLaunch, isLaunching, userPhone }: { 
campaign: Campaign;
onView: () => void;
onEdit: () => void;
onToggle: () => void;
onLaunch: () => void;
isLaunching ?: boolean;
userPhone ?: string;
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
                            {userPhone && (
                                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-sky-100 text-sky-700 border-2 border-sky-300">
                                    📞 {userPhone}
                                </span>
                            )}
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
                    <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl border-2 border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">🤖</span>
                            <span className="text-sm font-bold text-blue-700">AI-Powered Customer Support</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {campaign.aiFeatures.smartScheduling && (
                                <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-semibold">Smart Scheduling</span>
                            )}
                            {campaign.aiFeatures.abTesting && (
                                <span className="px-2 py-1 bg-sky-600 text-white rounded text-xs font-semibold">A/B Testing</span>
                            )}
                            {campaign.aiFeatures.sentimentAnalysis && (
                                <span className="px-2 py-1 bg-indigo-600 text-white rounded text-xs font-semibold">Sentiment AI</span>
                            )}
                            {campaign.aiFeatures.performancePrediction && (
                                <span className="px-2 py-1 bg-cyan-600 text-white rounded text-xs font-semibold">Performance Prediction</span>
                            )}
                            {campaign.aiFeatures.autoOptimization && (
                                <span className="px-2 py-1 bg-teal-600 text-white rounded text-xs font-semibold">Auto-Optimization</span>
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
                    <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl p-3 border-2 border-sky-200">
                        <div className="text-xs text-sky-700 font-semibold mb-1">Pending</div>
                        <div className="text-2xl font-black text-sky-900">{campaign.pending.toLocaleString()}</div>
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
                            <div className="text-xs text-gray-600 mb-1">Resolution Rate</div>
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
                            <div className="text-xs text-gray-600 mb-1">CSAT Score</div>
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
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-lg hover:from-sky-700 hover:to-indigo-700 transition-all font-semibold text-sm"
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
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [userInfo, setUserInfo] = useState<{ email: string, assignedPhoneNumber: string, userId: string } | null>(null);

    // Create Campaign Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [campaignName, setCampaignName] = useState('');
    const [campaignType, setCampaignType] = useState<'voice' | 'sms' | 'email' | 'multi-channel'>('voice');
    const [targetAudience, setTargetAudience] = useState('');
    const [agentId, setAgentId] = useState('');
    const [contacts, setContacts] = useState<Array<{ name: string, phone: string, email?: string }>>([]);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadStep, setUploadStep] = useState<'form' | 'upload' | 'review'>('form');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isProcessingFile, setIsProcessingFile] = useState(false);

    // Get user info on mount
    useEffect(() => {
        const user = getUserFromToken();
        if (user) {
            setUserInfo(user);
            console.log('👤 Logged in user:', user);
        }
    }, []);

    // Fetch campaigns from backend API
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                setLoading(true);
                const token = getAuthToken();

                if (!token) {
                    console.warn('⚠️ No authentication token found');
                    setCampaigns([]);
                    setLoading(false);
                    return;
                }

                const API_BASE_URL = 'https://digital-api-tef8.onrender.com/api';

                const response = await fetch(`${API_BASE_URL}/campaigns`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ Fetched campaigns:', data);

                    const campaignsList = data.data?.campaigns || data.campaigns || [];
                    setCampaigns(campaignsList);
                    setFilteredCampaigns(campaignsList);
                } else {
                    console.error('❌ Failed to fetch campaigns:', response.status);
                    setCampaigns([]);
                    setFilteredCampaigns([]);
                }
            } catch (error) {
                console.error('❌ Error fetching campaigns:', error);
                setCampaigns([]);
                setFilteredCampaigns([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    // Filter campaigns when search or filter changes
    useEffect(() => {
        let filtered = campaigns;

        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(c => c.status === filterStatus);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(c =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.targetAudience.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredCampaigns(filtered);
    }, [filterStatus, searchTerm, campaigns]);

    // Handle file upload and parsing
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadedFile(file);
        setIsProcessingFile(true);

        try {
            // Check file type
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            
            if (fileExtension === 'csv') {
                // Parse CSV
                const text = await file.text();
                const lines = text.split('\n').filter(line => line.trim());
                const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
                
                const parsedContacts = lines.slice(1).map(line => {
                    const values = line.split(',').map(v => v.trim());
                    const contact: { name: string, phone: string, email?: string } = {
                        name: '',
                        phone: '',
                        email: ''
                    };
                    
                    headers.forEach((header, index) => {
                        if (header.includes('name')) contact.name = values[index] || '';
                        if (header.includes('phone') || header.includes('mobile') || header.includes('number')) contact.phone = values[index] || '';
                        if (header.includes('email')) contact.email = values[index] || '';
                    });
                    
                    return contact;
                }).filter(c => c.phone); // Only keep contacts with phone numbers

                setContacts(parsedContacts);
                setUploadStep('review');
            } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
                // For Excel files, we'd need a library like xlsx
                alert('📊 Excel file detected! Please convert to CSV format for now, or we can add Excel parsing support.');
                setUploadedFile(null);
            } else if (fileExtension === 'pdf') {
                // For PDF files, we'd need a library like pdf-parse
                alert('📄 PDF file detected! PDF parsing requires backend processing. Please use CSV format for now.');
                setUploadedFile(null);
            } else {
                alert('❌ Unsupported file format! Please upload CSV, XLSX, or PDF files.');
                setUploadedFile(null);
            }
        } catch (error) {
            console.error('Error processing file:', error);
            alert('❌ Failed to process file. Please check the file format and try again.');
            setUploadedFile(null);
        } finally {
            setIsProcessingFile(false);
        }
    };

    // Create Campaign Handler
    const handleCreateCampaign = async () => {
        if (!campaignName.trim()) {
            alert('❌ Please enter a campaign name');
            return;
        }

        if (contacts.length === 0) {
            alert('❌ Please upload a file with contacts');
            return;
        }

        if (campaignType === 'voice' && !agentId.trim()) {
            alert('❌ Please enter a Smillis AI Agent ID for voice campaigns');
            return;
        }

        const token = getAuthToken();
        if (!token) {
            alert('❌ Please login to create a campaign');
            return;
        }

        setCreating(true);

        try {
            const API_BASE_URL = 'https://digital-api-tef8.onrender.com/api';

            const newCampaign = {
                name: campaignName,
                type: campaignType,
                targetAudience: targetAudience || 'Customer Support Contacts',
                contacts: contacts,
                aiFeatures: {
                    smartScheduling: true,
                    abTesting: false,
                    sentimentAnalysis: true,
                    performancePrediction: true,
                    autoOptimization: true
                },
                content: {
                    voiceAgentId: agentId
                },
                millisAI: {
                    agentId: agentId
                }
            };

            const response = await fetch(`${API_BASE_URL}/campaigns`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCampaign)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Campaign created:', data);

                // Add to campaigns list
                setCampaigns([data.data.campaign, ...campaigns]);

                // Reset form
                setShowCreateModal(false);
                setCampaignName('');
                setTargetAudience('');
                setAgentId('');
                setContacts([]);
                setUploadedFile(null);
                setUploadStep('form');

                alert(`✅ Campaign "${campaignName}" created successfully with ${contacts.length} contacts!\n\nCalls will be made from: ${userInfo?.assignedPhoneNumber || 'your assigned number'}`);
            } else {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.error || errorData?.message || response.statusText;

                if (response.status === 401 || response.status === 403) {
                    alert('❌ Authentication failed. Please login again.');
                } else {
                    throw new Error(errorMessage);
                }
            }
        } catch (error) {
            console.error('Error creating campaign:', error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            alert(`❌ Failed to create campaign!\n\nError: ${message}\n\nPlease try again or contact support.`);
        } finally {
            setCreating(false);
        }
    };

    // Launch Campaign Handler
    const handleLaunchCampaign = async (campaignId: string) => {
        const campaign = campaigns.find(c => c._id === campaignId);
        if (!campaign) {
            alert('❌ Campaign not found!');
            return;
        }

        const campaignAgentId = campaign.content?.voiceAgentId || campaign.millisAI?.agentId;
        if (campaign.type === 'voice' && (!campaignAgentId || campaignAgentId.trim() === '')) {
            alert('❌ Cannot launch campaign!\n\nThis voice campaign is missing an AI Voice Agent ID.');
            return;
        }

        const token = getAuthToken();
        if (!token) {
            alert('❌ Please login to launch a campaign');
            return;
        }

        if (!confirm(`🚀 Are you sure you want to launch this campaign?\n\nThis will start making ${campaign.totalContacts} calls using Smillis AI from: ${userInfo?.assignedPhoneNumber || 'your number'}`)) {
            return;
        }

        setLaunching(true);

        try {
            const API_BASE_URL = 'https://digital-api-tef8.onrender.com/api';

            const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/launch`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Campaign launched:', data);

                setCampaigns(campaigns.map(c =>
                    c._id === campaignId
                        ? { ...c, status: 'active', ...data.data.campaign }
                        : c
                ));

                alert(data.data.message || `✅ Campaign launched successfully!\n\nMaking calls from: ${data.data.fromPhone || userInfo?.assignedPhoneNumber}`);
            } else {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.error || errorData?.message || response.statusText;
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error launching campaign:', error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            alert(`❌ Failed to launch campaign!\n\nError: ${message}`);
        } finally {
            setLaunching(false);
        }
    };

    // Toggle Campaign Status
    const handleToggleCampaign = async (campaignId: string) => {
        const campaign = campaigns.find(c => c._id === campaignId);
        if (!campaign) return;

        const newStatus = campaign.status === 'active' ? 'paused' : 'active';
        
        try {
            // Update local state immediately for better UX
            setCampaigns(campaigns.map(c =>
                c._id === campaignId ? { ...c, status: newStatus } : c
            ));
        } catch (error) {
            console.error('Error toggling campaign:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100">
                <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out w-60`}>
                    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                </div>
                <main className="w-full md:ml-60 p-4 sm:p-6 lg:p-8 pt-20 md:pt-8 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div>
                        </div>
                        <p className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">Loading Campaigns...</p>
                        <p className="text-sm text-slate-600">Fetching your customer support campaigns</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-lg shadow-lg border-2 border-blue-200 hover:border-blue-400 transition-all"
                aria-label="Toggle menu"
            >
                <MenuIcon />
            </button>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out w-60`}>
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            </div>

            <main className="w-full md:ml-60 p-4 sm:p-6 lg:p-8 pt-20 md:pt-8">
                <div className="max-w-8xl mx-auto space-y-6 sm:space-y-8">

                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-200 p-4 sm:p-6 lg:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-300 rounded-xl px-4 py-2 mb-3">
                                    <span className="text-2xl">🎧</span>
                                    <span className="text-sm font-bold text-blue-700">AI Customer Support Campaigns</span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-2">
                                    Customer Support <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Campaigns</span>
                                </h1>
                                <p className="text-gray-600 text-sm sm:text-base">
                                    Upload contacts and launch AI-powered support campaigns using Smillis AI
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowCreateModal(true);
                                    setUploadStep('form');
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                            >
                                <span className="text-xl">➕</span>
                                <span>Create Campaign</span>
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="🔍 Search campaigns..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            {/* Status Filter */}
                            <div className="flex gap-2 flex-wrap">
                                {(['all', 'active', 'draft', 'paused', 'completed'] as FilterStatus[]).map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                                            filterStatus === status
                                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Campaigns Grid */}
                    {filteredCampaigns.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-12 text-center">
                            <div className="text-6xl mb-4">📞</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Campaigns Yet</h3>
                            <p className="text-gray-600 mb-6">Create your first customer support campaign to get started!</p>
                            <button
                                onClick={() => {
                                    setShowCreateModal(true);
                                    setUploadStep('form');
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all font-bold shadow-lg"
                            >
                                ➕ Create Campaign
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredCampaigns.map(campaign => (
                                <CampaignCard
                                    key={campaign._id}
                                    campaign={campaign}
                                    onView={() => console.log('View campaign:', campaign._id)}
                                    onEdit={() => console.log('Edit campaign:', campaign._id)}
                                    onToggle={() => handleToggleCampaign(campaign._id)}
                                    onLaunch={() => handleLaunchCampaign(campaign._id)}
                                    isLaunching={launching}
                                    userPhone={userInfo?.assignedPhoneNumber}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Create Campaign Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">Create Support Campaign</h2>
                                <button
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setUploadStep('form');
                                        setCampaignName('');
                                        setTargetAudience('');
                                        setAgentId('');
                                        setContacts([]);
                                        setUploadedFile(null);
                                    }}
                                    className="text-gray-600 hover:text-gray-900 transition-colors p-2"
                                >
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {uploadStep === 'form' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Campaign Name *</label>
                                        <input
                                            type="text"
                                            value={campaignName}
                                            onChange={(e) => setCampaignName(e.target.value)}
                                            placeholder="e.g., Customer Support Q1 2024"
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Campaign Type *</label>
                                        <select
                                            value={campaignType}
                                            onChange={(e) => setCampaignType(e.target.value as any)}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="voice">📞 Voice (Smillis AI)</option>
                                            <option value="sms">💬 SMS</option>
                                            <option value="email">📧 Email</option>
                                            <option value="multi-channel">🌐 Multi-Channel</option>
                                        </select>
                                    </div>

                                    {campaignType === 'voice' && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Smillis AI Agent ID *</label>
                                            <input
                                                type="text"
                                                value={agentId}
                                                onChange={(e) => setAgentId(e.target.value)}
                                                placeholder="Enter your Smillis AI Agent ID"
                                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Get your Agent ID from Smillis AI dashboard</p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Target Audience</label>
                                        <input
                                            type="text"
                                            value={targetAudience}
                                            onChange={(e) => setTargetAudience(e.target.value)}
                                            placeholder="e.g., Existing Customers"
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="pt-4 border-t">
                                        <button
                                            onClick={() => setUploadStep('upload')}
                                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-bold"
                                        >
                                            Next: Upload Contacts →
                                        </button>
                                    </div>
                                </>
                            )}

                            {uploadStep === 'upload' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Contact File *</label>
                                        <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-500 transition-all">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".csv,.xlsx,.xls,.pdf"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                            />
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-bold mb-4"
                                            >
                                                📁 Choose File
                                            </button>
                                            <p className="text-sm text-gray-600">Supported formats: CSV, XLSX, XLS, PDF</p>
                                            {uploadedFile && (
                                                <p className="text-sm text-green-600 mt-2">✅ {uploadedFile.name}</p>
                                            )}
                                        </div>
                                    </div>

                                    {isProcessingFile && (
                                        <div className="text-center py-4">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
                                            <p className="text-sm text-gray-600 mt-2">Processing file...</p>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setUploadStep('form')}
                                            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-bold"
                                        >
                                            ← Back
                                        </button>
                                    </div>
                                </>
                            )}

                            {uploadStep === 'review' && (
                                <>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Review Contacts ({contacts.length})</h3>
                                        <div className="max-h-64 overflow-y-auto border-2 border-gray-200 rounded-lg">
                                            <table className="w-full">
                                                <thead className="bg-gray-50 sticky top-0">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Name</th>
                                                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Phone</th>
                                                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Email</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {contacts.slice(0, 50).map((contact, index) => (
                                                        <tr key={index} className="border-t border-gray-200">
                                                            <td className="px-4 py-2 text-sm">{contact.name || '-'}</td>
                                                            <td className="px-4 py-2 text-sm">{contact.phone}</td>
                                                            <td className="px-4 py-2 text-sm">{contact.email || '-'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {contacts.length > 50 && (
                                            <p className="text-xs text-gray-500 mt-2">Showing first 50 of {contacts.length} contacts</p>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setUploadStep('upload')}
                                            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-bold"
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            onClick={handleCreateCampaign}
                                            disabled={creating}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-bold disabled:opacity-50"
                                        >
                                            {creating ? '⏳ Creating...' : '✅ Create Campaign'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
