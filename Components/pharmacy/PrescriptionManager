import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, FileText, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

export default function PrescriptionManager({ prescriptions, inventory, onCreatePrescription, onUpdatePrescription }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: "",
    patient_id: "",
    patient_email: "", // Added patient_email
    doctor_name: "",
    prescription_date: new Date().toISOString().split('T')[0],
    medications: []
  });

  const [medicationInput, setMedicationInput] = useState({
    medicine_name: "",
    dosage: "",
    frequency: "",
    duration: "",
    quantity: 1,
    price_per_unit: 0
  });

  const [dispensing, setDispensing] = useState(false); // Added dispensing state
  const { toast } = useToast(); // Initialize useToast

  const addMedication = () => {
    if (medicationInput.medicine_name && medicationInput.quantity) {
      setFormData({
        ...formData,
        medications: [...formData.medications, medicationInput]
      });
      setMedicationInput({
        medicine_name: "",
        dosage: "",
        frequency: "",
        duration: "",
        quantity: 1,
        price_per_unit: 0
      });
    }
  };

  const removeMedication = (index) => {
    setFormData({
      ...formData,
      medications: formData.medications.filter((_, i) => i !== index)
    });
  };

  const calculateTotal = () => {
    return formData.medications.reduce((sum, med) => sum + (med.quantity * med.price_per_unit), 0);
  };

  const handleSubmit = async (e) => { // Made handleSubmit async
    e.preventDefault();
    
    await onCreatePrescription({ // Await onCreatePrescription
      ...formData,
      total_amount: calculateTotal(),
      status: "pending"
    });

    setFormData({
      patient_name: "",
      patient_id: "",
      patient_email: "", // Clear patient_email after submission
      doctor_name: "",
      prescription_date: new Date().toISOString().split('T')[0],
      medications: []
    });
    setShowForm(false);
  };

  const handleDispense = async (prescription) => { // Made handleDispense async
    setDispensing(true);
    try {
      await onUpdatePrescription(prescription.id, { 
        status: "dispensed", 
        dispensed_by: "Pharmacist",
        dispensed_date: new Date().toISOString().split('T')[0] // Added dispensed_date
      });

      // Send prescription ready notification
      if (prescription.patient_email) {
        try {
          await base44.integrations.Core.SendEmail({
            to: prescription.patient_email,
            subject: "Prescription Ready for Pickup - MediCare Pharmacy",
            body: `
              <h2>Prescription Dispensed</h2>
              <p>Dear ${prescription.patient_name},</p>
              <p>Your prescription has been filled and is ready for pickup.</p>
              <br>
              <p><strong>Prescription Details:</strong></p>
              <ul>
                <li><strong>Doctor:</strong> ${prescription.doctor_name}</li>
                <li><strong>Date:</strong> ${prescription.prescription_date}</li>
                <li><strong>Total Medications:</strong> ${prescription.medications?.length || 0} items</li>
                <li><strong>Total Amount:</strong> $${prescription.total_amount?.toFixed(2)}</li>
              </ul>
              <br>
              <p>Please collect your medication from the pharmacy counter during business hours.</p>
              <p>Best regards,<br>MediCare Pharmacy</p>
            `
          });
          toast({ // Toast for email sent
            title: "Prescription Dispensed",
            description: "Patient has been notified via email.",
          });
        } catch (emailError) {
          console.error("Email notification failed:", emailError);
          toast({ // Toast for email failure
            title: "Dispensing Success, Email Failed",
            description: "Prescription dispensed, but email notification could not be sent.",
            variant: "destructive"
          });
        }
      } else {
        toast({ // Toast for successful dispense without email
          title: "Prescription Dispensed",
          description: "Prescription has been marked as dispensed.",
        });
      }
    } catch (error) {
      console.error("Dispensing failed:", error);
      toast({ // Toast for dispensing failure
        title: "Dispensing Failed",
        description: "Please try again. " + (error.message || ""),
        variant: "destructive"
      });
    } finally {
      setDispensing(false);
    }
  };

  return (
    <div className="space-y-6">
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          New Prescription
        </Button>
      )}

      {showForm && (
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-green-50 to-white">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                New E-Prescription
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient_name">Patient Name *</Label>
                  <Input
                    id="patient_name"
                    value={formData.patient_name}
                    onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patient_email">Patient Email</Label> {/* New patient_email field */}
                  <Input
                    id="patient_email"
                    type="email"
                    value={formData.patient_email}
                    onChange={(e) => setFormData({ ...formData, patient_email: e.target.value })}
                    placeholder="For notifications"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor_name">Doctor Name *</Label>
                  <Input
                    id="doctor_name"
                    value={formData.doctor_name}
                    onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-4">
                <Label className="text-base font-semibold">Medications</Label>
                
                <div className="grid md:grid-cols-6 gap-3">
                  <Input
                    placeholder="Medicine name"
                    value={medicationInput.medicine_name}
                    onChange={(e) => setMedicationInput({ ...medicationInput, medicine_name: e.target.value })}
                    className="md:col-span-2"
                  />
                  <Input
                    placeholder="Dosage"
                    value={medicationInput.dosage}
                    onChange={(e) => setMedicationInput({ ...medicationInput, dosage: e.target.value })}
                  />
                  <Input
                    placeholder="Frequency"
                    value={medicationInput.frequency}
                    onChange={(e) => setMedicationInput({ ...medicationInput, frequency: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={medicationInput.quantity}
                    onChange={(e) => setMedicationInput({ ...medicationInput, quantity: parseInt(e.target.value) || 0 })} // Ensure quantity is a number
                  />
                  <Button type="button" onClick={addMedication} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {formData.medications.length > 0 && (
                  <div className="space-y-2">
                    {formData.medications.map((med, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{med.medicine_name}</p>
                          <p className="text-sm text-gray-600">
                            {med.dosage} • {med.frequency} • {med.duration} • Qty: {med.quantity}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMedication(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-lg font-semibold">Total: ${calculateTotal().toFixed(2)}</span>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Create Prescription
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <CardTitle>Recent Prescriptions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Medications</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((rx) => (
                <TableRow key={rx.id}>
                  <TableCell className="font-medium">{rx.patient_name}</TableCell>
                  <TableCell>{rx.doctor_name}</TableCell>
                  <TableCell>{rx.prescription_date}</TableCell>
                  <TableCell>{rx.medications?.length || 0} items</TableCell>
                  <TableCell>${rx.total_amount?.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        rx.status === "dispensed" ? "border-green-500 text-green-700" :
                        "border-amber-500 text-amber-700"
                      }
                    >
                      {rx.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {rx.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => handleDispense(rx)}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={dispensing} // Disable button while dispensing
                      >
                        {dispensing ? ( // Show loader while dispensing
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Dispense"
                        )}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
