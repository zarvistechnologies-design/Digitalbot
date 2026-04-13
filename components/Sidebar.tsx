'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Bot, Calendar, CalendarCheck, CreditCard, FileText, LayoutDashboard, LogOut, Megaphone, MessageSquare, PhoneCall, PlusCircle, Send, Stethoscope, Ticket, Users, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface User {
  selectedService?: string;
  name?: string;
  email?: string;
  assignedPhoneNumber?: string;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const baseNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Calls', href: '/dashboard/calls', icon: PhoneCall },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  ];

  const getServiceNavigation = () => {
    const serviceItems = [];
    if (user?.selectedService === 'lead-analysis' || user?.selectedService === 'lead') {
      serviceItems.push({ name: 'Leads', href: '/dashboard/leads', icon: Users });
      serviceItems.push({ name: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone });
    }
    if (user?.selectedService === 'appointment') {
      serviceItems.push({ name: 'Appointments', href: '/dashboard/appointments', icon: Calendar });
      serviceItems.push({ name: 'Book Appointment', href: '/dashboard/book-appointment', icon: PlusCircle });
      serviceItems.push({ name: 'Doctors', href: '/dashboard/doctors', icon: Stethoscope });
      serviceItems.push({ name: 'Availability', href: '/dashboard/availability', icon: CalendarCheck });
      
    }
    if (user?.selectedService === 'customer-support') {
      serviceItems.push({ name: 'Support Campaigns', href: '/dashboard/customer-support-campaigns', icon: Megaphone });
      serviceItems.push({ name: 'AI Agents', href: '/dashboard/agents', icon: Bot });
    }
    if (user?.selectedService === 'healthiqure') {
      serviceItems.push({ name: 'Appointments', href: '/dashboard/appointments', icon: Calendar });
      serviceItems.push({ name: 'Book Appointment', href: '/dashboard/book-appointment', icon: PlusCircle });
      serviceItems.push({ name: 'Doctors', href: '/dashboard/doctors', icon: Stethoscope });
      serviceItems.push({ name: 'Availability', href: '/dashboard/availability', icon: CalendarCheck });
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
      serviceItems.push({ name: 'Knowledge Base', href: '/dashboard/akiara-knowledge', icon: BookOpen });
    }
    return serviceItems;
  };

  const isAkiara = user?.selectedService === 'akiara';
  const navigation = isAkiara ? getServiceNavigation() : [...baseNavigation, ...getServiceNavigation()];

  const handleLogout = () => {
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
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col grow bg-slate-50 border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center shrink-0 px-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent">
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
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col grow bg-slate-50 border-r border-gray-200 pt-5 pb-4 overflow-y-auto">

          {/* Logo */}
          <div className="flex items-center shrink-0 px-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent">
              DigitalBot
            </h1>
          </div>

          {/* User Info */}
          {user && (
            <div className="mt-6 px-4">
              <div className="bg-orange-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-600">{user.email}</p>
                {user.assignedPhoneNumber && (
                  <p className="text-xs text-gray-700 mt-1">
                    <span className="font-semibold">Assigned Number:</span> {user.assignedPhoneNumber}
                  </p>
                )}
                <p className="text-xs text-orange-600 mt-1 capitalize">
                  {user.selectedService?.replace('_', ' ')} Service
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
                  className={cn(
                    isActive
                      ? 'bg-gradient-to-r from-orange-600 to-orange-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100',
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
              className="flex items-center justify-center w-full gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
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
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-slate-50 border-r border-gray-200 shadow-lg"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent">
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
                  <div className="bg-orange-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Assigned Number:{user.assignedPhoneNumber}
                    </p>
                    <p className="text-xs text-orange-600 mt-1 capitalize">
                      {user.selectedService?.replace('_', ' ')} Service
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
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        isActive
                          ? 'bg-gradient-to-r from-orange-600 to-orange-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100',
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
                  className="flex items-center w-full rounded-lg p-2 hover:bg-gray-100 transition"
                >
                  <LogOut className="h-5 w-5 text-gray-400 mr-3 group-hover:text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Logout
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
