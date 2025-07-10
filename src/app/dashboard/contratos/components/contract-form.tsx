"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

interface Contract {
  clientId: string;
  description: string;
  product: string;
  product_description?: string;
  startDate: Date;
  endDate?: Date;
  price: string;
  isSigned: boolean;
  signedAt?: Date;
  status: 'criado' | 'esperando_assinatura' | 'ativado' | 'inativo' | 'cancelado';
  createdAt?: Date;
  updatedAt?: Date;
}


interface ContractFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<Contract, "_id">) => void
  initialData?: Contract | null
  isEditing?: boolean
  clientsValues: { _id: string, name: string }[]
}

export function ContractForm({ open, onOpenChange, onSubmit, initialData, isEditing = false, clientsValues }: ContractFormProps) {
  const [formData, setFormData] = useState({
    clientId: "",
    description: "",
    product: "",
    product_description: "",
    startDate: "",
    endDate: "",
    price: "",
    isSigned: false,
    status: "criado" as Contract["status"],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

//   console.log(clientsValues)

  useEffect(() => {
    if (initialData) {
      setFormData({
        clientId: initialData.clientId || "",
        description: initialData.description || "",
        product: initialData.product || "",
        product_description: initialData.product_description || "",
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split("T")[0] : "",
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split("T")[0] : "",
        price: initialData.price || "",
        isSigned: initialData.isSigned || false,
        status: initialData.status || "criado",
      })
    } else {
      setFormData({
        clientId: "",
        description: "",
        product: "",
        product_description: "",
        startDate: "",
        endDate: "",
        price: "",
        isSigned: false,
        status: "criado",
      })
    }
    setErrors({})
  }, [initialData, open])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.clientId.trim()) {
      newErrors.clientId = "ID do cliente é obrigatório"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória"
    }

    if (!formData.product.trim()) {
      newErrors.product = "Produto é obrigatório"
    }

    if (!formData.startDate) {
      newErrors.startDate = "Data de início é obrigatória"
    }

    if (!formData.price.trim()) {
      newErrors.price = "Preço é obrigatório"
    } else if (isNaN(Number.parseFloat(formData.price))) {
      newErrors.price = "Preço deve ser um número válido"
    }

    if (formData.endDate && formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = "Data de fim deve ser posterior à data de início"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      const submitData = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        signedAt: formData.isSigned && !initialData?.isSigned ? new Date() : initialData?.signedAt,
      }
      onSubmit(submitData)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Contrato" : "Novo Contrato"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize as informações do contrato." : "Preencha os dados para criar um novo contrato."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientId">Nome do cliente *</Label>
              {/* <Input
                id="clientId"
                value={formData.clientId}
                onChange={(e) => handleInputChange("clientId", e.target.value)}
                placeholder="Nome do cliente"
              /> */}

                <Select value={formData.clientId} onValueChange={(value) => handleInputChange("clientId", value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                    {clientsValues.map((client) => (
                    <SelectItem key={client._id} value={client._id}>
                        {client.name}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>




              {errors.clientId && <p className="text-sm text-red-500">{errors.clientId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="criado">Criado</SelectItem>
                  <SelectItem value="esperando_assinatura">Aguardando Assinatura</SelectItem>
                  <SelectItem value="ativado">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descrição do contrato"
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="product">Produto *</Label>
            <Input
              id="product"
              value={formData.product}
              onChange={(e) => handleInputChange("product", e.target.value)}
              placeholder="Nome do produto"
            />
            {errors.product && <p className="text-sm text-red-500">{errors.product}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="product_description">Descrição do Produto</Label>
            <Textarea
              id="product_description"
              value={formData.product_description}
              onChange={(e) => handleInputChange("product_description", e.target.value)}
              placeholder="Descrição detalhada do produto"
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data de Início *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
              />
              {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Data de Fim</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
              />
              {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="0.00"
            />
            {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isSigned"
              checked={formData.isSigned}
              onCheckedChange={(checked) => handleInputChange("isSigned", !!checked)}
            />
            <Label htmlFor="isSigned">Contrato assinado</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? "Atualizar" : "Criar"} Contrato</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
