import { getClientCollection, getContractCollection } from '@/utils/mongodb';

import { NextRequest, NextResponse } from 'next/server';

interface Contract {
  clientId: string;
  clientName: string
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

export async function GET(req: NextRequest) {
  try {
    const col = await getContractCollection();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const query = searchParams.get('q')?.toLowerCase() || '';

    const skip = (page - 1) * limit;

    const searchFilter = query
      ? {
          $or: [
            { description: { $regex: query, $options: 'i' } },
            { product: { $regex: query, $options: 'i' } },
            { status: { $regex: query, $options: 'i' } }
          ]
        }
      : {};

    const total = await col.countDocuments(searchFilter);

    const list = await col
      .find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const userCol = await getClientCollection();
    const clients = await userCol.find({ active: true }, { projection: { _id: 1, name: 1 }}).toArray();

    return NextResponse.json({
      data: list,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        clients
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST: Criar um contrato
export async function POST(req: NextRequest) {
  try {
    const col = await getContractCollection();
    const body = await req.json();

    const now = new Date();

    const newContract: Contract = {
      ...body,
      isSigned: false,
      status: 'criado',
      createdAt: now,
      updatedAt: now
    };

    const result = await col.insertOne(newContract);

    return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ errorMessage: 'Erro ao inserir contrato' }, { status: 500 });
  }
}

