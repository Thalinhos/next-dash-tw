import { getClientCollection } from '@/utils/mongodb';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

function parseId(id: string) {
    try {
      return new ObjectId(id);
    } catch {
      return null;
    }
  }

export async function PUT(req: NextRequest, { params }: any ) {
  const paramsBody = await params;
  const id = parseId(paramsBody.id);
  if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

  const col = await getClientCollection();

  const client = await col.findOne({ _id: id });
  if (!client) return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });

  if (client.active === true) return NextResponse.json({ error: 'Cliente já está ativo' }, { status: 400 });

  const result = await col.updateOne({ _id: id }, { $set: { active: true } });

  if (result.modifiedCount === 0) return NextResponse.json({ error: 'Falha ao reativar cliente' }, { status: 500 });

  return NextResponse.json({ message: 'Cliente reativado com sucesso' });
}
