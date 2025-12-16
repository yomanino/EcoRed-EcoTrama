import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Apple, Smartphone, Monitor, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const platforms = [
  {
    name: "Android",
    icon: Smartphone,
    description: "Descarga EcoTrama para Android",
    features: [
      "Optimizado para Android 8.0+",
      "Interfaz táctil mejorada",
      "Acceso a cámara y almacenamiento",
      "Notificaciones en tiempo real",
    ],
    color: "from-green-500 to-emerald-600",
    buttonText: "Descargar APK",
    size: "15 MB",
  },
  {
    name: "iPhone",
    icon: Apple,
    description: "Descarga EcoTrama para iOS",
    features: [
      "Compatible con iOS 13+",
      "Diseño nativo iOS",
      "Integración con Siri",
      "Sincronización iCloud",
    ],
    color: "from-blue-500 to-blue-600",
    buttonText: "Descargar en App Store",
    size: "18 MB",
  },
  {
    name: "Windows / Mac / Linux",
    icon: Monitor,
    description: "Descarga EcoTrama para Escritorio",
    features: [
      "Compatible con Windows 10+",
      "macOS 10.13+",
      "Linux Ubuntu 18.04+",
      "Sincronización automática",
    ],
    color: "from-purple-500 to-indigo-600",
    buttonText: "Descargar Escritorio",
    size: "35 MB",
  },
];

export default function DownloadsPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
            <Download className="w-4 h-4" />
            <span>Descarga EcoTrama Ahora</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Lleva EcoTrama a Todos Tus Dispositivos
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descarga la aplicación para Android, iPhone o tu computadora y comienza
            a contribuir a la economía circular desde cualquier lugar.
          </p>
        </motion.div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                className={`h-full hover-elevate transition-all cursor-pointer border-border overflow-hidden ${
                  selectedPlatform === platform.name ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedPlatform(platform.name)}
                data-testid={`card-platform-${index}`}
              >
                <div className={`bg-gradient-to-br ${platform.color} h-32 flex items-center justify-center`}>
                  <platform.icon className="w-16 h-16 text-white" />
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2" data-testid={`text-platform-name-${index}`}>
                    {platform.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {platform.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {platform.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-muted-foreground">
                      Tamaño: {platform.size}
                    </span>
                  </div>

                  <Button
                    className="w-full"
                    data-testid={`button-download-${index}`}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {platform.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Requirements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          <Card className="border-border">
            <CardContent className="p-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Requisitos Mínimos
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Conexión a internet</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Almacenamiento de 50 MB disponible</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Acceso a cámara (para escanear QR)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Ubicación activada (opcional)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border bg-primary/5">
            <CardContent className="p-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Características Principales
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-primary" />
                  <span>Escaneo de QR para residuos</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-primary" />
                  <span>Registro de hogares y comunidades</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-primary" />
                  <span>Gana puntos ecológicos</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-primary" />
                  <span>Estadísticas en tiempo real</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Instructions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-muted/50 rounded-xl p-8 border border-border"
        >
          <h3 className="text-2xl font-semibold text-foreground mb-6">
            Cómo Instalar EcoTrama
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Android Instructions */}
            <div data-testid="section-android-instructions">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-green-600" />
                Android
              </h4>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li>1. Haz clic en "Descargar APK"</li>
                <li>2. Permite descarga de fuentes desconocidas en Configuración</li>
                <li>3. Abre el archivo descargado</li>
                <li>4. Sigue los pasos de instalación</li>
                <li>5. ¡Comienza a usar EcoTrama!</li>
              </ol>
            </div>

            {/* iOS Instructions */}
            <div data-testid="section-ios-instructions">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Apple className="w-5 h-5 text-blue-600" />
                iPhone
              </h4>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li>1. Abre App Store en tu iPhone</li>
                <li>2. Busca "EcoTrama"</li>
                <li>3. Haz clic en "Obtener"</li>
                <li>4. Autoriza con Face ID o Touch ID</li>
                <li>5. ¡Listo para usar!</li>
              </ol>
            </div>

            {/* Desktop Instructions */}
            <div data-testid="section-desktop-instructions">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-purple-600" />
                Escritorio
              </h4>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li>1. Descarga el instalador</li>
                <li>2. Ejecuta el archivo .exe o .dmg</li>
                <li>3. Sigue el asistente de instalación</li>
                <li>4. Abre EcoTrama desde tu menú</li>
                <li>5. ¡Comienza a reciclar!</li>
              </ol>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            ¿Tienes preguntas?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Si necesitas ayuda para descargar o instalar EcoTrama, no dudes en contactarnos.
            Nuestro equipo está listo para asistirte.
          </p>
          <Button size="lg" data-testid="button-contact-support">
            Contacta con Soporte
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
