import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function InventoryOverview({ requests }) {
  const itemCounts = {};
  let totalCost = 0;
  let totalItems = 0;

  requests.forEach(req => {
    req.items?.forEach(item => {
      itemCounts[item.item_type] = (itemCounts[item.item_type] || 0) + item.quantity;
    });
    totalCost += req.cost || 0;
    totalItems += req.total_items || 0;
  });

  const chartData = Object.entries(itemCounts).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    value
  }));

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-bold">{totalItems}</span>
            </div>
            <p className="text-sm text-gray-600">Total Items Processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold">{requests.length}</span>
            </div>
            <p className="text-sm text-gray-600">Total Requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold">${totalCost.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-600">Total Cost</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <CardTitle>Items Distribution</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#9333EA" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
