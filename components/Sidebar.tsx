'use client';

import { cn } from '@/lib/utils';
import { akiaraAPI, authAPI, callsAPI, campaignsAPI, connectorsAPI, doctorsAPI, promptsAPI, tankroAPI, type VoiceConnector } from '@/lib/api';
import { CACHE_KEYS, clearCache } from '@/lib/cache';
import { DASHBOARD_QUERY_KEYS } from '@/lib/dashboard-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, BarChart3, BookOpen, Bot, Cable, Calendar, CalendarCheck, ChevronDown, ChevronUp, ClipboardList, CreditCard, Crown, FileText, FlaskConical, IdCard, LayoutDashboard, LogOut, MapPin, Megaphone, MessageSquare, Package, PhoneCall, PlusCircle, Send, Settings, Share2, Stethoscope, TestTube2, Ticket, Users, X } from 'lucide-react';
import Image from 'next/image';
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
let cachedVerifiedSelectedService: string | null = null;
let cachedConnectedAgents: VoiceConnector[] = [];

function ConnectedAgentNumbers({ connectors }: { connectors: VoiceConnector[] }) {
  const visibleConnectors = connectors.filter((connector) => Boolean(connector.externalPhoneNumber));
  if (visibleConnectors.length === 0) return null;

  return (
    <div className="mt-3 border-t border-zinc-200 pt-3">
      <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Voice connected
      </div>
      <div className="space-y-2.5">
        {visibleConnectors.map((connector) => (
          <div key={connector.id} className="flex min-w-0 items-start gap-2.5">
            <PhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-zinc-900">{connector.externalPhoneNumber}</p>
              <p className="truncate text-[11px] text-zinc-500">
                {connector.externalAgentName || connector.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(cachedDashboardUser);
  const [mounted, setMounted] = useState(Boolean(cachedDashboardUser));
  const [verifiedSelectedService, setVerifiedSelectedService] = useState<string | null>(cachedVerifiedSelectedService);
  const [profileOpen, setProfileOpen] = useState(false);
  const { data: connectedAgents = cachedConnectedAgents } = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.connectors,
    queryFn: async () => {
      const response = await connectorsAPI.list();
      return response.data.connectors || [];
    },
    enabled: Boolean(user),
    initialData: cachedConnectedAgents.length ? cachedConnectedAgents : undefined,
    select: (connectors) => connectors.filter(
      (connector) => connector.status === 'active' && Boolean(connector.externalAgentId)
    ),
    staleTime: 60_000,
    refetchInterval: 120_000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        cachedDashboardUser = JSON.parse(userData);
        setUser(cachedDashboardUser);
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let cancelled = false;
    const verifyWorkspace = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        if (cancelled) return;
        const currentUser = response.data;
        const nextUser = { ...(cachedDashboardUser || {}), ...currentUser };
        const selectedService = String(currentUser.selectedService || '').trim().toLowerCase();
        cachedDashboardUser = nextUser;
        cachedVerifiedSelectedService = selectedService;
        setUser(nextUser);
        setVerifiedSelectedService(selectedService);
        localStorage.setItem('user', JSON.stringify(nextUser));
      } catch {}
    };

    void verifyWorkspace();
    return () => {
      cancelled = true;
    };
  }, [mounted]);

  useEffect(() => {
    cachedConnectedAgents = user ? connectedAgents : [];
  }, [connectedAgents, user]);

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
    } else if (href === '/dashboard/campaigns') {
      void queryClient.prefetchQuery({
        queryKey: DASHBOARD_QUERY_KEYS.campaigns,
        queryFn: async () => {
          const response = await campaignsAPI.getCampaigns({ type: 'voice' });
          return response.data.data?.campaigns || response.data.campaigns || [];
        },
        staleTime: 60_000,
      });
    } else if (
      href === '/dashboard/doctors' ||
      href === '/dashboard/availability' ||
      href === '/dashboard/book-appointment' ||
      href === '/dashboard/share-schedule'
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

  const isPathologyService = String(user?.selectedService || '').toLowerCase() === 'pathology-diagnostic';
  const baseNavigation = [
    { name: isPathologyService ? 'Diagnostic Center' : 'Dashboard', href: isPathologyService ? '/dashboard/pathology' : '/dashboard', icon: LayoutDashboard },
    { name: 'Calls', href: '/dashboard/calls', icon: PhoneCall },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  ];
  const pathologyNavigation = [
    { name: 'Dashboard', href: '/dashboard/pathology', icon: LayoutDashboard },
    { name: 'Calls', href: '/dashboard/calls', icon: PhoneCall },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Connectors', href: '/dashboard/connectors', icon: Cable },
    { name: 'Bookings', href: '/dashboard/pathology/bookings', icon: ClipboardList },
    { name: 'Patients', href: '/dashboard/pathology/patients', icon: Users },
    { name: 'Sample Tracking', href: '/dashboard/pathology/samples', icon: TestTube2 },
    { name: 'Reports', href: '/dashboard/pathology/reports', icon: FileText },
    { name: 'WhatsApp Inbox', href: '/dashboard/pathology/whatsapp', icon: MessageSquare },
    { name: 'WhatsApp AI Setup', href: '/dashboard/pathology/whatsapp-ai', icon: Bot },
    { name: 'Test Catalog', href: '/dashboard/pathology/tests', icon: FlaskConical },
    { name: 'Doctors & Referrals', href: '/dashboard/pathology/referrals', icon: Stethoscope },
  ];

  const formatServiceName = (service?: string) => {
    if (!service) return '';
    if (service === 'doctor-dashboard') return 'Doctor Dashboard';
    if (service === 'appointment-whatsapp' || service === 'doctor-whatsapp') return 'Doctor Desk';
    if (service === 'tankro') return 'Tankro Dashboard';
    if (service === 'pathology-diagnostic') return 'Pathology Diagnostic Center';
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
    const isAppointmentWhatsApp = ['appointment-whatsapp', 'appointment whatsapp', 'doctor-whatsapp'].includes(selectedService);
    const isDoctorDashboard = ['doctor-dashboard', 'doctor dashboard', 'doctor', 'clinic-dashboard', 'healthcare'].includes(selectedService);
    const serviceItems = [];
    if (
      (selectedService === 'lead-analysis' || selectedService === 'lead') &&
      (verifiedSelectedService === 'lead-analysis' || verifiedSelectedService === 'lead')
    ) {
      serviceItems.push({ name: 'Analyzer', href: '/dashboard/leads', icon: BarChart3 });
      serviceItems.push({ name: 'Leads', href: '/dashboard/qualified-leads', icon: Users });
      serviceItems.push({ name: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone });
      if (connectedAgents.some((connector) => connector.provider === 'vozon')) {
        serviceItems.push({ name: 'Agent Knowledge', href: '/dashboard/agent-knowledge', icon: BookOpen });
      }
    }
    if (user?.selectedService === 'appointment' || isAppointmentWhatsApp || isDoctorDashboard) {
      serviceItems.push({ name: 'Appointments', href: '/dashboard/appointments', icon: Calendar });
      serviceItems.push({ name: 'Book Appointment', href: '/dashboard/book-appointment', icon: PlusCircle });
      serviceItems.push({ name: 'Doctors', href: '/dashboard/doctors', icon: Stethoscope });
      serviceItems.push({ name: 'Availability', href: '/dashboard/availability', icon: CalendarCheck });
      serviceItems.push({ name: 'Share Schedule', href: '/dashboard/share-schedule', icon: Share2 });
      if (isDoctorDashboard) {
        serviceItems.push({ name: 'Connectors', href: '/dashboard/connectors', icon: Cable });
      }
      if (isAppointmentWhatsApp) {
        serviceItems.push({ name: 'Patient Inbox', href: '/dashboard/doctor-whatsapp', icon: MessageSquare });
      }

      
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
      serviceItems.push({ name: 'Analyzer', href: '/dashboard/leads', icon: BarChart3 });
      serviceItems.push({ name: 'Leads', href: '/dashboard/qualified-leads', icon: Users });
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
      serviceItems.push({ name: 'Booking Workspace', href: '/dashboard/booking-crm', icon: Package });
      serviceItems.push({ name: 'Bulk Campaigns', href: '/dashboard/campaigns', icon: Megaphone });
      serviceItems.push({ name: 'Follow-ups', href: '/dashboard/booking-crm/follow-ups', icon: ClipboardList });
    }
    if (!serviceItems.some((item) => item.href === '/dashboard/connectors')) {
      serviceItems.push({ name: 'Connectors', href: '/dashboard/connectors', icon: Cable });
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
  const navigation = isPathologyService
    ? pathologyNavigation
    : isAkiara || ishealthiQurepatientnavigation
      ? [{ name: 'Billing', href: '/dashboard/billing', icon: CreditCard }, ...getServiceNavigation()]
      : [...baseNavigation, ...getServiceNavigation()];

  const handleLogout = () => {
    cachedDashboardUser = null;
    cachedVerifiedSelectedService = null;
    cachedConnectedAgents = [];
    queryClient.clear();
    clearCache();
    sessionStorage.removeItem('digitalbot-query-cache-v1');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const isNavigationActive = (href: string) =>
    href === '/dashboard'
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  const renderSidebarContent = (mobile = false) => (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 px-6">
        <Link href="/dashboard" aria-label="DigitalBot dashboard" className="text-xl font-bold tracking-tight text-zinc-950">
          <span className="text-orange-600">Digital</span>Bot
        </Link>
        {mobile && (
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
            className="grid h-9 w-9 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="shrink-0 px-6 pb-2 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Workspace</p>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-6 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {navigation.map((item) => {
          const isActive = isNavigationActive(item.href);
          return (
            <Link
              key={`${item.name}-${item.href}`}
              href={item.href}
              onMouseEnter={() => prefetchDashboardData(item.href)}
              onFocus={() => prefetchDashboardData(item.href)}
              onClick={() => mobile && setSidebarOpen(false)}
              className={cn(
                'group relative flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-orange-50 text-orange-700'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
              )}
            >
              {isActive && <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-orange-600" />}
              <item.icon
                className={cn(
                  'h-[18px] w-[18px] shrink-0',
                  isActive ? 'text-orange-600' : 'text-zinc-400 group-hover:text-zinc-700'
                )}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="relative shrink-0 border-t border-zinc-200 px-6 py-3">
          {profileOpen && (
            <div className="absolute bottom-[calc(100%+8px)] left-6 right-6 z-10 rounded-lg border border-zinc-200 bg-white p-3 shadow-xl">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-zinc-900 text-xs font-bold text-white">
                  {String(user.name || user.email || 'DB').slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-zinc-950">{user.name || 'Workspace user'}</p>
                  <p className="truncate text-xs text-zinc-500">{user.email}</p>
                </div>
              </div>
              <p className="mt-3 truncate text-[10px] font-semibold uppercase tracking-wide text-orange-700">
                {getAssignedServiceLabel()}
              </p>
              {user.assignedPhoneNumber && (
                <div className="mt-2 flex min-w-0 items-center gap-2 text-xs text-zinc-600">
                  <PhoneCall className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate font-semibold">{user.assignedPhoneNumber}</span>
                </div>
              )}
              <ConnectedAgentNumbers connectors={connectedAgents} />
              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-md bg-zinc-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-rose-700"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            aria-expanded={profileOpen}
            className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-zinc-100"
          >
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-zinc-900 text-[11px] font-bold text-white">
              {String(user.name || user.email || 'DB').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-900">{user.name || 'Workspace user'}</p>
              <p className="truncate text-[11px] text-zinc-500">View profile</p>
            </div>
            {profileOpen ? <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" /> : <ChevronUp className="h-4 w-4 shrink-0 text-zinc-400" />}
          </button>
        </div>
      )}
    </div>
  );
  if (!mounted) {
    return (
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-zinc-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b border-zinc-200 px-4">
          <div className="h-9 w-36 animate-pulse rounded-md bg-zinc-100" />
        </div>
        <div className="space-y-3 p-4">
          <div className="h-28 animate-pulse rounded-lg bg-zinc-100" />
          <div className="h-10 animate-pulse rounded-md bg-zinc-100" />
          <div className="h-10 animate-pulse rounded-md bg-zinc-100" />
          <div className="h-10 animate-pulse rounded-md bg-zinc-100" />
        </div>
      </aside>
    );
  }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-zinc-200 bg-white shadow-[4px_0_18px_rgba(24,24,27,0.03)] lg:block">
        {renderSidebarContent()}
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-zinc-950/45 backdrop-blur-[2px] lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] max-w-[86vw] border-r border-zinc-200 bg-white shadow-2xl lg:hidden"
            >
              {renderSidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
