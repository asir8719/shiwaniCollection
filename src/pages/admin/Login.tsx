import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AdminLogin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e: SubmitEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        setLoading(false)

        if (error) {
            toast.error(`Login failed: ${error.message}`)
        } else {
            toast.success("Welcome back, Administrator!")
            navigate("/admin")
        }
    }
    
    return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-sm rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold tracking-tight mb-1 text-gray-900">Admin Portal</h1>
        <p className="text-xs text-muted-foreground mb-4">Please log in to manage your inventory.</p>
        
        <form onSubmit={handleLogin} className="space-y-4 text-black">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@example.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
            {loading ? "Authenticating..." : "Log In"}
          </Button>
        </form>
      </div>
    </div>
  )
}