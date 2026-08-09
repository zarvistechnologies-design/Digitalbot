'use client';

import { cn } from '@/lib/utils';
import { akiaraAPI, callsAPI, doctorsAPI, promptsAPI, tankroAPI } from '@/lib/api';
import { CACHE_KEYS } from '@/lib/cache';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, BookOpen, Bot, Calendar, CalendarCheck, ClipboardList, CreditCard, Crown, FileText, IdCard, LayoutDashboard, LogOut, MapPin, Megaphone, MessageSquare, Package, PhoneCall, PlusCircle, Send, Settings, Stethoscope, Ticket, Users, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface User {
  selectedService?: string;
  bookingBusinessType?: string;
  bookingOnboardingComplete?: boolean;
  name?: string;
  email?: string;
  assignedPhoneNumber?: string;
}

let cachedDashboardUser: User | null = null;

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(cachedDashboardUser);
  const [mounted, setMounted] = useState(Boolean(cachedDashboardUser));

  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem('user');
    if (userData) {
      cachedDashboardUser = JSON.parse(userData);
      setUser(cachedDashboardUser);
    }
  }, []);

  const prefetchDashboardData = (href: string) => {
    router.prefetch(href);

    if (href === '/dashboard' || href === '/dashboard/calls') {
      void queryClient.prefetchQuery({
        queryKey: [CACHE_KEYS.CALLS],
        queryFn: async () => {
          const response = await callsAPI.getCalls({ limit: 1000 });
          return response.data.data?.calls || response.data.calls || [];
        },
        staleTime: 60_000,
      });
    } else if (
      href === '/dashboard/doctors' ||
      href === '/dashboard/availability' ||
      href === '/dashboard/book-appointment'
    ) {
      void queryClient.prefetchQuery({
        queryKey: ['doctors'],
        queryFn: async () => {
          const response = await doctorsAPI.getAll();
          return response.data.doctors || [];
        },
      });
    } else if (href === '/dashboard/prompts') {
      void queryClient.prefetchQuery({
        queryKey: ['prompts'],
        queryFn: async () => {
          const response = await promptsAPI.getAll();
          return response.data.prompts || [];
        },
      });
    } else if (href === '/dashboard/tankro-locations') {
      void queryClient.prefetchQuery({
        queryKey: ['tankro', 'summary'],
        queryFn: async () => {
          const response = await tankroAPI.getSummary();
          return {
            locations: response.data.locations || [],
            totals: response.data.totals || null,
          };
        },
      });
    } else if (href === '/dashboard/akiara-sessions') {
      void queryClient.prefetchQuery({
        queryKey: ['akiara', 'sessions', 'initial'],
        queryFn: async () => {
          const response = await akiaraAPI.getSessions({ limit: 100, historyLimit: 20 });
          return response.data?.data || [];
        },
        staleTime: 60_000,
      });
      void queryClient.prefetchQuery({
        queryKey: ['akiara', 'analytics', 7],
        queryFn: async () => {
          const response = await akiaraAPI.getAnalytics({ days: 7 });
          return response.data?.data || null;
        },
        staleTime: 30_000,
      });
    } else if (href === '/dashboard/akiara-tickets') {
      void queryClient.prefetchQuery({
        queryKey: ['akiara', 'tickets', 'initial'],
        queryFn: async () => {
          const response = await akiaraAPI.getTickets({ page: 1, limit: 100 });
          return response.data;
        },
        staleTime: 60_000,
      });
    }
  };

  const baseNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Calls', href: '/dashboard/calls', icon: PhoneCall },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  ];

  const formatServiceName = (service?: string) => {
    if (!service) return '';
    if (service === 'doctor-dashboard') return 'Doctor Dashboard';
    if (service === 'tankro') return 'Tankro Dashboard';
    return service.replace(/[-_]/g, ' ');
  };

  const getAssignedServiceLabel = () => {
    const selectedService = String(user?.selectedService || '').toLowerCase();
    const isBookingCrm = ['booking-crm', 'event-booking-crm'].includes(selectedService);
    if (isBookingCrm && user?.bookingBusinessType) {
      return `${formatServiceName(user.bookingBusinessType)} Workspace`;
    }
    return `${formatServiceName(user?.selectedService)} Service`;
  };

  const getServiceNavigation = () => {
    const selectedService = (user?.selectedService || '').toLowerCase();
    const isDoctorDashboard = ['doctor-dashboard', 'doctor dashboard', 'doctor', 'clinic-dashboard', 'healthcare'].includes(selectedService);
    const serviceItems = [];
    if (user?.selectedService === 'lead-analysis' || user?.selectedService === 'lead') {
      serviceItems.push({ name: 'Leads', href: '/dashboard/leads', icon: Users });
      serviceItems.push({ name: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone });
    }
    if (user?.selectedService === 'appointment' || isDoctorDashboard) {
      if (isDoctorDashboard) {
        serviceItems.push({ name: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone });
        serviceItems.push({ name: 'Lead Analysis', href: '/dashboard/lead-analysis', icon: Users });
        serviceItems.push({ name: 'System Agent', href: '/dashboard/system-agent', icon: Settings });
      }
      serviceItems.push({ name: 'Appointments', href: '/dashboard/appointments', icon: Calendar });
      serviceItems.push({ name: 'Book Appointment', href: '/dashboard/book-appointment', icon: PlusCircle });
      serviceItems.push({ name: 'Doctors', href: '/dashboard/doctors', icon: Stethoscope });
      serviceItems.push({ name: 'Availability', href: '/dashboard/availability', icon: CalendarCheck });

      
    }
    if (user?.selectedService === 'customer-support') {
      serviceItems.push({ name: 'Support Campaigns', href: '/dashboard/customer-support-campaigns', icon: Megaphone });
      serviceItems.push({ name: 'AI Agents', href: '/dashboard/agents', icon: Bot });
    }
    if (user?.selectedService === 'healthiQure patient navigation') {
      serviceItems.push({ name: 'Bot Sessions', href: '/dashboard/bot-sessions', icon: MessageSquare });
      serviceItems.push({ name: 'Bot Documents', href: '/dashboard/bot-documents', icon: FileText });
      serviceItems.push({ name: 'Bot Leads', href: '/dashboard/bot-leads', icon: Users });
      serviceItems.push({ name: 'Quick Messages', href: '/dashboard/quick-messages', icon: Send });
      serviceItems.push({ name: 'Templates', href: '/dashboard/templates', icon: FileText });
      serviceItems.push({ name: 'Patient Contacts', href: '/dashboard/bot-contacts', icon: Send });
      
    }
    if (user?.selectedService === 'akiara') {
      serviceItems.push({ name: 'Bot Sessions', href: '/dashboard/akiara-sessions', icon: MessageSquare });
      serviceItems.push({ name: 'Tickets', href: '/dashboard/akiara-tickets', icon: Ticket });
      serviceItems.push({ name: 'Messages', href: '/dashboard/akiara-messages', icon: Send });
      serviceItems.push({ name: 'Knowledge Base', href: '/dashboard/akiara-knowledge', icon: BookOpen });
      serviceItems.push({ name: 'Settings', href: '/dashboard/akiara-settings', icon: Settings });
    }
    if (user?.selectedService === 'visiva-bot' || user?.selectedService === 'visiva bot') {
      serviceItems.push({ name: 'Leads', href: '/dashboard/leads', icon: Users });
      serviceItems.push({ name: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone });
      serviceItems.push({ name: 'Bot Sessions', href: '/dashboard/visiva-bot/sessions', icon: MessageSquare });
      serviceItems.push({ name: 'Bot Leads', href: '/dashboard/visiva-bot/leads', icon: Users });
      serviceItems.push({ name: 'Quick Messages', href: '/dashboard/visiva-bot/messages', icon: Send });
      serviceItems.push({ name: 'Templates', href: '/dashboard/visiva-bot/templates', icon: FileText });
    }
    if (selectedService === 'tankro' || selectedService === 'tankro-dashboard') {
      serviceItems.push({ name: 'Locations', href: '/dashboard/tankro-locations', icon: MapPin });
      serviceItems.push({ name: 'Service Bookings', href: '/dashboard/tankro-bookings', icon: ClipboardList });
      serviceItems.push({ name: 'Bot Sessions', href: '/dashboard/tankro-sessions', icon: MessageSquare });
    }
    if (['event-booking-crm', 'event booking crm', 'event-booking', 'event', 'events', 'booking-crm', 'booking crm', 'booking'].includes(selectedService)) {
      serviceItems.push({ name: 'Booking CRM', href: '/dashboard/booking-crm', icon: Package });
      serviceItems.push({ name: 'Bulk Campaigns', href: '/dashboard/booking-crm/bulk-campaigns', icon: Megaphone });
      serviceItems.push({ name: 'Follow-ups', href: '/dashboard/booking-crm/follow-ups', icon: ClipboardList });
    }
    if (['casino', 'ballys', "bally's casino", 'ballys-casino'].includes(selectedService)) {
      serviceItems.push({ name: 'Reservations', href: '/dashboard/casino-reservations', icon: CalendarCheck });
      serviceItems.push({ name: 'VIP Guests', href: '/dashboard/casino-vip-guests', icon: Crown });
      serviceItems.push({ name: 'Membership', href: '/dashboard/casino-membership', icon: IdCard });
      serviceItems.push({ name: 'Guest Messages', href: '/dashboard/casino-messages', icon: MessageSquare });
      serviceItems.push({ name: 'Grievances', href: '/dashboard/casino-grievances', icon: AlertTriangle });
      serviceItems.push({ name: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone });
    }
    return serviceItems;
  };

  const isAkiara = user?.selectedService === 'akiara';
  const ishealthiQurepatientnavigation = user?.selectedService === 'healthiQure patient navigation';
  const navigation = isAkiara || ishealthiQurepatientnavigation
    ? [{ name: 'Billing', href: '/dashboard/billing', icon: CreditCard }, ...getServiceNavigation()]
    : [...baseNavigation, ...getServiceNavigation()];

  const handleLogout = () => {
    cachedDashboardUser = null;
    queryClient.clear();
    sessionStorage.removeItem('digitalbot-query-cache-v1');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  // Wait for client-side mount to prevent hydration mismatch
  if (!mounted) {
    // Return a loading skeleton that matches the structure
    return (
      <>
        {/* Desktop Sidebar Skeleton */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-40">
          <div className="flex flex-col grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center shrink-0 px-4">
              <h1 className="text-2xl font-bold text-orange-600">
                DigitalBot
              </h1>
            </div>
            <div className="mt-8 flex-1 px-2 space-y-2">
              {/* Loading skeleton */}
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-700 bg-opacity-60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-40">
        <div className="flex flex-col grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">

          {/* Logo */}
          <div className="flex items-center shrink-0 px-4">
            <h1 className="text-2xl font-bold text-orange-600">
              DigitalBot
            </h1>
          </div>

          {/* User Info */}
          {user && (
            <div className="mt-6 px-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-600">{user.email}</p>
                {user.assignedPhoneNumber && (
                  <p className="text-xs text-gray-700 mt-1">
                    <span className="font-semibold">Assigned Number:</span> {user.assignedPhoneNumber}
                  </p>
                )}
                <p className="text-xs text-orange-600 mt-1 capitalize">
                  {getAssignedServiceLabel()}
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="mt-8 flex-1 px-2 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onMouseEnter={() => prefetchDashboardData(item.href)}
                  onFocus={() => prefetchDashboardData(item.href)}
                  className={cn(
                    isActive
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-white',
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 shrink-0 h-5 w-5'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="shrink-0 flex border-t border-gray-200 p-4 mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white font-semibold shadow-lg hover:bg-orange-700 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-lg"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-orange-600">
                  DigitalBot
                </h1>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {user && (
                <div className="mt-4 px-4">
                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Assigned Number:{user.assignedPhoneNumber}
                    </p>
                    <p className="text-xs text-orange-600 mt-1 capitalize">
                      {getAssignedServiceLabel()}
                    </p>
                  </div>
                </div>
              )}

              <nav className="mt-8 flex-1 px-2 space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onMouseEnter={() => prefetchDashboardData(item.href)}
                      onFocus={() => prefetchDashboardData(item.href)}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        isActive
                          ? 'bg-orange-600 text-white shadow-md'
                          : 'text-gray-700 hover:text-orange-600 hover:bg-white',
                        'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all'
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500',
                          'mr-3 shrink-0 h-5 w-5'
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="shrink-0 flex border-t border-gray-200 p-4 mt-auto">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white font-semibold shadow-lg hover:bg-orange-700 transition"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
