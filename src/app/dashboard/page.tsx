// app/dashboard/page.tsx
'use client'
import { toast } from "sonner" 
import { peganobreu } from './actions';
import { useActionState, useEffect } from "react"; 
import { Button } from "@/components/ui/button";
export default function Dashboard() {
   
const [state, formAction, pending] = useActionState(peganobreu, { success: false, message: '' });

    
useEffect(() => {

    if (state.message) {
        if (state.success) {
            toast.success(state.message);
        } else {
            toast.error(state.message);
        }
    }

}, [state]);

return (
    <>
        <form action={formAction}>
            <div>
                <label htmlFor="teste1">Teste 1</label>
                <input
                    type="text"
                    name="teste1"
                    id="teste1"
                    placeholder="Digite o teste 1"
                    defaultValue=""
                />
            </div>
            <div>
                <label htmlFor="teste2">Teste 2</label>
                <input
                    type="text"
                    name="teste2"
                    id="teste2"
                    placeholder="Digite o teste 2"
                    defaultValue=""
                />
            </div>
            <Button type="submit" disabled={pending}>
                enviar
            </Button>
        </form>
    </>
);
}