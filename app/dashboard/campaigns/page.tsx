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
            case 'scheduled': return 'bg-orange-100 text-orange-700 border-orange-300';
            case 'completed': return 'bg-gray-100 text-gray-700 border-gray-300';
            case 'paused': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            default: return 'bg-orange-100 text-orange-700 border-orange-300';
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
        <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-200 transition-all duration-300 hover:shadow-xl hover:border-orange-400">
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
                            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-orange-100 text-orange-700 border-2 border-orange-300">
                                {campaign.type}
                            </span>
                            {userPhone && (
                                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-orange-100 text-orange-700 border-2 border-orange-300">
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
                    <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl border-2 border-orange-200">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">🤖</span>
                            <span className="text-sm font-bold text-orange-700">AI-Powered Features</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {campaign.aiFeatures.smartScheduling && (
                                <span className="px-2 py-1 bg-orange-600 text-white rounded text-xs font-semibold">Smart Scheduling</span>
                            )}
                            {campaign.aiFeatures.abTesting && (
                                <span className="px-2 py-1 bg-pink-600 text-white rounded text-xs font-semibold">A/B Testing</span>
                            )}
                            {campaign.aiFeatures.sentimentAnalysis && (
                                <span className="px-2 py-1 bg-orange-600 text-white rounded text-xs font-semibold">Sentiment AI</span>
                            )}
                            {campaign.aiFeatures.performancePrediction && (
                                <span className="px-2 py-1 bg-sky-600 text-white rounded text-xs font-semibold">Performance Prediction</span>
                            )}
                            {campaign.aiFeatures.autoOptimization && (
                                <span className="px-2 py-1 bg-green-600 text-white rounded text-xs font-semibold">Auto-Optimization</span>
                            )}
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 border-2 border-orange-200">
                        <div className="text-xs text-orange-700 font-semibold mb-1">Total Contacts</div>
                        <div className="text-2xl font-black text-orange-900">{campaign.totalContacts.toLocaleString()}</div>
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
                <div className="bg-gradient-to-br from-orange-50 to-orange-50 rounded-xl p-4 mb-4 border-2 border-orange-200">
                    <h4 className="text-sm font-bold text-orange-700 mb-3 flex items-center gap-2">
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
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-600 text-white rounded-lg hover:from-orange-700 hover:to-orange-700 transition-all font-semibold text-sm"
                        >
                            📊 View
                        </button>
                        <button
                            onClick={onEdit}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-sky-600 to-pink-600 text-white rounded-lg hover:from-sky-700 hover:to-pink-700 transition-all font-semibold text-sm"
                        >
                            ✏️ Edit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CampaignsPage() {
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
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [uploadStep, setUploadStep] = useState<'form' | 'upload' | 'review'>('form');
    const fileInputRef = useRef<HTMLInputElement>(null);

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

                const API_BASE_URL = 'https://digital-api-46ss.onrender.com/api';

                const response = await fetch(`${API_BASE_URL}/campaigns`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        console.warn('⚠️ Authentication failed - please login again');
                        // Optionally redirect to login
                        // window.location.href = '/login';
                    }
                    console.warn('Failed to fetch campaigns');
                    setCampaigns([]);
                    return;
                }

                const data = await response.json();
                const fetchedCampaigns = data.data?.campaigns || data.campaigns || [];
                setCampaigns(fetchedCampaigns);

                console.log(`✅ Fetched ${fetchedCampaigns.length} campaigns from backend`);

            } catch (error) {
                console.error('Error fetching campaigns:', error);
                setCampaigns([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

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

    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalContacts = campaigns.reduce((sum, c) => sum + c.totalContacts, 0);
    const avgConversion = campaigns.length > 0
        ? campaigns.reduce((sum, c) => sum + c.performance.conversionRate, 0) / campaigns.length
        : 0;

    // Handle campaign actions
    const handleToggleCampaign = async (campaignId: string, currentStatus: string) => {
        try {
            const token = getAuthToken();
            if (!token) {
                alert('❌ Please login to perform this action');
                return;
            }

            const API_BASE_URL = 'https://digital-api-46ss.onrender.com/api';

            const endpoint = currentStatus === 'active' ? 'pause' : 'resume';

            const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCampaigns(campaigns.map(c =>
                    c._id === campaignId ? data.data : c
                ));
                alert(`✅ Campaign ${endpoint}d successfully!`);
            } else {
                throw new Error('Failed to toggle campaign');
            }
        } catch (error) {
            console.error('Error toggling campaign:', error);
            alert('❌ Failed to update campaign. Please try again.');
        }
    };
    const handleViewCampaign = (campaignId: string) => {
        alert(`View campaign details: ${campaignId}\n\nThis will open a detailed campaign modal or page.`);
    };
    const handleEditCampaign = (campaignId: string) => {
        alert(`Edit campaign: ${campaignId}\n\nThis will open a campaign editor.`);
    };

    // CSV Upload Handler
    const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.name.endsWith('.csv')) {
            alert('❌ Invalid file type! Please upload a CSV file.');
            e.target.value = ''; // Reset input
            return;
        }

        // Validate file size (max 5MB)
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > MAX_FILE_SIZE) {
            alert('❌ File too large! Maximum file size is 5MB.');
            e.target.value = '';
            return;
        }

        setCsvFile(file);
        const reader = new FileReader();

        reader.onerror = () => {
            alert('❌ Error reading file. Please try again.');
            e.target.value = '';
        };

        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                const lines = text.split('\n').filter(line => line.trim());

                if (lines.length === 0) {
                    alert('❌ CSV file is empty!');
                    e.target.value = '';
                    return;
                }

                // Skip header row
                const dataLines = lines.slice(1);

                if (dataLines.length === 0) {
                    alert('❌ CSV contains only headers, no contact data!');
                    e.target.value = '';
                    return;
                }

                // Phone validation regex (basic international format)
                const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

                // Email validation regex
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                const parsedContacts: Array<{ name: string; phone: string; email: string }> = [];
                const errors: string[] = [];

                dataLines.forEach((line, index) => {
                    const [name, phone, email] = line.split(',').map(v => v.trim());

                    // Validate name
                    if (!name || name.length < 2) {
                        errors.push(`Line ${index + 2}: Invalid name "${name}"`);
                        return;
                    }

                    // Validate phone
                    if (!phone) {
                        errors.push(`Line ${index + 2}: Missing phone number`);
                        return;
                    }

                    if (!phoneRegex.test(phone)) {
                        errors.push(`Line ${index + 2}: Invalid phone format "${phone}"`);
                        return;
                    }

                    // Validate email if provided
                    if (email && !emailRegex.test(email)) {
                        errors.push(`Line ${index + 2}: Invalid email "${email}"`);
                        // Still allow contact, just skip email
                    }

                    parsedContacts.push({
                        name,
                        phone,
                        email: email && emailRegex.test(email) ? email : ''
                    });
                });

                // Check for duplicate phone numbers
                const phoneSet = new Set<string>();
                const duplicates: string[] = [];
                parsedContacts.forEach(contact => {
                    if (phoneSet.has(contact.phone)) {
                        duplicates.push(contact.phone);
                    }
                    phoneSet.add(contact.phone);
                });

                if (duplicates.length > 0) {
                    console.warn('⚠️ Duplicate phone numbers found:', duplicates);
                    if (!confirm(`⚠️ Found ${duplicates.length} duplicate phone numbers. Continue anyway?`)) {
                        e.target.value = '';
                        return;
                    }
                }

                // Show validation errors if any
                if (errors.length > 0) {
                    const errorMsg = `⚠️ Found ${errors.length} validation errors:\n\n${errors.slice(0, 10).join('\n')}${errors.length > 10 ? '\n\n...and ' + (errors.length - 10) + ' more' : ''}`;

                    if (!confirm(`${errorMsg}\n\nContinue with ${parsedContacts.length} valid contacts?`)) {
                        e.target.value = '';
                        return;
                    }
                }

                // Warn about large contact lists
                if (parsedContacts.length > 500) {
                    alert(`⚠️ WARNING: You're uploading ${parsedContacts.length} contacts!\n\nThis may:\n- Take a long time to process\n- Cost significant API credits\n- Overwhelm your system\n\nConsider splitting into smaller campaigns.`);

                    if (!confirm('Do you want to continue with this large campaign?')) {
                        e.target.value = '';
                        return;
                    }
                } else if (parsedContacts.length > 100) {
                    if (!confirm(`You're about to upload ${parsedContacts.length} contacts. This will make ${parsedContacts.length} calls. Continue?`)) {
                        e.target.value = '';
                        return;
                    }
                }

                setContacts(parsedContacts);
                setUploadStep('review');
                console.log(`✅ Parsed ${parsedContacts.length} valid contacts from CSV`);
                alert(`✅ Successfully loaded ${parsedContacts.length} contacts!`);

            } catch (error) {
                console.error('CSV parsing error:', error);
                alert('❌ Failed to parse CSV file. Please check the format and try again.');
                e.target.value = '';
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
    const handleCreateCampaign = async () => {
        // Validate required fields
        if (!campaignName || !targetAudience || contacts.length === 0) {
            alert('❌ Please fill in all required fields and add contacts!');
            return;
        }
        // Validate Agent ID is required for voice campaigns
        if (campaignType === 'voice' && (!agentId || agentId.trim() === '')) {
            alert('❌ AI Agent ID is required for voice campaigns!\n\nPlease enter your AI Voice Agent ID from your AI Voice Agent dashboard before creating a campaign.');
            return;
        }

        // Check authentication
        const token = getAuthToken();
        if (!token) {
            alert('❌ Please login to create a campaign');
            return;
        }

        setCreating(true);

        try {
            const API_BASE_URL = 'https://digital-api-46ss.onrender.com/api';

            const newCampaign = {
                name: campaignName,
                type: campaignType,
                targetAudience: targetAudience,
                totalContacts: contacts.length,
                status: 'draft',
                content: {
                    voiceAgentId: agentId || undefined
                },
                // Store contacts temporarily in metadata
                metadata: {
                    contacts: contacts
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
                setCsvFile(null);
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

            if (message.includes('Network') || message.includes('fetch')) {
                alert('❌ Network error! Please check:\n- Backend server is running\n- No firewall blocking the connection');
            } else if (message.includes('phone number')) {
                alert('❌ Phone Number Error!\n\nYou don\'t have an assigned phone number. Please contact support.');
            } else {
                alert(`❌ Failed to create campaign!\n\nError: ${message}\n\nPlease try again or contact support.`);
            }
        } finally {
            setCreating(false);
        }
    };

    // Launch Campaign Handler
    const handleLaunchCampaign = async (campaignId: string) => {
        // Find campaign to check if it has Agent ID
        const campaign = campaigns.find(c => c._id === campaignId);

        if (!campaign) {
            alert('❌ Campaign not found!');
            return;
        }

        // Check if campaign has Agent ID configured
        const campaignAgentId = campaign.content?.voiceAgentId || campaign.millisAI?.agentId;
        if (campaign.type === 'voice' && (!campaignAgentId || campaignAgentId.trim() === '')) {
            alert('❌ Cannot launch campaign!\n\nThis voice campaign is missing an AI Voice Agent ID. Please edit the campaign and add an Agent ID before launching.');
            return;
        }
        // Check authentication
        const token = getAuthToken();
        if (!token) {
            alert('❌ Please login to launch a campaign');
            return;
        }

        if (!confirm(`🚀 Are you sure you want to launch this campaign?\n\nThis will start making ${campaign.totalContacts} calls from your assigned phone number: ${userInfo?.assignedPhoneNumber || 'your number'}`)) {
            return;
        }
        if (!confirm(`🚀 Are you sure you want to launch this campaign?\n\nThis will start making ${campaign.totalContacts} calls from your assigned phone number: ${userInfo?.assignedPhoneNumber || 'your number'}`)) {
            return;
        }

        setLaunching(true);

        try {
            const API_BASE_URL = 'https://digital-api-46ss.onrender.com/api';

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

                // Update campaign in list
                setCampaigns(campaigns.map(c =>
                    c._id === campaignId
                        ? { ...c, status: 'active', ...data.data.campaign }
                        : c
                ));

                alert(data.data.message || `✅ Campaign launched successfully!\n\nMaking calls from: ${data.data.fromPhone || userInfo?.assignedPhoneNumber}`);
            } else {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.error || errorData?.message || response.statusText;

                if (response.status === 500 && errorMessage.includes('MILLIS_API_KEY')) {
                    throw new Error('API_KEY_MISSING');
                } else if (response.status === 500 && errorMessage.includes('phone number')) {
                    throw new Error('NO_PHONE_NUMBER');
                } else if (response.status === 403) {
                    throw new Error('UNAUTHORIZED');
                } else if (response.status === 400) {
                    throw new Error(`Invalid request: ${errorMessage}`);
                } else {
                    throw new Error(errorMessage);
                }
            }
        } catch (error) {
            console.error('Error launching campaign:', error);
            const message = error instanceof Error ? error.message : 'Unknown error';

            if (message === 'API_KEY_MISSING') {
                alert('❌ Cannot Launch Campaign!\n\nThe backend server is missing the MILLIS_API_KEY environment variable.\n\nPlease:\n1. Add MILLIS_API_KEY to your .env file\n2. Restart the backend server\n3. Try launching again');
            } else if (message === 'NO_PHONE_NUMBER') {
                alert('❌ Cannot Launch Campaign!\n\nYou do not have an assigned phone number.\n\nPlease contact support to get a phone number assigned to your account.');
            } else if (message === 'UNAUTHORIZED') {
                alert('❌ Cannot Launch Campaign!\n\nYou are not authorized to launch this campaign.\nYou can only launch campaigns you created.');
            } else if (message.includes('Network') || message.includes('fetch')) {
                alert('❌ Network error!\n\nCannot connect to backend server.\nPlease ensure the backend is running.');
            } else if (message.includes('Invalid request')) {
                alert(`❌ Invalid Campaign Data!\n\n${message}\n\nPlease check the campaign configuration.`);
            } else {
                alert(`❌ Failed to launch campaign!\n\nError: ${message}\n\nPlease try again or contact support.`);
            }
        } finally {
            setLaunching(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-orange-100">
                <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out w-60`}>
                    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                </div>
                <main className="w-full md:ml-60 p-4 sm:p-6 lg:p-8 pt-20 md:pt-8 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div>
                        </div>
                        <p className="text-2xl font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-2">Loading Campaigns...</p>
                        <p className="text-sm text-slate-600">Fetching your campaign data</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-orange-100">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-lg shadow-lg border-2 border-orange-200 hover:border-orange-400 transition-all"
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
                    <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-200 p-4 sm:p-6 lg:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-pink-100 border-2 border-orange-300 rounded-xl px-4 py-2 mb-3">
                                    <span className="text-2xl">🚀</span>
                                    <span className="text-sm font-bold text-orange-700">Advanced Campaign Manager</span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 via-orange-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                    Campaign Management
                                </h1>
                                <p className="text-slate-600 mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg">
                                    AI-powered campaigns • Multi-channel • Smart automation
                                </p>
                                {userInfo?.assignedPhoneNumber && (
                                    <p className="text-sm text-orange-600 font-semibold mt-2">
                                        📞 Your calling number: {userInfo.assignedPhoneNumber}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-bold shadow-lg hover:scale-105 transform"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create Campaign
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 shadow-lg">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-slate-600 font-semibold mb-1 text-sm">Total Campaigns</p>
                            <p className="text-3xl font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">{totalCampaigns}</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border-2 border-green-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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

                        <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-cyan-600 shadow-lg">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-slate-600 font-semibold mb-1 text-sm">Total Reach</p>
                            <p className="text-3xl font-black bg-gradient-to-r from-orange-600 to-cyan-600 bg-clip-text text-transparent">{totalContacts.toLocaleString()}</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border-2 border-sky-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-sky-500 to-red-600 shadow-lg">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-slate-600 font-semibold mb-1 text-sm">Avg Conversion</p>
                            <p className="text-3xl font-black bg-gradient-to-r from-sky-600 to-red-600 bg-clip-text text-transparent">{avgConversion.toFixed(1)}%</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-200 p-4 sm:p-6">
                        <div className="flex flex-col gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="🔍 Search campaigns..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-6 py-4 pl-12 bg-gradient-to-r from-orange-50 to-pink-50 border-2 border-orange-200 rounded-xl focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-lg text-slate-800 placeholder-slate-500 font-medium"
                                />
                                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {[
                                    { value: 'all', label: 'All Campaigns', color: 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200', active: 'bg-gradient-to-r from-orange-500 to-pink-600' },
                                    { value: 'active', label: 'Active', color: 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100', active: 'bg-gradient-to-r from-green-500 to-emerald-600' },
                                    { value: 'scheduled', label: 'Scheduled', color: 'bg-orange-50 text-orange-700 border-orange-300 hover:bg-orange-100', active: 'bg-gradient-to-r from-orange-500 to-cyan-600' },
                                    { value: 'paused', label: 'Paused', color: 'bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100', active: 'bg-gradient-to-r from-yellow-500 to-sky-600' },
                                    { value: 'completed', label: 'Completed', color: 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100', active: 'bg-gradient-to-r from-gray-500 to-slate-600' },
                                    { value: 'draft', label: 'Draft', color: 'bg-orange-50 text-orange-700 border-orange-300 hover:bg-orange-100', active: 'bg-gradient-to-r from-orange-500 to-orange-600' }
                                ].map(filter => (
                                    <button
                                        key={filter.value}
                                        onClick={() => setFilterStatus(filter.value as FilterStatus)}
                                        className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 text-sm border-2 ${filterStatus === filter.value
                                            ? filter.active + ' text-white shadow-lg transform scale-105'
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
                            <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-3xl shadow-2xl border-2 border-orange-300 p-16 text-center">
                                <div className="text-orange-500 mb-6">
                                    <svg className="mx-auto h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-3">
                                    {searchTerm || filterStatus !== 'all' ? 'No campaigns match your filters' : 'No campaigns yet'}
                                </h3>
                                <p className="text-gray-600 text-lg mb-6">
                                    {searchTerm || filterStatus !== 'all'
                                        ? 'Try adjusting your search or filters'
                                        : 'Create your first AI-powered bulk calling campaign to start generating leads!'
                                    }
                                </p>
                                {!searchTerm && filterStatus === 'all' && (
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-bold shadow-lg hover:scale-105 transform mx-auto"
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
                                    userPhone={userInfo?.assignedPhoneNumber}
                                />
                            ))
                        )}
                    </div>

                    <div className="text-center py-6">
                        <p className="text-gray-600 text-lg">
                            Showing <span className="font-bold text-orange-600">{filteredCampaigns.length}</span> of <span className="font-bold text-orange-600">{totalCampaigns}</span> campaigns
                        </p>
                    </div>

                </div>
            </main>

            {/* Create Campaign Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-pink-600 text-white p-6 rounded-t-3xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-black">🚀 Create New Campaign</h2>
                                    <p className="text-orange-100 mt-1">Launch AI-powered bulk calling campaign</p>
                                    {userInfo?.assignedPhoneNumber && (
                                        <p className="text-orange-100 text-sm mt-1">
                                            📞 Calls will be made from: {userInfo.assignedPhoneNumber}
                                        </p>
                                    )}
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
                                <div className="space-y-6 animate-fadeIn">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Campaign Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={campaignName}
                                            onChange={(e) => setCampaignName(e.target.value)}
                                            placeholder="e.g., Black Friday Sales Campaign"
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Campaign Type *
                                        </label>
                                        <div className="grid grid-cols-4 gap-3">
                                            {(['voice', 'sms', 'email', 'multi-channel'] as const).map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => setCampaignType(type)}
                                                    className={`p-4 rounded-xl border-2 font-semibold transition-all ${campaignType === type
                                                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                        : 'border-gray-300 hover:border-orange-300'
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
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Target Audience *
                                        </label>
                                        <input
                                            type="text"
                                            value={targetAudience}
                                            onChange={(e) => setTargetAudience(e.target.value)}
                                            placeholder="e.g., Premium Customers, New Leads"
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                                        />
                                    </div>

                                    {campaignType === 'voice' && (
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                AI Agent ID * (Required for Voice Campaigns)
                                            </label>
                                            <input
                                                type="text"
                                                value={agentId}
                                                onChange={(e) => setAgentId(e.target.value)}
                                                placeholder="e.g., -OXrv5021Ddq4NGGbG0h"
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Get this from your Millis AI Voice Agent dashboard</p>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => setUploadStep('upload')}
                                        disabled={!campaignName || !targetAudience}
                                        className="w-full py-4 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-xl font-bold hover:from-orange-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        Next: Upload Contacts →
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Upload Contacts */}
                            {uploadStep === 'upload' && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold mb-2">📋 Upload Contact List</h3>
                                        <p className="text-gray-600">Upload CSV or add contacts manually</p>
                                    </div>

                                    {/* CSV Upload */}
                                    <div className="border-4 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-orange-400 transition-all">
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
                                            className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all"
                                        >
                                            Choose CSV File
                                        </button>
                                        <p className="text-sm text-gray-500 mt-3">
                                            CSV format: name, phone, email (one contact per line)
                                        </p>
                                    </div>

                                    {/* OR Divider */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                        <span className="text-gray-500 font-semibold">OR</span>
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                    </div>

                                    {/* Manual Add */}
                                    <button
                                        onClick={handleAddManualContact}
                                        className="w-full py-4 border-2 border-orange-600 text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-all"
                                    >
                                        ➕ Add Contact Manually
                                    </button>

                                    {contacts.length > 0 && (
                                        <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
                                            <p className="text-green-700 font-bold">
                                                ✅ {contacts.length} contacts ready to go!
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setUploadStep('form')}
                                            className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            onClick={() => setUploadStep('review')}
                                            disabled={contacts.length === 0}
                                            className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-xl font-bold hover:from-orange-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            Review Contacts →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Review & Create */}
                            {uploadStep === 'review' && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold mb-2">✅ Review & Launch</h3>
                                        <p className="text-gray-600">Confirm details before creating campaign</p>
                                    </div>

                                    {/* Campaign Summary */}
                                    <div className="bg-gradient-to-br from-orange-50 to-pink-50 border-2 border-orange-300 rounded-2xl p-6 space-y-4">
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
                                                <p className="text-lg font-bold text-orange-600">{contacts.length}</p>
                                            </div>
                                            {agentId && (
                                                <div className="col-span-2">
                                                    <p className="text-sm text-gray-600 font-semibold">AI Agent ID</p>
                                                    <p className="text-lg font-bold text-gray-900">{agentId}</p>
                                                </div>
                                            )}
                                            {userInfo?.assignedPhoneNumber && (
                                                <div className="col-span-2">
                                                    <p className="text-sm text-gray-600 font-semibold">Calling From</p>
                                                    <p className="text-lg font-bold text-orange-600">📞 {userInfo.assignedPhoneNumber}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Contacts Preview */}
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-3">Contact List Preview</h4>
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
                                                    ... and {contacts.length - 20} more contacts
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setUploadStep('upload')}
                                            disabled={creating}
                                            className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            onClick={handleCreateCampaign}
                                            disabled={creating}
                                            className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
