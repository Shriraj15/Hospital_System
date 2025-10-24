import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pill } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import PrescriptionManager from "../components/pharmacy/PrescriptionManager";
import InventoryDashboard from "../components/pharmacy/InventoryDashboard";
import BillingSection from "../components/pharmacy/BillingSection";

export default function Pharmacy() {
  const [activeTab, setActiveTab] = useState("prescriptions");
  const queryClient = useQueryClient();

  const { data: prescriptions = [] } = useQuery({
    queryKey: ['prescriptions'],
    queryFn: () => base44.entities.Prescription.list("-created_date"),
    initialData: [],
  });

  const { data: inventory = [] } = useQuery({
    queryKey: ['inventory'],
    queryFn: () => base44.entities.InventoryItem.list(),
    initialData: [],
  });

  const createPrescriptionMutation = useMutation({
    mutationFn: (data) => base44.entities.Prescription.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
  });

  const updatePrescriptionMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Prescription.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
  });

  const updateInventoryMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.InventoryItem.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-green-100 rounded-xl">
              <Pill className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Pharmacy Information System
            </h1>
          </div>
          <p className="text-gray-600 ml-16">
            E-prescriptions, inventory management, and automated billing
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="prescriptions">
            <PrescriptionManager
              prescriptions={prescriptions}
              inventory={inventory}
              onCreatePrescription={(data) => createPrescriptionMutation.mutate(data)}
              onUpdatePrescription={(id, data) => updatePrescriptionMutation.mutate({ id, data })}
            />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryDashboard
              inventory={inventory}
              onUpdateItem={(id, data) => updateInventoryMutation.mutate({ id, data })}
            />
          </TabsContent>

          <TabsContent value="billing">
            <BillingSection
              prescriptions={prescriptions.filter(p => p.status === "dispensed")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
