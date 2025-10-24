
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, X, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

const categories = [
  { value: "medical_care", label: "Medical Care" },
  { value: "staff_behavior", label: "Staff Behavior" },
  { value: "facility", label: "Facility" },
  { value: "billing", label: "Billing" },
  { value: "appointment", label: "Appointment" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "other", label: "Other" }
];

export default function ComplaintForm({ onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    ticket_id: `TCK${Date.now()}`,
    complainant_name: "",
    contact_info: "",
    category: "",
    priority: "medium",
    description: "",
    department: ""
  });
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      await onSubmit({
        ...formData,
        status: "submitted"
      });

      // Send acknowledgment email
      if (formData.contact_info.includes('@')) {
        try {
          await base44.integrations.Core.SendEmail({
            to: formData.contact_info,
            subject: `Complaint Ticket ${formData.ticket_id} - Received`,
            body: `
              <h2>Complaint Acknowledgment</h2>
              <p>Dear ${formData.complainant_name},</p>
              <p>Thank you for bringing this matter to our attention. We have received your complaint and assigned it ticket number <strong>${formData.ticket_id}</strong>.</p>
              <br>
              <p><strong>Category:</strong> ${formData.category.replace(/_/g, ' ')}</p>
              <p><strong>Priority:</strong> ${formData.priority}</p>
              <br>
              <p>Our team will review your complaint and respond within 24-48 hours.</p>
              <p>You can track your complaint status using the ticket ID above.</p>
              <br>
              <p>Best regards,<br>MediCare Patient Relations Team</p>
            `
          });
        } catch (emailError) {
          console.log("Email notification failed:", emailError); // Log the email error specifically
        }
      }

      toast({
        title: "Complaint Submitted",
        description: `Ticket ID: ${formData.ticket_id}`,
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an issue submitting your complaint. Please try again.",
        variant: "destructive"
      });
      console.error("Complaint submission error:", error); // Log the submission error
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-white">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Submit New Complaint
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="complainant_name">Your Name *</Label>
              <Input
                id="complainant_name"
                value={formData.complainant_name}
                onChange={(e) => setFormData({ ...formData, complainant_name: e.target.value })}
                required
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_info">Contact Info *</Label>
              <Input
                id="contact_info"
                value={formData.contact_info}
                onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                required
                placeholder="Phone or email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="Which department is this about?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Please describe your complaint in detail..."
              rows={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700"
            disabled={isLoading || sending || !formData.complainant_name || !formData.contact_info || !formData.category || !formData.description}
          >
            {isLoading || sending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Complaint"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
