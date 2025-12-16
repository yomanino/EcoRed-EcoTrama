import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import ecoRedLogo from "@assets/generated_images/ecored_comunal_logo_v2.png";
import ecoTramaLogo from "@assets/generated_images/ecotrama_logo_v2.png";
import homeBg from "@assets/generated_images/home_bg_new.jpg";
import {
  Recycle,
  Users,
  TrendingUp,
  Leaf,
  BookOpen,
  QrCode,
  Home as HomeIcon,
  BarChart3,
  Smartphone,
  Mail,
  MapPin,
  User,
  Send,
  ChevronDown,
  ExternalLink,
  Check,
  Loader2,
  Star,
  Quote,
  Download,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { contactMessageSchema, type ContactMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const programFeatures = [
  {
    icon: Recycle,
    title: "Separación Inteligente",
    description: "Fomenta la separación en la fuente con tecnología de clasificación automatizada.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Users,
    title: "Comunidad Conectada",
    description: "Recupera y reutiliza materiales reciclables a través de redes vecinales activas.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: TrendingUp,
    title: "Recompensas Sostenibles",
    description: "Sistema de puntos e incentivos que premian el compromiso ambiental.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Smartphone,
    title: "Tecnología Digital",
    description: "Integración de herramientas digitales para la gestión ambiental eficiente.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: BookOpen,
    title: "Educación Ambiental",
    description: "Fortalecimiento de la conciencia ecológica en la comunidad.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    icon: Leaf,
    title: "Economía Circular",
    description: "Modelo escalable que transforma residuos en recursos valiosos.",
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  },
];

const appFeatures = [
  { icon: QrCode, text: "Escaneo de códigos o QR para identificar residuos" },
  { icon: HomeIcon, text: "Registro por hogar y sincronización comunitaria" },
  { icon: TrendingUp, text: "Sistema de puntos e incentivos locales" },
  { icon: BarChart3, text: "Estadísticas a nivel hogar, barrio y comuna" },
  { icon: Smartphone, text: "Integración futura con sensores y pesaje" },
];

const impactStats = [
  { value: 500, suffix: "+", label: "Hogares Conectados" },
  { value: 12500, suffix: "kg", label: "Materiales Reciclados" },
  { value: 8, suffix: "ton", label: "CO₂ Reducido" },
  { value: 25, suffix: "+", label: "Empleos Verdes" },
];

const testimonials = [
  {
    name: "María Fernanda López",
    role: "Líder comunitaria, Barrio Cuba",
    content: "EcoRed ha transformado nuestra comunidad. Ahora separamos correctamente los residuos y ganamos incentivos que benefician a todos. Es increíble ver cómo los vecinos se unieron por una causa común.",
    rating: 5,
    avatar: "ML",
  },
  {
    name: "Carlos Eduardo Ramírez",
    role: "Reciclador asociado",
    content: "Antes trabajaba de manera informal, ahora con EcoTrama tengo rutas definidas y mejor remuneración. La tecnología me ayuda a ser más eficiente y la comunidad me reconoce como parte importante del proceso.",
    rating: 5,
    avatar: "CR",
  },
  {
    name: "Ana Patricia Gómez",
    role: "Madre de familia, Comuna San Joaquín",
    content: "Mis hijos aprendieron sobre reciclaje gracias al programa. Ahora son ellos quienes me recuerdan separar los residuos. Ver cómo ganamos puntos juntos es una actividad familiar muy bonita.",
    rating: 5,
    avatar: "AG",
  },
  {
    name: "Jorge Hernández",
    role: "Propietario de tienda local",
    content: "Como comerciante, genero muchos residuos reciclables. Con EcoRed puedo darles un destino adecuado y además contribuyo con la comunidad. Los clientes valoran que seamos un negocio responsable.",
    rating: 4,
    avatar: "JH",
  },
];

const references = [
  {
    author: "Delgado, D. Z.",
    year: "2023",
    title: "Factibilidad económica de la creación de una aplicación que promueva el reciclaje en Portoviejo",
    source: "Revista V8-N3",
    url: "https://dialnet.unirioja.es/descarga/articulo/9124179.pdf",
  },
  {
    author: "Huerta Ávila, H.",
    year: "2021",
    title: "Sistema de recolección de residuos reciclables que incentiva al usuario mediante recompensas",
    source: "Revista Científica",
    url: "https://www.scielo.org.mx/scielo.php?pid=S2448-84372021000200005",
  },
  {
    author: "Ministerio de Ambiente y Desarrollo Sostenible",
    year: "2019",
    title: "Estrategia Nacional de Economía Circular",
    source: "Gobierno de Colombia",
    url: "https://www.minambiente.gov.co/asuntos-ambientales-sectorial-y-urbana/estrategia-nacional-de-economia-circular/",
  },
  {
    author: "Barros Sanabria, E. A.",
    year: "2024",
    title: "Propuesta de Aplicación Digital para el aprovechamiento de residuos sólidos domésticos",
    source: "Universidad EAN",
    url: "https://repository.universidadean.edu.co",
  },
  {
    author: "Tovar Mendoza, W. I.",
    year: "s. f.",
    title: "Aplicación para el reciclaje en la ciudad de Bogotá: Clean Point",
    source: "Universidad UNAD",
    url: "https://repository.unad.edu.co",
  },
  {
    author: "Ecoembes",
    year: "2024",
    title: "Reciclar para cambiar el mundo: esta es la app que ayuda a cuidar el planeta",
    source: "El País",
    url: "https://elpais.com/sociedad/2024-10-18/reciclar-para-cambiar-el-mundo-esta-es-la-app-que-ayuda-a-cuidar-el-planeta.html",
  },
  {
    author: "Kunwar, S.",
    year: "2023",
    title: "MWaste: A Deep Learning Approach to Manage Household Waste",
    source: "arXiv",
    url: "https://arxiv.org/abs/2304.14498",
  },
  {
    author: "Narayan, Y.",
    year: "2021",
    title: "DeepWaste: Applying Deep Learning to Waste Classification for a Sustainable Planet",
    source: "arXiv",
    url: "https://arxiv.org/abs/2101.05960",
  },
];

function AnimatedCounter({ value, suffix = "", duration = 2000 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

function HeroSection() {
  const scrollToProgram = () => {
    const element = document.querySelector("#programa");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={homeBg}
          alt="Community recycling"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
      </div>

      {/* Animated particles/grid overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.05]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <img
                src={ecoRedLogo}
                alt="EcoRed Comunal / EcoTrama App"
                className="relative w-64 sm:w-80 md:w-96 lg:w-[28rem] h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </motion.div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-8 animate-fade-in backdrop-blur-md">
            <Leaf className="w-4 h-4 text-primary" />
            <span>Economía Circular Para Comunidades Sostenibles</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
            Conectamos Hogares, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-secondary text-glow">Tejemos Futuro.</span>
          </h1>

          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
            Un programa escalable que impulsa la economía circular desde los hogares,
            fortaleciendo la participación comunitaria y la educación ambiental en Colombia.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={scrollToProgram}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1"
            >
              Descubre el Programa
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Link href="/app">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full backdrop-blur-sm"
              >
                Abrir EcoTrama App
              </Button>
            </Link>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 text-white/70 hover:text-white transition-all duration-500">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="font-medium">500+ Hogares</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              <span className="font-medium">100% Sostenible</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <button
            onClick={scrollToProgram}
            className="flex flex-col items-center text-white/60 hover:text-primary transition-colors animate-bounce"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

function ProgramSection() {
  return (
    <section id="programa" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-secondary/5 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 blur-3xl rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Programa Social <span className="text-primary">EcoRed Comunal</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Un ecosistema integral que transforma residuos en oportunidades, conectando tecnología, comunidad y sostenibilidad.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="group h-full p-8 rounded-3xl glass-panel hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
                <div className={`w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-heading font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AppSection() {
  return (
    <section id="app" className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 blur-3xl rounded-full transform -rotate-6 animate-pulse-glow" />
            <div className="relative glass-panel rounded-[2.5rem] p-8 md:p-12 border-white/40 dark:border-white/10 box-glow">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-lg">
                  <img
                    src={ecoTramaLogo}
                    alt="EcoTrama App"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-2xl text-foreground">EcoTrama</h4>
                  <p className="text-muted-foreground">Tu compañero de reciclaje</p>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />)}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { icon: HomeIcon, label: "Mi Hogar", value: "250 pts", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                  { icon: BarChart3, label: "Estadísticas", value: "Ver", color: "text-blue-500", bg: "bg-blue-500/10" },
                  { icon: QrCode, label: "Escanear", value: "Nuevo", color: "text-purple-500", bg: "bg-purple-500/10" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border hover:bg-background/80 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center`}>
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <span className="font-medium text-foreground">{item.label}</span>
                    </div>
                    <span className={`text-sm font-semibold ${item.label === 'Mi Hogar' ? 'text-primary' : 'text-muted-foreground'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6">
              <Smartphone className="w-4 h-4" />
              <span>Disponible en iOS y Android</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Tu impacto ambiental <br />
              <span className="text-primary">en tu bolsillo</span>
            </h2>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              EcoTrama es la herramienta digital que conecta tu hogar con el ecosistema de reciclaje.
              Registra, clasifica y gana recompensas por tus acciones sostenibles.
            </p>

            <div className="space-y-4 mb-10">
              {appFeatures.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-foreground/80 font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/app">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-semibold rounded-full"
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  Abrir EcoTrama App
                </Button>
              </Link>
              <Link href="/descargas">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-foreground/20 text-foreground hover:bg-foreground/5 px-8 py-6 text-lg font-semibold rounded-full"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Descargar App
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ImpactSection() {
  return (
    <section id="impacto" className="py-24 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/0 via-primary/5 to-black/40" />
      <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[80%] bg-accent/20 blur-[150px] rounded-full animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
            Impacto Real y Medible
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Transformando comunidades a través de la economía circular y la
            participación activa de los hogares colombianos.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {impactStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="glass-panel rounded-3xl p-8 text-center hover:bg-white/20 transition-colors duration-500 hover:scale-105 transform">
                <div className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight text-glow">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-white/80 font-medium">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section id="testimonios" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Voces de la Comunidad
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Historias reales de personas que están cambiando su entorno.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="h-full p-8 rounded-3xl glass-panel hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-primary font-medium">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <Quote className="w-8 h-8 text-primary/20" />
                </div>

                <p className="text-muted-foreground text-lg leading-relaxed mb-6 italic">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted-foreground/30"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogSection() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/blog");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <section id="blog" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Blog de Sostenibilidad
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl">
              Noticias, consejos y artículos sobre economía circular.
            </p>
          </motion.div>

          <Button variant="outline" className="rounded-full">
            Ver todos los artículos
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <Card className="h-full border-none shadow-none bg-transparent group cursor-pointer">
                    <div className="rounded-2xl overflow-hidden mb-4 aspect-[4/3] relative">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Leaf className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-primary uppercase tracking-wider">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-0">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <span>5 min de lectura</span>
                        <span>•</span>
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                      <span className="inline-flex items-center text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
                        Leer artículo <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function DashboardSection() {
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/recycling-stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <section id="dashboard" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Panel de Transparencia
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Datos en tiempo real que demuestran el compromiso de nuestras comunidades.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="glass-panel rounded-3xl p-8 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-foreground">
                      {stat.communityName}
                    </h3>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Materiales Reciclados</span>
                        <span className="font-bold text-primary">{stat.materialsRecycled.toLocaleString()} kg</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Hogares</p>
                        <p className="text-2xl font-bold text-foreground">{stat.householdsParticipating}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">CO₂ Ahorrado</p>
                        <p className="text-2xl font-bold text-foreground">{stat.co2Reduced}t</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ContactSection() {
  const { toast } = useToast();

  const form = useForm<ContactMessage>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactMessage) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Mensaje enviado",
        description: "Gracias por contactarnos. Te responderemos pronto.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Intenta de nuevo.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactMessage) => {
    mutation.mutate(data);
  };

  return (
    <section id="contacto" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Hablemos de <br />
              <span className="text-primary">Futuro</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              ¿Tienes preguntas o quieres implementar EcoRed Comunal en tu comunidad?
              Estamos listos para ayudarte a dar el siguiente paso.
            </p>

            <div className="space-y-8 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg">Autor</p>
                  <p className="text-muted-foreground">Yoman Enrique Salcedo Rojas</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg">Ubicación</p>
                  <p className="text-muted-foreground">Pereira, Colombia</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg">Email</p>
                  <a
                    href="mailto:ysalcedo10@estudiantes.areandina.edu.co"
                    className="text-primary hover:underline"
                  >
                    ysalcedo10@estudiantes.areandina.edu.co
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-card rounded-[2rem] p-8 md:p-10 border border-border shadow-xl">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre completo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tu nombre"
                            className="h-12 rounded-xl bg-muted/30 border-border focus:border-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="tu@email.com"
                            className="h-12 rounded-xl bg-muted/30 border-border focus:border-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensaje</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="¿Cómo podemos ayudarte?"
                            className="min-h-[150px] resize-none rounded-xl bg-muted/30 border-border focus:border-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12 text-lg rounded-xl bg-primary hover:bg-primary/90"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar Mensaje
                        <Send className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ReferencesSection() {
  return (
    <section id="referencias" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Referencias Bibliográficas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fundamentos científicos y académicos que respaldan nuestro programa.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {references.map((ref, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full p-6 rounded-2xl bg-background border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-foreground font-medium mb-2 group-hover:text-primary transition-colors">
                      {ref.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {ref.author} ({ref.year}) • {ref.source}
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main>
        <HeroSection />
        <ProgramSection />
        <AppSection />
        <ImpactSection />
        <TestimonialsSection />
        <BlogSection />
        <DashboardSection />
        <ContactSection />
        <ReferencesSection />
      </main>
      <Footer />
    </div>
  );
}
