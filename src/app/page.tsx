import { validarToken } from "@/utils/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return redirect('/login');
  }

  try {
      const isValid = await validarToken(token);
  
      if (!isValid) {
        return redirect('/login')
      }
    } catch (e) {
      return redirect('/login')

    }
  return redirect('/dashboard')
}
