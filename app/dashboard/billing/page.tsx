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
  }>({ name: '', email: '', assignedPhoneNumber: '' });

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

  // Predefined plans (1 credit = ₹1, dollar to INR conversion)
  const creditPackages: CreditPackage[] = [
    {
      id: 'starter',
      name: 'Starter',
      credits: 829,
      price: 9,
      savings: 'Best for beginners'
    },
    {
      id: 'professional',
      name: 'Professional',
      credits: 4145,
      price: 45,
      popular: true,
      savings: 'Save 10%'
    },
    {
      id: 'business',
      name: 'Business',
      credits: 16580,
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
      answer: "Yes! You can purchase any amount starting from $9. Our system automatically calculates credits based on the current USD to INR conversion rate."
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
    fetchUserInfo();
    fetchCreditBalance();
    fetchTransactions();
    if (activeView === 'calls') {
      fetchCallHistory();
      fetchCallStatistics();
    }
  }, [activeView]);

  // Fetch user info from backend
  const fetchUserInfo = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setUserInfo({
            name: data.name || '',
            email: data.email || '',
            assignedPhoneNumber: data.assignedPhoneNumber || '',
          });
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

  // Calculate credits based on amount (~₹92.11 credits per $1)
  const calculateCredits = (amount: number): number => {
    return Math.floor(amount * 92.11);
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

      // Razorpay options - use user info fetched from backend
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_RenAKHL0qTaSlA",
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
                razorpay_signature: response.razorpay_signature,
                userId // Include userId for payment verification
              })
            });

            const verifyResult = await verifyResponse.json();

            if (verifyResult.success) {
              setShowPaymentModal(false);
              setSelectedPlan(null);
              setIsCustom(false);
              // Refresh data
              await fetchCreditBalance();
              await fetchTransactions();
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
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { height: 100%; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; background: #e2e8f0; padding: 0; -webkit-font-smoothing: antialiased; }

  .page { max-width: 800px; margin: 0 auto; background: #fff; overflow: hidden; position: relative; min-height: 100vh; display: flex; flex-direction: column; }

  /* === HERO HEADER === */
  .hero {
    background: linear-gradient(135deg, #0f0a2e 0%, #1a1145 30%, #2d1b69 60%, #1e1b4b 100%);
    padding: 28px 36px 40px;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute;
    top: -60%; right: -20%;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%);
    border-radius: 50%;
  }
  .hero::after {
    content: '';
    position: absolute;
    bottom: -40%; left: -10%;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%);
    border-radius: 50%;
  }
  .hero-content { position: relative; z-index: 1; }
  .hero-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
  .logo-group { display: flex; align-items: center; gap: 10px; }
  .logo-circle {
    width: 40px; height: 40px;
    background: linear-gradient(135deg, #8b5cf6, #6366f1);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 18px rgba(139,92,246,0.4);
  }
  .logo-circle svg { width: 20px; height: 20px; fill: white; }
  .logo-text { color: white; }
  .logo-title { font-size: 18px; font-weight: 800; letter-spacing: -0.5px; }
  .logo-title em { font-style: normal; color: #a78bfa; }
  .logo-sub { font-size: 9px; color: #818cf8; letter-spacing: 2px; text-transform: uppercase; margin-top: 1px; }

  .inv-tag {
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 10px 16px;
    text-align: right;
  }
  .inv-tag-label { font-size: 9px; color: #818cf8; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; }
  .inv-tag-num { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #e0e7ff; font-weight: 700; margin-top: 2px; }

  /* Amount showcase */
  .amount-showcase {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 18px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .amount-label { font-size: 9px; color: #818cf8; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin-bottom: 4px; }
  .amount-value { font-size: 36px; font-weight: 800; color: white; letter-spacing: -2px; line-height: 1; }
  .amount-value .currency { font-size: 20px; color: #a78bfa; vertical-align: top; margin-right: 2px; }
  .amount-meta { display: flex; gap: 18px; margin-top: 8px; }
  .amount-meta-item { display: flex; align-items: center; gap: 5px; }
  .meta-dot { width: 6px; height: 6px; border-radius: 50%; }
  .meta-dot.green { background: #34d399; box-shadow: 0 0 6px rgba(52,211,153,0.5); }
  .meta-dot.purple { background: #a78bfa; box-shadow: 0 0 6px rgba(167,139,250,0.5); }
  .meta-text { font-size: 10px; color: #94a3b8; }
  .meta-text strong { color: #e0e7ff; }

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
    background: linear-gradient(135deg, #faf5ff 0%, #f0f9ff 100%);
    border: 1px solid #e9d5ff;
    border-radius: 10px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
  }
  .item-icon-wrap {
    width: 42px; height: 42px;
    background: linear-gradient(135deg, #7c3aed, #6366f1);
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
  .footer-wave::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 24px;
    background: #0f0a2e;
    clip-path: ellipse(60% 100% at 50% 100%);
  }
  .footer-main {
    background: #0f0a2e;
    padding: 14px 36px 18px;
    display: flex; justify-content: space-between; align-items: flex-end;
  }
  .footer-left {}
  .footer-brand2 { font-size: 14px; font-weight: 800; color: white; margin-bottom: 2px; }
  .footer-brand2 em { font-style: normal; color: #a78bfa; }
  .footer-desc { font-size: 10px; color: #6366f1; line-height: 1.5; }
  .footer-right2 { text-align: right; }
  .footer-link { font-size: 10px; color: #818cf8; text-decoration: none; display: block; line-height: 1.8; }
  .footer-note2 {
    background: #0a0720;
    padding: 8px 36px;
    text-align: center;
    font-size: 9px; color: #4338ca;
    border-top: 1px solid rgba(99,102,241,0.1);
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
          <div class="amount-value"><span class="currency">$</span>${invoiceData.amount.toFixed(2)}</div>
          <div class="amount-meta">
            <div class="amount-meta-item">
              <span class="meta-dot green"></span>
              <span class="meta-text"><strong>${invoiceData.credits.toLocaleString()}</strong> credits</span>
            </div>
            <div class="amount-meta-item">
              <span class="meta-dot purple"></span>
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
        <div class="item-price">$${invoiceData.amount.toFixed(2)}</div>
        <div class="item-rate">@ $${(invoiceData.amount / invoiceData.credits).toFixed(4)} per credit</div>
      </div>
    </div>

    <!-- BREAKDOWN -->
    <div class="section-title">Payment Summary</div>
    <div class="breakdown">
      <div class="brk-row">
        <span class="brk-label">${invoiceData.planName} (${invoiceData.credits.toLocaleString()} credits)</span>
        <span class="brk-value">$${invoiceData.amount.toFixed(2)}</span>
      </div>
      <div class="brk-row">
        <span class="brk-label">Platform Fee</span>
        <span class="brk-value muted">$0.00</span>
      </div>
      <div class="brk-row">
        <span class="brk-label">Tax</span>
        <span class="brk-value muted">$0.00</span>
      </div>
      <div class="brk-row brk-total">
        <span class="brk-label">Total Charged</span>
        <span class="brk-value">$${invoiceData.amount.toFixed(2)}</span>
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
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
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
              <span className="text-sm text-slate-600 font-medium">Plan</span>
              <span className="text-sm font-bold text-slate-900">{successData.planName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 font-medium">Amount Paid</span>
              <span className="text-sm font-bold text-slate-900">${successData.amount}</span>
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
              <span className="text-lg font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
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
              className="flex-1 bg-white border-2 border-purple-200 hover:border-purple-400 text-purple-700 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
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
                  <p className="text-xs text-slate-500 mt-1.5">1 credit = ₹1</p>
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
                                  className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
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
      <SuccessModal />
    </div>
  );
}
