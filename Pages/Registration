import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Users, Clock, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import RegistrationForm from "../components/registration/RegistrationForm";
import AppointmentScheduler from "../components/registration/AppointmentScheduler";
import QueueTracker from "../components/registration/QueueTracker";

export default function Registration() {
  const [activeTab, setActiveTab] = useState("schedule");
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => base44.entities.Appointment.list("-created_date"),
    initialData: [],
  });

  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: () => base44.entities.Patient.list(),
    initialData: [],
  });

  const createAppointmentMutation = useMutation({
    mutationFn: (data) => base44.entities.Appointment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const createPatientMutation = useMutation({
    mutationFn: (data) => base44.entities.Patient.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Appointment.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  // Calculate statistics
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.appointment_date === today);
  const emergencyCases = todayAppointments.filter(a => a.medical_urgency === 'emergency' || a.medical_urgency === 'critical');
  const checkedIn = todayAppointments.filter(a => a.status === 'checked_in');
  const onlineBookings = appointments.filter(a => a.booking_type === 'online').length;
  const walkIns = appointments.filter(a => a.booking_type === 'walk_in').length;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 rounded-xl">
              <CalendarDays className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Priority-Based Appointment System
            </h1>
          </div>
          <p className="text-gray-600 ml-16">
            Smart queue management with medical urgency and arrival time prioritization
          </p>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Today's Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">{todayAppointments.length}</p>
                </div>
                <CalendarDays className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Emergency Cases</p>
                  <p className="text-2xl font-bold text-red-600">{emergencyCases.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Checked In</p>
                  <p className="text-2xl font-bold text-purple-600">{checkedIn.length}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Online vs Walk-in</p>
                  <p className="text-2xl font-bold text-green-600">{onlineBookings} / {walkIns}</p>
                </div>
                <Clock className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="register">Register Patient</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="queue">
              Queue Tracker
              {emergencyCases.length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">{emergencyCases.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="register">
            <RegistrationForm
              onSubmit={(data) => createPatientMutation.mutate(data)}
              isLoading={createPatientMutation.isPending}
            />
          </TabsContent>

          <TabsContent value="schedule">
            <AppointmentScheduler
              appointments={appointments}
              patients={patients}
              onCreateAppointment={(data) => createAppointmentMutation.mutate(data)}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="queue">
            <QueueTracker
              appointments={appointments}
              onUpdateStatus={(id, data) => updateAppointmentMutation.mutate({ id, data })}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
