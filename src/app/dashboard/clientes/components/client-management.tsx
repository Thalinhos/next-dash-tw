'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, RotateCcw, Eye } from "lucide-react"
import { ClientForm } from "./client-form"
import { ClientDetails } from "./client-details"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"
import { toast } from "sonner"

export interface Client {
  _id: string
  name: string
  company: string
  email: string
  phone: string
  address: string
  notes: string
  active?: boolean
  createdAt?: string
  updatedAt?: string
}

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  const [page, setPage] = useState<number>(1)
  const limit = 5

  const [pagination, setPagination] = useState<{
    total: number
    page: number
    limit: number
    totalPages: number
  } | null>(null)

  useEffect(() => {
    fetchClients()
  }, [page])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/clientes?page=${page}&limit=${limit}`)
      if (response.ok) {
        const data = await response.json()
        setClients(data.data)
        setPagination(data.pagination)
      } else {
        toast("Falha ao carregar clientes")
      }
    } catch (error) {
      toast("Erro ao conectar")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClient = async (clientData: Omit<Client, "_id">) => {
    try {
      const response = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      })

      if (response.ok) {
        toast("Cliente criado com sucesso")
        fetchClients()
        setShowForm(false)
      } else {
        toast("Falha ao criar cliente")
      }
    } catch (error) {
      toast("Erro de conexão")
    }
  }

  const handleUpdateClient = async (clientData: Omit<Client, "_id">) => {
    if (!editingClient) return

    try {
      const response = await fetch(`/api/clientes/${editingClient._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      })

      if (response.ok) {
        toast("Cliente atualizado com sucesso")
        fetchClients()
        setShowForm(false)
        setEditingClient(null)
      } else {
        toast("Falha ao atualizar cliente")
      }
    } catch (error) {
      toast("Erro de conexão")
    }
  }

  const handleDeactivateClient = async (clientId: string) => {
    try {
      const response = await fetch(`/api/clientes/${clientId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast("Cliente desativado com sucesso")
        fetchClients()
      } else {
        toast("Erro ao desativar cliente")
      }
    } catch (error) {
      toast("Erro de conexão")
    }
  }

  const handleReactivateClient = async (clientId: string) => {
    try {
      const response = await fetch(`/api/clientes/reactivate/${clientId}`, {
        method: "PUT",
      })

      if (response.ok) {
        toast("Cliente reativado com sucesso")
        fetchClients()
      } else {
        toast("Erro ao reativar cliente")
      }
    } catch (error) {
      toast("Erro de conexão")
    }
  }

  const openEditForm = (client: Client) => {
    setEditingClient(client)
    setShowForm(true)
  }

  const openCreateForm = () => {
    setEditingClient(null)
    setShowForm(true)
  }

  const openDetails = (client: Client) => {
    setSelectedClient(client)
    setShowDetails(true)
  }

  const openDeleteDialog = (client: Client) => {
    setSelectedClient(client)
    setShowDeleteDialog(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando clientes...</div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Clientes</h1>
          <p className="text-muted-foreground">Gerencie seus clientes de forma eficiente</p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <div className="grid gap-4">
        {clients.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">Nenhum cliente encontrado</p>
            </CardContent>
          </Card>
        ) : (
          clients.map((client) => (
            <Card key={client._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {client.name}
                      <Badge variant={client.active !== false ? "default" : "secondary"}>
                        {client.active !== false ? "Ativo" : "Inativo"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{client.company}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openDetails(client)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEditForm(client)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {client.active !== false ? (
                      <Button variant="outline" size="sm" onClick={() => openDeleteDialog(client)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleReactivateClient(client._id)}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Email:</span> {client.email}
                  </div>
                  <div>
                    <span className="font-medium">Telefone:</span> {client.phone}
                  </div>
                  <div>
                    <span className="font-medium">Endereço:</span> {client.address}
                  </div>
                </div>
                {client.notes && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Observações:</span> {client.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modais */}
      <ClientForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={editingClient ? handleUpdateClient : handleCreateClient}
        initialData={editingClient}
        isEditing={!!editingClient}
      />

      <ClientDetails open={showDetails} onOpenChange={setShowDetails} client={selectedClient} />

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => {
          if (selectedClient) {
            handleDeactivateClient(selectedClient._id)
            setShowDeleteDialog(false)
          }
        }}
        clientName={selectedClient?.name || ""}
      />

      {/* Paginação */}
      {pagination && (
        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={pagination.page <= 1}
          >
            Anterior
          </Button>

          <span className="flex items-center">
            Página {pagination.page} de {pagination.totalPages}
          </span>

          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
            disabled={pagination.page >= pagination.totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  )
}
