import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function RiskCalculator() {
  const severityLevels = [
    { level: "Critical", score: 5, color: "text-red-600", description: "Immediate attention required" },
    { level: "High", score: 4, color: "text-orange-600", description: "Urgent care needed" },
    { level: "Moderate", score: 3, color: "text-yellow-600", description: "Should be seen soon" },
    { level: "Low", score: 2, color: "text-green-600", description: "Can wait" },
    { level: "Minimal", score: 1, color: "text-blue-600", description: "Non-urgent" }
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-red-50 to-white">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Priority Scoring Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">AI-Based Scoring</p>
                <p className="text-blue-700">
                  Priority scores are calculated based on vital signs, symptoms, and medical history.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {severityLevels.map((level) => (
              <div key={level.score} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-semibold ${level.color}`}>
                    {level.level}
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {level.score}
                  </span>
                </div>
                <Progress value={level.score * 20} className="h-2 mb-2" />
                <p className="text-sm text-gray-600">{level.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
            <p className="font-medium mb-2">Scoring Factors:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>High temperature (&gt;39°C)</li>
              <li>Abnormal heart rate</li>
              <li>Low oxygen saturation (&lt;90%)</li>
              <li>Number of symptoms</li>
              <li>Medical history severity</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
