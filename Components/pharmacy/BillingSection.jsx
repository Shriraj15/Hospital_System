import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Receipt } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function BillingSection({ prescriptions }) {
  const totalRevenue = prescriptions.reduce((sum, rx) => sum + (rx.total_amount || 0), 0);
  const avgBillAmount = totalRevenue / (prescriptions.length || 1);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold">${totalRevenue.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-600">Total Revenue (Dispensed)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Receipt className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold">${avgBillAmount.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-600">Average Bill Amount</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <CardTitle>Recent Billing Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Prescription Date</TableHead>
                <TableHead>Medications</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Dispensed By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((rx) => (
                <TableRow key={rx.id}>
                  <TableCell className="font-medium">{rx.patient_name}</TableCell>
                  <TableCell>{rx.prescription_date}</TableCell>
                  <TableCell>
                    {rx.medications?.map(m => m.medicine_name).join(", ")}
                  </TableCell>
                  <TableCell className="font-semibold text-green-700">
                    ${rx.total_amount?.toFixed(2)}
                  </TableCell>
                  <TableCell>{rx.dispensed_by || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
