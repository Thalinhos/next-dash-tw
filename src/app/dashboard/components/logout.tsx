'use client'

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { redirect } from "next/navigation"

export default function LogoutBtn(){

    function logout(){
        fetch('/api/auth/logout', {credentials: 'include'})
        .then(() => {
            redirect('/')
        })
    }

    return (
        <>
        {/* <Button className="bg-white text-black hover:bg-gray-100" onClick={logout}><LogOut className=""/> Sair</Button> */}
        <Button
        className="bg-white text-black hover:bg-gray-100 flex items-center justify-center relative"
        onClick={logout}
        >
        <LogOut className="absolute left-4" />
        <span className="w-full text-center">Sair</span>
        </Button>
        </>
    )

}