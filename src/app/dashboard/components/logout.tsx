'use client'

import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"

export default function LogoutBtn(){

    function logout(){
        fetch('/api/auth/logout', {credentials: 'include'})
        .then(() => {
            redirect('/')
        })
    }

    return (
        <Button className="bg-white text-black hover:bg-gray-100" onClick={logout}>Sair</Button>
    )

}