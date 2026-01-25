import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Headphones, Megaphone, PhoneCall, X, CreditCard, LogOut, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function CustomerSupportSidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  const navigation = [
    { name: 'Campaigns', href: '/customer-support/campaigns', icon: Megaphone },
    { name: 'Calls', href: '/customer-support/calls', icon: PhoneCall },
    { name: 'Billing', href: '/customer-support/billing', icon: CreditCard },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900">
      {/* Header */}
      <div className="p-6 border-b border-blue-700/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg">
            <Headphones className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Customer Support</h1>
            <p className="text-blue-300 text-sm">AI-Powered Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/customer-support' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200',
                isActive
                  ? 'bg-blue-500/30 text-white border border-blue-400/50 shadow-lg'
                  : 'text-blue-200 hover:bg-blue-700/30 hover:text-white'
              )}
            >
              <item.icon className={cn('h-5 w-5', isActive ? 'text-cyan-400' : 'text-blue-300')} />
              <span>{item.name}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-700/50">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-blue-300 hover:bg-blue-700/30 hover:text-white transition-all"
        >
          <Home className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-700/30 hover:text-red-200 transition-all mt-2"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
        <div className="mt-4 p-4 bg-blue-800/50 rounded-xl border border-blue-600/30">
          <p className="text-blue-200 text-sm">
            <span className="text-cyan-400 font-semibold">Free Trial</span> - No credit card required
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-blue-700/50 text-white hover:bg-blue-600/50 transition-colors z-10"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
