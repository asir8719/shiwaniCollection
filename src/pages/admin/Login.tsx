import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SEO from "@/components/SEO";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AdminLogin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
      async function checkExistingSession() {
        const { data: { session } } = await supabase.auth.getSession()

        if (session) {
          navigate("/admin", { replace: true })
        }
      }
      checkExistingSession()
    }, [navigate])

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
    <>
    <SEO
      title="Admin Login | Shiwani Collection"
      description="Secure admin sign-in to manage Shiwani Collection."
      canonicalPath="/admin/login"
      noindex
    />
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-sm rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold tracking-tight mb-1 text-gray-900">Admin Portal</h1>
        <p className="text-xs text-muted-foreground mb-4">Please log in to manage your inventory.</p>
        
        <form onSubmit={handleLogin} className="space-y-4 text-black" aria-label="Admin login form">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@example.com" autoComplete="email" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
          </div>
          <Button type="submit" className="w-full cursor-pointer" disabled={loading} aria-label="Sign in to admin portal">
            {loading ? "Authenticating..." : "Log In"}
          </Button>
        </form>
      </div>
    </div>
    </>
  )
}