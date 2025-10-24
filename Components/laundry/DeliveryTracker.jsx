import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, CheckCircle2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const statusConfig = {
  requested: { label: "Requested", progress: 20, color: "bg-blue-500" },
  picked_up: { label: "Picked Up", progress: 40, color: "bg-purple-500" },
  in_progress: { label: "In Progress", progress: 60, color: "bg-amber-500" },
  quality_check: { label: "Quality Check", progress: 80, color: "bg-orange-500" },
  delivered: { label: "Delivered", progress: 100, color: "bg-green-500" }
};

export default function DeliveryTracker({ requests, onUpdateRequest }) {
  const handleStatusChange = (requestId, currentStatus) => {
    const statuses = Object.keys(statusConfig);
    const currentIndex = statuses.indexOf(currentStatus);
    if (currentIndex < statuses.length - 1) {
      onUpdateRequest(requestId, { status: statuses[currentIndex + 1] });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-white">
        <CardTitle className="flex items-center gap-2">
          <Truck className="w-5 h-5" />
          Delivery Tracking ({requests.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Pickup Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status Progress</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => {
              const config = statusConfig[request.status];
              return (
                <TableRow key={request.id}>
                  <TableCell className="font-mono text-sm">
                    {request.request_id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {request.department}
                  </TableCell>
                  <TableCell>{request.pickup_date}</TableCell>
                  <TableCell>{request.total_items} items</TableCell>
                  <TableCell>
                    <div className="space-y-2 min-w-[200px]">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{config.label}</span>
                        <span className="text-xs text-gray-500">{config.progress}%</span>
                      </div>
                      <Progress value={config.progress} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    {request.status !== "delivered" ? (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(request.id, request.status)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Next Stage
                      </Button>
                    ) : (
                      <Badge className="bg-green-100 text-green-700 border-green-300 border">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Complete
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
