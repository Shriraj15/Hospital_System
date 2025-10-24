import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Loader2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

const departments = [
  { value: "cardiology", label: "Cardiology" },
  { value: "neurology", label: "Neurology" },
  { value: "orthopedics", label: "Orthopedics" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "general_medicine", label: "General Medicine" },
  { value: "dermatology", label: "Dermatology" },
  { value: "ent", label: "ENT" },
  { value: "ophthalmology", label: "Ophthalmology" },
  { value: "emergency", label: "Emergency" }
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
];

const bookingTypes = [
  { value: "online", label: "Online Booking" },
  { value: "walk_in", label: "Walk-in" },
  { value: "kiosk", label: "Kiosk Registration" }
];

const urgencyLevels = [
  { value: "routine", label: "Routine", description: "Regular checkup or follow-up" },
  { value: "urgent", label: "Urgent", description: "Needs attention soon" },
  { value: "emergency", label: "Emergency", description: "Severe symptoms" },
  { value: "critical", label: "Critical", description: "Life-threatening condition" }
];

export default function AppointmentScheduler({ appointments, patients, onCreateAppointment }) {
  const [formData, setFormData] = useState({
    patient_name: "",
    patient_id: "",
    patient_email: "",
    appointment_date: "",
    appointment_time: "",
    department: "",
    doctor_name: "",
    reason: "",
    booking_type: "online",
    medical_urgency: "routine",
    amount: 500,
    notes: ""
  });
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  // Calculate priority score based on multiple factors
  const calculatePriorityScore = (appointmentData) => {
    let score = 0;

    // Medical urgency is the highest priority factor (0-100 points)
    const urgencyScores = {
      critical: 100,
      emergency: 75,
      urgent: 50,
      routine: 25
    };
    score += urgencyScores[appointmentData.medical_urgency] || 25;

    // Booking type (online gets slight priority for being organized)
    const bookingScores = {
      online: 10,
      kiosk: 8,
      walk_in: 5
    };
    score += bookingScores[appointmentData.booking_type] || 5;

    return score;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const priorityScore = calculatePriorityScore(formData);
      
      const appointmentData = {
        ...formData,
        priority_score: priorityScore,
        status: "scheduled",
        payment_status: "pending"
      };

      await onCreateAppointment(appointmentData);

      // Send appointment confirmation email
      if (formData.patient_email) {
        try {
          const urgencyLabel = urgencyLevels.find(u => u.value === formData.medical_urgency)?.label || 'Routine';
          
          await base44.integrations.Core.SendEmail({
            to: formData.patient_email,
            subject: "Appointment Confirmation - MediCare Hospital",
            body: `
              <h2>Appointment Confirmed</h2>
              <p>Dear ${formData.patient_name},</p>
              <p>Your appointment has been successfully scheduled.</p>
              <br>
              <p><strong>Details:</strong></p>
              <ul>
                <li><strong>Date:</strong> ${formData.appointment_date}</li>
                <li><strong>Time:</strong> ${formData.appointment_time}</li>
                <li><strong>Department:</strong> ${formData.department.replace(/_/g, ' ')}</li>
                <li><strong>Doctor:</strong> ${formData.doctor_name || 'To be assigned'}</li>
                <li><strong>Urgency Level:</strong> ${urgencyLabel}</li>
                <li><strong>Booking Type:</strong> ${formData.booking_type.replace(/_/g, ' ')}</li>
              </ul>
              <br>
              <p><strong>Important:</strong> Please arrive on time. Late arrivals may lose priority in the queue.</p>
              ${formData.medical_urgency === 'emergency' || formData.medical_urgency === 'critical' ? 
                '<p style="color: red;"><strong>URGENT:</strong> Please head directly to the emergency department upon arrival.</p>' : 
                '<p>Please arrive 15 minutes before your scheduled time and check in at the reception.</p>'}
              <br>
              <p>Best regards,<br>MediCare Hospital</p>
            `
          });
        } catch (emailError) {
          console.log("Email notification failed");
        }
      }

      toast({
        title: "Appointment Scheduled!",
        description: `Priority score: ${priorityScore}`,
      });
      
      setFormData({
        patient_name: "",
        patient_id: "",
        patient_email: "",
        appointment_date: "",
        appointment_time: "",
        department: "",
        doctor_name: "",
        reason: "",
        booking_type: "online",
        medical_urgency: "routine",
        amount: 500,
        notes: ""
      });
    } catch (error) {
      toast({
        title: "Scheduling Failed",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-white">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Schedule Appointment
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient_name">Patient Name *</Label>
              <Input
                id="patient_name"
                value={formData.patient_name}
                onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                required
                placeholder="Enter patient name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient_email">Patient Email</Label>
              <Input
                id="patient_email"
                type="email"
                value={formData.patient_email}
                onChange={(e) => setFormData({ ...formData, patient_email: e.target.value })}
                placeholder="patient@example.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointment_date">Date *</Label>
              <Input
                id="appointment_date"
                type="date"
                value={formData.appointment_date}
                onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointment_time">Time *</Label>
              <Select
                value={formData.appointment_time}
                onValueChange={(value) => setFormData({ ...formData, appointment_time: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor_name">Doctor Name</Label>
              <Input
                id="doctor_name"
                value={formData.doctor_name}
                onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                placeholder="Dr. Smith"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="booking_type">Booking Type *</Label>
              <Select
                value={formData.booking_type}
                onValueChange={(value) => setFormData({ ...formData, booking_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select booking type" />
                </SelectTrigger>
                <SelectContent>
                  {bookingTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medical_urgency" className="flex items-center gap-2">
                Medical Urgency *
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </Label>
              <Select
                value={formData.medical_urgency}
                onValueChange={(value) => setFormData({ ...formData, medical_urgency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  {urgencyLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{level.label}</span>
                        <span className="text-xs text-gray-500">{level.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Visit</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Brief description of symptoms or purpose"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special requirements or additional information..."
              rows={3}
            />
          </div>

          {formData.medical_urgency === 'emergency' || formData.medical_urgency === 'critical' ? (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Emergency Case Detected</p>
                  <p className="text-sm text-red-700 mt-1">
                    This appointment will be given highest priority. Patient should proceed directly to emergency department.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={sending}
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Schedule Appointment
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
