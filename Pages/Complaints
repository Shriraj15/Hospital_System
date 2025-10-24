import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquareWarning } from "lucide-react";

import ComplaintForm from "../components/complaints/ComplaintForm";
import TicketTracker from "../components/complaints/TicketTracker";
import AnalyticsDashboard from "../components/complaints/AnalyticsDashboard";

export default function Complaints() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: complaints = [] } = useQuery({
    queryKey: ['complaints'],
    queryFn: () => base44.entities.Complaint.list("-created_date"),
    initialData: [],
  });

  const createComplaintMutation = useMutation({
    mutationFn: (data) => base44.entities.Complaint.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      setShowForm(false);
    },
  });

  const updateComplaintMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Complaint.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-amber-100 rounded-xl">
              <MessageSquareWarning className="w-6 h-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Complaints & Issue Tracker
            </h1>
          </div>
          <p className="text-gray-600 ml-16">
            Centralized platform for tracking and resolving complaints
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {showForm && (
              <ComplaintForm
                onSubmit={(data) => createComplaintMutation.mutate(data)}
                onCancel={() => setShowForm(false)}
                isLoading={createComplaintMutation.isPending}
              />
            )}

            <TicketTracker
              complaints={complaints}
              onUpdateComplaint={(id, data) => updateComplaintMutation.mutate({ id, data })}
              onAddNew={() => setShowForm(true)}
              showForm={showForm}
            />
          </div>

          <div>
            <AnalyticsDashboard complaints={complaints} />
          </div>
        </div>
      </div>
    </div>
  );
}
