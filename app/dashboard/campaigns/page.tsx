"use client"
import Sidebar from "@/components/Sidebar";
import SheetAutomationModal from "@/components/leads/SheetAutomationModal";
import { DASHBOARD_QUERY_KEYS } from "@/lib/dashboard-query";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit3, Eye, FileSpreadsheet, Loader2, Pause, Phone, Play, Plus, Save, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;

}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://digital-api-46ss.onrender.com/api';

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
    type: 'voice';
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
        conversionRate: number | null;
        avgSentiment: number | null;
        engagementScore: number | null;
        predictedROI: number | null;
    };
    operational?: {
        attempted: number;
        answered: number;
        failed: number;
        pending: number;
        answerRate: number | null;
        avgDurationSeconds: number | null;
        analyzedOutcomes: number;
        successfulOutcomes: number;
        sentimentSamples: number;
        positiveSentimentRate: number | null;
        analyticsAvailable: boolean;
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
    vozonAI?: {
        agentId?: string;
        phoneNumberId?: string;
        dailyLimit?: number;
        windowStart?: string;
        windowEnd?: string;
        concurrency?: number;
        maxAttempts?: number;
        retryGapSeconds?: number;
        firstMessageMode?: 'assistant-speaks-first' | 'model-generated' | 'user-speaks-first';
        detectVoicemail?: boolean;
        voicemailHandling?: boolean;
    };
    vozonCampaignId?: string;
    metadata?: {
        outboundProvider?: 'millis' | 'vozon';
        dailyLimit?: number;
        [key: string]: unknown;
    };
};

type FilterStatus = 'all' | 'active' | 'scheduled' | 'completed' | 'draft' | 'paused';

// Professional "clinical ledger" theme — muted, flat, high-legibility.
// Status tokens pair a soft surface with a saturated ink; the accent used
// for the row rail and progress bar is a FLAT color, never a gradient, and
// blue-600 is the single interface accent used everywhere else on the page.
const campaignStatusMeta = {
    active: {
        label: 'Active',
        badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
        dot: 'bg-emerald-500',
        accent: 'bg-emerald-500',
        row: 'hover:bg-slate-50'
    },
    scheduled: {
        label: 'Scheduled',
        badge: 'bg-sky-50 text-sky-700 ring-1 ring-sky-600/20',
        dot: 'bg-sky-500',
        accent: 'bg-sky-500',
        row: 'hover:bg-slate-50'
    },
    paused: {
        label: 'Paused',
        badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
        dot: 'bg-amber-500',
        accent: 'bg-amber-500',
        row: 'hover:bg-slate-50'
    },
    completed: {
        label: 'Completed',
        badge: 'bg-slate-100 text-slate-700 ring-1 ring-slate-600/15',
        dot: 'bg-slate-500',
        accent: 'bg-slate-500',
        row: 'hover:bg-slate-50'
    },
    draft: {
        label: 'Draft',
        badge: 'bg-slate-50 text-slate-600 ring-1 ring-slate-600/15',
        dot: 'bg-slate-400',
        accent: 'bg-slate-400',
        row: 'hover:bg-slate-50'
    }
} as const;

const formatPercent = (value: number | null | undefined, digits = 1) =>
    typeof value === 'number' && Number.isFinite(value) ? `${value.toFixed(digits)}%` : 'Not available';

const formatDuration = (seconds: number | null | undefined) => {
    if (typeof seconds !== 'number' || !Number.isFinite(seconds)) return 'Not available';
    const rounded = Math.round(seconds);
    return rounded < 60 ? `${rounded}s` : `${Math.floor(rounded / 60)}m ${rounded % 60}s`;
};

const formatRetryGap = (seconds: number | null | undefined) => {
    if (typeof seconds !== 'number' || !Number.isFinite(seconds)) return 'Not set';
    if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
    if (seconds % 86400 === 0) return `${Math.round(seconds / 86400)} day${seconds === 86400 ? '' : 's'}`;
    return `${Math.round(seconds / 3600)} hour${seconds === 3600 ? '' : 's'}`;
};

type FirstMessageMode = 'assistant-speaks-first' | 'model-generated' | 'user-speaks-first';

