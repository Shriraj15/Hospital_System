import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Shirt } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const itemTypes = [
  "bed_sheet", "pillow_cover", "blanket", "towel", 
  "patient_gown", "scrubs", "curtain"
];

export default function LaundryRequestForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    request_id: `LND${Date.now()}`,
    department: "",
    pickup_date: new Date().toISOString().split('T')[0],
    expected_delivery: "",
    items: []
  });

  const [itemInput, setItemInput] = useState({
    item_type: "",
    quantity: 1,
    condition: "normal"
  });

  const addItem = () => {
    if (itemInput.item_type && itemInput.quantity > 0) {
      setFormData({
        ...formData,
        items: [...formData.items, itemInput]
      });
      setItemInput({ item_type: "", quantity: 1, condition: "normal" });
    }
  };

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalItems = formData.items.reduce((sum, item) => sum + item.quantity, 0);
    onSubmit({
      ...formData,
      total_items: totalItems,
      status: "requested",
      cost: totalItems * 5
    });
    setFormData({
      request_id: `LND${Date.now()}`,
      department: "",
      pickup_date: new Date().toISOString().split('T')[0],
      expected_delivery: "",
      items: []
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-white">
        <CardTitle className="flex items-center gap-2">
          <Shirt className="w-5 h-5" />
          New Laundry Request
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
                placeholder="e.g., ICU, Ward 3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickup_date">Pickup Date *</Label>
              <Input
                id="pickup_date"
                type="date"
                value={formData.pickup_date}
                onChange={(e) => setFormData({ ...formData, pickup_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expected_delivery">Expected Delivery</Label>
              <Input
                id="expected_delivery"
                type="date"
                value={formData.expected_delivery}
                onChange={(e) => setFormData({ ...formData, expected_delivery: e.target.value })}
              />
            </div>
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <Label className="text-base font-semibold">Items</Label>
            
            <div className="grid md:grid-cols-4 gap-3">
              <Select
                value={itemInput.item_type}
                onValueChange={(value) => setItemInput({ ...itemInput, item_type: value })}
              >
                <SelectTrigger className="md:col-span-2">
                  <SelectValue placeholder="Select item type" />
                </SelectTrigger>
                <SelectContent>
                  {itemTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                min="1"
                placeholder="Quantity"
                value={itemInput.quantity}
                onChange={(e) => setItemInput({ ...itemInput, quantity: parseInt(e.target.value) })}
              />

              <Button type="button" onClick={addItem} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {formData.items.length > 0 && (
              <div className="space-y-2">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">
                        {item.item_type.replace(/_/g, ' ')}
                      </Badge>
                      <span className="text-sm">Quantity: {item.quantity}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={isLoading || formData.items.length === 0}
          >
            Submit Laundry Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
