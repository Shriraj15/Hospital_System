import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  CalendarDays, 
  Activity, 
  Pill, 
  MessageSquareWarning, 
  Shirt,
  Users,
  TrendingUp,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const modules = [
  {
    id: 1,
    title: "Registration & Appointments",
    description: "Unified digital registration, appointment scheduling, and queue management",
    icon: CalendarDays,
    color: "from-blue-500 to-blue-600",
    url: createPageUrl("Registration"),
    stats: { label: "Today's Bookings", value: "24" }
  },
  {
    id: 4,
    title: "Triage Management",
    description: "AI-based patient prioritization with smart symptom assessment",
    icon: Activity,
    color: "from-red-500 to-red-600",
    url: createPageUrl("Triage"),
    stats: { label: "Critical Cases", value: "3" }
  },
  {
    id: 6,
    title: "Pharmacy System",
    description: "E-prescriptions, inventory management, and automated billing",
    icon: Pill,
    color: "from-green-500 to-green-600",
    url: createPageUrl("Pharmacy"),
    stats: { label: "Low Stock Items", value: "8" }
  },
  {
    id: 37,
    title: "Complaints Tracker",
    description: "Digital grievance system with automated tracking and resolution",
    icon: MessageSquareWarning,
    color: "from-amber-500 to-amber-600",
    url: createPageUrl("Complaints"),
    stats: { label: "Open Tickets", value: "12" }
  },
  {
    id: 42,
    title: "Laundry Management",
    description: "Real-time tracking of linen flow from pickup to delivery",
    icon: Shirt,
    color: "from-purple-500 to-purple-600",
    url: createPageUrl("Laundry"),
    stats: { label: "Active Requests", value: "18" }
  }
];

const quickStats = [
  { label: "Total Patients", value: "1,247", icon: Users, change: "+12%", trend: "up" },
  { label: "Avg Wait Time", value: "18 min", icon: Clock, change: "-8%", trend: "down" },
  { label: "Appointments", value: "156", icon: CalendarDays, change: "+23%", trend: "up" },
  { label: "Revenue Today", value: "$12.4K", icon: TrendingUp, change: "+15%", trend: "up" }
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome to MediCare HMS
          </h1>
          <p className="text-gray-600 text-lg">
            Your comprehensive hospital management dashboard
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <stat.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className={`text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Module Cards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Hospital Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(module.url)}
                className="cursor-pointer group"
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-none">
                  <CardHeader className="pb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${module.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <module.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                      {module.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {module.description}
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">{module.stats.label}</span>
                      <span className="text-lg font-bold text-blue-600">{module.stats.value}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
