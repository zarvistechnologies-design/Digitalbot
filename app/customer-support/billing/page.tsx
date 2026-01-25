"use client"
import { useState } from "react";
import { CreditCard, Check, Zap, Crown, Building, ArrowRight, Phone, MessageSquare, BarChart3, Headphones } from "lucide-react";

type PlanType = 'starter' | 'professional' | 'enterprise';

const plans = [
  {
    id: 'starter' as PlanType,
    name: 'Starter',
    description: 'Perfect for small teams getting started',
    price: 49,
    icon: Zap,
    color: 'blue',
    features: [
      '500 AI calls/month',
      '2 Campaigns',
      'Basic analytics',
      'Email support',
      '1 Phone number',
      'Standard voice quality',
    ],
    popular: false,
  },
  {
    id: 'professional' as PlanType,
    name: 'Professional',
    description: 'For growing businesses with advanced needs',
    price: 149,
    icon: Crown,
    color: 'cyan',
    features: [
      '5,000 AI calls/month',
      '10 Campaigns',
      'Advanced analytics & reports',
      'Priority support',
      '5 Phone numbers',
      'HD voice quality',
      'Sentiment analysis',
      'Custom AI training',
    ],
    popular: true,
  },
  {
    id: 'enterprise' as PlanType,
    name: 'Enterprise',
    description: 'For large organizations with custom requirements',
    price: 499,
    icon: Building,
    color: 'purple',
    features: [
      'Unlimited AI calls',
      'Unlimited Campaigns',
      'Custom analytics dashboard',
      '24/7 dedicated support',
      'Unlimited phone numbers',
      'Ultra HD voice quality',
      'Advanced AI features',
      'Custom integrations',
      'SLA guarantee',
      'Dedicated account manager',
    ],
    popular: false,
  },
];

const usageStats = {
  callsUsed: 342,
  callsLimit: 500,
  campaignsUsed: 2,
  campaignsLimit: 2,
  currentPlan: 'starter' as PlanType,
  billingCycle: 'Monthly',
  nextBillingDate: 'Feb 25, 2026',
};

export default function CustomerSupportBilling() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(usageStats.currentPlan);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200', gradient: 'from-blue-500 to-blue-600' };
      case 'cyan': return { bg: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-200', gradient: 'from-cyan-500 to-teal-600' };
      case 'purple': return { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200', gradient: 'from-purple-500 to-indigo-600' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', gradient: 'from-gray-500 to-gray-600' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Plans</h1>
        <p className="text-gray-600">Manage your subscription and billing details</p>
      </div>

      {/* Current Usage */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Current Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calls Usage */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">AI Calls</div>
                <div className="font-bold text-gray-900">{usageStats.callsUsed} / {usageStats.callsLimit}</div>
              </div>
            </div>
            <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                style={{ width: `${(usageStats.callsUsed / usageStats.callsLimit) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-2">{Math.round((usageStats.callsUsed / usageStats.callsLimit) * 100)}% used this month</div>
          </div>

          {/* Campaigns Usage */}
          <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-4 border border-cyan-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Campaigns</div>
                <div className="font-bold text-gray-900">{usageStats.campaignsUsed} / {usageStats.campaignsLimit}</div>
              </div>
            </div>
            <div className="h-2 bg-cyan-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                style={{ width: `${(usageStats.campaignsUsed / usageStats.campaignsLimit) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-2">{usageStats.campaignsUsed} active campaigns</div>
          </div>

          {/* Billing Info */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Current Plan</div>
                <div className="font-bold text-gray-900 capitalize">{usageStats.currentPlan}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <div>Billing: {usageStats.billingCycle}</div>
              <div>Next billing: {usageStats.nextBillingDate}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-xl p-1 shadow-md border border-gray-200 inline-flex">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              billingCycle === 'annual'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Annual <span className="text-green-500 text-xs ml-1">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => {
          const colors = getColorClasses(plan.color);
          const isCurrentPlan = plan.id === usageStats.currentPlan;
          const price = billingCycle === 'annual' ? Math.round(plan.price * 0.8) : plan.price;
          
          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular ? 'border-cyan-400 ring-2 ring-cyan-200' : 'border-gray-200 hover:border-blue-300'
              } ${isCurrentPlan ? 'ring-2 ring-blue-400' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}
              
              {isCurrentPlan && (
                <div className="absolute -top-3 right-4 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                  CURRENT
                </div>
              )}

              <div className="p-6">
                {/* Plan Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                    <plan.icon className={`h-6 w-6 ${colors.text}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-500">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-gray-900">${price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <div className="text-sm text-green-600 font-medium">Save ${(plan.price * 12 * 0.2).toFixed(0)}/year</div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className={`h-5 w-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    isCurrentPlan
                      ? 'bg-gray-100 text-gray-500 cursor-default'
                      : `bg-gradient-to-r ${colors.gradient} text-white hover:shadow-lg hover:scale-[1.02]`
                  }`}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? 'Current Plan' : 'Upgrade Now'}
                  {!isCurrentPlan && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">Can I change my plan anytime?</h3>
            <p className="text-gray-600 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">What happens if I exceed my call limit?</h3>
            <p className="text-gray-600 text-sm">You&apos;ll receive notifications as you approach your limit. Additional calls are billed at $0.10/call.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
            <p className="text-gray-600 text-sm">Yes! All new accounts get 14 days free trial with full access to Professional features.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
