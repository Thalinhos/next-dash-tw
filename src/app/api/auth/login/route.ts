import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { gerarToken } from '@/utils/jwt';
import { getUserCollection } from '@/utils/mongodb';


export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const usersCollection = await getUserCollection();
  const user = await usersCollection.findOne({ email });

  if (!user) {
    return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
  }

  const isValidPass = await bcrypt.compare(password, user.password);
  if (!isValidPass) {
    return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
  }

  const token = await gerarToken({ _id: user._id.toString(), email: user.email });

  const response = NextResponse.json({ mensagem: 'Login realizado com sucesso' }, { status: 200 });
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  return response;
}
