import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "buildvision2026") {
      sessionStorage.setItem("adminAuth", "true");
      setLocation("/admin");
    } else {
      setError("Mot de passe incorrect");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
        <h1 className="text-2xl font-serif font-bold text-center mb-6">Accès Admin BuildVision</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <Button type="submit" className="w-full">Connexion</Button>
        </form>
      </div>
    </div>
  );
}
