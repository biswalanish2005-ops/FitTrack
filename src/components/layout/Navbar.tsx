import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, Target, Sparkles, Image as ImageIcon, BarChart3, User, Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/tracker', label: 'Tracker', icon: ClipboardList },
    { to: '/goals', label: 'Goals', icon: Target },
    { to: '/ai-diet', label: 'AI Diet', icon: Sparkles },
    { to: '/progress', label: 'Progress', icon: ImageIcon },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <nav className="glass-nav fixed top-0 w-full z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-display font-bold text-primary">
          FitTrack <span className="text-accent font-light">AI</span>
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-2 text-sm font-medium transition-colors hover:text-accent relative group ${
                  isActive ? 'text-accent' : 'text-slate-600 dark:text-slate-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div layoutId="navbar-indicator" className="absolute -bottom-4 left-0 right-0 h-0.5 bg-accent" />
                  )}
                </>
              )}
            </NavLink>
          ))}
          
          <div className="w-px h-6 bg-black/10 dark:bg-white/10 mx-2"></div>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            id="theme-toggle"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <NavLink to="/profile" className="flex items-center space-x-2 bg-primary text-cream px-5 py-2 rounded-full hover:bg-black dark:hover:bg-white dark:hover:text-black transition-colors font-medium">
            <User size={18} />
            <span>Profile</span>
          </NavLink>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-2">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-primary">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 space-y-1 overflow-hidden"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-2xl transition-colors ${
                    isActive ? 'bg-primary/5 text-accent' : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
            <div className="pt-2">
              <NavLink
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center space-x-3 px-4 py-3 rounded-2xl bg-primary text-cream font-medium"
              >
                <User size={20} />
                <span>Profile</span>
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
