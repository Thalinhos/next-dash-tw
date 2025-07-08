'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"


export default function Component() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const router = useRouter()

    async function sendForm(e: React.FormEvent){

        e.preventDefault();
        try {
            const response = await fetch(`/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            })
            if (!response.ok) {
                const errorData = await response.json();
                setMessage(errorData.message || "Erro ao fazer login.");
                return;
            }   
            router.push('/dashboard')
        } catch (error) {
            setMessage("Erro ao fazer login.")
            return
        }
    }



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">Entre com suas credenciais para acessar sua conta</CardDescription>
        </CardHeader>
        <form onSubmit={sendForm}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" required           value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="Digite sua senha" required  value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 mt-4">
          <Button className="w-full" type="submit">Entrar</Button>

            {message && (
                <p className="text-red-500">
                    {message}
                </p>
            )}

          <div className="text-center text-sm text-muted-foreground">
            <a href="#" className="hover:underline">
              Esqueceu sua senha?
            </a>
          </div>
        </CardFooter>
        </form>
      </Card>
    </div>
  )
}
