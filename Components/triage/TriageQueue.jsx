import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, Clock } from "lucide-react";
import { motion } from "framer-motion";

const severityConfig = {
  critical: {
    color: "bg-red-100 text-red-800 border-red-300",
    dotColor: "bg-red-500",
    label: "Critical"
  },
  high: {
    color: "bg-orange-100 text-orange-800 border-orange-300",
    dotColor: "bg-orange-500",
    label: "High"
  },
  moderate: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    dotColor: "bg-yellow-500",
    label: "Moderate"
  },
  low: {
    color: "bg-green-100 text-green-800 border-green-300",
    dotColor: "bg-green-500",
    label: "Low"
  }
};

export default function TriageQueue({ cases, onUpdateCase, onAddNew, showForm }) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-red-50 to-white">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Triage Queue ({cases.length})
          </CardTitle>
          {!showForm && (
            <Button onClick={onAddNew} size="sm" className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              New Assessment
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {cases.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No patients in triage queue</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cases.map((triageCase, index) => {
              const config = severityConfig[triageCase.severity_level];
              return (
                <motion.div
                  key={triageCase.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-2 rounded-xl p-4 hover:shadow-md transition-all"
                  style={{ borderColor: config?.dotColor }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${config?.dotColor} rounded-full flex items-center justify-center`}>
                        <span className="text-lg font-bold text-white">
                          {triageCase.priority_score}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{triageCase.patient_name}</p>
                        <p className="text-sm text-gray-600">{triageCase.patient_id}</p>
                      </div>
                    </div>
                    <Badge className={`${config?.color} border`}>
                      {config?.label}
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Symptoms:</p>
                    <div className="flex flex-wrap gap-2">
                      {triageCase.symptoms?.map((symptom, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {triageCase.vitals && (
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                      {triageCase.vitals.temperature && (
                        <div>Temp: {triageCase.vitals.temperature}°C</div>
                      )}
                      {triageCase.vitals.blood_pressure && (
                        <div>BP: {triageCase.vitals.blood_pressure}</div>
                      )}
                      {triageCase.vitals.heart_rate && (
                        <div>HR: {triageCase.vitals.heart_rate} bpm</div>
                      )}
                      {triageCase.vitals.oxygen_saturation && (
                        <div>O2: {triageCase.vitals.oxygen_saturation}%</div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 pt-3 border-t">
                    {triageCase.status === "waiting" && (
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => onUpdateCase(triageCase.id, { status: "in_progress" })}
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        Start Treatment
                      </Button>
                    )}
                    {triageCase.status === "in_progress" && (
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => onUpdateCase(triageCase.id, { status: "completed" })}
                      >
                        Complete
                      </Button>
                    )}
                    {triageCase.status === "completed" && (
                      <Badge variant="outline" className="border-green-500 text-green-700">
                        Completed
                      </Badge>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
