import { useState } from "react";
import { Recycle, Mail, MapPin, Send, Loader2, Download } from "lucide-react";
import { SiLinkedin, SiX, SiInstagram } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const navLinks = [
    { href: "#programa", label: "Programa" },
    { href: "#app", label: "EcoTrama" },
    { href: "#impacto", label: "Impacto" },
    { href: "#testimonios", label: "Testimonios" },
    { href: "#blog", label: "Blog" },
    { href: "#dashboard", label: "Dashboard" },
    { href: "#contacto", label: "Contacto" },
    { href: "#referencias", label: "Referencias" },
];

function NewsletterSubscribeForm() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            const response = await apiRequest("POST", "/api/newsletter", { email }) as any;
            toast({
                title: "Suscrito correctamente",
                description: response?.message || "Gracias por suscribirte al boletín.",
            });
            setEmail("");
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo procesar tu suscripción. Intenta de nuevo.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h4 className="font-heading font-bold text-lg mb-2 text-white">Boletín Informativo</h4>
            <p className="text-sm text-white/60 mb-4">
                Suscríbete para recibir noticias sobre economía circular y sostenibilidad.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 transition-all"
                />
                <Button
                    type="submit"
                    size="icon"
                    className="flex-shrink-0 bg-primary hover:bg-primary/90 text-white"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
            </form>
        </div>
    );
}

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0a0a0a] text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                <Recycle className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-heading font-bold text-xl tracking-tight">EcoRed Comunal</span>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Conectamos Hogares, Tejemos Futuro. Economía circular para
                            comunidades sostenibles en Colombia.
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white/60 hover:text-white hover:bg-white/10 rounded-full"
                            >
                                <SiLinkedin className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white/60 hover:text-white hover:bg-white/10 rounded-full"
                            >
                                <SiX className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white/60 hover:text-white hover:bg-white/10 rounded-full"
                            >
                                <SiInstagram className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-heading font-bold text-lg mb-6 text-white">Enlaces Rápidos</h4>
                        <ul className="space-y-3">
                            {navLinks.slice(0, 5).map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-white/60 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-primary transition-colors" />
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading font-bold text-lg mb-6 text-white">Contacto</h4>
                        <ul className="space-y-4 text-sm text-white/60">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                                <span>Pereira, Colombia</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                                <a
                                    href="mailto:ysalcedo10@estudiantes.areandina.edu.co"
                                    className="hover:text-white transition-colors break-all"
                                >
                                    ysalcedo10@estudiantes.areandina.edu.co
                                </a>
                            </li>
                            <li className="pt-4">
                                <a
                                    href="/descargas"
                                    className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors font-medium"
                                >
                                    <Download className="w-4 h-4" />
                                    Descargar App Móvil
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="lg:col-span-1">
                        <NewsletterSubscribeForm />
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
                    <p>&copy; {currentYear} EcoRed Comunal / EcoTrama. Todos los derechos reservados.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-white transition-colors">
                            Política de Privacidad
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            Términos de Uso
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
