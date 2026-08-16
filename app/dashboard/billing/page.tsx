"use client";
import Sidebar from "@/components/Sidebar";
import { useQueryClient } from "@tanstack/react-query";
import {
    ArrowRight,
    Award,
    BarChart3,
    CalendarDays,
    CheckCircle2,
    ChevronDown, ChevronUp,
    Clock,
    CreditCard,
    Download,
    Headphones,
    History,
    Info,
    Loader2,
    Mail,
    Menu,
    MessageSquare,
    Phone,
    Plus,
    RefreshCw,
    Shield,
    TrendingUp,
    Wallet,
    X,
    Zap
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://digital-api-46ss.onrender.com/api';

interface Transaction {
  id: string;
  date: string;
  credits: number;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
}

interface Call {
  id: string;
  dateTime: string;
  phoneNumber: string;
  duration: string;
  type: string;
  credits: number;
  status: string;
  provider?: 'exotel' | 'vobiz';
}

interface FAQ {
  question: string;
  answer: string;
}

type UsagePeriod = 'this_month' | 'last_month' | 'last_30_days' | 'all_time' | 'custom';

interface UsageSummary {
  creditsSpent: number;
  callCount: number;
  durationMinutes: number;
  averageCreditsPerCall: number;
  creditsPurchased: number;
  amountPaid: number;
  purchaseCount: number;
}

interface AutoRechargeSettings {
  enabled: boolean;
  thresholdCredits: number;
  rechargeAmount: number;
  providerReady: boolean;
  canAutoCharge: boolean;
  status: 'disabled' | 'provider_not_configured' | 'authorization_required' | 'mandate_pending' | 'active';
  tokenStatus?: string;
  lastTriggeredAt: string | null;
  lastError: string;
}

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatCredits = (value: number) => value.toLocaleString(undefined, {
  minimumFractionDigits: value % 1 === 0 ? 0 : 1,
  maximumFractionDigits: 1
});
const formatInr = (value: number) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
}).format(value);

