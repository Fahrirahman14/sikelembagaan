"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import { AlertCircle, Building2, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PublicLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError("Email dan password harus diisi");
        return;
      }
      await login(email, password);
      router.push("/admin");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat login.";
      setError(msg === "Unauthorized" ? "Email atau password salah" : msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="mb-4 inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-lg font-bold text-foreground">SIKELEMBAGAAN</p>
              <p className="text-xs text-muted-foreground">Pemerintah Kabupaten</p>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Masuk ke Sistem</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Akses data dan administrasi kelembagaan
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl">Login Administrator</CardTitle>
            <CardDescription className="text-center">
              Masukkan kredensial Anda untuk mengakses sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Ingat saya</span>
                </label>
                <Link
                  href="#"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Lupa password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Sedang masuk..." : "Masuk"}
              </Button>
            </form>

            {/* Divider */}
            <Separator className="my-6" />

            {/* Demo Credentials */}
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="mb-2 text-sm font-medium text-foreground">Demo Credentials</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Email: <span className="font-mono">admin@opd.local</span></p>
                <p>Password: <span className="font-mono">password123</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Tidak memiliki akun?{" "}
            <Link
              href="/"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Kembali ke halaman utama
            </Link>
          </p>
        </div>

        {/* Additional Info */}
        <Card className="mt-6 border-accent bg-accent/5">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">
              Sistem ini adalah portal informasi publik dan manajemen kelembagaan pemerintah.
              Akses admin terbatas hanya untuk pengguna yang berwenang. Hubungi administrator
              jika mengalami masalah login.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
