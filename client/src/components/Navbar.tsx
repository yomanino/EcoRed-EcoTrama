import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("theme-dark");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const shouldBeDark = saved ? saved === "true" : prefersDark;
        setIsDark(shouldBeDark);
        if (shouldBeDark) {
            document.documentElement.classList.add("dark");
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (href: string) => {
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        setIsMobileMenuOpen(false);
    };

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        localStorage.setItem("theme-dark", String(newIsDark));
        if (newIsDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? "py-2 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-white/10 shadow-sm"
                : "py-4 bg-transparent"
                }`}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-8">
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="flex items-center gap-3 flex-shrink-0 group"
                    >
                        <span className={`font-heading font-bold text-2xl tracking-tight transition-colors ${isScrolled ? 'text-foreground' : 'text-white'
                            }`}>

                        </span>
                    </a>

                    <div className="hidden xl:flex items-center gap-1 flex-1 justify-center">
                        {navLinks.map((link) => (
                            <Button
                                key={link.href}
                                variant="ghost"
                                onClick={() => scrollToSection(link.href)}
                                className={`text-sm font-medium transition-all duration-300 rounded-full px-4 ${isScrolled
                                    ? 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                                    : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {link.label}
                            </Button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                        <a href="/descargas" className="hidden md:block">
                            <Button
                                variant={isScrolled ? "default" : "outline"}
                                size="sm"
                                className={`rounded-full font-medium transition-all duration-300 ${isScrolled
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg'
                                    : 'border-white/30 text-white hover:bg-white/10 hover:border-white/50'
                                    }`}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Descargas
                            </Button>
                        </a>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className={`rounded-full transition-colors ${isScrolled
                                ? 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                : 'text-white/80 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className={`xl:hidden rounded-full ${isScrolled
                                ? 'text-foreground hover:bg-muted'
                                : 'text-white hover:bg-white/10'
                                }`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="xl:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-2">
                            {navLinks.map((link) => (
                                <Button
                                    key={link.href}
                                    variant="ghost"
                                    onClick={() => scrollToSection(link.href)}
                                    className="w-full justify-start text-lg font-medium h-12"
                                >
                                    {link.label}
                                </Button>
                            ))}
                            <div className="pt-4 mt-4 border-t border-border">
                                <a href="/descargas" className="w-full block">
                                    <Button
                                        className="w-full justify-center text-lg h-12 rounded-full bg-primary text-primary-foreground"
                                    >
                                        <Download className="w-5 h-5 mr-2" />
                                        Descargas
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
