import { validarToken } from '@/utils/jwt';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Token não fornecido' }, { status: 401 });
  }

  try {
    const isValid = await validarToken(token);
    if (!isValid) {
      return NextResponse.json({ message: 'Token inválido ou expirado' }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ message: 'Token inválido ou expirado' }, { status: 401 });
  }

  return new NextResponse(null, { status: 200 });
}
