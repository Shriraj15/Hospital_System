import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Activity } from "lucide-react";

import TriageForm from "../components/triage/TriageForm";
import TriageQueue from "../components/triage/TriageQueue";
import RiskCalculator from "../components/triage/RiskCalculator";

export default function Triage() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: triageCases = [], isLoading } = useQuery({
    queryKey: ['triageCases'],
    queryFn: () => base44.entities.TriageCase.list("-priority_score"),
    initialData: [],
  });

  const createTriageMutation = useMutation({
    mutationFn: (data) => base44.entities.TriageCase.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['triageCases'] });
      setShowForm(false);
    },
  });

  const updateTriageMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.TriageCase.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['triageCases'] });
    },
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-red-100 rounded-xl">
              <Activity className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Triage Management
            </h1>
          </div>
          <p className="text-gray-600 ml-16">
            AI-based patient prioritization and smart symptom assessment
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {showForm ? (
              <TriageForm
                onSubmit={(data) => createTriageMutation.mutate(data)}
                onCancel={() => setShowForm(false)}
                isLoading={createTriageMutation.isPending}
              />
            ) : null}

            <TriageQueue
              cases={triageCases}
              onUpdateCase={(id, data) => updateTriageMutation.mutate({ id, data })}
              onAddNew={() => setShowForm(true)}
              showForm={showForm}
            />
          </div>

          <div>
            <RiskCalculator />
          </div>
        </div>
      </div>
    </div>
  );
}
