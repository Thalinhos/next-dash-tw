"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
// Update the import path below if use-toast is located elsewhere in your project structure
import { toast } from "sonner"
// If the file does not exist, create 'use-toast.ts' in 'src/components/ui/' or adjust the path accordingly

interface ProductData {
  name: string
  description: string
  type: "one_time" | "recurring"
  price: number
  active: boolean
}

export default function ProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ProductData>({
    name: "Produto de Teste",
    description: "Descrição do produto",
    type: "one_time",
    price: 199.99,
    active: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast("Product data submitted successfully.")
        console.log("Submitted data:", formData)
      } else {
        throw new Error("Failed to submit")
      }
    } catch (error) {
      toast("Failed to submit product data. Please try again.")
      console.error("Submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof ProductData, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="flex min-h-screen">

    <div className="flex-1 flex items-center justify-center p-6">
      <Card className="w-128">
        <CardHeader>
          <CardTitle>Product Form</CardTitle>
          <CardDescription>Submit product information to the server</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter product name"
                required
                />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter product description"
                className="min-h-[100px]"
                required
                />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Product Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "one_time" | "recurring") => handleInputChange("type", value)}
                >
                <SelectTrigger>
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_time">One Time</SelectItem>
                  <SelectItem value="recurring">Recurring</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
                />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => handleInputChange("active", checked)}
                />
              <Label htmlFor="active">Active Product</Label>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Submitting..." : "Submit Product"}
              </Button>
            </div>
          </form>

          {/* <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Current Form Data:</h3>
            <pre className="text-sm overflow-x-auto">{JSON.stringify(formData, null, 2)}</pre>
            </div> */}
        </CardContent>
      </Card>
    </div>
</div>
  )
}
