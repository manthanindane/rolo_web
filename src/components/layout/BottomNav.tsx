import { Home, Clock, User, Car, Settings, Bell } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import logo from '../../../public/assets/logo.png'


export function BottomNav() {
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/rides', icon: Clock, label: 'Rides' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  const sidebarItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/booking/location', icon: Car, label: 'Book Ride' },
    { path: '/rides', icon: Clock, label: 'My Rides' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xl border-t border-white/10 z-50 lg:hidden font-['Plus_Jakarta_Sans']">
        <div className="flex items-center justify-around px-4 py-3">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center p-2 rounded-xl transition-all duration-300 min-w-[60px]",
                  isActive
                    ? "text-[#00D1C1] bg-[#00D1C1]/10"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )
              }
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden lg:flex fixed top-0 left-0 h-full w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 z-40 font-['Plus_Jakarta_Sans']">
        <div className="flex flex-col w-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              {/* <div className="w-10 h-10 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] rounded-xl flex items-center justify-center"> */}
                {/* <Car className="w-5 h-5 text-white" /> */}
                {/* <img src={logo} className='w-4 h-4' alt="Rolo Logo" /> */}
              {/* </div> */}
              <div>
                <h2 className="text-white font-bold text-lg">Rolo</h2>
                {/* <p className="text-white/50 text-xs">Premium Transport</p> */}
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 p-4 space-y-2">
            {sidebarItems.map(({ path, icon: Icon, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                    isActive
                      ? "text-white bg-gradient-to-r from-[#1A1F36]/50 to-[#00D1C1]/20 border border-[#00D1C1]/20"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn(
                      "h-5 w-5 transition-colors",
                      isActive ? "text-[#00D1C1]" : "text-white/70 group-hover:text-white"
                    )} />
                    <span className="font-medium">{label}</span>
                    {isActive && (
                      <div className="ml-auto w-1 h-6 bg-[#00D1C1] rounded-full"></div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 bg-gradient-to-r from-[#00D1C1]/20 to-[#1A1F36]/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white/70" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">John Doe</p>
                <p className="text-white/50 text-xs">Premium Member</p>
              </div>
              <Bell className="w-4 h-4 text-white/40" />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}