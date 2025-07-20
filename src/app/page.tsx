import { redirect } from "next/navigation"

export default function Home() {
  return redirect('/login')
  // return (
  //   <div className="container mx-auto py-8">
  //   </div>
  // )
}
