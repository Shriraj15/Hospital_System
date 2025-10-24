import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusColors = {
  submitted: "bg-blue-100 text-blue-700 border-blue-300",
  under_review: "bg-purple-100 text-purple-700 border-purple-300",
  in_progress: "bg-amber-100 text-amber-700 border-amber-300",
  resolved: "bg-green-100 text-green-700 border-green-300",
  closed: "bg-gray-100 text-gray-700 border-gray-300"
};

const priorityColors = {
  low: "bg-blue-100 text-blue-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700"
};

export default function TicketTracker({ complaints, onUpdateComplaint, onAddNew, showForm }) {
  const handleStatusChange = (complaintId, newStatus) => {
    onUpdateComplaint(complaintId, { status: newStatus });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-white">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Complaint Tickets ({complaints.length})
          </CardTitle>
          {!showForm && (
            <Button onClick={onAddNew} size="sm" className="bg-amber-600 hover:bg-amber-700">
              <Plus className="w-4 h-4 mr-2" />
              New Complaint
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell className="font-mono text-sm">
                  {complaint.ticket_id}
                </TableCell>
                <TableCell className="font-medium">
                  {complaint.complainant_name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {complaint.category?.replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={priorityColors[complaint.priority]}>
                    {complaint.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`${statusColors[complaint.status]} border`}>
                    {complaint.status?.replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {new Date(complaint.created_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Select
                    value={complaint.status}
                    onValueChange={(value) => handleStatusChange(complaint.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
