"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Contract } from "./contract-management"
import { FileText, Package, Calendar, DollarSign, User, CheckCircle, Clock, Info } from "lucide-react"

interface ContractDetailsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contract: Contract | null
}

export function ContractDetails({ open, onOpenChange, contract }: ContractDetailsProps) {
  if (!contract) return null

  const formatDate = (dateString?: Date | string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatDateTime = (dateString?: Date | string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number.parseFloat(price))
  }

  const getStatusColor = (status: Contract["status"]) => {
    switch (status) {
      case "criado":
        return "default"
      case "esperando_assinatura":
        return "secondary"
      case "ativado":
        return "default"
      case "inativo":
        return "outline"
      case "cancelado":
        return "destructive"
      default:
        return "default"
    }
  }

  const getStatusLabel = (status: Contract["status"]) => {
    switch (status) {
      case "criado":
        return "Criado"
      case "esperando_assinatura":
        return "Aguardando Assinatura"
      case "ativado":
        return "Ativo"
      case "inativo":
        return "Inativo"
      case "cancelado":
        return "Cancelado"
      default:
        return status
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalhes do Contrato
            <Badge variant={getStatusColor(contract.status)}>{getStatusLabel(contract.status)}</Badge>
            {contract.isSigned && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Assinado
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Informações Gerais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="font-medium">{contract.description}</p>
                  <p className="text-sm text-muted-foreground">Descrição</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="font-medium font-mono text-xs">{contract._id}</p>
                  <p className="text-sm text-muted-foreground">ID do Contrato</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="font-medium">{contract.clientName}</p>
                  <p className="text-sm text-muted-foreground">Nome do Cliente</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="font-medium font-mono text-xs">{contract.clientId}</p>
                  <p className="text-sm text-muted-foreground">ID do Cliente</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">Produto</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Package className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="font-medium">{contract.product}</p>
                  <p className="text-sm text-muted-foreground">Nome do Produto</p>
                </div>
              </div>

              {contract.product_description && (
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">{contract.product_description}</p>
                    <p className="text-sm text-muted-foreground">Descrição do Produto</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">Informações Financeiras</h3>
            <div className="flex items-start gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="font-medium text-lg">{formatPrice(contract.price)}</p>
                <p className="text-sm text-muted-foreground">Valor do Contrato</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">Período</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="font-medium">{formatDate(contract.startDate)}</p>
                  <p className="text-sm text-muted-foreground">Data de Início</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="font-medium">{contract.endDate ? formatDate(contract.endDate) : "Indefinido"}</p>
                  <p className="text-sm text-muted-foreground">Data de Fim</p>
                </div>
              </div>
            </div>
          </div>

          {contract.isSigned && contract.signedAt && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Assinatura</h3>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium">{formatDateTime(contract.signedAt)}</p>
                    <p className="text-sm text-muted-foreground">Data e Hora da Assinatura</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">Informações do Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="font-medium">{formatDateTime(contract.createdAt)}</p>
                  <p className="text-sm text-muted-foreground">Criado em</p>
                </div>
              </div>

              {contract.updatedAt && (
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">{formatDateTime(contract.updatedAt)}</p>
                    <p className="text-sm text-muted-foreground">Atualizado em</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