const formatDateLabel = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export default function Billing() {
  const queryClient = useQueryClient();
  const readFreshCache = <T,>(queryKey: readonly unknown[], maxAge = 30_000): T | undefined => {
    const state = queryClient.getQueryState<T>(queryKey);
    return state?.dataUpdatedAt && Date.now() - state.dataUpdatedAt < maxAge
      ? state.data
      : undefined;
  };
  const [mounted, setMounted] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<number>(100);
  const [activeView, setActiveView] = useState<'credits' | 'calls'>('credits');
  const [loading, setLoading] = useState(false);
  const [usagePeriod, setUsagePeriod] = useState<UsagePeriod>('this_month');
  const [customStartDate, setCustomStartDate] = useState(() => {
    const now = new Date();
    return toDateInputValue(new Date(now.getFullYear(), now.getMonth(), 1));
  });
  const [customEndDate, setCustomEndDate] = useState(() => toDateInputValue(new Date()));
  const [usageLoading, setUsageLoading] = useState(false);
  const usageRequestId = useRef(0);
  const [usageError, setUsageError] = useState('');
  const [autoRechargeSaving, setAutoRechargeSaving] = useState(false);
  const [autoRechargeMessage, setAutoRechargeMessage] = useState('');
  const [usageSummary, setUsageSummary] = useState<UsageSummary>({
    creditsSpent: 0,
    callCount: 0,
    durationMinutes: 0,
    averageCreditsPerCall: 0,
    creditsPurchased: 0,
    amountPaid: 0,
    purchaseCount: 0
  });
  const [autoRecharge, setAutoRecharge] = useState<AutoRechargeSettings>({
    enabled: false,
    thresholdCredits: 50,
    rechargeAmount: 500,
    providerReady: false,
    canAutoCharge: false,
    status: 'disabled',
    lastTriggeredAt: null,
    lastError: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<{
    creditsAdded: number;
    newBalance: number;
    transactionId: string;
    amount: number;
    planName: string;
  } | null>(null);

  // User info from backend
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    assignedPhoneNumber: string;
    callRatePerMinute: number;
  }>({ name: '', email: '', assignedPhoneNumber: '', callRatePerMinute: 6 });

  // Data from backend
  const [userCredits, setUserCredits] = useState({
    used: 0,
    total: 0,
    remaining: 0,
    percentage: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [callHistory, setCallHistory] = useState<Call[]>([]);
  const [callStats, setCallStats] = useState({
    totalCalls: 0,
    totalDuration: '0h',
    totalCreditsUsed: 0,
    callTypes: { outbound: { percentage: 0 }, inbound: { percentage: 0 } },
    peakHours: {
      morning: { percentage: 0 },
      afternoon: { percentage: 0 },
      evening: { percentage: 0 }
    }
  });

  const faqs: FAQ[] = [
    {
      question: "How do credits work?",
      answer: `₹1 gives you 1 credit. Connected calls use credits at your assigned ₹${userInfo.callRatePerMinute} per-minute rate and are prorated by seconds.`
    },
    {
      question: "What happens when I run out of credits?",
      answer: "Calling pauses when credits are exhausted. You can recharge any amount from this page and continue after payment confirmation."
    },
    {
      question: "Can I get a refund?",
      answer: "Credits are non-refundable once purchased. Unused credits do not expire."
    },
    {
      question: "Is my payment information secure?",
      answer: "Payments are processed by Razorpay. DigitalBot does not store your complete card or bank details."
    },
    {
      question: "Can I purchase a custom amount?",
      answer: "Yes. Enter any amount from ₹1 and the page immediately shows your credits and estimated talk time."
    },
    {
      question: "What payment methods are accepted?",
      answer: "Razorpay supports cards, UPI, net banking and supported digital wallets."
    },
    {
      question: "Can AutoPay recharge automatically?",
      answer: "AutoPay settings can be saved here. Automatic debit starts only after Razorpay mandate support is configured and authorised for the customer."
    }
  ];

  useEffect(() => {
    setMounted(true);
    fetchUserInfo();
    fetchCreditBalance();
    fetchTransactions();
    fetchAutoRechargeSettings();
    if (activeView === 'calls') {
      fetchCallHistory();
      fetchCallStatistics();
    }
  }, [activeView]);

  useEffect(() => {
    if (!mounted || activeView !== 'calls') return;
    fetchUsageSummary();
  }, [mounted, activeView, usagePeriod, customStartDate, customEndDate]);

  // Fetch user info from backend
  const fetchUserInfo = async () => {
    try {
      const cached = readFreshCache<typeof userInfo>(['billing', 'user'], 5 * 60_000);
      if (cached) {
        setUserInfo({
          ...cached,
          callRatePerMinute: [4, 5, 6].includes(Number(cached.callRatePerMinute)) ? Number(cached.callRatePerMinute) : 6,
        });
        return;
      }
      const token = getAuthToken();
      if (!token) return;
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (data) {
          const nextUserInfo = {
            name: data.name || '',
            email: data.email || '',
            assignedPhoneNumber: data.assignedPhoneNumber || '',
            callRatePerMinute: [4, 5, 6].includes(Number(data.callRatePerMinute)) ? Number(data.callRatePerMinute) : 6,
          };
          setUserInfo(nextUserInfo);
          queryClient.setQueryData(['billing', 'user'], nextUserInfo);
        }
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };


  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token') || '';
  };

  // Get userId from localStorage (or from token payload if needed)
  const getUserId = () => {
    // If you store userId separately
    const userId = localStorage.getItem('userId');
    if (userId) return userId;
    // Try to get from stored user object
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.id) return user.id;
      } catch (e) {}
    }
    // If not, try to decode from token (JWT)
    const token = getAuthToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
      } catch (e) {}
    }
    return '';
  };

  // Fetch credit balance
  const fetchCreditBalance = async (force = false) => {
    try {
      const userId = getUserId();
      const queryKey = ['billing', 'credits', userId];
      const cached = !force ? readFreshCache<typeof userCredits>(queryKey) : null;
      if (cached) {
        setUserCredits(cached);
        return;
      }
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/billing/credits/balance?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        console.error('❌ HTTP Error:', response.status);
        if (response.status === 403) {
          console.error('🔒 FORBIDDEN - Possible causes:');
          console.error('   1. Token not provided');
          console.error('   2. Token is expired');
          console.error('   3. Token is invalid');
          console.error('   4. Backend JWT_SECRET mismatch');
          // Suggestion: Log out and log back in to get a fresh token
        }
        return;
      }

      const result = await response.json();

      if (result.success) {
        setUserCredits(result.data);
        queryClient.setQueryData(queryKey, result.data);
      }
    } catch (error) {
      console.error('❌ Error fetching credit balance:', error);
    }
  };

  const fetchAutoRechargeSettings = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const cached = readFreshCache<AutoRechargeSettings>(['billing', 'autoRecharge'], 30_000);
      if (cached) {
        setAutoRecharge(cached);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/billing/auto-recharge/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to load AutoPay settings');
      }

      setAutoRecharge(result.data);
      queryClient.setQueryData(['billing', 'autoRecharge'], result.data);
    } catch (error) {
      console.error('Error fetching AutoPay settings:', error);
    }
  };

  const saveAutoRechargeSettings = async () => {
    try {
      setAutoRechargeSaving(true);
      setAutoRechargeMessage('');

      const token = getAuthToken();
      if (!token) throw new Error('Please log in again');

      const response = await fetch(`${API_BASE_URL}/billing/auto-recharge/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          enabled: autoRecharge.enabled,
          thresholdCredits: autoRecharge.thresholdCredits,
          rechargeAmount: autoRecharge.rechargeAmount
        })
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to save AutoPay settings');
      }

      setAutoRecharge(result.data);
      queryClient.setQueryData(['billing', 'autoRecharge'], result.data);
      setAutoRechargeMessage(
        result.data.canAutoCharge
          ? 'AutoPay is active.'
          : result.data.enabled
            ? 'Settings saved. Razorpay mandate setup is still required before automatic debit can run.'
            : 'AutoPay is turned off.'
      );
    } catch (error) {
      setAutoRechargeMessage(error instanceof Error ? error.message : 'Unable to save AutoPay settings');
    } finally {
      setAutoRechargeSaving(false);
    }
  };

  const authorizeAutoPay = async () => {
    try {
      setAutoRechargeSaving(true);
      setAutoRechargeMessage('');

      const token = getAuthToken();
      if (!token) throw new Error('Please log in again');

      const res = await initializeRazorpay();
      if (!res) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      const orderResponse = await fetch(`${API_BASE_URL}/billing/razorpay/autopay/create-authorization-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          thresholdCredits: autoRecharge.thresholdCredits,
          rechargeAmount: autoRecharge.rechargeAmount
        })
      });
      const orderResult = await orderResponse.json();
      if (!orderResponse.ok || !orderResult.success) {
        throw new Error(orderResult.message || 'Unable to start AutoPay authorization');
      }

      const options = {
        key: orderResult.data.keyId,
        order_id: orderResult.data.orderId,
        customer_id: orderResult.data.customerId,
        recurring: '1',
        name: 'DigitalBot',
        description: `Authorize AutoPay up to ${formatInr(orderResult.data.maxAmount)}`,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch(`${API_BASE_URL}/billing/razorpay/autopay/verify-authorization`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const verifyResult = await verifyResponse.json();
            if (!verifyResponse.ok || !verifyResult.success) {
              throw new Error(verifyResult.message || 'AutoPay authorization failed');
            }

            setAutoRecharge(verifyResult.data);
            queryClient.setQueryData(['billing', 'autoRecharge'], verifyResult.data);
            setAutoRechargeMessage(
              verifyResult.data.canAutoCharge
                ? 'AutoPay mandate is active.'
                : 'Mandate saved. Razorpay may take time to confirm it before automatic debit starts.'
            );
          } catch (error) {
            setAutoRechargeMessage(error instanceof Error ? error.message : 'AutoPay authorization failed');
          } finally {
            setAutoRechargeSaving(false);
          }
        },
        prefill: {
          name: userInfo.name || 'Customer',
          email: userInfo.email,
          contact: userInfo.assignedPhoneNumber,
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: function () {
            setAutoRechargeSaving(false);
          },
        },
      };

      // @ts-ignore
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      setAutoRechargeMessage(error instanceof Error ? error.message : 'Unable to authorize AutoPay');
      setAutoRechargeSaving(false);
    }
  };

  const getUsageDateRange = () => {
    const now = new Date();
    if (usagePeriod === 'all_time') return null;
    if (usagePeriod === 'custom') {
      return { startDate: customStartDate, endDate: customEndDate };
    }
    if (usagePeriod === 'last_month') {
      return {
        startDate: toDateInputValue(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
        endDate: toDateInputValue(new Date(now.getFullYear(), now.getMonth(), 0))
      };
    }
    if (usagePeriod === 'last_30_days') {
      const start = new Date(now);
      start.setDate(start.getDate() - 29);
      return { startDate: toDateInputValue(start), endDate: toDateInputValue(now) };
    }
    return {
      startDate: toDateInputValue(new Date(now.getFullYear(), now.getMonth(), 1)),
      endDate: toDateInputValue(now)
    };
  };

  const fetchUsageSummary = async () => {
    const requestId = ++usageRequestId.current;
    const userId = getUserId();
    if (!userId) return;

    const range = getUsageDateRange();
    if (range && (!range.startDate || !range.endDate || range.startDate > range.endDate)) {
      setUsageError('Choose a valid date range. The start date must be before the end date.');
      setUsageLoading(false);
      return;
    }

    try {
      setUsageLoading(true);
      setUsageError('');
      const params = new URLSearchParams({ userId });
      if (range) {
        params.set('startDate', range.startDate);
        params.set('endDate', range.endDate);
        params.set('timezoneOffset', String(new Date().getTimezoneOffset()));
      }
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/billing/credits/usage-summary?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to load usage');
      }
      if (requestId === usageRequestId.current) setUsageSummary(result.data);
    } catch (error) {
      if (requestId === usageRequestId.current) {
        setUsageError(error instanceof Error ? error.message : 'Unable to load usage');
      }
    } finally {
      if (requestId === usageRequestId.current) setUsageLoading(false);
    }
  };

  const getUsageRangeLabel = () => {
    const range = getUsageDateRange();
    if (!range) return 'All recorded usage';
    if (!range.startDate || !range.endDate) return 'Choose both dates';
    return `${formatDateLabel(range.startDate)} – ${formatDateLabel(range.endDate)}`;
  };

  const UsageByPeriodCard = () => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg mb-8 p-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Usage by period</h2>
          </div>
          <p className="text-xs text-slate-500">Choose a period to see exactly what you spent during those dates.</p>
        </div>
        <select
          value={usagePeriod}
          onChange={(event) => setUsagePeriod(event.target.value as UsagePeriod)}
          aria-label="Usage period"
          className="w-full lg:w-52 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="this_month">This month</option>
          <option value="last_month">Last month</option>
          <option value="last_30_days">Last 30 days</option>
          <option value="all_time">All time</option>
          <option value="custom">Custom dates</option>
        </select>
      </div>

      <p className="text-xs font-semibold text-slate-600 mb-4">Showing: {getUsageRangeLabel()}</p>

      {usagePeriod === 'custom' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 mb-5 rounded-xl bg-slate-50 border border-slate-200">
          <label className="text-xs font-bold text-slate-600">
            From
            <input
              type="date"
              value={customStartDate}
              max={customEndDate || undefined}
              onChange={(event) => setCustomStartDate(event.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900"
            />
          </label>
          <label className="text-xs font-bold text-slate-600">
            To
            <input
              type="date"
              value={customEndDate}
              min={customStartDate || undefined}
              max={toDateInputValue(new Date())}
              onChange={(event) => setCustomEndDate(event.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900"
            />
          </label>
        </div>
      )}

      {usageError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{usageError}</div>
      ) : usageLoading ? (
        <div className="flex min-h-32 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600">
          <Loader2 className="w-4 h-4 mr-2 animate-spin text-blue-600" />
          Updating usage for this period…
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Credits spent</p>
            <p className="text-2xl font-black text-slate-900 mt-2">{formatCredits(usageSummary.creditsSpent)}</p>
            <p className="text-xs text-slate-500 mt-1">Deducted for billed calls</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Billed calls</p>
            <p className="text-2xl font-black text-slate-900 mt-2">{usageSummary.callCount.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">Connected, chargeable calls</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Call minutes</p>
            <p className="text-2xl font-black text-slate-900 mt-2">{formatCredits(usageSummary.durationMinutes)}</p>
            <p className="text-xs text-slate-500 mt-1">Total billed duration</p>
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-xs font-bold text-green-700 uppercase tracking-wide">Credits purchased</p>
            <p className="text-2xl font-black text-slate-900 mt-2">{formatCredits(usageSummary.creditsPurchased)}</p>
            <p className="text-xs text-slate-500 mt-1">From completed payments</p>
          </div>
        </div>
      )}

      {!usageLoading && !usageError && (
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 pt-4 border-t border-slate-200 text-xs text-slate-600">
          <span>Payments in period: <strong className="text-slate-900">{usageSummary.purchaseCount}</strong></span>
          <span>Amount paid: <strong className="text-slate-900">{formatInr(usageSummary.amountPaid)}</strong></span>
        </div>
      )}
    </div>
  );

  // Fetch transactions
  const fetchTransactions = async (force = false) => {
    try {
      const userId = getUserId();
      const queryKey = ['billing', 'transactions', userId];
      const cached = !force ? readFreshCache<Transaction[]>(queryKey) : null;
      if (cached) {
        setRecentTransactions(cached);
        return;
      }
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/billing/transactions/history?userId=${userId}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      

      if (!response.ok) {
        console.error('❌ HTTP Error:', response.status);
        return;
      }

      const result = await response.json();
      if (result.success && result.data.transactions) {
        setRecentTransactions(result.data.transactions);
        queryClient.setQueryData(queryKey, result.data.transactions);
      }
    } catch (error) {
      console.error('❌ Error fetching transactions:', error);
    }
  };

  // Fetch call history
  const fetchCallHistory = async () => {
    try {
      const userId = getUserId();
      const queryKey = ['billing', 'calls', userId];
      const cached = readFreshCache<Call[]>(queryKey);
      if (cached) {
        setCallHistory(cached);
        return;
      }
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/billing/calls/history?userId=${userId}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        console.error('❌ HTTP Error:', response.status);
        return;
      }

      const result = await response.json();

      if (result.success && result.data.calls) {
        setCallHistory(result.data.calls);
        queryClient.setQueryData(queryKey, result.data.calls);
      }
    } catch (error) {
      console.error('❌ Error fetching call history:', error);
    }
  };

  // Fetch call statistics
  const fetchCallStatistics = async () => {
    try {
      const userId = getUserId();
      const queryKey = ['billing', 'statistics', userId];
      const cached = readFreshCache<typeof callStats>(queryKey);
      if (cached) {
        setCallStats(cached);
        return;
      }
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/billing/calls/statistics?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        console.error('❌ HTTP Error:', response.status);
        return;
      }

      const result = await response.json();

      if (result.success) {
        setCallStats(result.data);
        queryClient.setQueryData(queryKey, result.data);
      }
    } catch (error) {
      console.error('❌ Error fetching call statistics:', error);
    }
  };

  // The backend uses the same authoritative rate: ₹1 = 1 credit.
  const calculateCredits = (amount: number): number => {
    return Math.round(Math.max(0, amount) * 100) / 100;
  };

  // Initialize Razorpay
  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Razorpay Payment
  const handlePayment = async () => {
    let amount = customAmount;
    let credits = calculateCredits(customAmount);
    const planName = 'Credit Top-up';

    if (!Number.isFinite(amount) || amount < 1) {
      alert('Please enter an amount of at least ₹1');
      return;
    }

    try {
      setLoading(true);

      // Create order
const token = getAuthToken(); // Get the token

const orderResponse = await fetch(`${API_BASE_URL}/billing/razorpay/create-order`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // ✅ Add this line
  },
  body: JSON.stringify({
    amount
  })
});

      const orderResult = await orderResponse.json();

      if (!orderResult.success) {
        throw new Error(orderResult.message || 'Failed to create order');
      }
      amount = Number(orderResult.data.amount);
      credits = Number(orderResult.data.credits);

      // Initialize Razorpay
      const res = await initializeRazorpay();
      if (!res) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        return;
      }

      // Razorpay options - use user info fetched from backend
      const options = {
        key: orderResult.data.keyId,
        amount: Math.round(orderResult.data.amount * 100),
        currency: orderResult.data.currency,
        name: "DigitalBot",
        description: `${planName} - ${credits} Credits`,
        order_id: orderResult.data.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch(`${API_BASE_URL}/billing/razorpay/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyResult = await verifyResponse.json();

            if (verifyResult.success) {
              setShowPaymentModal(false);
              // Refresh data
              await fetchCreditBalance(true);
              await fetchTransactions(true);
              // Show success modal
              setSuccessData({
                creditsAdded: verifyResult.data.credits_added,
                newBalance: verifyResult.data.new_balance,
                transactionId: verifyResult.data.transaction_id,
                amount: amount,
                planName: planName,
              });
              setShowSuccessModal(true);
            } else {
              alert('❌ Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('❌ Payment verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: userInfo.name || 'Customer',
          email: userInfo.email,
          contact: userInfo.assignedPhoneNumber,
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      // @ts-ignore
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  // Payment Modal Component
  const PaymentModal = () => {
    const amount = customAmount;
    const credits = calculateCredits(customAmount);

    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 transform transition-all animate-slideUp">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">
              Complete Your Purchase
            </h3>
            <p className="text-slate-600 font-medium">Secure payment via Razorpay</p>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 mb-6">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200">
              <span className="text-slate-700 font-bold">Purchase:</span>
              <span className="font-black text-slate-900">Credit Top-up</span>
            </div>
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200">
              <span className="text-slate-700 font-bold">Credits:</span>
              <span className="font-black text-blue-600 flex items-center gap-1">
                <Zap className="w-4 h-4" />
                {credits.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-black text-slate-900">Total:</span>
              <span className="text-2xl font-black text-blue-700">
                ₹{amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pay with Razorpay
                </>
              )}
            </button>

            <button
              onClick={() => {
                setShowPaymentModal(false);
              }}
              disabled={loading}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-center gap-3 text-xs text-slate-500">
              <Shield className="w-4 h-4" />
              <span>Secured by Razorpay • 256-bit SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Generate and download invoice as HTML→PDF
  const generateInvoice = (invoiceData: {
    transactionId: string;
    date: string;
    planName: string;
    credits: number;
    amount: number;
    status: string;
    paymentMethod?: string;
    userName?: string;
    userEmail?: string;
  }) => {
    const invoiceNumber = `INV-${invoiceData.transactionId.slice(-8).toUpperCase()}`;
    const invoiceDate = invoiceData.date || new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Invoice ${invoiceNumber}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { height: 100%; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; background: #e2e8f0; padding: 0; -webkit-font-smoothing: antialiased; }

  .page { max-width: 800px; margin: 0 auto; background: #fff; overflow: hidden; position: relative; min-height: 100vh; display: flex; flex-direction: column; }

  /* === HERO HEADER === */
  .hero {
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    padding: 28px 36px 40px;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    display: none;
  }
  .hero::after {
    display: none;
  }
  .hero-content { position: relative; z-index: 1; }
  .hero-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
  .logo-group { display: flex; align-items: center; gap: 10px; }
  .logo-circle {
    width: 40px; height: 40px;
    background: #2563eb;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 18px rgba(37,99,235,0.18);
  }
  .logo-circle svg { width: 20px; height: 20px; fill: white; }
  .logo-text { color: #0f172a; }
  .logo-title { font-size: 18px; font-weight: 800; letter-spacing: -0.5px; }
  .logo-title em { font-style: normal; color: #2563eb; }
  .logo-sub { font-size: 9px; color: #64748b; letter-spacing: 2px; text-transform: uppercase; margin-top: 1px; }

  .inv-tag {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 10px 16px;
    text-align: right;
  }
  .inv-tag-label { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; }
  .inv-tag-num { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #0f172a; font-weight: 700; margin-top: 2px; }

  /* Amount showcase */
  .amount-showcase {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 18px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .amount-label { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin-bottom: 4px; }
  .amount-value { font-size: 36px; font-weight: 800; color: #0f172a; letter-spacing: -2px; line-height: 1; }
  .amount-value .currency { font-size: 20px; color: #2563eb; vertical-align: top; margin-right: 2px; }
  .amount-meta { display: flex; gap: 18px; margin-top: 8px; }
  .amount-meta-item { display: flex; align-items: center; gap: 5px; }
  .meta-dot { width: 6px; height: 6px; border-radius: 50%; }
  .meta-dot.green { background: #34d399; box-shadow: 0 0 6px rgba(52,211,153,0.5); }
  .meta-dot.blue { background: #2563eb; box-shadow: 0 0 6px rgba(37,99,235,0.25); }
  .meta-text { font-size: 10px; color: #94a3b8; }
  .meta-text strong { color: #0f172a; }

  .paid-stamp { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .stamp-circle {
    width: 52px; height: 52px;
    border: 2px solid #34d399;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    position: relative;
  }
  .stamp-circle::after {
    content: '';
    position: absolute;
    inset: -6px;
    border: 1px dashed rgba(52,211,153,0.3);
    border-radius: 50%;
  }
  .stamp-circle svg { width: 24px; height: 24px; fill: #34d399; }
  .stamp-text { font-size: 9px; color: #34d399; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; }

  /* === BODY === */
  .body { padding: 0 36px; flex: 1; }

  /* Info tiles */
  .info-row {
    display: flex; gap: 0;
    margin: -14px 0 18px;
    position: relative; z-index: 2;
  }
  .info-tile {
    flex: 1;
    background: white;
    padding: 14px 16px;
    border: 1px solid #e2e8f0;
  }
  .info-tile:first-child { border-radius: 10px 0 0 10px; border-right: none; }
  .info-tile:nth-child(2) { border-left: none; border-right: none; }
  .info-tile:last-child { border-radius: 0 10px 10px 0; border-left: none; }
  .tile-icon { width: 28px; height: 28px; border-radius: 7px; display: flex; align-items: center; justify-content: center; margin-bottom: 6px; }
  .tile-icon svg { width: 14px; height: 14px; }
  .tile-icon.purple { background: #f3e8ff; }
  .tile-icon.purple svg { fill: #7c3aed; }
  .tile-icon.blue { background: #dbeafe; }
  .tile-icon.blue svg { fill: #2563eb; }
  .tile-icon.emerald { background: #d1fae5; }
  .tile-icon.emerald svg { fill: #059669; }
  .tile-label { font-size: 8px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 700; margin-bottom: 3px; }
  .tile-value { font-size: 12px; font-weight: 700; color: #1e293b; }
  .tile-sub { font-size: 10px; color: #64748b; margin-top: 2px; }

  /* Section titles */
  .section-title {
    font-size: 9px; text-transform: uppercase; letter-spacing: 2px;
    color: #94a3b8; font-weight: 800; margin-bottom: 10px;
    display: flex; align-items: center; gap: 8px;
  }
  .section-title::after { content: ''; flex: 1; height: 1px; background: #e2e8f0; }

  /* Item card */
  .item-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
  }
  .item-icon-wrap {
    width: 42px; height: 42px;
    background: #2563eb;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 3px 12px rgba(124,58,237,0.25);
  }
  .item-icon-wrap svg { width: 20px; height: 20px; fill: white; }
  .item-info { flex: 1; }
  .item-title { font-size: 13px; font-weight: 800; color: #1e293b; margin-bottom: 2px; }
  .item-subtitle { font-size: 10px; color: #64748b; }
  .item-right { text-align: right; }
  .item-credits {
    display: inline-flex; align-items: center; gap: 4px;
    background: white; border: 1.5px solid #e9d5ff;
    padding: 3px 10px; border-radius: 16px;
    font-weight: 800; font-size: 12px; color: #7c3aed;
    margin-bottom: 4px;
  }
  .item-credits svg { width: 12px; height: 12px; fill: #7c3aed; }
  .item-price { font-size: 18px; font-weight: 800; color: #1e293b; }
  .item-rate { font-size: 9px; color: #94a3b8; margin-top: 1px; }

  /* Breakdown */
  .breakdown {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 14px 18px;
    margin-bottom: 16px;
  }
  .brk-row { display: flex; justify-content: space-between; padding: 6px 0; }
  .brk-row:not(:last-child) { border-bottom: 1px dashed #e2e8f0; }
  .brk-label { font-size: 11px; color: #64748b; }
  .brk-value { font-size: 11px; font-weight: 700; color: #1e293b; }
  .brk-value.muted { color: #cbd5e1; }
  .brk-total { padding-top: 10px !important; margin-top: 2px; border-top: 2px solid #7c3aed !important; border-bottom: none !important; }
  .brk-total .brk-label { font-size: 13px; font-weight: 800; color: #0f172a; }
  .brk-total .brk-value {
    font-size: 20px; font-weight: 800; letter-spacing: -1px;
    background: linear-gradient(135deg, #7c3aed, #2563eb);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  /* Transaction bar */
  .txn-bar {
    display: flex; align-items: center;
    background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
    border: 1px solid #bbf7d0;
    border-radius: 10px;
    padding: 10px 14px;
    margin-bottom: 18px;
    gap: 10px;
  }
  .txn-check {
    width: 24px; height: 24px;
    background: #22c55e; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .txn-check svg { width: 12px; height: 12px; fill: white; }
  .txn-details { flex: 1; }
  .txn-label2 { font-size: 8px; color: #16a34a; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
  .txn-id2 { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #334155; font-weight: 500; margin-top: 1px; }
  .txn-status-pill {
    background: #22c55e; color: white;
    padding: 3px 10px; border-radius: 14px;
    font-size: 8px; font-weight: 800;
    text-transform: uppercase; letter-spacing: 1px;
  }

  /* === FOOTER === */
  .footer-wave { height: 24px; background: white; position: relative; }
  .footer-wave::after { display: none; }
  .footer-main {
    background: #ffffff;
    border-top: 1px solid #e2e8f0;
    padding: 14px 36px 18px;
    display: flex; justify-content: space-between; align-items: flex-end;
  }
  .footer-left {}
  .footer-brand2 { font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 2px; }
  .footer-brand2 em { font-style: normal; color: #2563eb; }
  .footer-desc { font-size: 10px; color: #64748b; line-height: 1.5; }
  .footer-right2 { text-align: right; }
  .footer-link { font-size: 10px; color: #818cf8; text-decoration: none; display: block; line-height: 1.8; }
  .footer-note2 {
    background: #f8fafc;
    padding: 8px 36px;
    text-align: center;
    font-size: 9px; color: #64748b;
    border-top: 1px solid #e2e8f0;
  }

  @page { margin: 8mm; size: A4; }
  @media print {
    body { background: white; padding: 0; }
    .page { margin: 0; box-shadow: none; min-height: auto; }
    .hero, .amount-showcase, .logo-circle, .item-icon-wrap, .txn-check, .txn-status-pill,
    .tile-icon, .item-credits, .stamp-circle, .footer-main, .footer-note2, .footer-wave::after,
    .paid-stamp, .inv-tag, .breakdown, .brk-total .brk-value, thead th {
      print-color-adjust: exact; -webkit-print-color-adjust: exact;
    }
  }
</style>
</head>
<body>
<div class="page">

  <!-- HERO HEADER -->
  <div class="hero">
    <div class="hero-content">
      <div class="hero-top">
        <div class="logo-group">
          <div class="logo-circle">
            <svg viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/></svg>
          </div>
          <div class="logo-text">
            <div class="logo-title">Digital<em>Bot</em>.ai</div>
            <div class="logo-sub">AI Voice Assistant Platform</div>
          </div>
        </div>
        <div class="inv-tag">
          <div class="inv-tag-label">Invoice</div>
          <div class="inv-tag-num">${invoiceNumber}</div>
        </div>
      </div>

      <div class="amount-showcase">
        <div class="amount-left">
          <div class="amount-label">Amount Paid</div>
          <div class="amount-value"><span class="currency">₹</span>${invoiceData.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div class="amount-meta">
            <div class="amount-meta-item">
              <span class="meta-dot green"></span>
              <span class="meta-text"><strong>${invoiceData.credits.toLocaleString()}</strong> credits</span>
            </div>
            <div class="amount-meta-item">
              <span class="meta-dot blue"></span>
              <span class="meta-text">via <strong>${invoiceData.paymentMethod || 'Razorpay'}</strong></span>
            </div>
          </div>
        </div>
        <div class="paid-stamp">
          <div class="stamp-circle">
            <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          </div>
          <div class="stamp-text">Paid</div>
        </div>
      </div>
    </div>
  </div>

  <!-- INFO TILES -->
  <div class="body">
    <div class="info-row">
      <div class="info-tile">
        <div class="tile-icon purple">
          <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </div>
        <div class="tile-label">Billed To</div>
        <div class="tile-value">${invoiceData.userName || userInfo.name || 'Customer'}</div>
        <div class="tile-sub">${invoiceData.userEmail || userInfo.email || 'N/A'}</div>
      </div>
      <div class="info-tile">
        <div class="tile-icon blue">
          <svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>
        </div>
        <div class="tile-label">Invoice Date</div>
        <div class="tile-value">${invoiceDate}</div>
        <div class="tile-sub">${invoiceNumber}</div>
      </div>
      <div class="info-tile">
        <div class="tile-icon emerald">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        </div>
        <div class="tile-label">Payment Status</div>
        <div class="tile-value" style="color:#059669">${invoiceData.status.toUpperCase()}</div>
        <div class="tile-sub">${invoiceData.paymentMethod || 'Razorpay'}</div>
      </div>
    </div>

    <!-- ITEM -->
    <div class="section-title">Service Details</div>
    <div class="item-card">
      <div class="item-icon-wrap">
        <svg viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
      </div>
      <div class="item-info">
        <div class="item-title">${invoiceData.planName}</div>
        <div class="item-subtitle">Voice AI credit recharge via ${invoiceData.paymentMethod || 'Razorpay'}</div>
      </div>
      <div class="item-right">
        <div class="item-credits">
          <svg viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
          ${invoiceData.credits.toLocaleString()}
        </div>
        <div class="item-price">₹${invoiceData.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <div class="item-rate">@ ₹${(invoiceData.amount / invoiceData.credits).toFixed(2)} per credit</div>
      </div>
    </div>

    <!-- BREAKDOWN -->
    <div class="section-title">Payment Summary</div>
    <div class="breakdown">
      <div class="brk-row">
        <span class="brk-label">${invoiceData.planName} (${invoiceData.credits.toLocaleString()} credits)</span>
        <span class="brk-value">₹${invoiceData.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div class="brk-row">
        <span class="brk-label">Platform Fee</span>
        <span class="brk-value muted">₹0.00</span>
      </div>
      <div class="brk-row">
        <span class="brk-label">Tax</span>
        <span class="brk-value muted">₹0.00</span>
      </div>
      <div class="brk-row brk-total">
        <span class="brk-label">Total Charged</span>
        <span class="brk-value">₹${invoiceData.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
    </div>

    <!-- TXN BAR -->
    <div class="txn-bar">
      <div class="txn-check">
        <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
      </div>
      <div class="txn-details">
        <div class="txn-label2">Transaction Reference</div>
        <div class="txn-id2">${invoiceData.transactionId}</div>
      </div>
      <div class="txn-status-pill">Verified</div>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer-wave"></div>
  <div class="footer-main">
    <div class="footer-left">
      <div class="footer-brand2">Digital<em>Bot</em>.ai</div>
      <div class="footer-desc">AI Voice Assistant Platform<br>Powering intelligent voice experiences</div>
    </div>
    <div class="footer-right2">
      <a class="footer-link" href="mailto:support@digitalbot.ai">support@digitalbot.ai</a>
      <a class="footer-link" href="https://www.digitalbot.ai">www.digitalbot.ai</a>
    </div>
  </div>
  <div class="footer-note2">
    This is a system-generated invoice. No signature required.
  </div>
</div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
        URL.revokeObjectURL(url);
      };
    } else {
      // Fallback: direct download as HTML
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${invoiceNumber}.html`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Transaction Success Modal
  const SuccessModal = () => {
    if (!showSuccessModal || !successData) return null;
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center transform transition-all animate-slideUp">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <h3 className="text-2xl font-black text-slate-900 mb-2">Transaction Successful!</h3>
          <p className="text-slate-500 font-medium mb-6">Your credits have been added to your account</p>

          {/* Transaction Details */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5 mb-6 text-left space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 font-medium">Purchase</span>
              <span className="text-sm font-bold text-slate-900">{successData.planName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 font-medium">Amount Paid</span>
              <span className="text-sm font-bold text-slate-900">{formatInr(successData.amount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 font-medium">Credits Added</span>
              <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                <Zap className="w-4 h-4" />
                +{successData.creditsAdded.toLocaleString()}
              </span>
            </div>
            <div className="border-t border-green-200 pt-3 flex justify-between items-center">
              <span className="text-sm text-slate-600 font-medium">New Balance</span>
              <span className="text-lg font-black text-blue-700">
                {successData.newBalance.toLocaleString()} credits
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 font-medium">Transaction ID</span>
              <span className="text-xs font-mono text-slate-500">{successData.transactionId.slice(-10)}</span>
            </div>
          </div>

          <div className="flex gap-3 mb-3">
            <button
              onClick={() => {
                generateInvoice({
                  transactionId: successData.transactionId,
                  date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
                  planName: successData.planName,
                  credits: successData.creditsAdded,
                  amount: successData.amount,
                  status: 'completed',
                });
              }}
              className="flex-1 bg-white border-2 border-blue-200 hover:border-blue-400 text-blue-700 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Invoice
            </button>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setSuccessData(null);
              }}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Continue
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-2">A receipt has been sent to your email</p>
        </div>
      </div>
    );
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="hidden lg:block">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
        <main className="flex-1 lg:ml-60 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-base text-slate-700 font-bold">Loading your billing dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border-2 border-slate-200"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/50 z-40"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      <main className="flex-1 lg:ml-60 bg-slate-50 p-4 pt-20 sm:p-8 lg:pt-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-6 rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm">
            {/* View Toggle Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-normal text-slate-800">
                  {activeView === 'credits' ? 'Billing' : 'Call usage'}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {activeView === 'credits'
                    ? 'Recharge credits and download your invoices.'
                    : 'Review call charges and usage details.'
                  }
                </p>
              </div>

              <div className="flex w-full gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 sm:w-auto">
                <button
                  onClick={() => setActiveView('credits')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold transition sm:flex-none ${
                    activeView === 'credits'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  Credits
                </button>
                <button
                  onClick={() => setActiveView('calls')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold transition sm:flex-none ${
                    activeView === 'calls'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Phone className="w-5 h-5" />
                  Calls
                </button>
              </div>
            </div>
          </div>

          {/* Credit Management View */}
          {activeView === 'credits' && (
            <>
              {/* Available Credit Balance */}
              {mounted && (
                <div className="relative mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm sm:p-8">
                  <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div>
                      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700">
                        <Wallet className="h-4 w-4" /> Wallet balance
                      </div>
                      <p className="text-sm text-slate-500">Available credits</p>
                      <div className="mt-1 flex items-end gap-2">
                        <span className="text-5xl font-black tracking-tight sm:text-6xl">{formatCredits(userCredits.remaining)}</span>
                        <span className="mb-2 text-sm font-medium text-slate-500">credits</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:min-w-[360px]">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs text-slate-500">Your call rate</p>
                        <p className="mt-1 text-2xl font-bold">₹{userInfo.callRatePerMinute}<span className="text-sm font-medium text-slate-500">/min</span></p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs text-slate-500">Talk time available</p>
                        <p className="mt-1 text-2xl font-bold">{formatCredits(userCredits.remaining / userInfo.callRatePerMinute)}<span className="text-sm font-medium text-slate-500"> min</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

          <div className="mb-8 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Recharge wallet</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">How much would you like to add?</h2>
                <p className="mt-1 text-sm text-slate-500">Choose a quick amount or enter your own. ₹1 gives you 1 credit.</p>
              </div>

              <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[100, 500, 1000, 5000].map(amount => (
                  <button key={amount} type="button" onClick={() => setCustomAmount(amount)} className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${customAmount === amount ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/60'}`}>
                    {formatInr(amount)}
                  </button>
                ))}
              </div>

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Custom amount</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">₹</span>
                <input type="number" min="1" max="1000000" step="0.01" value={customAmount} onChange={(event) => setCustomAmount(Math.max(0, Number(event.target.value) || 0))} className="h-16 w-full rounded-2xl border-2 border-slate-200 bg-slate-50 pl-12 pr-5 text-2xl font-black text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" />
              </div>

              <button onClick={() => setShowPaymentModal(true)} disabled={customAmount < 1 || customAmount > 1_000_000} className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 text-base font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                Pay {formatInr(customAmount)} securely
                <ArrowRight className="h-5 w-5" />
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500"><Shield className="h-3.5 w-3.5" /> Payments are securely processed by Razorpay</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Recharge summary</p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <span className="flex items-center gap-2 text-sm font-medium text-slate-600"><Zap className="h-4 w-4 text-blue-500" /> Credits added</span>
                  <strong className="text-xl text-slate-900">{formatCredits(calculateCredits(customAmount))}</strong>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <span className="flex items-center gap-2 text-sm font-medium text-slate-600"><Phone className="h-4 w-4 text-blue-500" /> Estimated talk time</span>
                  <strong className="text-xl text-slate-900">{formatCredits(calculateCredits(customAmount) / userInfo.callRatePerMinute)} min</strong>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <span className="text-sm font-medium text-slate-600">Your rate</span>
                  <strong className="text-xl text-slate-900">₹{userInfo.callRatePerMinute}/min</strong>
                </div>
              </div>
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                Credits are added immediately after Razorpay confirms your payment and never expire.
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-900">AutoPay</h2>
                </div>
                <p className="text-sm text-slate-500">
                  Recharge automatically when credits fall below your selected balance.
                </p>
              </div>

              <label className="inline-flex cursor-pointer items-center gap-3">
                <span className="text-sm font-semibold text-slate-600">{autoRecharge.enabled ? 'On' : 'Off'}</span>
                <input
                  type="checkbox"
                  checked={autoRecharge.enabled}
                  onChange={(event) => setAutoRecharge((current) => ({ ...current, enabled: event.target.checked }))}
                  className="sr-only"
                />
                <span className={`h-7 w-12 rounded-full p-1 transition ${autoRecharge.enabled ? 'bg-blue-600' : 'bg-slate-200'}`}>
                  <span className={`block h-5 w-5 rounded-full bg-white shadow transition ${autoRecharge.enabled ? 'translate-x-5' : ''}`} />
                </span>
              </label>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Trigger below</span>
                <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
                  <input
                    type="number"
                    min="1"
                    max="1000000"
                    step="1"
                    value={autoRecharge.thresholdCredits}
                    onChange={(event) => setAutoRecharge((current) => ({
                      ...current,
                      thresholdCredits: Math.max(1, Number(event.target.value) || 1)
                    }))}
                    className="h-12 w-full bg-transparent text-base font-bold text-slate-900 outline-none"
                  />
                  <span className="text-sm font-medium text-slate-500">credits</span>
                </div>
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Recharge amount</span>
                <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
                  <span className="text-base font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="1"
                    max="1000000"
                    step="1"
                    value={autoRecharge.rechargeAmount}
                    onChange={(event) => setAutoRecharge((current) => ({
                      ...current,
                      rechargeAmount: Math.max(1, Number(event.target.value) || 1)
                    }))}
                    className="h-12 w-full bg-transparent pl-2 text-base font-bold text-slate-900 outline-none"
                  />
                </div>
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 sm:max-w-2xl">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <span>
                  {autoRecharge.canAutoCharge
                    ? 'AutoPay can debit automatically when the balance is below your threshold.'
                    : autoRecharge.enabled
                      ? autoRecharge.status === 'mandate_pending'
                        ? 'Mandate is saved but still pending at Razorpay. Automatic debit starts after it is confirmed.'
                        : 'Authorize the Razorpay mandate once. After that, automatic debit can run when balance is low.'
                      : 'Turn on AutoPay to save your preferred threshold and recharge amount.'}
                </span>
              </div>
              <div className="flex flex-col gap-2 sm:min-w-56">
                <button
                  type="button"
                  onClick={saveAutoRechargeSettings}
                  disabled={autoRechargeSaving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {autoRechargeSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  Save settings
                </button>
                <button
                  type="button"
                  onClick={authorizeAutoPay}
                  disabled={autoRechargeSaving || !autoRecharge.enabled}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {autoRechargeSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Authorize mandate
                </button>
              </div>
            </div>

            {autoRechargeMessage && (
              <p className="mt-3 text-sm font-medium text-slate-600">{autoRechargeMessage}</p>
            )}
          </div>

          {/* Transaction History */}
          {mounted && (
            <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700"><History className="h-5 w-5" /></div>
                <div><h2 className="font-bold text-slate-900">Payment history</h2><p className="text-xs text-slate-500">Completed recharges and downloadable invoices</p></div>
              </div>
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="hidden px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wide lg:table-cell">ID</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wide">Date</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wide">Credits</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wide">Amount</th>
                        <th className="hidden px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wide md:table-cell">Method</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wide">Status</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wide">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {recentTransactions.length > 0 ? (
                        recentTransactions.map((txn) => (
                          <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                            <td className="hidden px-6 py-4 lg:table-cell">
                              <span className="font-mono text-xs font-bold text-slate-500">…{txn.id.slice(-8)}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-slate-600 font-medium">{txn.date}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1">
                                <Zap className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-bold text-blue-600">{formatCredits(txn.credits)}</span>
                              </div>
                            </td>
                            <td className="hidden px-6 py-4 md:table-cell">
                              <span className="text-sm font-bold text-slate-900">{formatInr(txn.amount)}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-slate-600 font-medium">{txn.paymentMethod}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                                txn.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : txn.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {txn.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {txn.status === 'completed' ? (
                                <button
                                  onClick={() => generateInvoice({
                                    transactionId: txn.id,
                                    date: txn.date,
                                    planName: `Credit Recharge`,
                                    credits: txn.credits,
                                    amount: txn.amount,
                                    status: txn.status,
                                    paymentMethod: txn.paymentMethod,
                                  })}
                                  className="flex items-center gap-1 rounded-lg border border-blue-200 px-2.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50"
                                >
                                  <Download className="w-4 h-4" />
                                  Invoice
                                </button>
                              ) : (
                                <span className="text-slate-400 text-sm">—</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                            No transactions yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* FAQ Section */}
          {mounted && (
            <div className="mb-6">
              <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Frequently Asked Questions
              </h2>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {faqs.map((faq, index) => (
                  <div key={faq.question} className="border-b border-slate-200 last:border-b-0">
                    <button type="button" onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)} className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-blue-50/60">
                      <span className="pr-3 text-sm font-semibold text-slate-900">{faq.question}</span>
                      {expandedFAQ === index ? <ChevronUp className="h-4 w-4 shrink-0 text-blue-600" /> : <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />}
                    </button>
                    {expandedFAQ === index && <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600">{faq.answer}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Support */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-white text-blue-600 shadow-sm"><Headphones className="h-5 w-5" /></div>
                <div><h2 className="font-bold">Need help with billing?</h2><p className="text-sm text-slate-600">Our support team can help with payments and invoices.</p></div>
              </div>
              <div className="flex flex-wrap gap-2">
                <a href="tel:+15551234567" className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-700"><Phone className="h-3.5 w-3.5" /> Call support</a>
                <a href="mailto:support@digitalbot.com" className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-700"><Mail className="h-3.5 w-3.5" /> Email support</a>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { icon: Shield, title: 'Secure Payment', desc: 'Razorpay protected' },
              { icon: Clock, title: 'Instant Access', desc: 'Credits added quickly' },
              { icon: Award, title: 'No Expiry', desc: 'Use credits anytime' },
              { icon: Plus, title: 'Flexible Top-up', desc: 'Choose any amount' }
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700"><item.icon className="h-5 w-5" /></div>
                <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                <p className="mt-0.5 text-[10px] text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>

            </>
          )}

          {/* Calls View */}
          {activeView === 'calls' && mounted && (
            <>
              <UsageByPeriodCard />

              {/* Recent Calls Table */}
              <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden mb-8">
                <div className="px-6 py-4 border-b-2 border-slate-200 bg-slate-50">
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Phone className="w-6 h-6 text-blue-600" />
                    Recent Calls
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-100 border-b-2 border-slate-300">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">Date & Time</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">Phone Number</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">Duration</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">Provider</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">Credits</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {callHistory.length > 0 ? (
                        callHistory.map((call) => (
                          <tr key={call.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-slate-700">{call.dateTime}</td>
                            <td className="px-6 py-4 text-sm font-bold text-slate-900">{call.phoneNumber}</td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-700">{call.duration}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                call.type === 'Outbound'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {call.type}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-700">{call.provider || 'exotel'}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1">
                                <Zap className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-black text-blue-600">{call.credits}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                {call.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                            No calls yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Call Analytics */}
              <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl p-6">
                <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  Call Analytics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-600 mb-3">Call Types Distribution</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-slate-700">Outbound</span>
                          <span className="text-sm font-black text-blue-600">{callStats.callTypes.outbound.percentage}%</span>
                        </div>
                        <div className="bg-slate-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: `${callStats.callTypes.outbound.percentage}%`}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-slate-700">Inbound</span>
                          <span className="text-sm font-black text-green-600">{callStats.callTypes.inbound.percentage}%</span>
                        </div>
                        <div className="bg-slate-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{width: `${callStats.callTypes.inbound.percentage}%`}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-600 mb-3">Peak Call Hours</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 font-medium">Morning (9 AM - 12 PM)</span>
                        <span className="font-black text-blue-600">{callStats.peakHours.morning.percentage}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 font-medium">Afternoon (12 PM - 5 PM)</span>
                        <span className="font-black text-blue-600">{callStats.peakHours.afternoon.percentage}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 font-medium">Evening (5 PM - 9 PM)</span>
                        <span className="font-black text-blue-600">{callStats.peakHours.evening.percentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </main>

      {showPaymentModal && mounted && <PaymentModal />}
      <SuccessModal />
    </div>
  );
}
