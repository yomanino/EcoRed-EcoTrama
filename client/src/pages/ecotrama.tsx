import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import ecoTramaLogo from "@assets/generated_images/ecotrama_logo_v2.png";
import { Button } from "@/components/ui/button";
import { Scanner } from "@/components/Scanner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Leaf, QrCode, TrendingUp, Users, Award, LogOut, Home as HomeIcon, BarChart3, Smartphone, Trophy, Crown, BookOpen } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { EcotramaUser, Scan, BlogPost, Product } from "@shared/schema";

export default function EcoTramaApp() {
  const [currentUser, setCurrentUser] = useState<EcotramaUser | null>(null);
  const [view, setView] = useState<"auth" | "home" | "scan" | "profile" | "stats" | "leaderboard" | "education">("auth");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [wasteType, setWasteType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [scannedBarcode, setScannedBarcode] = useState<string | undefined>(undefined);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const { toast } = useToast();

  // Login
  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/login", data);
      return (await response.json()) as EcotramaUser;
    },
    onSuccess: (user: EcotramaUser) => {
      setCurrentUser(user);
      setView("home");
      setPassword(""); // Clear password
      toast({ description: `¡Bienvenido de nuevo, ${user.name}! 🌱` });
    },
    onError: () => {
      toast({ description: "Credenciales inválidas", variant: "destructive" });
    },
  });

  // Register
  const registerMutation = useMutation({
    mutationFn: async (data: { email: string; password: string; name: string; householdAddress?: string }) => {
      const response = await apiRequest("POST", "/api/register", data);
      return (await response.json()) as EcotramaUser;
    },
    onSuccess: (user: EcotramaUser) => {
      setCurrentUser(user);
      setView("home");
      setPassword("");
      toast({ description: `¡Bienvenido a EcoTrama, ${user.name}! 🚀` });
    },
    onError: (error: any) => {
      const msg = error.message || "Error al registrarse";
      toast({ description: msg, variant: "destructive" });
    },
  });

  // Edit Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name: string; householdAddress: string }) => {
      // In a real app we'd have a specific endpoint for this, reusing register/update logic
      // For now we'll simulate it or reuse register route if it supported updates (it doesn't yet)
      // So we will just optimistically update the state for the demo feel
      return new Promise<void>((resolve) => setTimeout(resolve, 500));
    },
    onSuccess: (_, variables) => {
      if (currentUser) {
        setCurrentUser({ ...currentUser, name: variables.name, householdAddress: variables.householdAddress });
        setIsEditingProfile(false);
        toast({ description: "Perfil actualizado correctamente" });
      }
    }
  });

  const [, navigate] = useLocation();

  // Check valid session
  const { data: user, isLoading: isLoadingUser } = useQuery<EcotramaUser>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/user");
      return (await response.json()) as EcotramaUser;
    },
    retry: false,
  });

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      setView("home");
    }
  }, [user]);

  const { data: leaderboard } = useQuery<EcotramaUser[]>({
    queryKey: ["/api/ecotrama/leaderboard"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/ecotrama/leaderboard");
      return (await response.json()) as EcotramaUser[];
    },
    enabled: view === "leaderboard",
  });

  const { data: blogPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/blog");
      return (await response.json()) as BlogPost[];
    },
    enabled: view === "education",
  });

  const educationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ecotrama/education/complete", {});
      return (await response.json()) as { message: string, user: EcotramaUser, pointsEarned: number };
    },
    onSuccess: (res) => {
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          points: (currentUser.points || 0) + res.pointsEarned,
        });
        toast({
          title: "¡Lección Completada!",
          description: `Ganaste +${res.pointsEarned} puntos`,
        });
      }
    },
    onError: () => {
      toast({ description: "Error al completar lección", variant: "destructive" });
    }
  });

  const productLookupMutation = useMutation({
    mutationFn: async (barcode: string) => {
      const response = await apiRequest("GET", `/api/ecotrama/products/${barcode}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error("Error looking up product");
      return (await response.json()) as Product;
    },
    onSuccess: (product) => {
      if (product) {
        setWasteType(product.type);
        setScannedBarcode(product.barcode);
        toast({
          title: "¡Producto Identificado!",
          description: `${product.name} (${product.brand || 'Generico'}) - +${product.points} pts`,
          className: "bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:text-green-100",
        });
      } else {
        toast({
          title: "Producto no registrado",
          description: "Por favor selecciona el tipo de material manualmente.",
          variant: "default",
        });
        setScannedBarcode(undefined);
      }
    },
    onError: () => {
      toast({ description: "Error al consultar la base de datos de productos", variant: "destructive" });
    }
  });

  const scanMutation = useMutation({
    mutationFn: async (data: { userId: string; wasteType: string; quantity: number, barcode?: string }) => {
      const response = await apiRequest("POST", "/api/ecotrama/scan", data);
      return (await response.json()) as { message: string, newPoints: number, pointsEarned: number, scan: Scan };
    },
    onSuccess: (result) => {
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          points: result.newPoints,
          totalScans: (currentUser.totalScans || 0) + 1,
        });
      }
      toast({
        description: `¡Excelente! +${result.pointsEarned} puntos 🎉`,
      });
      setWasteType("");
      setQuantity(1);
      setScannedBarcode(undefined);
      setView("home");
    },
    onError: () => {
      toast({
        description: "Error al registrar escaneo",
        variant: "destructive",
      });
    },
  });

  const wasteCategories = [
    { type: "Plástico", icon: "♻️", points: 10 },
    { type: "Vidrio", icon: "🔷", points: 15 },
    { type: "Metal", icon: "⬜", points: 20 },
    { type: "Papel", icon: "📄", points: 5 },
    { type: "Orgánico", icon: "🌿", points: 8 },
    { type: "Electrónico", icon: "📱", points: 50 },
  ];

  const userLevel = currentUser && currentUser.points ? Math.floor(currentUser.points / 500) + 1 : 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-emerald-100 to-teal-200 dark:from-slate-800 dark:via-green-950 dark:to-slate-800">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white/70 via-emerald-50/80 to-white/70 dark:from-slate-900/70 dark:via-emerald-950/80 dark:to-slate-900/70 backdrop-blur-xl border-b-2 border-gradient-to-r from-emerald-400/30 via-teal-400/50 to-emerald-400/30 shadow-lg shadow-emerald-500/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              EcoTrama
            </h1>
          </div>
          {currentUser && (
            <Button
              size="sm"
              variant="ghost"
              onClick={async () => {
                await apiRequest("POST", "/api/logout"); // Hit logout endpoint
                setCurrentUser(null);
                setView("auth");
              }}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-24 pb-20">
        {/* Auth Screen */}
        {view === "auth" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <img src={ecoTramaLogo} alt="EcoTrama" className="w-28 h-28 mx-auto mb-4 object-contain" />
              <h2 className="text-2xl font-bold text-foreground mb-2">EcoTrama</h2>
              <p className="text-muted-foreground">Tu app de reciclaje inteligente</p>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-4">
                {/* Tabs */}
                <div className="flex w-full border-b border-border mb-4">
                  <button
                    className={`flex-1 pb-2 text-sm font-medium transition-colors ${authMode === 'login' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                    onClick={() => setAuthMode('login')}
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    className={`flex-1 pb-2 text-sm font-medium transition-colors ${authMode === 'register' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                    onClick={() => setAuthMode('register')}
                  >
                    Registrarse
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {authMode === 'register' && (
                    <div>
                      <Label>Nombre</Label>
                      <Input
                        placeholder="Tu nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  )}

                  <div>
                    <Label>Contraseña</Label>
                    <Input
                      type="password"
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  {authMode === 'register' && (
                    <div>
                      <Label>Dirección (opcional)</Label>
                      <Input
                        placeholder="Tu dirección"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  )}

                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => {
                      if (authMode === 'login') {
                        if (!email || !password) return toast({ description: "Faltan datos" });
                        loginMutation.mutate({ email, password });
                      } else {
                        if (!email || !password || !name) return toast({ description: "Faltan datos obligatorios" });
                        registerMutation.mutate({ email, password, name, householdAddress: address || undefined });
                      }
                    }}
                    disabled={loginMutation.isPending || registerMutation.isPending}
                  >
                    {loginMutation.isPending || registerMutation.isPending ? "Procesando..." : (authMode === 'login' ? "Ingresar" : "Crear Cuenta")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Home Screen */}
        {view === "home" && currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Profile Card */}
            <Card className="bg-gradient-to-br from-primary/20 to-teal-500/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{currentUser.name}</h3>
                    <p className="text-sm text-muted-foreground">Nivel {userLevel}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">{currentUser.points || 0}</div>
                    <p className="text-xs text-muted-foreground">puntos ecológicos</p>
                  </div>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(((currentUser.points || 0) % 500) / 500) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <QrCode className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{currentUser.totalScans || 0}</div>
                    <p className="text-xs text-muted-foreground">escaneos</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <Award className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{userLevel}</div>
                    <p className="text-xs text-muted-foreground">nivel</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-3">
              <Button
                size="lg"
                onClick={() => setView("scan")}
                className="bg-primary hover:bg-primary/90"
                data-testid="button-scan-waste"
              >
                <QrCode className="w-5 h-5 mr-2" />
                Escanear Residuo
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setView("stats")}
                data-testid="button-view-stats"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Mis Estadísticas
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setView("profile")}
                data-testid="button-view-profile"
              >
                <Users className="w-5 h-5 mr-2" />
                Mi Perfil
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-yellow-500/50 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/10"
                onClick={() => setView("leaderboard")}
              >
                <Trophy className="w-5 h-5 mr-2" />
                Ranking Global
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="col-span-1"
                onClick={() => setView("education")}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Aprende y Gana
              </Button>
            </div>
          </motion.div>
        )}

        {/* Scan Screen */}
        {view === "scan" && currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setView("home")}
                data-testid="button-back-home"
              >
                ← Atrás
              </Button>
              <h2 className="text-xl font-bold text-foreground">Escanear Residuo</h2>
            </div>

            {!wasteType ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Escanea el código QR o de barras del residuo</p>
                <div className="min-h-[300px]">
                  <Scanner onScan={(code) => {
                    // Prevent multiple rapid scans if already processing the same code or finding a product
                    if (productLookupMutation.isPending || wasteType) return;

                    toast({ description: `Código detectado: ${code}. Buscando en base de datos...` });
                    productLookupMutation.mutate(code);
                  }} />
                </div>
                {productLookupMutation.isPending && (
                  <div className="text-center text-sm text-primary animate-pulse">Buscando producto...</div>
                )}
                <div className="text-center text-xs text-muted-foreground my-2">- O selecciona manual -</div>
                <div className="grid grid-cols-2 gap-3">
                  {wasteCategories.map((category) => (
                    <motion.button
                      key={category.type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setWasteType(category.type)}
                      className={`p-4 rounded-lg border-2 transition-all ${wasteType === category.type
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                        }`}
                      data-testid={`button-waste-${category.type.toLowerCase()}`}
                    >
                      <div className="text-2xl mb-2">{category.icon}</div>
                      <div className="font-semibold text-sm">{category.type}</div>
                      <div className="text-xs text-muted-foreground">+{category.points} pts</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">{wasteType} seleccionado</h3>
                    <Button variant="ghost" size="sm" onClick={() => {
                      setWasteType("");
                      setScannedBarcode(undefined);
                    }}>Cambiar</Button>
                  </div>
                  <div>
                    <Label>Cantidad (en kg)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      data-testid="input-quantity"
                    />
                  </div>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => {
                      scanMutation.mutate({
                        userId: currentUser.id,
                        wasteType,
                        quantity,
                        barcode: scannedBarcode,
                      });
                    }}
                    disabled={scanMutation.isPending}
                    data-testid="button-confirm-scan"
                  >
                    {scanMutation.isPending ? "Registrando..." : "✓ Confirmar escaneo"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Stats Screen */}
        {view === "stats" && currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setView("home")}
                data-testid="button-back-home-stats"
              >
                ← Atrás
              </Button>
              <h2 className="text-xl font-bold text-foreground">Mis Estadísticas</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold">{currentUser.points || 0}</div>
                  <p className="text-sm text-muted-foreground">puntos totales</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <QrCode className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold">{currentUser.totalScans || 0}</div>
                  <p className="text-sm text-muted-foreground">escaneos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold">{userLevel}</div>
                  <p className="text-sm text-muted-foreground">nivel actual</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Leaf className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold">{Math.round((currentUser.totalScans || 0) * 2.5)}</div>
                  <p className="text-sm text-muted-foreground">kg reciclados</p>
                </CardContent>
              </Card>

              <Card className="col-span-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 border-none">
                <CardContent className="pt-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-1">Huella de Carbono</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Has evitado la emisión de:</p>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                      {Math.round((currentUser.totalScans || 0) * 0.5)}
                    </span>
                    <span className="text-sm ml-1 font-medium">kg CO₂</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-2">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4 text-center">Desglose de Materiales</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Plástico</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> Vidrio</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-500"></span> Metal</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Papel</span>
                      <span className="font-medium">10%</span>
                    </div>
                    {/* Visual Bar */}
                    <div className="flex h-4 w-full rounded-full overflow-hidden mt-2">
                      <div className="bg-blue-500 h-full w-[45%]"></div>
                      <div className="bg-green-500 h-full w-[25%]"></div>
                      <div className="bg-gray-500 h-full w-[20%]"></div>
                      <div className="bg-amber-500 h-full w-[10%]"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Progreso al siguiente nivel</h3>
                <div className="mb-2 flex justify-between text-sm">
                  <span>{(currentUser.points || 0) % 500} / 500 puntos</span>
                  <span>{Math.round((((currentUser.points || 0) % 500) / 500) * 100)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${(((currentUser.points || 0) % 500) / 500) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Profile Screen */}
        {view === "profile" && currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setView("home")}
                data-testid="button-back-home-profile"
              >
                ← Atrás
              </Button>
              <h2 className="text-xl font-bold text-foreground">Mi Perfil</h2>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">Información Personal</h3>
                  <Button variant="ghost" size="sm" onClick={() => {
                    if (isEditingProfile) {
                      updateProfileMutation.mutate({
                        name: name || currentUser.name,
                        householdAddress: address || currentUser.householdAddress || ""
                      });
                    } else {
                      setName(currentUser.name);
                      setAddress(currentUser.householdAddress || "");
                      setIsEditingProfile(true);
                    }
                  }}>
                    {isEditingProfile ? "Guardar" : "Editar"}
                  </Button>
                </div>

                {isEditingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Nombre</Label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                      <Label>Dirección</Label>
                      <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsEditingProfile(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">Nombre</label>
                      <p className="text-lg font-semibold">{currentUser.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">Email</label>
                      <p className="text-lg font-semibold">{currentUser.email}</p>
                    </div>
                    {currentUser.householdAddress && (
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground">Dirección</label>
                        <p className="text-lg font-semibold">{currentUser.householdAddress}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">Miembro desde</label>
                      <p className="text-lg font-semibold">
                        {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString("es-CO") : "Hoy"}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  Tu Impacto Ambiental
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">{Math.round((currentUser.totalScans || 0) * 2.5)} kg</span> de residuos
                    reciclados
                  </p>
                  <p>
                    <span className="font-semibold">{Math.round((currentUser.totalScans || 0) * 0.5)}</span> kg de CO₂ ahorrado
                  </p>
                  <p>
                    <span className="font-semibold">{currentUser.totalScans || 0}</span> veces contribuyendo al planeta
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Leaderboard Screen */}
        {view === "leaderboard" && currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setView("home")}
              >
                ← Atrás
              </Button>
              <h2 className="text-xl font-bold text-foreground">Ranking Top 10</h2>
            </div>

            <div className="space-y-3">
              {leaderboard?.map((u, index) => (
                <Card key={u.id} className={`overflow-hidden ${index < 3 ? 'border-primary/50 bg-primary/5' : ''}`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center font-bold
                                ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                        index === 1 ? 'bg-gray-100 text-gray-600' :
                          index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-secondary text-muted-foreground'}
                            `}>
                      {index < 3 ? <Crown className="w-5 h-5" /> : index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold flex items-center gap-2">
                        {u.name}
                        {u.id === currentUser.id && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">Tú</span>}
                      </div>
                      <div className="text-xs text-muted-foreground">{u.league} • {u.rank}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{u.points} pts</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {!leaderboard?.length && <div className="text-center text-muted-foreground py-8">Cargando ranking...</div>}
            </div>
          </motion.div>
        )}

        {/* Education Screen */}
        {view === "education" && currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setView("home")}
              >
                ← Atrás
              </Button>
              <h2 className="text-xl font-bold text-foreground">Aprende y Gana</h2>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Lee nuestros artículos educativos y gana puntos extra para subir de nivel.</p>

              {blogPosts?.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  {post.image && (
                    <div className="h-32 w-full overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="text-xs font-bold text-primary mb-1">{post.category}</div>
                    <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                    <Button
                      className="w-full"
                      variant="secondary"
                      onClick={() => {
                        toast({ description: "Leyendo artículo..." });
                        setTimeout(() => {
                          educationMutation.mutate();
                        }, 1500);
                      }}
                      disabled={educationMutation.isPending}
                    >
                      {educationMutation.isPending ? "Procesando..." : "Leer Artículo (+50 pts)"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {!blogPosts?.length && <div className="text-center text-muted-foreground py-8">Cargando lecciones...</div>}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
