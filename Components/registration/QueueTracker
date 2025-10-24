import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, AlertTriangle, LogIn, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

const urgencyColors = {
  critical: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300", dot: "bg-red-600" },
  emergency: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300", dot: "bg-orange-600" },
  urgent: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300", dot: "bg-yellow-600" },
  routine: { bg: "bg-green-100", text: "text-green-800", border: "border-green-300", dot: "bg-green-600" }
};

const statusColors = {
  scheduled: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
  checked_in: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
  in_consultation: { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-300" },
  completed: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" }
};

export default function QueueTracker({ appointments, onUpdateStatus }) {
  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toTimeString().slice(0, 5);

  // Calculate dynamic priority for each appointment
  const calculateDynamicPriority = (apt) => {
    let priority = apt.priority_score || 0;

    // If patient has checked in
    if (apt.status === 'checked_in' && apt.arrival_time) {
      const scheduledTime = apt.appointment_time;
      const arrivalTime = apt.arrival_time;

      // Penalty for late arrival (reduce priority)
      if (arrivalTime > scheduledTime) {
        const lateMinutes = (new Date(`2000-01-01 ${arrivalTime}`) - new Date(`2000-01-01 ${scheduledTime}`)) / 60000;
        priority -= Math.min(lateMinutes * 2, 50); // Max 50 point penalty
      } else {
        // Bonus for early/on-time arrival
        priority += 10;
      }
    }

    return priority;
  };

  // Get today's appointments and sort by dynamic priority
  const todayAppointments = appointments
    .filter(a => a.appointment_date === today && a.status !== 'cancelled' && a.status !== 'completed')
    .map(apt => ({
      ...apt,
      dynamic_priority: calculateDynamicPriority(apt)
    }))
    .sort((a, b) => b.dynamic_priority - a.dynamic_priority);

  const handleCheckIn = (apt) => {
    const currentTime = new Date().toTimeString().slice(0, 5);
    onUpdateStatus(apt.id, { 
      status: "checked_in",
      arrival_time: currentTime
    });
  };

  const handleStartConsultation = (apt) => {
    onUpdateStatus(apt.id, { status: "in_consultation" });
  };

  const handleComplete = (apt) => {
    onUpdateStatus(apt.id, { status: "completed" });
  };

  const getTimeDifference = (scheduledTime, arrivalTime) => {
    if (!arrivalTime) return null;
    
    const scheduled = new Date(`2000-01-01 ${scheduledTime}`);
    const arrival = new Date(`2000-01-01 ${arrivalTime}`);
    const diffMinutes = Math.round((arrival - scheduled) / 60000);
    
    if (diffMinutes > 0) {
      return { late: true, minutes: diffMinutes };
    } else if (diffMinutes < 0) {
      return { late: false, minutes: Math.abs(diffMinutes) };
    }
    return { late: false, minutes: 0, onTime: true };
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-white">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Priority-Based Queue ({todayAppointments.length})
          </CardTitle>
          <Badge className="bg-blue-600 text-white">
            Today: {today}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-blue-900 mb-1">Smart Priority Queue</p>
              <p className="text-blue-700">
                Queue is automatically prioritized based on: <strong>Medical Urgency</strong> (highest priority), 
                <strong> Arrival Time vs Scheduled Time</strong> (late arrivals lose priority), and 
                <strong> Booking Type</strong>.
              </p>
            </div>
          </div>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No patients in queue today</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todayAppointments.map((apt, index) => {
              const urgency = urgencyColors[apt.medical_urgency] || urgencyColors.routine;
              const status = statusColors[apt.status] || statusColors.scheduled;
              const timeDiff = apt.arrival_time ? getTimeDifference(apt.appointment_time, apt.arrival_time) : null;

              return (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-2 rounded-xl p-4 hover:shadow-md transition-all ${urgency.border}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${urgency.dot} rounded-full flex items-center justify-center`}>
                        <span className="text-lg font-bold text-white">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{apt.patient_name}</p>
                        <p className="text-sm text-gray-600">{apt.patient_id || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`${urgency.bg} ${urgency.text} border ${urgency.border}`}>
                        {apt.medical_urgency}
                      </Badge>
                      <Badge className={`${status.bg} ${status.text} border ${status.border}`}>
                        {apt.status?.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                    <div>
                      <span className="text-gray-600">Department:</span>
                      <p className="font-medium">{apt.department?.replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Booking Type:</span>
                      <p className="font-medium">{apt.booking_type?.replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Scheduled:</span>
                      <p className="font-medium">{apt.appointment_time}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Arrival:</span>
                      <p className="font-medium">{apt.arrival_time || 'Not checked in'}</p>
                    </div>
                  </div>

                  {timeDiff && (
                    <div className={`mb-3 p-2 rounded-lg text-sm ${
                      timeDiff.onTime ? 'bg-green-50 text-green-700' :
                      timeDiff.late ? 'bg-red-50 text-red-700' : 
                      'bg-blue-50 text-blue-700'
                    }`}>
                      {timeDiff.onTime ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Arrived on time
                        </span>
                      ) : timeDiff.late ? (
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" />
                          Late by {timeDiff.minutes} minutes - Priority reduced
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Early by {timeDiff.minutes} minutes - Priority boosted
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="text-sm">
                      <span className="text-gray-600">Priority Score: </span>
                      <span className="font-bold text-blue-600">{Math.round(apt.dynamic_priority)}</span>
                    </div>

                    <div className="flex gap-2">
                      {apt.status === "scheduled" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCheckIn(apt)}
                          className="border-purple-300 text-purple-700 hover:bg-purple-50"
                        >
                          <LogIn className="w-4 h-4 mr-1" />
                          Check In
                        </Button>
                      )}
                      {apt.status === "checked_in" && (
                        <Button
                          size="sm"
                          onClick={() => handleStartConsultation(apt)}
                          className="bg-indigo-600 hover:bg-indigo-700"
                        >
                          <PlayCircle className="w-4 h-4 mr-1" />
                          Start Consultation
                        </Button>
                      )}
                      {apt.status === "in_consultation" && (
                        <Button
                          size="sm"
                          onClick={() => handleComplete(apt)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>

                  {apt.reason && (
                    <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                      <span className="font-medium">Reason: </span>
                      {apt.reason}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
