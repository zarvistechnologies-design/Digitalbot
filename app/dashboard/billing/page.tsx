"use client";
import Sidebar from "@/components/Sidebar";
import {
    ArrowRight,
    Award,
    BarChart3,
    Check,
    CheckCircle2,
    ChevronDown, ChevronUp,
    Clock,
    CreditCard,
    Download,
    Gift,
    Headphones,
    History,
    Loader2,
    Mail,
    Menu,
    MessageSquare,
    Minus,
    Package,
    Phone,
    Plus,
    RefreshCw,
    Settings,
    Shield,
    Star,
    TrendingUp,
    Wallet,
    X,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://digital-api-tef8.onrender.com/api';

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
  savings?: string;
}

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
}

interface FAQ {
  question: string;
  answer: string;
}

export default function Billing() {
  const [mounted, setMounted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);
  const [customAmount, setCustomAmount] = useState<number>(9);
  const [isCustom, setIsCustom] = useState(false);
  const [activeView, setActiveView] = useState<'credits' | 'calls'>('credits');
  const [loading, setLoading] = useState(false);

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

  // Predefined plans
  const creditPackages: CreditPackage[] = [
    {
      id: 'starter',
      name: 'Starter',
      credits: 100,
      price: 9,
      savings: 'Best for beginners'
    },
    {
      id: 'professional',
      name: 'Professional',
      credits: 500,
      price: 45,
      popular: true,
      savings: 'Save 10%'
    },
    {
      id: 'business',
      name: 'Business',
      credits: 2000,
      price: 180,
      savings: 'Save 20%'
    }
  ];

  // FAQs
  const faqs: FAQ[] = [
    {
      question: "How do credits work?",
      answer: "Credits are consumed based on API usage. Each API call uses a certain number of credits depending on the complexity and type of request. You can monitor your usage in real-time on the dashboard."
    },
    {
      question: "What happens when I run out of credits?",
      answer: "When your credits run low, we'll notify you via email. Your API access will be paused once credits are exhausted, but you can instantly top up by purchasing more credits."
    },
    {
      question: "How does AutoPay work?",
      answer: "AutoPay automatically purchases credits when your balance drops below 10%. You can set your preferred credit package, and we'll charge your default payment method automatically."
    },
    {
      question: "Can I get a refund?",
      answer: "Credits are non-refundable once purchased. However, unused credits never expire and remain in your account until used."
    },
    {
      question: "Is my payment information secure?",
      answer: "Yes! All payments are processed through Razorpay with bank-grade encryption. We never store your complete card details on our servers."
    },
    {
      question: "Can I purchase custom credit amounts?",
      answer: "Yes! You can purchase any amount starting from $9. Our system automatically calculates credits based on $0.09 per credit."
    },
    {
      question: "Do credits expire?",
      answer: "No! Your credits never expire. Use them at your own pace without any time pressure."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets through Razorpay payment gateway."
    }
  ];

  useEffect(() => {
    setMounted(true);
    fetchCreditBalance();
    fetchTransactions();
    if (activeView === 'calls') {
      fetchCallHistory();
      fetchCallStatistics();
    }
  }, [activeView]);


  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token') || '';
  };

  // Get userId from localStorage (or from token payload if needed)
  const getUserId = () => {
    // If you store userId separately
    const userId = localStorage.getItem('userId');
    if (userId) return userId;
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
  const fetchCreditBalance = async () => {
    try {
      const token = getAuthToken();
      console.log('\n========== FETCH CREDIT BALANCE ==========');
      console.log('🔐 Token Present:', !!token);
      console.log('🔐 Token Preview:', token ? token.substring(0, 30) + '...' : 'NO TOKEN');
      console.log('📋 API URL:', `${API_BASE_URL}/billing/credits/balance`);
      
      const userId = getUserId();
      const response = await fetch(`${API_BASE_URL}/billing/credits/balance?userId=${userId}`);
      
      console.log('📊 Response Status:', response.status, response.statusText);
      
      if (!response.ok) {
        console.error('❌ HTTP Error:', response.status);
        if (response.status === 403) {
          console.error('🔒 FORBIDDEN - Possible causes:');
          console.error('   1. Token not provided');
          console.error('   2. Token is expired');
          console.error('   3. Token is invalid');
          console.error('   4. Backend JWT_SECRET mismatch');
          console.log('💡 Solution: Log out and log back in to get a fresh token');
        }
        return;
      }
      
      const result = await response.json();
      console.log('✅ Credit Balance Response:', result);
      
      if (result.success) {
        setUserCredits(result.data);
      }
    } catch (error) {
      console.error('❌ Error fetching credit balance:', error);
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const token = getAuthToken();
      console.log('\n========== FETCH TRANSACTIONS ==========');
      console.log('🔐 Token Present:', !!token);
      console.log('📋 API URL:', `${API_BASE_URL}/billing/transactions/history?limit=10`);
      
      const userId = getUserId();
      const response = await fetch(`${API_BASE_URL}/billing/transactions/history?userId=${userId}&limit=10`);
      
      console.log('📊 Response Status:', response.status, response.statusText);
      
      if (!response.ok) {
        console.error('❌ HTTP Error:', response.status);
        return;
      }
      
      const result = await response.json();
      console.log('✅ Transactions Response:', result);
      
      if (result.success && result.data.transactions) {
        setRecentTransactions(result.data.transactions);
      }
    } catch (error) {
      console.error('❌ Error fetching transactions:', error);
    }
  };

  // Fetch call history
  const fetchCallHistory = async () => {
    try {
      const token = getAuthToken();
      console.log('\n========== FETCH CALL HISTORY ==========');
      console.log('🔐 Token Present:', !!token);
      console.log('📋 API URL:', `${API_BASE_URL}/billing/calls/history?limit=10`);
      
      const userId = getUserId();
      const response = await fetch(`${API_BASE_URL}/billing/calls/history?userId=${userId}&limit=10`);
      
      console.log('📊 Response Status:', response.status, response.statusText);
      
      if (!response.ok) {
        console.error('❌ HTTP Error:', response.status);
        return;
      }
      
      const result = await response.json();
      console.log('✅ Call History Response:', result);
      
      if (result.success && result.data.calls) {
        setCallHistory(result.data.calls);
      }
    } catch (error) {
      console.error('❌ Error fetching call history:', error);
    }
  };

  // Fetch call statistics
  const fetchCallStatistics = async () => {
    try {
      const token = getAuthToken();
      console.log('\n========== FETCH CALL STATISTICS ==========');
      console.log('🔐 Token Present:', !!token);
      console.log('📋 API URL:', `${API_BASE_URL}/billing/calls/statistics`);
      
      const userId = getUserId();
      const response = await fetch(`${API_BASE_URL}/billing/calls/statistics?userId=${userId}`);
      
      console.log('📊 Response Status:', response.status, response.statusText);
      
      if (!response.ok) {
        console.error('❌ HTTP Error:', response.status);
        return;
      }
      
      const result = await response.json();
      console.log('✅ Call Statistics Response:', result);
      
      if (result.success) {
        setCallStats(result.data);
      }
    } catch (error) {
      console.error('❌ Error fetching call statistics:', error);
    }
  };

  // Calculate credits based on amount ($0.09 per credit)
  const calculateCredits = (amount: number): number => {
    return Math.floor(amount / 0.09);
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
    let amount = 0;
    let credits = 0;
    let planName = '';

    if (isCustom) {
      amount = customAmount;
      credits = calculateCredits(customAmount);
      planName = 'Custom Plan';
    } else if (selectedPlan) {
      const plan = creditPackages.find(p => p.id === selectedPlan);
      if (!plan) return;
      amount = plan.price;
      credits = plan.credits;
      planName = plan.name;
    } else {
      alert('Please select a plan or enter custom amount');
      return;
    }

    try {
      setLoading(true);

      // Create order
const token = getAuthToken(); // Get the token
const userId = getUserId(); // Get the userId

const orderResponse = await fetch(`${API_BASE_URL}/billing/razorpay/create-order`, {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // ✅ Add this line
  },
  body: JSON.stringify({
    amount,
    credits,
    planName,
    autoPay: autoPayEnabled,
    userId // Include userId as well
  })
});

      const orderResult = await orderResponse.json();
      
      if (!orderResult.success) {
        throw new Error(orderResult.message || 'Failed to create order');
      }

      // Initialize Razorpay
      const res = await initializeRazorpay();
      if (!res) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        return;
      }

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_RenAKHL0qTaSlA",
        amount: orderResult.data.amount * 100,
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
              alert(`✅ Payment Successful! ${verifyResult.data.credits_added} credits added to your account.`);
              setShowPaymentModal(false);
              setSelectedPlan(null);
              setIsCustom(false);
              // Refresh data
              await fetchCreditBalance();
              await fetchTransactions();
            } else {
              alert('❌ Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('❌ Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#8b5cf6",
        },
        modal: {
          ondismiss: function () {
            console.log("Payment cancelled");
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
    let amount = 0;
    let credits = 0;
    let planName = '';

    if (isCustom) {
      amount = customAmount;
      credits = calculateCredits(customAmount);
      planName = 'Custom Amount';
    } else if (selectedPlan) {
      const plan = creditPackages.find(p => p.id === selectedPlan);
      if (plan) {
        amount = plan.price;
        credits = plan.credits;
        planName = plan.name;
      }
    }

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 transform transition-all animate-slideUp">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">
              Complete Your Purchase
            </h3>
            <p className="text-slate-600 font-medium">Secure payment via Razorpay</p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-50 to-purple-50 border-2 border-purple-200 rounded-2xl p-6 mb-6">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200">
              <span className="text-slate-700 font-bold">Plan:</span>
              <span className="font-black text-slate-900">{planName}</span>
            </div>
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200">
              <span className="text-slate-700 font-bold">Credits:</span>
              <span className="font-black text-purple-600 flex items-center gap-1">
                <Zap className="w-4 h-4" />
                {credits.toLocaleString()}
              </span>
            </div>
            {autoPayEnabled && (
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-200 text-sm">
                <RefreshCw className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-bold">AutoPay Enabled</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-black text-slate-900">Total:</span>
              <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ${amount}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
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
                setIsCustom(false);
                setSelectedPlan(null);
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

  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100">
        <div className="hidden lg:block">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
        <main className="flex-1 lg:ml-60 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-base text-slate-700 font-bold">Loading your billing dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100">
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
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
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

      <main className="flex-1 lg:ml-60 p-4 sm:p-8 pt-20 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300 rounded-xl px-4 py-2">
                <Gift className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-bold text-purple-700">Special Offer: Get 20% more credits on Business Plan!</span>
              </div>
            </div>
            
            {/* View Toggle Buttons */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-slate-900 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  {activeView === 'credits' ? 'Credit Management' : 'Call History'}
                </h1>
                <p className="text-base text-slate-600 font-medium">
                  {activeView === 'credits' 
                    ? 'Purchase credits, manage payments, and track your usage'
                    : 'View your call history and usage details'
                  }
                </p>
              </div>
              
              <div className="flex gap-2 bg-white rounded-xl p-2 shadow-lg border-2 border-slate-200">
                <button
                  onClick={() => setActiveView('credits')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                    activeView === 'credits'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  Credits
                </button>
                <button
                  onClick={() => setActiveView('calls')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                    activeView === 'calls'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100'
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
              {/* Credit Usage Card */}
              {mounted && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg mb-6 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Current Balance</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {userCredits.remaining}
                    </span>
                    <span className="text-base text-slate-500 font-medium">/ {userCredits.total} credits</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-slate-600">Credits Used</span>
                  <span className="text-xs font-bold text-purple-600">{userCredits.percentage.toFixed(1)}%</span>
                </div>
                <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 transition-all duration-700"
                    style={{ width: `${userCredits.percentage}%` }}
                  >
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  You've used <span className="font-bold text-purple-600">{userCredits.used}</span> credits this month
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
                <div className="text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-1.5">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-base font-bold text-slate-900">{userCredits.used}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Used</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-1.5">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-base font-bold text-slate-900">{userCredits.remaining}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Remaining</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-1.5">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-base font-bold text-slate-900">{userCredits.total}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Total</p>
                </div>
              </div>
            </div>
          )}

          {/* AutoPay Toggle */}
          {mounted && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-0.5">AutoPay</h3>
                    <p className="text-xs text-slate-600">
                      Auto-purchase credits when balance drops below 10%
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAutoPayEnabled(!autoPayEnabled)}
                  className={`relative w-16 h-8 rounded-full transition-all shadow-inner ${
                    autoPayEnabled ? 'bg-green-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                      autoPayEnabled ? 'translate-x-8' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              {autoPayEnabled && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-bold">AutoPay is active. We'll automatically purchase your preferred plan when credits are low.</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pricing Plans */}
          <div className="mb-6">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              Choose Your Plan
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {creditPackages.map((pkg) => {
                const isSelected = selectedPlan === pkg.id && !isCustom;
                
                return (
                  <div
                    key={pkg.id}
                    onClick={() => {
                      setSelectedPlan(pkg.id);
                      setIsCustom(false);
                    }}
                    className={`relative bg-white rounded-xl p-5 border cursor-pointer transition-all hover:shadow-lg ${
                      isSelected
                        ? 'border-purple-500 ring-2 ring-purple-200 shadow-lg'
                        : 'border-slate-200 shadow hover:border-purple-300'
                    } ${pkg.popular ? 'md:scale-105' : ''}`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          POPULAR
                        </div>
                      </div>
                    )}

                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}

                    <div className="text-center mb-4">
                      <h3 className="text-sm font-bold text-slate-900 mb-1">{pkg.name}</h3>
                      {pkg.savings && (
                        <p className="text-xs font-semibold text-green-600">{pkg.savings}</p>
                      )}
                    </div>

                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold text-slate-900 mb-2">
                        ${pkg.price}
                      </div>
                      <div className="inline-block bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg px-3 py-1.5 border border-purple-200">
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-bold text-purple-600">
                            {pkg.credits.toLocaleString()}
                          </span>
                          <span className="text-xs font-medium text-slate-600">credits</span>
                        </div>
                      </div>
                    </div>

                    <button
                      className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:scale-105'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select Plan'}
                      <ArrowRight className="w-5 h-5" />
                    </button>

                    <div className="mt-4 text-center text-xs text-slate-500 font-medium">
                      ${(pkg.price / pkg.credits).toFixed(2)} per credit
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Amount Section */}
            <div className="bg-gradient-to-br from-sky-50 to-sky-50 border border-sky-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Custom Amount</h3>
                  <p className="text-xs text-slate-600">Purchase any amount starting from $9</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-sky-200 mb-3">
                <label className="block text-xs font-semibold text-slate-700 mb-2">Enter Amount (USD)</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCustomAmount(Math.max(9, customAmount - 10))}
                    className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base font-bold text-slate-900">$</span>
                    <input
                      type="number"
                      min="9"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(Math.max(9, parseInt(e.target.value) || 9))}
                      className="w-full pl-9 pr-3 py-2.5 text-lg font-bold text-center border border-slate-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    />
                  </div>
                  <button
                    onClick={() => setCustomAmount(customAmount + 10)}
                    className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mt-3 text-center">
                  <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg px-4 py-2 border border-purple-200">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <span className="text-base font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {calculateCredits(customAmount).toLocaleString()}
                    </span>
                    <span className="text-sm text-slate-600 font-medium">credits</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">$0.09 per credit</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCustom(true);
                  setSelectedPlan(null);
                  setShowPaymentModal(true);
                }}
                disabled={customAmount < 9}
                className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="w-5 h-5" />
                Purchase Custom Amount
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Proceed to Payment Button */}
          {selectedPlan && !isCustom && mounted && (
            <div className="mb-6">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full bg-gradient-to-r from-purple-500 via-blue-600 to-cyan-600 hover:from-purple-600 hover:via-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
              >
                <CreditCard className="w-4 h-4" />
                Proceed to Payment
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Transaction History */}
          {mounted && (
            <div className="mb-6">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                Transaction History
              </h2>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wide">ID</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wide">Date</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wide">Credits</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wide">Amount</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wide">Method</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wide">Status</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wide">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {recentTransactions.length > 0 ? (
                        recentTransactions.map((txn) => (
                          <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-slate-900">{txn.id}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-slate-600 font-medium">{txn.date}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1">
                                <Zap className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-bold text-purple-600">{txn.credits}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-slate-900">${txn.amount}</span>
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
                              <button className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1">
                                <Download className="w-4 h-4" />
                                Download
                              </button>
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
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-600" />
                Frequently Asked Questions
              </h2>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border-b border-slate-200 last:border-b-0">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                    >
                      <span className="font-semibold text-slate-900 text-sm pr-3">
                        {faq.question}
                      </span>
                      {expandedFAQ === idx ? (
                        <ChevronUp className="w-4 h-4 text-purple-600 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {expandedFAQ === idx && (
                      <div className="px-4 pb-3">
                        <p className="text-slate-600 leading-relaxed text-xs">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Support */}
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl p-6 text-center shadow-lg mb-6">
            <div className="max-w-2xl mx-auto">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-3">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">
                Need Help?
              </h2>
              <p className="text-white/90 text-xs mb-4">
                Our support team is available 24/7 to assist you
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <a
                  href="tel:+15551234567"
                  className="bg-white hover:bg-slate-50 text-purple-600 font-semibold py-2 px-4 rounded-lg transition-all shadow-md text-xs inline-flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  +1 (555) 123-4567
                </a>
                <a
                  href="mailto:support@digitalbot.com"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all border border-white/50 text-xs inline-flex items-center justify-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  support@digitalbot.com
                </a>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/30">
                <div className="grid grid-cols-3 gap-3 text-white">
                  <div className="text-center">
                    <div className="text-sm font-bold mb-0.5">24/7</div>
                    <div className="text-[10px] font-medium text-white/80">Support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold mb-0.5">&lt;2min</div>
                    <div className="text-[10px] font-medium text-white/80">Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold mb-0.5">98%</div>
                    <div className="text-[10px] font-medium text-white/80">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Shield, title: 'Secure Payment', desc: '256-bit SSL' },
              { icon: Clock, title: 'Instant Access', desc: 'Credits added instantly' },
              { icon: Award, title: 'No Expiry', desc: 'Credits never expire' },
              { icon: RefreshCw, title: 'AutoPay', desc: 'Never run out' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 text-center border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-slate-900 mb-0.5 text-xs">{item.title}</h4>
                <p className="text-[10px] text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
            </>
          )}

          {/* Calls View */}
          {activeView === 'calls' && mounted && (
            <>
              {/* Call Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <Phone className="w-12 h-12" />
                    <div className="text-right">
                      <p className="text-3xl font-black">{callStats.totalCalls}</p>
                      <p className="text-sm font-medium opacity-90">Total Calls</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="w-12 h-12" />
                    <div className="text-right">
                      <p className="text-3xl font-black">{callStats.totalDuration}</p>
                      <p className="text-sm font-medium opacity-90">Total Duration</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <Zap className="w-12 h-12" />
                    <div className="text-right">
                      <p className="text-3xl font-black">{callStats.totalCreditsUsed}</p>
                      <p className="text-sm font-medium opacity-90">Credits Used</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Calls Table */}
              <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden mb-8">
                <div className="px-6 py-4 border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
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
                              <div className="flex items-center gap-1">
                                <Zap className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-black text-purple-600">{call.credits}</span>
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
                          <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
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
                  <BarChart3 className="w-6 h-6 text-purple-600" />
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
                          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: `${callStats.callTypes.outbound.percentage}%`}}></div>
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
                        <span className="font-black text-purple-600">{callStats.peakHours.morning.percentage}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 font-medium">Afternoon (12 PM - 5 PM)</span>
                        <span className="font-black text-purple-600">{callStats.peakHours.afternoon.percentage}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 font-medium">Evening (5 PM - 9 PM)</span>
                        <span className="font-black text-purple-600">{callStats.peakHours.evening.percentage}%</span>
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
    </div>
  );
}
