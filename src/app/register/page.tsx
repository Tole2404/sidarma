"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Landmark, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || "Pendaftaran gagal");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="hidden lg:block">
          <Badge variant="secondary" className="mb-4">
            Akses admin baru
          </Badge>
          <h1 className="max-w-md text-4xl font-semibold tracking-tight text-zinc-950">
            Buat akun untuk mulai mengelola bisnis di Majun Admin.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-zinc-600">
            Registrasi ini cocok untuk setup lokal, demo internal, atau menambah pengguna admin
            baru pada sistem administrasi usaha kain majun.
          </p>

          <Card className="mt-8 max-w-lg">
            <CardHeader className="pb-3">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                <UserPlus className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">Langsung aktif</CardTitle>
              <CardDescription>
                Setelah registrasi berhasil, akun akan otomatis masuk ke dashboard.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-2xl">Buat akun admin</CardTitle>
              <CardDescription>
                Lengkapi data berikut untuk mengakses dashboard Majun Admin.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {error ? (
              <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama lengkap</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  placeholder="Admin Darmin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="owner@majun.local"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Memproses..." : "Daftar Akun"}
                {!loading ? <ArrowRight className="h-4 w-4" /> : null}
              </Button>
            </form>

            <p className="text-center text-sm text-zinc-600">
              Sudah punya akun?{" "}
              <Link href="/portal-admin" className="font-medium text-primary hover:text-primary-hover">
                Masuk di sini
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
