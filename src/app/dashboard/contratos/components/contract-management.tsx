"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Eye, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { ContractForm } from "./contract-form"
import { ContractDetails } from "./contract-details"
import { toast } from "sonner"

export interface Contract {
  _id: string
  clientId: string
  clientName?: string
  description: string
  product: string
  product_description?: string
  startDate: Date
  endDate?: Date
  price: string
  isSigned: boolean
  signedAt?: Date
  status: "criado" | "esperando_assinatura" | "ativado" | "inativo" | "cancelado"
  createdAt?: Date
  updatedAt?: Date
}

interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function ContractManagement() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [editingContract, setEditingContract] = useState<Contract | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const [clients, setClients] = useState<{ _id: string; name: string }[]>([])

  useEffect(() => {
    fetchContracts()
  }, [pagination.page, searchQuery])

  const fetchContracts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchQuery && { q: searchQuery }),
      })

      const response = await fetch(`/api/contratos?${params}`)
      if (response.ok) {
        const data = await response.json()
        setClients(data.pagination.clients || [])
        setContracts(data.data)
        setPagination(data.pagination)
      } else {
        toast("Falha ao carregar contratos")
      }
    } catch (error) {
      toast('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateContract = async (contractData: Omit<Contract, "_id">) => {
    try {
      const response = await fetch("/api/contratos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contractData),
      })

      if (response.ok) {
        toast('Contrato criado com sucesso')
        fetchContracts()
        setShowForm(false)
      } else {
        toast('Falha ao criar contrato')
      }
    } catch (error) {
      toast('Erro de conexão')
    }
  }

  const handleUpdateContract = async (contractData: Omit<Contract, "_id">) => {
    if (!editingContract) return

    try {
      const response = await fetch(`/api/contratos/${editingContract._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contractData),
      })

      if (response.ok) {
        toast('Contrato atualizado com sucesso')
        fetchContracts()
        setShowForm(false)
        setEditingContract(null)
      } else {
        toast("Falha ao atualizar Contrato")
      }
    } catch (error) {
      toast("Erro de conexão")
    }
  }

  const openEditForm = (contract: Contract) => {
    setEditingContract(contract)
    setShowForm(true)
  }

  const openCreateForm = () => {
    setEditingContract(null)
    setShowForm(true)
  }

  const openDetails = (contract: Contract) => {
    setSelectedContract(contract)
    setShowDetails(true)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
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

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number.parseFloat(price))
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("pt-BR")
  }

  if (loading && contracts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando contratos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Contratos</h1>
          <p className="text-muted-foreground">Gerencie seus contratos de forma eficiente</p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Contrato
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar contratos..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {pagination.total} contrato{pagination.total !== 1 ? "s" : ""} encontrado{pagination.total !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="grid gap-4">
        {contracts.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">
                {searchQuery ? "Nenhum contrato encontrado para sua busca" : "Nenhum contrato encontrado"}
              </p>
            </CardContent>
          </Card>
        ) : (
          contracts.map((contract) => (
            <Card key={contract._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      {contract.description}
                      <Badge variant={getStatusColor(contract.status)}>{getStatusLabel(contract.status)}</Badge>
                      {contract.isSigned && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Assinado
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{contract.product}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openDetails(contract)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEditForm(contract)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Preço:</span> {formatPrice(contract.price)}
                  </div>
                  <div>
                    <span className="font-medium">Início:</span> {formatDate(contract.startDate)}
                  </div>
                  <div>
                    <span className="font-medium">Fim:</span>{" "}
                    {contract.endDate ? formatDate(contract.endDate) : "Indefinido"}
                  </div>
                  <div>
                    <span className="font-medium">Cliente ID:</span> {contract.clientId}
                  </div>
                </div>
                {contract.product_description && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Descrição do Produto:</span> {contract.product_description}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Paginação */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Página {pagination.page} de {pagination.totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <ContractForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={editingContract ? handleUpdateContract : handleCreateContract}
        initialData={editingContract}
        isEditing={!!editingContract}
        clientsValues={clients}
      />

      <ContractDetails
        open={showDetails}
        onOpenChange={setShowDetails}
        contract={
          selectedContract
            ? {
                ...selectedContract,
                clientName:
                  clients.find((c) => c._id === selectedContract.clientId)?.name || "Desconhecido",
              }
            : null
        }
      />
    </div>
  )
}
