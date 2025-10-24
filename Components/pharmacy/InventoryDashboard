import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package, TrendingDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

export default function InventoryDashboard({ inventory }) {
  const lowStockItems = inventory.filter(item => item.current_stock <= item.reorder_level);
  const totalValue = inventory.reduce((sum, item) => sum + (item.current_stock * item.unit_price), 0);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold">{inventory.length}</span>
            </div>
            <p className="text-sm text-gray-600">Total Items</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
              <span className="text-2xl font-bold">{lowStockItems.length}</span>
            </div>
            <p className="text-sm text-gray-600">Low Stock Alerts</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold">${totalValue.toFixed(0)}</span>
            </div>
            <p className="text-sm text-gray-600">Total Inventory Value</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <CardTitle>Inventory Status</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => {
                const stockPercentage = (item.current_stock / (item.reorder_level * 2)) * 100;
                const isLowStock = item.current_stock <= item.reorder_level;
                
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.medicine_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.category?.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.current_stock} units</span>
                          <span className="text-gray-500">
                            {stockPercentage.toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={stockPercentage} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>${item.unit_price?.toFixed(2)}</TableCell>
                    <TableCell>{item.expiry_date}</TableCell>
                    <TableCell>
                      {isLowStock ? (
                        <Badge className="bg-red-100 text-red-700 border-red-300 border">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Low Stock
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-700 border-green-300 border">
                          In Stock
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
    </div>
  );
}
