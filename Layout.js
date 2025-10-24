import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Activity, 
  Pill, 
  MessageSquareWarning, 
  Shirt,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { title: "Dashboard", url: createPageUrl("Dashboard"), icon: LayoutDashboard },
  { title: "Registration", url: createPageUrl("Registration"), icon: CalendarDays },
  { title: "Triage", url: createPageUrl("Triage"), icon: Activity },
  { title: "Pharmacy", url: createPageUrl("Pharmacy"), icon: Pill },
  { title: "Complaints", url: createPageUrl("Complaints"), icon: MessageSquareWarning },
  { title: "Laundry", url: createPageUrl("Laundry"), icon: Shirt }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MediCare HMS</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Hospital Management System</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navigationItems.map((item) => (
                <Link key={item.title} to={item.url}>
                  <Button
                    variant="ghost"
                    className={`gap-2 ${
                      location.pathname === item.url
                        ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.title}</span>
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-gray-200">
              <div className="grid gap-2">
                {navigationItems.map((item) => (
                  <Link key={item.title} to={item.url} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-3 ${
                        location.pathname === item.url
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.title}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © 2024 MediCare Hospital. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Contact Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