// Icons
const MenuIcon = () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);
function CampaignCard({ campaign, onView, onEdit, onToggle, onLaunch, isLaunching, isToggling, userPhone }: {
campaign: Campaign;
onView: () => void;
onEdit: () => void;
onToggle: () => void;
onLaunch: () => void;
isLaunching ?: boolean;
isToggling ?: boolean;
userPhone ?: string;
}) {
    const statusMeta = campaignStatusMeta[campaign.status] || campaignStatusMeta.draft;
    const attempted = campaign.operational?.attempted ?? campaign.contacted;
    const answered = campaign.operational?.answered ?? 0;
    const pending = campaign.operational?.pending ?? campaign.pending;
    const progress = campaign.totalContacts > 0
        ? Math.min(100, Math.round((attempted / campaign.totalContacts) * 100))
        : 0;

    return (
        <article className={`relative overflow-hidden px-5 py-5 transition-colors sm:px-6 ${statusMeta.row}`}>
            <div className={`absolute inset-y-0 left-0 w-1 ${statusMeta.accent}`} />
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-[minmax(260px,1.6fr)_minmax(180px,1fr)_90px_90px_auto] xl:items-center">
                <div className="flex min-w-0 items-start gap-3 sm:col-span-2 xl:col-span-1">
                    <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                        <Phone className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                        <button onClick={onView} className="block max-w-full truncate text-left text-base font-bold text-slate-950 transition-colors hover:text-slate-700">{campaign.name}</button>
                        <p className="mt-1 truncate text-sm text-slate-500">{campaign.targetAudience || 'General audience'}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-wider ${statusMeta.badge}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dot}`} />
                                {campaign.status.toUpperCase()}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">Vozon</span>
                            {userPhone && <span className="hidden text-xs text-slate-400 2xl:inline">• {userPhone}</span>}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-500">{progress}% complete</span>
                        <span className="font-semibold text-slate-700">{attempted.toLocaleString()}/{campaign.totalContacts.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full transition-all ${statusMeta.accent}`} style={{ width: `${progress}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Answer rate <strong className="text-slate-700">{formatPercent(campaign.operational?.answerRate)}</strong></p>
                </div>

                <div><p className="text-xs font-medium text-slate-500">Answered</p><p className="mt-1 text-lg font-bold text-emerald-700">{answered.toLocaleString()}</p></div>
                <div><p className="text-xs font-medium text-slate-500">Pending</p><p className="mt-1 text-lg font-bold text-slate-900">{pending.toLocaleString()}</p></div>

                <div className="flex flex-wrap items-center gap-2 sm:col-span-2 xl:col-span-1 xl:justify-end">
                {campaign.status === 'draft' && (
                    <button onClick={onLaunch} disabled={isLaunching} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                        {isLaunching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />} {isLaunching ? 'Launching' : 'Launch'}
                    </button>
                )}
                {campaign.status === 'active' || campaign.status === 'paused' ? (
                    <button onClick={onToggle} disabled={isToggling} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${campaign.status === 'active' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'} disabled:opacity-60`}>
                        {isToggling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : campaign.status === 'active' ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        {isToggling ? 'Updating' : campaign.status === 'active' ? 'Pause' : 'Resume'}
                    </button>
                ) : null}
                    <button onClick={onView} aria-label={`View ${campaign.name}`} title="View details" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950">
                        <Eye className="h-4 w-4" />
                    </button>
                    <button onClick={onEdit} aria-label={`Edit ${campaign.name}`} title="Edit campaign" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950">
                        <Edit3 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </article>
    );
}

