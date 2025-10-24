import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Shirt } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import LaundryRequestForm from "../components/laundry/LaundryRequestForm";
import DeliveryTracker from "../components/laundry/DeliveryTracker";
import InventoryOverview from "../components/laundry/InventoryOverview";

export default function Laundry() {
  const [activeTab, setActiveTab] = useState("requests");
  const queryClient = useQueryClient();

  const { data: requests = [] } = useQuery({
    queryKey: ['laundryRequests'],
    queryFn: () => base44.entities.LaundryRequest.list("-created_date"),
    initialData: [],
  });

  const createRequestMutation = useMutation({
    mutationFn: (data) => base44.entities.LaundryRequest.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laundryRequests'] });
    },
  });

  const updateRequestMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.LaundryRequest.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laundryRequests'] });
    },
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Shirt className="w-6 h-6 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Laundry & Linen Management
            </h1>
          </div>
          <p className="text-gray-600 ml-16">
            Real-time tracking of linen flow from pickup to delivery
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="tracker">Tracker</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <LaundryRequestForm
              onSubmit={(data) => createRequestMutation.mutate(data)}
              isLoading={createRequestMutation.isPending}
            />
          </TabsContent>

          <TabsContent value="tracker">
            <DeliveryTracker
              requests={requests}
              onUpdateRequest={(id, data) => updateRequestMutation.mutate({ id, data })}
            />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryOverview requests={requests} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
