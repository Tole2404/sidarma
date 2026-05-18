"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Landmark, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || "Login gagal");
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
            Admin usaha majun
          </Badge>
          <h1 className="max-w-md text-4xl font-semibold tracking-tight text-zinc-950">
            Masuk ke Majun Admin untuk memantau pembelian, penjualan, dan stok harian.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-zinc-600">
            Tampilan admin yang ringkas untuk mengelola supplier, customer, biaya operasional,
            stok berjalan, dan estimasi laba usaha kain majun.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white">
                  <Landmark className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">Ringkas dan fokus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-zinc-600">
                  Dashboard, transaksi, dan kategori ditata untuk alur kerja admin harian.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">Akses aman</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-zinc-600">
                  Login admin berbasis session untuk penggunaan lokal dan demo jaringan internal.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-950 text-white">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-2xl">Masuk ke akun Anda</CardTitle>
              <CardDescription>
                Gunakan akun admin untuk mengakses dashboard Majun Admin.
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="admin@majun.local"
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
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Memproses..." : "Masuk Aplikasi"}
                {!loading ? <ArrowRight className="h-4 w-4" /> : null}
              </Button>
            </form>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
              Fallback admin: <span className="font-medium text-zinc-900">admin@majun.local</span> /
              <span className="ml-1 font-medium text-zinc-900">admin123</span>.
              <span className="block pt-1 text-xs text-zinc-500">
                Jika migrasi legacy MySQL aktif, akun admin lama tetap bisa dipakai.
              </span>
            </div>

            <p className="text-center text-sm text-zinc-600">
              Belum punya akun?{" "}
              <Link href="/register" className="font-medium text-zinc-950 hover:text-zinc-700">
                Daftar sekarang
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
