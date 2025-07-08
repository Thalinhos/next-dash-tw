"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Client } from "./client-management"
import { Mail, Phone, MapPin, Building, FileText, Calendar } from "lucide-react"

interface ClientDetailsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: Client | null
}

export function ClientDetails({ open, onOpenChange, client }: ClientDetailsProps) {
  if (!client) return null

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalhes do Cliente
            <Badge variant={client.active !== false ? "default" : "secondary"}>
              {client.active !== false ? "Ativo" : "Inativo"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Informações Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">{client.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm text-muted-foreground">Nome</p>
                </div>
              </div>

              {client.company && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{client.company}</p>
                    <p className="text-sm text-muted-foreground">Empresa</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{client.email}</p>
                  <p className="text-sm text-muted-foreground">Email</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{client.phone}</p>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                </div>
              </div>
            </div>
          </div>

          {client.address && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Endereço</h3>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">{client.address}</p>
                    <p className="text-sm text-muted-foreground">Endereço</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {client.notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Observações</h3>
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">{client.notes}</p>
                    <p className="text-sm text-muted-foreground">Notas</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">Informações do Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{formatDate(client.createdAt)}</p>
                  <p className="text-sm text-muted-foreground">Criado em</p>
                </div>
              </div>

              {client.updatedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{formatDate(client.updatedAt)}</p>
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
