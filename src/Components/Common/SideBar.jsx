import { BarChart2, DollarSign, Menu, Settings, ShoppingBag, ShoppingCart, TrendingUp, Users, LogOut, X } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const SIDEBAR_ITEMS = [
  { name: "Overview", icon: BarChart2, color: "#000000", href: "/overview" },
  { name: "Users", icon: Users, color: "#000000", href: "/users" },
  { name: "Settings", icon: Settings, color: "#000000", href: "/settings" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isSidebarOpen) {
        const sidebar = document.getElementById("sidebar");
        if (sidebar && !sidebar.contains(event.target)) setIsSidebarOpen(false);
      }
    };
    if (isMobile && isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMobile, isSidebarOpen]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {isMobile && isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <motion.div
        id="sidebar"
        className={`relative z-50 transition-all duration-300 ease-in-out flex-shrink-0 
          ${isMobile 
            ? `fixed left-0 top-0 h-full ${isSidebarOpen ? "w-64" : "w-0"}` 
            : `${isSidebarOpen ? "w-64" : "w-20"}`
          }`}
        animate={{ width: isMobile ? (isSidebarOpen ? 256 : 0) : isSidebarOpen ? 256 : 80 }}
      >
        <div className="h-full bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-30 shadow-lg p-4 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              {isMobile && isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>

            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-white font-bold text-lg"
                >
                  Dashboard
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <nav className="mt-4 flex-grow">
            {SIDEBAR_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => isMobile && setIsSidebarOpen(false)}
              >
                <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-white hover:bg-opacity-20 mb-2 transition-colors">
                  <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        className="ml-4 whitespace-nowrap text-white"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <motion.button
            onClick={handleLogout}
            className="mt-6 w-full py-2 bg-black rounded flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={20} style={{ minWidth: "20px" }} />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  className="ml-2 whitespace-nowrap"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2, delay: 0.3 }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
