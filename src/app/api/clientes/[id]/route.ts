import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from "mongodb";
import { getClientCollection } from '@/utils/mongodb';

 export function parseId(id: string) {
    try {
      return new ObjectId(id);
    } catch {
      return null;
    }
  }

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

  const paramBody = await params;
  const id = parseId(paramBody.id);
  if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

  const col = await getClientCollection();

  const client = await col.findOne({ _id: id });
  if (!client) return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });

  return NextResponse.json(client);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {

  const paramBody = await params;
  const id = parseId(paramBody.id);
  if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

  const data = await req.json();
  const col = await getClientCollection();

  const result = await col.updateOne({ _id: id }, { $set: data });
  if (result.matchedCount === 0) return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });

  return NextResponse.json({ modifiedCount: result.modifiedCount });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {

   const paramBody = await params;
  const id = parseId(paramBody.id);
  if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

  const col = await getClientCollection();

  const client = await col.findOne({ _id: id });
  if (!client) return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });

  if (client.active === false) return NextResponse.json({ error: 'Cliente já está desativado' }, { status: 400 });

  const result = await col.updateOne({ _id: id }, { $set: { active: false } });

  if (result.modifiedCount === 0) return NextResponse.json({ error: 'Falha ao desativar cliente' }, { status: 500 });

  return NextResponse.json({ message: 'Cliente desativado com sucesso' });
}
