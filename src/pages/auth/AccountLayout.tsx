import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/web/WebLayout';
import { User, Calendar, Lock, LogOut } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Profile', href: '/account/profile', icon: User },
  { name: 'Bookings', href: '/account/bookings', icon: Calendar },
  { name: 'Security', href: '/account/security', icon: Lock },
];

export default function AccountLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };

  return (
    <Layout>
      <Helmet>
        <title>My Account - Fadelines Barber Shop</title>
        <meta name="description" content="Manage your Fadelines account, view booking history, and update your profile." />
      </Helmet>

      <section className="min-h-screen bg-[#010401] py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">My Account</h1>
            <p className="text-gray-400">Manage your profile and booking preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-1">
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                        isActive
                          ? 'bg-stone-900 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-stone-900/50'
                      )
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </NavLink>
                ))}
                
                <div className="pt-4 mt-4 border-t border-stone-800">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </nav>

              {/* User Info Card */}
              <div className="mt-6 p-4 bg-stone-900/50 rounded-lg border border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-stone-700 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-stone-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user?.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="lg:col-span-3">
              <Outlet />
            </main>
          </div>
        </div>
      </section>
    </Layout>
  );
}