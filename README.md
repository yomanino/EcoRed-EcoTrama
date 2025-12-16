
# 🌱 EcoRed Comunal / EcoTrama

<div align="center">

![EcoRed Comunal](client/src/assets/generated_images/ecored_comunal_logo_v2.png)

**Conectamos Hogares, Tejemos Futuro**

Una plataforma web integral que impulsa la economía circular desde los hogares, fortaleciendo la participación comunitaria y la educación ambiental en Colombia.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933.svg)](https://nodejs.org/)

[Demo en Vivo](#) • [Documentación](#características) • [Reportar Bug](https://github.com/tu-usuario/ecored-comunal/issues)

</div>

---

## 📖 Tabla de Contenidos

- [Acerca del Proyecto](#-acerca-del-proyecto)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)
- [Contacto](#-contacto)
- [Referencias](#-referencias)

---

## 🌍 Acerca del Proyecto

**EcoRed Comunal** es un programa social escalable que transforma residuos en oportunidades, conectando tecnología, comunidad y sostenibilidad. A través de la aplicación móvil **EcoTrama**, los hogares pueden registrar, clasificar y obtener recompensas por sus acciones de reciclaje.

### Problema que Resuelve

- **Baja participación comunitaria** en programas de reciclaje
- **Falta de educación ambiental** efectiva
- **Desconexión** entre hogares y recicladores formales
- **Ausencia de incentivos** para separación en la fuente

### Nuestra Solución

Un ecosistema digital que:
- ✅ Facilita la separación inteligente de residuos
- ✅ Conecta hogares con recicladores certificados
- ✅ Ofrece sistema de puntos e incentivos
- ✅ Proporciona educación ambiental continua
- ✅ Genera datos transparentes de impacto ambiental

### Impacto Actual

- 🏘️ **500+** Hogares conectados
- ♻️ **12,500 kg** de materiales reciclados
- 🌱 **8 toneladas** de CO₂ reducido
- 💼 **25+** empleos verdes generados

---

## ✨ Características

### 🏠 Programa EcoRed Comunal

- **Separación Inteligente**: Tecnología de clasificación automatizada
- **Comunidad Conectada**: Redes vecinales activas de reciclaje
- **Recompensas Sostenibles**: Sistema de puntos e incentivos
- **Tecnología Digital**: Herramientas para gestión ambiental eficiente
- **Educación Ambiental**: Fortalecimiento de conciencia ecológica
- **Economía Circular**: Modelo escalable de transformación de residuos

### 📱 App EcoTrama

- **Escaneo QR/Códigos de Barras**: Identificación automática de residuos
- **Registro por Hogar**: Sincronización comunitaria en tiempo real
- **Sistema de Puntos**: Incentivos locales por reciclaje
- **Estadísticas Detalladas**: A nivel hogar, barrio y comuna
- **Integración IoT**: Preparado para sensores y pesaje automático

### 🎨 Diseño y UX

- **Diseño Moderno**: Inspirado en las mejores prácticas de diseño web
- **Dark Mode**: Soporte completo para tema oscuro
- **Responsive**: Optimizado para todos los dispositivos
- **Animaciones Fluidas**: Experiencia de usuario premium con Framer Motion
- **Accesibilidad**: Cumple con estándares WCAG AA

---

## 🛠️ Tecnologías

### Frontend

- **React 18.3** - Biblioteca de UI
- **TypeScript 5.6** - Tipado estático
- **Vite 5.4** - Build tool y dev server
- **Tailwind CSS 3.4** - Framework de estilos
- **Framer Motion 11.13** - Animaciones
- **Wouter 3.3** - Enrutamiento ligero
- **TanStack Query 5.60** - Gestión de estado del servidor
- **React Hook Form 7.55** - Manejo de formularios
- **Zod 3.24** - Validación de esquemas

### Backend

- **Express 4.21** - Framework web
- **Drizzle ORM 0.39** - ORM TypeScript-first
- **Passport.js 0.7** - Autenticación
- **PostgreSQL** - Base de datos (via Neon Serverless)
- **Express Session** - Gestión de sesiones
- **WebSockets (ws)** - Comunicación en tiempo real

### UI Components

- **Radix UI** - Componentes accesibles headless
- **Lucide React** - Iconos modernos
- **Recharts 2.15** - Gráficos y visualizaciones
- **html5-qrcode 2.3** - Escaneo de códigos QR

### DevOps & Tools

- **ESBuild** - Bundler de producción
- **Drizzle Kit** - Migraciones de base de datos
- **Cross-env** - Variables de entorno multiplataforma

---

## 🚀 Instalación

### Prerrequisitos

- **Node.js** 20 o superior
- **npm** o **pnpm**
- **PostgreSQL** (o cuenta en [Neon](https://neon.tech))

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/ecored-comunal.git
cd ecored-comunal
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
# Database
DATABASE_URL=postgresql://usuario:password@localhost:5432/ecored_db

# Session
SESSION_SECRET=tu-secreto-super-seguro-aqui

# Environment
NODE_ENV=development
```

4. **Configurar la base de datos**

```bash
npm run db:push
```

5. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

6. **Abrir en el navegador**

Visita [http://localhost:5000](http://localhost:5000)

---

## 💻 Uso

### Modo Desarrollo

```bash
npm run dev
```

Inicia el servidor de desarrollo con hot-reload en `http://localhost:5000`

### Compilar para Producción

```bash
npm run build
```

Genera los archivos optimizados en la carpeta `dist/`

### Ejecutar en Producción

```bash
npm start
```

Ejecuta la versión compilada de producción

### Verificar Tipos TypeScript

```bash
npm run check
```

### Actualizar Base de Datos

```bash
npm run db:push
```

---

## 📁 Estructura del Proyecto

```
ecored-comunal/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── assets/           # Imágenes y recursos estáticos
│   │   ├── components/       # Componentes reutilizables
│   │   │   ├── ui/          # Componentes UI base (shadcn)
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Scanner.tsx
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilidades y helpers
│   │   ├── pages/           # Páginas de la aplicación
│   │   │   ├── home.tsx
│   │   │   ├── ecotrama.tsx
│   │   │   ├── downloads.tsx
│   │   │   └── blog-post.tsx
│   │   └── main.tsx         # Punto de entrada
│   └── index.html
├── server/                   # Backend Express
│   ├── app.ts               # Configuración de Express
│   ├── auth.ts              # Estrategias de autenticación
│   ├── db.ts                # Configuración de base de datos
│   ├── routes.ts            # Definición de rutas API
│   ├── storage.ts           # Gestión de almacenamiento
│   ├── index-dev.ts         # Servidor de desarrollo
│   └── index-prod.ts        # Servidor de producción
├── shared/                   # Código compartido
│   └── schema.ts            # Esquemas Zod compartidos
├── design_guidelines.md      # Guías de diseño
├── drizzle.config.ts        # Configuración Drizzle ORM
├── tailwind.config.ts       # Configuración Tailwind
├── vite.config.ts           # Configuración Vite
├── tsconfig.json            # Configuración TypeScript
└── package.json
```

---

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm start` | Ejecuta versión de producción |
| `npm run check` | Verifica tipos TypeScript |
| `npm run db:push` | Sincroniza esquema de BD |

---

## 🤝 Contribuir

Las contribuciones son lo que hace que la comunidad open source sea un lugar increíble para aprender, inspirar y crear. Cualquier contribución que hagas será **muy apreciada**.

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica increíble'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Sigue las [guías de diseño](design_guidelines.md)
- Escribe código TypeScript tipado
- Agrega tests cuando sea apropiado
- Actualiza la documentación según sea necesario

---

## 📄 Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.

---

## 📧 Contacto

**EcoRed Comunal Team**

- 🌐 Website: [ecored-comunal.com](#)
- 📧 Email: contacto@ecored-comunal.com
- 🐦 Twitter: [@EcoRedComunal](#)
- 💼 LinkedIn: [EcoRed Comunal](#)

**Proyecto Link**: [https://github.com/tu-usuario/ecored-comunal](https://github.com/tu-usuario/ecored-comunal)

---

## 📚 Referencias

Este proyecto se basa en investigación académica y mejores prácticas de economía circular:

1. **Delgado, D. Z.** (2023). *Factibilidad económica de la creación de una aplicación que promueva el reciclaje en Portoviejo*. Revista V8-N3. [Link](https://dialnet.unirioja.es/descarga/articulo/9124179.pdf)

2. **Huerta Ávila, H.** (2021). *Sistema de recolección de residuos reciclables que incentiva al usuario mediante recompensas*. Revista Científica. [Link](https://www.scielo.org.mx/scielo.php?pid=S2448-84372021000200005)

3. **Ministerio de Ambiente y Desarrollo Sostenible** (2019). *Estrategia Nacional de Economía Circular*. Gobierno de Colombia. [Link](https://www.minambiente.gov.co/asuntos-ambientales-sectorial-y-urbana/estrategia-nacional-de-economia-circular/)

4. **Barros Sanabria, E. A.** (2024). *Propuesta de Aplicación Digital para el aprovechamiento de residuos sólidos domésticos*. Universidad EAN.

5. **Kunwar, S.** (2023). *MWaste: A Deep Learning Approach to Manage Household Waste*. arXiv. [Link](https://arxiv.org/abs/2304.14498)

6. **Narayan, Y.** (2021). *DeepWaste: Applying Deep Learning to Waste Classification for a Sustainable Planet*. arXiv. [Link](https://arxiv.org/abs/2101.05960)

---

## 🙏 Agradecimientos

- [Radix UI](https://www.radix-ui.com/) por los componentes accesibles
- [Tailwind CSS](https://tailwindcss.com/) por el framework de estilos
- [Lucide](https://lucide.dev/) por los iconos
- [Framer Motion](https://www.framer.com/motion/) por las animaciones
- Todas las comunidades que participan en EcoRed Comunal

---

<div align="center">

**Hecho con 💚 para un planeta más sostenible**

[⬆ Volver arriba](#-ecored-comunal--ecotrama)

</div>

