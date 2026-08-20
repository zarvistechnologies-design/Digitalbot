'use client';

import { cn } from '@/lib/utils';
import { agentKnowledgeAPI, akiaraAPI, authAPI, callsAPI, campaignsAPI, connectorsAPI, doctorsAPI, promptsAPI, tankroAPI, type VoiceConnector } from '@/lib/api';
import { CACHE_KEYS, clearCache } from '@/lib/cache';
import { DASHBOARD_QUERY_KEYS } from '@/lib/dashboard-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, BarChart3, BookOpen, Bot, Cable, Calendar, CalendarCheck, ChevronDown, ChevronUp, ClipboardList, CreditCard, Crown, FileText, FlaskConical, IdCard, LayoutDashboard, LogOut, MapPin, Megaphone, MessageSquare, Package, PhoneCall, PlusCircle, Send, Settings, Share2, Stethoscope, TestTube2, Ticket, Users, X } from 'lucide-react';
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
  legacyPhoneFallback?: boolean;
  legacyAgentKnowledgeEnabled?: boolean;
  connectorManagementEnabled?: boolean;
}

let cachedDashboardUser: User | null = null;
let cachedVerifiedSelectedService: string | null = null;
let cachedConnectedAgents: VoiceConnector[] = [];

function ConnectedAgentNumbers({ connectors }: { connectors: VoiceConnector[] }) {
  const visibleConnectors = connectors.filter((connector) => Boolean(connector.externalPhoneNumber));
  if (visibleConnectors.length === 0) return null;

  return (
    <div className="mt-3 border-t border-slate-200 pt-3">
      <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-orange-700">
        <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
        Voice connected
      </div>
      <div className="space-y-2.5">
        {visibleConnectors.map((connector) => (
          <div key={connector.id} className="flex min-w-0 items-start gap-2.5">
            <PhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div className="min-w-0">
              <p className="truncate text-xs font-bold font-mono text-slate-900">{connector.externalPhoneNumber}</p>
              <p className="truncate text-[11px] text-slate-500">
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
    enabled: Boolean(user) && user?.connectorManagementEnabled !== false,
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

    if (href === '/dashboard') {
      void queryClient.prefetchQuery({
        queryKey: [CACHE_KEYS.DASHBOARD_CALLS_SUMMARY],
        queryFn: async () => {
          const response = await callsAPI.getCalls({ limit: 1000, view: 'summary' });
          return response.data.data?.calls || response.data.calls || [];
        },
        staleTime: 60_000,
      });
    } else if (href === '/dashboard/calls') {
      void queryClient.prefetchQuery({
        queryKey: [CACHE_KEYS.CALLS],
        queryFn: async () => {
          const response = await callsAPI.getCalls({ limit: 50 });
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
    } else if (href === '/dashboard/agent-knowledge') {
      void queryClient.prefetchQuery({
        queryKey: ['agent-knowledge'],
        queryFn: async () => {
          const response = await agentKnowledgeAPI.list();
          return response.data.connections || [];
        },
        staleTime: 15_000,
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
  const connectorNavigationEnabled = user?.connectorManagementEnabled === true;
  const baseNavigation = [
    { name: isPathologyService ? 'Diagnostic Center' : 'Dashboard', href: isPathologyService ? '/dashboard/pathology' : '/dashboard', icon: LayoutDashboard },
    { name: 'Calls', href: '/dashboard/calls', icon: PhoneCall },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  ];
  const pathologyNavigation = [
    { name: 'Dashboard', href: '/dashboard/pathology', icon: LayoutDashboard },
    { name: 'Calls', href: '/dashboard/calls', icon: PhoneCall },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    ...(connectorNavigationEnabled ? [{ name: 'Connectors', href: '/dashboard/connectors', icon: Cable }] : []),
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
      if (
        user?.legacyPhoneFallback === false
        || user?.legacyAgentKnowledgeEnabled
      ) {
        serviceItems.push({ name: 'Agent Knowledge', href: '/dashboard/agent-knowledge', icon: BookOpen });
      }
    }
    if (user?.selectedService === 'appointment' || isAppointmentWhatsApp || isDoctorDashboard) {
      serviceItems.push({ name: 'Appointments', href: '/dashboard/appointments', icon: Calendar });
      serviceItems.push({ name: 'Book Appointment', href: '/dashboard/book-appointment', icon: PlusCircle });
      serviceItems.push({ name: 'Doctors', href: '/dashboard/doctors', icon: Stethoscope });
      serviceItems.push({ name: 'Availability', href: '/dashboard/availability', icon: CalendarCheck });
      serviceItems.push({ name: 'Share Schedule', href: '/dashboard/share-schedule', icon: Share2 });
      if (isDoctorDashboard && connectorNavigationEnabled) {
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
    if (connectorNavigationEnabled && !serviceItems.some((item) => item.href === '/dashboard/connectors')) {
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
      ? getServiceNavigation()
      : [...baseNavigation, ...getServiceNavigation()];
  const navigationKey = navigation.map((item) => item.href).join('|');

  useEffect(() => {
    if (!mounted || !navigationKey) return;
    const routeTimer = window.setTimeout(() => {
      navigation.forEach((item) => router.prefetch(item.href));
    }, 300);
    const dataTimer = window.setTimeout(() => {
      navigation.forEach((item) => prefetchDashboardData(item.href));
    }, 1200);
    return () => {
      window.clearTimeout(routeTimer);
      window.clearTimeout(dataTimer);
    };
  }, [mounted, navigationKey, router]);

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

  // Wait for client-side mount to prevent hydration mismatch
  if (!mounted) {
    return (
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b border-slate-200 px-4">
          <div className="h-9 w-36 animate-pulse rounded-md bg-slate-100" />
        </div>
        <div className="space-y-3 p-4">
          <div className="h-28 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-10 animate-pulse rounded-md bg-slate-100" />
          <div className="h-10 animate-pulse rounded-md bg-slate-100" />
          <div className="h-10 animate-pulse rounded-md bg-slate-100" />
        </div>
      </aside>
    );
  }

  const renderSidebarContent = (mobile = false) => {
    const serviceItems = getServiceNavigation();
    const workspaceItems = navigation.filter(
      (item) => !serviceItems.some((serviceItem) => serviceItem.href === item.href)
    );
    const isServiceActive = Boolean(user?.selectedService);

    return (
      <div className="flex h-full min-h-0 flex-col bg-white border-r border-slate-200/90 select-none">
        {/* Top Brand Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 px-5 bg-white">
          <Link
            href="/dashboard"
            aria-label="DigitalBot dashboard"
            className="flex items-center gap-2.5 group transition-transform active:scale-98"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm ring-1 ring-slate-800">
              <Bot className="h-4.5 w-4.5 text-orange-400" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-slate-950 leading-none">
                Digital<span className="text-orange-600">Bot</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
                AI Workspace
              </span>
            </div>
          </Link>

          {mobile && (
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation"
              className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          )}
        </div>

        {/* Active Workspace / Service Badge */}
        {isServiceActive && (
          <div className="shrink-0 px-4 pt-3 pb-1">
            <div className="flex items-center justify-between rounded-lg bg-orange-50/50 border border-orange-200/60 px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-2 w-2 rounded-full bg-orange-500 shrink-0" />
                <p className="truncate text-xs font-bold text-slate-800">
                  {formatServiceName(user?.selectedService)}
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-100/70 border border-orange-200 px-1.5 py-0.5 rounded shrink-0">
                Live
              </span>
            </div>
          </div>
        )}

        {/* Navigation List */}
        <nav className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3.5 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Operations & Tools Group */}
          {serviceItems.length > 0 && (
            <div>
              <div className="px-2.5 pb-1.5">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Operations &amp; Tools
                </p>
              </div>
              <div className="space-y-1">
                {serviceItems.map((item) => {
                  const isActive = isNavigationActive(item.href);
                  return (
                    <Link
                      key={`service-${item.name}-${item.href}`}
                      href={item.href}
                      onMouseEnter={() => prefetchDashboardData(item.href)}
                      onFocus={() => prefetchDashboardData(item.href)}
                      onClick={() => mobile && setSidebarOpen(false)}
                      className={cn(
                        'group relative flex min-h-[38px] items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all',
                        isActive
                          ? 'bg-orange-50 text-orange-700 border border-orange-200/70 shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-950'
                      )}
                    >
                      {isActive && (
                        <span className="absolute inset-y-1.5 left-0 w-1 rounded-r-full bg-orange-500" />
                      )}
                      <item.icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          isActive ? 'text-orange-600' : 'text-slate-400 group-hover:text-slate-700'
                        )}
                      />
                      <span className="truncate text-xs font-semibold">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* General / Core Workspace Group */}
          {workspaceItems.length > 0 && <div>
            <div className="px-2.5 pb-1.5">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Workspace
              </p>
            </div>
            <div className="space-y-1">
              {workspaceItems.map((item) => {
                const isActive = isNavigationActive(item.href);

                return (
                  <Link
                    key={`base-${item.name}-${item.href}`}
                    href={item.href}
                    onMouseEnter={() => prefetchDashboardData(item.href)}
                    onFocus={() => prefetchDashboardData(item.href)}
                    onClick={() => mobile && setSidebarOpen(false)}
                    className={cn(
                      'group relative flex min-h-[38px] items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all',
                      isActive
                        ? 'bg-orange-50 text-orange-700 border border-orange-200/70 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-950'
                    )}
                  >
                    {isActive && (
                      <span className="absolute inset-y-1.5 left-0 w-1 rounded-r-full bg-orange-500" />
                    )}
                    <item.icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-colors',
                        isActive ? 'text-orange-600' : 'text-slate-400 group-hover:text-slate-700'
                      )}
                    />
                    <span className="truncate text-xs font-semibold">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>}
        </nav>

        {/* User Profile & Footer Section */}
        {user && (
          <div className="relative shrink-0 border-t border-slate-200/80 p-3 bg-slate-50/50">
            {profileOpen && (
              <div className="absolute bottom-[calc(100%+8px)] left-3 right-3 z-20 rounded-xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-900 text-xs font-bold text-white shadow-sm">
                    {String(user.name || user.email || 'DB').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-950">{user.name || 'Workspace user'}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>

                <div className="mt-3 inline-flex items-center rounded-md border border-orange-200 bg-orange-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-700">
                  {getAssignedServiceLabel()}
                </div>

                {user.assignedPhoneNumber && (
                  <div className="mt-3 flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                    <PhoneCall className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate font-semibold font-mono">{user.assignedPhoneNumber}</span>
                  </div>
                )}

                <ConnectedAgentNumbers connectors={connectedAgents} />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white transition-colors hover:bg-rose-600 shadow-sm"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              aria-expanded={profileOpen}
              className="flex w-full items-center gap-2.5 rounded-lg border border-slate-200/80 bg-white p-2 text-left shadow-xs transition hover:bg-slate-50 hover:border-slate-300"
            >
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-900 text-[11px] font-bold text-white shadow-xs">
                {String(user.name || user.email || 'DB').slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900">{user.name || 'Workspace user'}</p>
                <p className="truncate text-[10px] text-slate-500">{user.email || 'Online'}</p>
              </div>
              {profileOpen ? (
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
              ) : (
                <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white shadow-sm lg:block">
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
              className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed inset-y-0 left-0 z-50 w-[270px] max-w-[85vw] border-r border-slate-200 bg-white shadow-2xl lg:hidden"
            >
              {renderSidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
