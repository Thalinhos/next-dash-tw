import { getContractCollection } from "@/utils/mongodb"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

interface Contract {
  _id?: string
  clientId: string
  clientName: string
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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "ID do contrato inválido" }, { status: 400 })
    }

    const col = await getContractCollection()
    const contract = await col.findOne({ _id: new ObjectId(id) })

    if (!contract) {
      return NextResponse.json({ message: "Contrato não encontrado" }, { status: 404 })
    }

    return NextResponse.json(contract)
  } catch (error) {
    console.error("Erro ao buscar contrato:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "ID do contrato inválido" }, { status: 400 })
    }

    const body = await req.json()
    const now = new Date()

    const updateData: Partial<Contract> = {
      clientId: body.clientId,
      clientName: body.clientName,
      description: body.description,
      product: body.product,
      product_description: body.product_description,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      price: body.price,
      isSigned: body.isSigned,
      status: body.status,
      updatedAt: now,
    }

    if (body.isSigned && !body.signedAt) {
      updateData.signedAt = now
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key as keyof Contract] === undefined) {
        delete updateData[key as keyof Contract]
      }
    })

    const col = await getContractCollection()

    const existingContract = await col.findOne({ _id: new ObjectId(id) })
    if (!existingContract) {
      return NextResponse.json({ message: "Contrato não encontrado" }, { status: 404 })
    }

    const result = await col.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Contrato não encontrado" }, { status: 404 })
    }

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "Nenhuma alteração foi feita" }, { status: 200 })
    }

    const updatedContract = await col.findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      message: "Contrato atualizado com sucesso",
      contract: updatedContract,
    })
  } catch (error) {
    console.error("Erro ao atualizar contrato:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params

    // Validar se o ID é um ObjectId válido
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "ID do contrato inválido" }, { status: 400 })
    }

    const col = await getContractCollection()

    // Verificar se o contrato existe
    const existingContract = await col.findOne({ _id: new ObjectId(id) })
    if (!existingContract) {
      return NextResponse.json({ message: "Contrato não encontrado" }, { status: 404 })
    }

    // Ao invés de deletar, marcar como cancelado
    const result = await col.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "cancelado",
          updatedAt: new Date(),
        },
      },
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "Erro ao cancelar contrato" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Contrato cancelado com sucesso",
    })
  } catch (error) {
    console.error("Erro ao cancelar contrato:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