export default function CampaignsPage() {
    const queryClient = useQueryClient();
    const cachedCampaigns = queryClient.getQueryData<Campaign[]>(DASHBOARD_QUERY_KEYS.campaigns);
    const [campaigns, setCampaigns] = useState<Campaign[]>(() => cachedCampaigns || []);
    const [loading, setLoading] = useState(() => !cachedCampaigns);
    const [creating, setCreating] = useState(false);
    const [launchingCampaignId, setLaunchingCampaignId] = useState<string | null>(null);
    const [togglingCampaignId, setTogglingCampaignId] = useState<string | null>(null);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [editName, setEditName] = useState('');
    const [editTargetAudience, setEditTargetAudience] = useState('');
    const [savingEdit, setSavingEdit] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [userInfo, setUserInfo] = useState<{ email: string, assignedPhoneNumber: string, userId: string } | null>(null);

    // Create Voice Campaign Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSheetAutomation, setShowSheetAutomation] = useState(false);
    const [campaignName, setCampaignName] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [agentId, setAgentId] = useState('');
    const [phoneNumberId, setPhoneNumberId] = useState('');
    const [outboundProvider, setOutboundProvider] = useState<'millis' | 'vozon'>('vozon');
    const [dailyLimit, setDailyLimit] = useState(250);
    const [windowStart, setWindowStart] = useState('09:00');
    const [windowEnd, setWindowEnd] = useState('18:00');
    const [concurrency, setConcurrency] = useState(3);
    const [retryAttempts, setRetryAttempts] = useState(1);
    const [retryDelayHours, setRetryDelayHours] = useState(24);
    const [firstMessageMode, setFirstMessageMode] = useState<FirstMessageMode>('assistant-speaks-first');
    const [detectVoicemail, setDetectVoicemail] = useState(false);
    const [contacts, setContacts] = useState<Array<{ name: string, phone: string, email?: string }>>([]);
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [uploadStep, setUploadStep] = useState<'form' | 'upload' | 'review'>('form');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const updateCampaigns = useCallback((updater: (current: Campaign[]) => Campaign[]) => {
        setCampaigns((current) => {
            const next = updater(current);
            queryClient.setQueryData(DASHBOARD_QUERY_KEYS.campaigns, next);
            return next;
        });
    }, [queryClient]);

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
        let mounted = true;
        const fetchCampaigns = async (silent = false) => {
            try {
                if (!silent) setLoading(true);
                const prefetchedCampaigns = queryClient.getQueryData<Campaign[]>(DASHBOARD_QUERY_KEYS.campaigns);
                if (!silent && prefetchedCampaigns) {
                    updateCampaigns(() => prefetchedCampaigns);
                    setLoading(false);
                    return;
                }
                const token = getAuthToken();

                if (!token) {
                    console.warn('⚠️ No authentication token found');
                    if (mounted) updateCampaigns(() => []);
                    if (mounted && !silent) setLoading(false);
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/campaigns?type=voice`, {
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
                    if (mounted && !silent) updateCampaigns(() => []);
                    return;
                }

                const data = await response.json();
                const fetchedCampaigns = data.data?.campaigns || data.campaigns || [];
                if (mounted) updateCampaigns(() => fetchedCampaigns);

                console.log(`✅ Fetched ${fetchedCampaigns.length} campaigns from backend`);

            } catch (error) {
                console.error('Error fetching campaigns:', error);
                if (mounted && !silent) updateCampaigns(() => []);
            } finally {
                if (mounted && !silent) setLoading(false);
            }
        };

        void fetchCampaigns();
        const refreshTimer = window.setInterval(() => void fetchCampaigns(true), 60_000);
        return () => {
            mounted = false;
            window.clearInterval(refreshTimer);
        };
    }, [queryClient, updateCampaigns]);

    const filteredCampaigns = useMemo(() => {
        let filtered = campaigns.filter((campaign) => campaign.type === 'voice');

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

        return filtered;
    }, [campaigns, filterStatus, searchTerm]);

    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const pausedCampaigns = campaigns.filter(c => c.status === 'paused').length;
    const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;
    const draftCampaigns = campaigns.filter(c => c.status === 'draft').length;
    const totalContacts = campaigns.reduce((sum, c) => sum + c.totalContacts, 0);
    const averageProgress = campaigns.length
        ? Math.round(campaigns.reduce((sum, campaign) => {
            const attempted = campaign.operational?.attempted ?? campaign.contacted ?? 0;
            return sum + (campaign.totalContacts ? Math.min(100, (attempted / campaign.totalContacts) * 100) : 0);
        }, 0) / campaigns.length)
        : 0;

    // Handle campaign actions
    const handleToggleCampaign = async (campaignId: string, currentStatus: string) => {
        if (togglingCampaignId) return;
        try {
            const token = getAuthToken();
            if (!token) {
                alert('❌ Please login to perform this action');
                return;
            }

            const endpoint = currentStatus === 'active' ? 'pause' : 'resume';
            setTogglingCampaignId(campaignId);

            const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                updateCampaigns(current => current.map(c =>
                    c._id === campaignId ? data.data : c
                ));
                alert(`✅ Campaign ${endpoint}d successfully!`);
            } else {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || errorData?.message || `Failed to ${endpoint} campaign`);
            }
        } catch (error) {
            console.error('Error toggling campaign:', error);
            alert(`❌ ${error instanceof Error ? error.message : 'Failed to update campaign. Please try again.'}`);
        } finally {
            setTogglingCampaignId(null);
        }
    };
    const handleViewCampaign = (campaignId: string) => {
        const campaign = campaigns.find(item => item._id === campaignId);
        if (campaign) setSelectedCampaign(campaign);
    };
    const handleEditCampaign = (campaignId: string) => {
        const campaign = campaigns.find(item => item._id === campaignId);
        if (!campaign) return;
        setEditingCampaign(campaign);
        setEditName(campaign.name);
        setEditTargetAudience(campaign.targetAudience);
    };

    const handleSaveCampaign = async () => {
        if (!editingCampaign || !editName.trim() || !editTargetAudience.trim()) return;
        const token = getAuthToken();
        if (!token) {
            alert('❌ Please login to edit this campaign');
            return;
        }
        setSavingEdit(true);
        try {
            const response = await fetch(`${API_BASE_URL}/campaigns/${editingCampaign._id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editName.trim(), targetAudience: editTargetAudience.trim() })
            });
            const data = await response.json().catch(() => null);
            if (!response.ok) throw new Error(data?.error || data?.message || 'Failed to update campaign');
            updateCampaigns(current => current.map(item => item._id === editingCampaign._id ? data.data : item));
            setSelectedCampaign(current => current?._id === editingCampaign._id ? data.data : current);
            setEditingCampaign(null);
            alert('✅ Campaign updated successfully!');
        } catch (error) {
            alert(`❌ ${error instanceof Error ? error.message : 'Failed to update campaign'}`);
        } finally {
            setSavingEdit(false);
        }
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

    // Create Voice Campaign Handler
    const handleCreateCampaign = async () => {
        // Validate required fields
        if (!campaignName || !targetAudience || contacts.length === 0) {
            alert('❌ Please fill in all required fields and add contacts!');
            return;
        }
        // Validate Agent ID is required for voice campaigns
        if (outboundProvider === 'millis' && (!agentId || agentId.trim() === '')) {
            alert('❌ AI Agent ID is required for voice campaigns!\n\nPlease enter your AI Voice Agent ID from your AI Voice Agent dashboard before creating a campaign.');
            return;
        }
        if (outboundProvider === 'vozon' && (!Number.isInteger(dailyLimit) || dailyLimit < 1 || dailyLimit > 100000)) {
            alert('❌ Daily limit must be a whole number between 1 and 100000.');
            return;
        }
        if (outboundProvider === 'vozon' && (!/^\d{2}:\d{2}$/.test(windowStart) || !/^\d{2}:\d{2}$/.test(windowEnd))) {
            alert('❌ Calling window must use HH:MM time format.');
            return;
        }
        if (outboundProvider === 'vozon' && (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 100)) {
            alert('❌ Concurrent calls must be between 1 and 100.');
            return;
        }
        if (outboundProvider === 'vozon' && (!Number.isInteger(retryAttempts) || retryAttempts < 1 || retryAttempts > 10)) {
            alert('❌ Retry attempts must be between 1 and 10. Use 1 for no retry.');
            return;
        }
        if (outboundProvider === 'vozon' && (!Number.isFinite(retryDelayHours) || retryDelayHours < (1 / 60) || retryDelayHours > 720)) {
            alert('❌ Retry delay must be between 1 minute and 30 days.');
            return;
        }
        if (outboundProvider === 'vozon' && (!agentId.trim() || !phoneNumberId.trim())) {
            alert('❌ Vozon Agent ID and Phone Number ID are required.');
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
            const newCampaign = {
                name: campaignName,
                type: 'voice',
                targetAudience: targetAudience,
                totalContacts: contacts.length,
                status: 'draft',
                content: {
                    voiceAgentId: outboundProvider === 'millis' ? agentId || undefined : undefined
                },
                vozonAI: outboundProvider === 'vozon' ? {
                    agentId: agentId.trim(),
                    phoneNumberId: phoneNumberId.trim(),
                    dailyLimit,
                    windowStart,
                    windowEnd,
                    concurrency,
                    maxAttempts: retryAttempts,
                    retryGapSeconds: Math.round(retryDelayHours * 3600),
                    firstMessageMode,
                    detectVoicemail,
                    voicemailHandling: detectVoicemail
                } : undefined,
                // Store contacts temporarily in metadata
                metadata: {
                    contacts: contacts,
                    outboundProvider,
                    dailyLimit: outboundProvider === 'vozon' ? dailyLimit : undefined,
                    windowStart: outboundProvider === 'vozon' ? windowStart : undefined,
                    windowEnd: outboundProvider === 'vozon' ? windowEnd : undefined,
                    concurrency: outboundProvider === 'vozon' ? concurrency : undefined,
                    maxAttempts: outboundProvider === 'vozon' ? retryAttempts : undefined,
                    retryGapSeconds: outboundProvider === 'vozon' ? Math.round(retryDelayHours * 3600) : undefined,
                    firstMessageMode: outboundProvider === 'vozon' ? firstMessageMode : undefined,
                    detectVoicemail: outboundProvider === 'vozon' ? detectVoicemail : undefined,
                    voicemailHandling: outboundProvider === 'vozon' ? detectVoicemail : undefined
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
                updateCampaigns(current => [data.data.campaign, ...current]);

                // Reset form
                setShowCreateModal(false);
                setCampaignName('');
                setTargetAudience('');
                setAgentId('');
                setPhoneNumberId('');
                setOutboundProvider('vozon');
                setDailyLimit(250);
                setWindowStart('09:00');
                setWindowEnd('18:00');
                setConcurrency(3);
                setRetryAttempts(1);
                setRetryDelayHours(24);
                setFirstMessageMode('assistant-speaks-first');
                setDetectVoicemail(false);
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
        const provider = campaign.metadata?.outboundProvider || 'vozon';
        const campaignAgentId = campaign.content?.voiceAgentId || campaign.millisAI?.agentId;
        if (provider === 'millis' && (!campaignAgentId || campaignAgentId.trim() === '')) {
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

        if (launchingCampaignId) return;
        setLaunchingCampaignId(campaignId);

        try {
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
                updateCampaigns(current => current.map(c =>
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
            setLaunchingCampaignId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-white">
                <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out w-60`}>
                    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                </div>
                <main className="w-full md:ml-60 p-4 sm:p-6 lg:p-8 pt-20 md:pt-8 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-600" />
                        <p className="text-lg font-semibold text-slate-900">Loading campaigns</p>
                        <p className="mt-1 text-sm text-slate-500">Fetching your campaign data</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-lg shadow-lg border border-slate-200 hover:border-blue-300 transition-all"
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
                <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">

                    {/* Header */}
                    <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                                    <Sparkles className="h-4 w-4" />
                                    Campaign management
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Voice Campaigns</h1>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                                    Create, launch, pause and monitor outbound Vozon campaigns with calling windows, retry policy and agent behavior controls.
                                </p>
                                {userInfo?.assignedPhoneNumber && (
                                    <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                                        <Phone className="h-3.5 w-3.5" /> Calling from {userInfo.assignedPhoneNumber}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <button
                                    onClick={() => setShowSheetAutomation(true)}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-100"
                                >
                                    <FileSpreadsheet className="h-4 w-4" />
                                    Connect Google Sheet
                                </button>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4" />
                                    New campaign
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Campaigns</p>
                                <p className="mt-2 text-3xl font-bold text-slate-950">{totalCampaigns}</p>
                                <p className="mt-1 text-xs text-slate-500">Total created</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Active</p>
                                <p className="mt-2 text-3xl font-bold text-emerald-700">{activeCampaigns}</p>
                                <p className="mt-1 text-xs text-slate-500">Running now</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Paused</p>
                                <p className="mt-2 text-3xl font-bold text-amber-700">{pausedCampaigns}</p>
                                <p className="mt-1 text-xs text-slate-500">Temporarily stopped</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Reach</p>
                                <p className="mt-2 text-3xl font-bold text-slate-950">{totalContacts.toLocaleString()}</p>
                                <p className="mt-1 text-xs text-slate-500">Total contacts</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Avg progress</p>
                                <p className="mt-2 text-3xl font-bold text-slate-950">{averageProgress}%</p>
                                <p className="mt-1 text-xs text-slate-500">{completedCampaigns} complete · {draftCampaigns} draft</p>
                            </div>
                        </div>
                    </header>

                    {/* Filters */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="relative lg:max-w-md lg:flex-1">
                                <input
                                    type="text"
                                    placeholder="Search campaigns by name or audience..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                                <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {[
                                    { value: 'all', label: 'All campaigns' },
                                    { value: 'active', label: 'Active' },
                                    { value: 'scheduled', label: 'Scheduled' },
                                    { value: 'paused', label: 'Paused' },
                                    { value: 'completed', label: 'Completed' },
                                    { value: 'draft', label: 'Draft' }
                                ].map(filter => (
                                    <button
                                        key={filter.value}
                                        onClick={() => setFilterStatus(filter.value as FilterStatus)}
                                        className={`rounded-lg border px-3.5 py-2 text-sm font-semibold transition-colors ${filterStatus === filter.value
                                            ? 'border-blue-600 bg-blue-600 text-white'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Campaign list */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100">
                        {filteredCampaigns.length > 0 && (
                            <div className="hidden grid-cols-[minmax(260px,1.6fr)_minmax(180px,1fr)_90px_90px_auto] gap-5 bg-slate-50 px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 xl:grid">
                                <span>Campaign</span>
                                <span>Progress</span>
                                <span>Answered</span>
                                <span>Pending</span>
                                <span className="text-right">Actions</span>
                            </div>
                        )}
                        {filteredCampaigns.length === 0 ? (
                            <div className="p-10 text-center sm:p-14">
                                <div className="mb-4 text-slate-400">
                                    <svg className="mx-auto h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-slate-950">
                                    {searchTerm || filterStatus !== 'all' ? 'No campaigns match your filters' : 'No campaigns yet'}
                                </h3>
                                <p className="mx-auto mb-6 max-w-lg text-sm text-slate-500">
                                    {searchTerm || filterStatus !== 'all'
                                        ? 'Try adjusting your search or filters'
                                        : 'Create your first outbound voice campaign to start contacting leads.'
                                    }
                                </p>
                                {!searchTerm && filterStatus === 'all' && (
                                    <div className="flex flex-col justify-center gap-2 sm:flex-row">
                                        <button
                                            onClick={() => setShowSheetAutomation(true)}
                                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm transition-colors hover:bg-emerald-100"
                                        >
                                            <FileSpreadsheet className="h-4 w-4" />
                                            Connect Google Sheet
                                        </button>
                                        <button
                                            onClick={() => setShowCreateModal(true)}
                                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                                        >
                                            <Plus className="h-4 w-4" />
                                            New campaign
                                        </button>
                                    </div>
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
                                    isLaunching={launchingCampaignId === campaign._id}
                                    isToggling={togglingCampaignId === campaign._id}
                                    userPhone={userInfo?.assignedPhoneNumber}
                                />
                            ))
                        )}
                    </div>

                    <div className="py-2 text-center">
                        <p className="text-sm text-slate-500">
                            Showing <span className="font-semibold text-slate-800">{filteredCampaigns.length}</span> of <span className="font-semibold text-slate-800">{totalCampaigns}</span> campaigns
                        </p>
                    </div>

                </div>
            </main>

            {/* Campaign details modal */}
            {selectedCampaign && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm" onMouseDown={() => setSelectedCampaign(null)}>
                    <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
                        <div className="flex items-start justify-between bg-slate-950 p-6 text-white sm:p-8">
                            <div>
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-200"><Eye className="h-3.5 w-3.5" /> Campaign details</div>
                                <h2 className="text-2xl font-semibold sm:text-3xl">{selectedCampaign.name}</h2>
                                <p className="mt-2 text-sm text-slate-300">{selectedCampaign.targetAudience}</p>
                            </div>
                            <button type="button" onClick={() => setSelectedCampaign(null)} className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white" aria-label="Close campaign details"><X className="h-5 w-5" /></button>
                        </div>
                        <div className="max-h-[70vh] space-y-6 overflow-y-auto p-6 sm:p-8">
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {[
                                    ['Status', selectedCampaign.status],
                                    ['Provider', 'Vozon'],
                                    ['Contacts', selectedCampaign.totalContacts],
                                    ['Answered', selectedCampaign.operational?.answered ?? 0]
                                ].map(([label, value]) => <div key={String(label)} className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 break-words font-extrabold capitalize text-slate-950">{String(value)}</p></div>)}
                            </div>
                            <div className="rounded-2xl border border-slate-200 p-5">
                                <h3 className="font-extrabold text-slate-950">Performance</h3>
                                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    <div><p className="text-xs text-slate-500">Attempted</p><p className="text-lg font-bold">{selectedCampaign.operational?.attempted ?? selectedCampaign.contacted}</p></div>
                                    <div><p className="text-xs text-slate-500">Answer rate</p><p className="text-lg font-bold">{formatPercent(selectedCampaign.operational?.answerRate)}</p></div>
                                    <div><p className="text-xs text-slate-500">Avg duration</p><p className="text-lg font-bold">{formatDuration(selectedCampaign.operational?.avgDurationSeconds)}</p></div>
                                    <div><p className="text-xs text-slate-500">Goal conversion</p><p className="text-lg font-bold text-emerald-600">{formatPercent(selectedCampaign.performance?.conversionRate)}</p></div>
                                </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-slate-200 p-4"><p className="text-xs font-semibold text-slate-500">Agent ID</p><p className="mt-1 break-all text-sm font-bold text-slate-800">{selectedCampaign.vozonAI?.agentId || selectedCampaign.content?.voiceAgentId || selectedCampaign.millisAI?.agentId || 'Not configured'}</p></div>
                                <div className="rounded-2xl border border-slate-200 p-4"><p className="text-xs font-semibold text-slate-500">Provider campaign ID</p><p className="mt-1 break-all text-sm font-bold text-slate-800">{selectedCampaign.vozonCampaignId || 'Not available'}</p></div>
                                <div className="rounded-2xl border border-slate-200 p-4">
                                    <p className="text-xs font-semibold text-slate-500">Calling Window</p>
                                    <p className="mt-1 text-sm font-bold text-slate-800">{selectedCampaign.vozonAI?.windowStart || '09:00'} - {selectedCampaign.vozonAI?.windowEnd || '18:00'}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 p-4">
                                    <p className="text-xs font-semibold text-slate-500">Volume</p>
                                    <p className="mt-1 text-sm font-bold text-slate-800">{selectedCampaign.vozonAI?.dailyLimit || 250}/day · {selectedCampaign.vozonAI?.concurrency || 3} concurrent</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 p-4">
                                    <p className="text-xs font-semibold text-slate-500">Retry Policy</p>
                                    <p className="mt-1 text-sm font-bold text-slate-800">
                                        {(selectedCampaign.vozonAI?.maxAttempts || 1) <= 1
                                            ? 'No retry'
                                            : `${selectedCampaign.vozonAI?.maxAttempts || 1} attempts, after ${formatRetryGap(selectedCampaign.vozonAI?.retryGapSeconds || 86400)}`}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 p-4">
                                    <p className="text-xs font-semibold text-slate-500">Opening Mode</p>
                                    <p className="mt-1 text-sm font-bold text-slate-800">
                                        {selectedCampaign.vozonAI?.firstMessageMode === 'user-speaks-first'
                                            ? 'Customer speaks first'
                                            : selectedCampaign.vozonAI?.firstMessageMode === 'model-generated'
                                                ? 'AI generates opening'
                                                : 'Agent speaks first'}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 p-4">
                                    <p className="text-xs font-semibold text-slate-500">Voicemail Detection</p>
                                    <p className={`mt-1 text-sm font-bold ${selectedCampaign.vozonAI?.detectVoicemail ? 'text-amber-700' : 'text-emerald-700'}`}>
                                        {selectedCampaign.vozonAI?.detectVoicemail ? 'Enabled' : 'Disabled'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => { handleEditCampaign(selectedCampaign._id); setSelectedCampaign(null); }} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-blue-600"><Edit3 className="h-4 w-4" /> Edit campaign</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit campaign modal */}
            {editingCampaign && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm" onMouseDown={() => !savingEdit && setEditingCampaign(null)}>
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl sm:p-8" onMouseDown={(event) => event.stopPropagation()}>
                        <div className="flex items-start justify-between">
                            <div><p className="text-sm font-semibold text-blue-600">Edit campaign</p><h2 className="mt-1 text-2xl font-semibold text-slate-950">Campaign information</h2></div>
                            <button type="button" disabled={savingEdit} onClick={() => setEditingCampaign(null)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" aria-label="Close campaign editor"><X className="h-5 w-5" /></button>
                        </div>
                        <div className="mt-7 space-y-5">
                            <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Campaign name</span><input value={editName} onChange={(event) => setEditName(event.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label>
                            <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Target audience</span><input value={editTargetAudience} onChange={(event) => setEditTargetAudience(event.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label>
                            <p className="rounded-xl bg-sky-50 p-3 text-xs leading-5 text-sky-700">Provider, agent and phone-number settings stay locked after creation so the linked Vozon campaign remains consistent.</p>
                        </div>
                        <div className="mt-7 flex gap-3">
                            <button type="button" disabled={savingEdit} onClick={() => setEditingCampaign(null)} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">Cancel</button>
                            <button type="button" disabled={savingEdit || !editName.trim() || !editTargetAudience.trim()} onClick={handleSaveCampaign} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50">{savingEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{savingEdit ? 'Saving...' : 'Save changes'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Docked campaign studio */}
            {showCreateModal && (
                <div
                    className="fixed inset-0 z-50 bg-slate-950/35 backdrop-blur-[2px]"
                    onMouseDown={() => {
                        setShowCreateModal(false);
                        setUploadStep('form');
                    }}
                >
                    <aside
                        className="absolute inset-y-0 right-0 flex w-full max-w-4xl flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl sm:rounded-l-3xl"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        {/* Builder Header */}
                        <div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            setUploadStep('form');
                                        }}
                                        className="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to campaigns
                                    </button>
                                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                                        <Sparkles className="h-3.5 w-3.5" />
                                        Campaign setup
                                    </div>
                                    <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">Build outbound campaign</h2>
                                    <p className="mt-1 max-w-2xl text-sm text-slate-500">Configure campaign details, Vozon settings, contacts, retry policy and call behavior.</p>
                                    {userInfo?.assignedPhoneNumber && (
                                        <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
                                            <Phone className="h-3.5 w-3.5" /> Calling from {userInfo.assignedPhoneNumber}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setUploadStep('form');
                                        setCampaignName('');
                                        setTargetAudience('');
                                        setContacts([]);
                                        setCsvFile(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                        setAgentId('');
                                        setPhoneNumberId('');
                                        setOutboundProvider('vozon');
                                        setDailyLimit(250);
                                        setWindowStart('09:00');
                                        setWindowEnd('18:00');
                                        setConcurrency(3);
                                        setRetryAttempts(1);
                                        setRetryDelayHours(24);
                                        setFirstMessageMode('assistant-speaks-first');
                                        setDetectVoicemail(false);
                                    }}
                                    className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                    aria-label="Close campaign builder"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Builder Body */}
                        <div className="flex-1 overflow-y-auto bg-slate-50 px-5 py-6 sm:px-6">
                            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

                            {/* Step 1: Campaign Details */}
                            {uploadStep === 'form' && (
                                <div className="space-y-5 animate-fadeIn">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Campaign builder</p>
                                        <h3 className="mt-2 text-xl font-bold text-slate-950">Create a controlled outbound campaign</h3>
                                        <p className="mt-1 text-sm text-slate-500">Set who to call, when to call, retry rules, and how the agent should start the conversation.</p>
                                    </div>

                                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <div className="mb-4 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-base font-bold text-slate-950">Campaign basics</h3>
                                                <p className="text-xs text-slate-500">Name and audience shown in reporting.</p>
                                            </div>
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Step 1</span>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <label className="block">
                                                <span className="mb-2 block text-sm font-bold text-gray-700">Campaign Name *</span>
                                                <input
                                                    type="text"
                                                    value={campaignName}
                                                    onChange={(e) => setCampaignName(e.target.value)}
                                                    placeholder="e.g., August appointment follow-up"
                                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                                />
                                            </label>
                                            <label className="block">
                                                <span className="mb-2 block text-sm font-bold text-gray-700">Target Audience *</span>
                                                <input
                                                    type="text"
                                                    value={targetAudience}
                                                    onChange={(e) => setTargetAudience(e.target.value)}
                                                    placeholder="e.g., New leads, missed patients"
                                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                                />
                                            </label>
                                        </div>
                                    </section>

                                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <div className="mb-4">
                                            <h3 className="text-base font-bold text-slate-950">Vozon setup</h3>
                                            <p className="text-xs text-slate-500">Connect the campaign with the Vozon agent and outbound number.</p>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-sm font-bold text-gray-700">Calling Provider *</label>
                                                <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                                                    <span className="h-2 w-2 rounded-full bg-emerald-600" />
                                                    Vozon connected campaign
                                                </div>
                                            </div>
                                            <label className="block">
                                                <span className="mb-2 block text-sm font-bold text-gray-700">Vozon Agent ID *</span>
                                                <input
                                                    type="text"
                                                    value={agentId}
                                                    onChange={(e) => setAgentId(e.target.value)}
                                                    placeholder="Enter Vozon agent ID"
                                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                                />
                                            </label>
                                            <label className="block md:col-span-2">
                                                <span className="mb-2 block text-sm font-bold text-gray-700">Vozon Phone Number or Phone Number ID *</span>
                                                <input
                                                    type="text"
                                                    value={phoneNumberId}
                                                    onChange={(e) => setPhoneNumberId(e.target.value)}
                                                    placeholder="e.g., +919876543210 or Vozon phone-number ID"
                                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                                />
                                                <p className="mt-1 text-xs text-gray-500">If you enter a phone number, Digitalbot will resolve its internal Vozon ID automatically.</p>
                                            </label>
                                        </div>
                                    </section>

                                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <div className="mb-4">
                                            <h3 className="text-base font-bold text-slate-950">Schedule & volume</h3>
                                            <p className="text-xs text-slate-500">Control calling hours and how many calls Vozon can run.</p>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-4">
                                            <label className="block">
                                                <span className="mb-2 block text-sm font-bold text-gray-700">Daily call limit *</span>
                                                <input type="number" min={1} max={100000} step={1} value={dailyLimit} onChange={(e) => setDailyLimit(Number(e.target.value))} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                                            </label>
                                            <label className="block">
                                                <span className="mb-2 block text-sm font-bold text-gray-700">Concurrent calls *</span>
                                                <input type="number" min={1} max={100} step={1} value={concurrency} onChange={(e) => setConcurrency(Number(e.target.value))} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                                            </label>
                                            <label className="block">
                                                <span className="mb-2 block text-sm font-bold text-gray-700">Start time *</span>
                                                <input type="time" value={windowStart} onChange={(e) => setWindowStart(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                                            </label>
                                            <label className="block">
                                                <span className="mb-2 block text-sm font-bold text-gray-700">End time *</span>
                                                <input type="time" value={windowEnd} onChange={(e) => setWindowEnd(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                                            </label>
                                        </div>
                                    </section>

                                    <section className="grid gap-5 lg:grid-cols-2">
                                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                            <h3 className="text-base font-bold text-slate-950">Retry policy</h3>
                                            <p className="mt-1 text-xs text-slate-500">Decide if missed contacts should be called again.</p>
                                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                                <label className="block">
                                                    <span className="mb-2 block text-sm font-bold text-gray-700">Total attempts *</span>
                                                    <input type="number" min={1} max={10} step={1} value={retryAttempts} onChange={(e) => setRetryAttempts(Number(e.target.value))} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                                                    <span className="mt-1 block text-xs text-gray-500">1 means no retry.</span>
                                                </label>
                                                <label className="block">
                                                    <span className="mb-2 block text-sm font-bold text-gray-700">Retry after hours *</span>
                                                    <input type="number" min={0.02} max={720} step={0.25} value={retryDelayHours} onChange={(e) => setRetryDelayHours(Number(e.target.value))} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                                                    <span className="mt-1 block text-xs text-gray-500">Example: 24 = next day.</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                            <h3 className="text-base font-bold text-slate-950">Call behavior</h3>
                                            <p className="mt-1 text-xs text-slate-500">Choose how the agent starts and handles voicemail.</p>
                                            <label className="mt-4 block">
                                                <span className="mb-2 block text-sm font-bold text-gray-700">Opening Mode *</span>
                                                <select value={firstMessageMode} onChange={(e) => setFirstMessageMode(e.target.value as FirstMessageMode)} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                                                    <option value="assistant-speaks-first">Agent speaks first</option>
                                                    <option value="model-generated">AI generates opening</option>
                                                    <option value="user-speaks-first">Customer speaks first</option>
                                                </select>
                                            </label>
                                            <label className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                <input type="checkbox" checked={detectVoicemail} onChange={(e) => setDetectVoicemail(e.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                                <span>
                                                    <span className="block text-sm font-bold text-gray-700">Detect voicemail</span>
                                                    <span className="mt-1 block text-xs leading-5 text-gray-500">Keep off for normal campaigns if you want the agent to speak immediately.</span>
                                                </span>
                                            </label>
                                        </div>
                                    </section>
                                    <button
                                        onClick={() => setUploadStep('upload')}
                                        disabled={!campaignName.trim() || !targetAudience.trim() || !agentId.trim() || (outboundProvider === 'vozon' && !phoneNumberId.trim())}
                                        className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Next: upload contacts
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Upload Contacts */}
                            {uploadStep === 'upload' && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-950">Upload contact list</h3>
                                        <p className="mt-1 text-sm text-slate-500">Upload a CSV file or add contacts manually.</p>
                                    </div>

                                    {/* CSV Upload */}
                                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center transition-colors hover:border-blue-400">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".csv"
                                            onChange={handleCSVUpload}
                                            className="hidden"
                                        />
                                        <svg className="mx-auto mb-4 h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-300 transition-colors hover:bg-slate-50"
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
                                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">or</span>
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                    </div>

                                    {/* Manual Add */}
                                    <button
                                        onClick={handleAddManualContact}
                                        className="w-full rounded-lg border border-slate-300 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                                    >
                                        Add contact manually
                                    </button>

                                    {contacts.length > 0 && (
                                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                                            <p className="text-sm font-semibold text-emerald-700">
                                                {contacts.length} contacts ready
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setUploadStep('form')}
                                            className="flex-1 rounded-lg border border-slate-300 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setUploadStep('review')}
                                            disabled={contacts.length === 0}
                                            className="flex-1 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Review contacts
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Review & Create */}
                            {uploadStep === 'review' && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-950">Review campaign</h3>
                                        <p className="mt-1 text-sm text-slate-500">Confirm the details before creating the campaign.</p>
                                    </div>

                                    {/* Campaign Summary */}
                                    <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600 font-semibold">Campaign Name</p>
                                                <p className="text-lg font-bold text-gray-900">{campaignName}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 font-semibold">Type</p>
                                                <p className="text-lg font-bold text-gray-900 capitalize">Voice</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 font-semibold">Target Audience</p>
                                                <p className="text-lg font-bold text-gray-900">{targetAudience}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 font-semibold">Total Contacts</p>
                                                <p className="text-lg font-bold text-blue-600">{contacts.length}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 font-semibold">Provider</p>
                                                <p className="text-lg font-bold text-gray-900 capitalize">{outboundProvider}</p>
                                            </div>
                                            {agentId && (
                                                <div className="col-span-2">
                                                    <p className="text-sm text-gray-600 font-semibold">AI Agent ID</p>
                                                    <p className="text-lg font-bold text-gray-900">{agentId}</p>
                                                </div>
                                            )}
                                            {outboundProvider === 'vozon' && phoneNumberId && (
                                                <div className="col-span-2">
                                                    <p className="text-sm text-gray-600 font-semibold">Phone Number ID</p>
                                                    <p className="text-lg font-bold text-gray-900">{phoneNumberId}</p>
                                                </div>
                                            )}
                                            {outboundProvider === 'vozon' && (
                                                <div>
                                                    <p className="text-sm text-gray-600 font-semibold">Daily Limit</p>
                                                    <p className="text-lg font-bold text-gray-900">{dailyLimit.toLocaleString()}</p>
                                                </div>
                                            )}
                                            {outboundProvider === 'vozon' && (
                                                <div>
                                                    <p className="text-sm text-gray-600 font-semibold">Concurrent Calls</p>
                                                    <p className="text-lg font-bold text-gray-900">{concurrency}</p>
                                                </div>
                                            )}
                                            {outboundProvider === 'vozon' && (
                                                <div>
                                                    <p className="text-sm text-gray-600 font-semibold">Calling Window</p>
                                                    <p className="text-lg font-bold text-gray-900">{windowStart} - {windowEnd}</p>
                                                </div>
                                            )}
                                            {outboundProvider === 'vozon' && (
                                                <div>
                                                    <p className="text-sm text-gray-600 font-semibold">Retry Policy</p>
                                                    <p className="text-lg font-bold text-gray-900">
                                                        {retryAttempts <= 1 ? 'No retry' : `${retryAttempts} attempts, after ${formatRetryGap(Math.round(retryDelayHours * 3600))}`}
                                                    </p>
                                                </div>
                                            )}
                                            {outboundProvider === 'vozon' && (
                                                <div>
                                                    <p className="text-sm text-gray-600 font-semibold">Opening Mode</p>
                                                    <p className="text-lg font-bold text-gray-900">
                                                        {firstMessageMode === 'assistant-speaks-first'
                                                            ? 'Agent speaks first'
                                                            : firstMessageMode === 'model-generated'
                                                                ? 'AI generates opening'
                                                                : 'Customer speaks first'}
                                                    </p>
                                                </div>
                                            )}
                                            {outboundProvider === 'vozon' && (
                                                <div>
                                                    <p className="text-sm text-gray-600 font-semibold">Voicemail Detection</p>
                                                    <p className={`text-lg font-bold ${detectVoicemail ? 'text-amber-700' : 'text-emerald-700'}`}>
                                                        {detectVoicemail ? 'Enabled' : 'Disabled'}
                                                    </p>
                                                </div>
                                            )}
                                            {userInfo?.assignedPhoneNumber && (
                                                <div className="col-span-2">
                                                    <p className="text-sm text-gray-600 font-semibold">Calling From</p>
                                                    <p className="inline-flex items-center gap-2 text-lg font-bold text-slate-900"><Phone className="h-4 w-4 text-blue-600" /> {userInfo.assignedPhoneNumber}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Contacts Preview */}
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-3">Contact List Preview</h4>
                                        <div className="max-h-60 overflow-x-auto overflow-y-auto rounded-lg border border-slate-200">
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
                                            className="flex-1 rounded-lg border border-slate-300 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleCreateCampaign}
                                            disabled={creating}
                                            className="flex-1 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {creating ? 'Creating...' : 'Create campaign'}
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                        </div>
                    </aside>
                </div>
            )}
            {showSheetAutomation && (
                <SheetAutomationModal onClose={() => setShowSheetAutomation(false)} />
            )}
        </div>
    );
}
