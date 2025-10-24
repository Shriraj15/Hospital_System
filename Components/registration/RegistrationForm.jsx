
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Loader2, CheckCircle } from "lucide-react"; // Added CheckCircle
import { base44 } from "@/api/base44Client"; // New import
import { useToast } from "@/components/ui/use-toast"; // New import

export default function RegistrationForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    patient_id: `PAT${Date.now()}`,
    full_name: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    blood_group: "",
    emergency_contact: "",
    medical_history: ""
  });
  const [sending, setSending] = useState(false); // New state for local loading
  const { toast } = useToast(); // Initialize useToast hook

  const handleSubmit = async (e) => { // Made handleSubmit async
    e.preventDefault();
    setSending(true); // Set local loading state to true

    try {
      // Submit patient registration using the provided onSubmit prop
      await onSubmit(formData);

      // Send welcome email if email is provided
      if (formData.email) {
        try {
          await base44.integrations.Core.SendEmail({
            to: formData.email,
            subject: "Welcome to MediCare Hospital",
            body: `
              <h2>Welcome ${formData.full_name}!</h2>
              <p>Thank you for registering with MediCare Hospital.</p>
              <p><strong>Your Patient ID:</strong> ${formData.patient_id}</p>
              <p><strong>Contact Number:</strong> ${formData.phone}</p>
              <p>You can now book appointments and access our services.</p>
              <br>
              <p>Best regards,<br>MediCare Hospital Team</p>
            `
          });

          toast({
            title: "Registration Successful!",
            description: "Welcome email sent to patient.",
          });
        } catch (emailError) {
          console.error("Email sending failed, but registration successful:", emailError);
          toast({
            title: "Email Sending Failed",
            description: "Patient registered, but welcome email could not be sent.",
            variant: "warning"
          });
        }
      }

      toast({
        title: "Patient Registered Successfully!",
        description: `Patient ID: ${formData.patient_id}`,
      });

      // Reset form after successful submission
      setFormData({
        patient_id: `PAT${Date.now()}`, // Generate new ID for next registration
        full_name: "",
        date_of_birth: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        blood_group: "",
        emergency_contact: "",
        medical_history: ""
      });
    } catch (error) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setSending(false); // Reset local loading state
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-white">
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Patient Registration
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient_id">Patient ID</Label>
              <Input
                id="patient_id"
                value={formData.patient_id}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth *</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blood_group">Blood Group</Label>
              <Select
                value={formData.blood_group}
                onValueChange={(value) => setFormData({ ...formData, blood_group: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency_contact">Emergency Contact</Label>
              <Input
                id="emergency_contact"
                value={formData.emergency_contact}
                onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main St, City, State, ZIP"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medical_history">Medical History</Label>
            <Textarea
              id="medical_history"
              value={formData.medical_history}
              onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
              placeholder="Any relevant medical history, allergies, or conditions..."
              rows={4}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading || sending} // Disable if either prop or local state is loading
          >
            {isLoading || sending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Register Patient
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
