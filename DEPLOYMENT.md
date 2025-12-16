# 📝 DEPLOYMENT.md

Guía rápida para desplegar EcoRed Comunal en producción.

---

## 🚀 Deployment Rápido

### Opción Recomendada: Vercel

1. **Crear cuenta**: [vercel.com](https://vercel.com) → Sign up with GitHub
2. **Importar proyecto**: Add New → Project → Selecciona tu repo
3. **Configurar variables**:
   ```
   DATABASE_URL=postgresql://...
   SESSION_SECRET=genera-un-string-aleatorio-seguro
   NODE_ENV=production
   ```
4. **Deploy**: Click "Deploy" y espera 2-5 minutos
5. **¡Listo!** Tu app estará en `https://tu-proyecto.vercel.app`

---

## 📚 Documentación Completa

Para instrucciones detalladas, consulta la [Guía Completa de Deployment](https://github.com/tu-usuario/ecored-comunal/blob/main/docs/deployment-guide.md)

---

## 🗄️ Base de Datos

### Neon PostgreSQL (Gratis)

1. Crear cuenta en [neon.tech](https://neon.tech)
2. Crear proyecto → Copiar connection string
3. Agregar a variables de entorno en Vercel
4. Ejecutar migraciones:
   ```bash
   DATABASE_URL="tu-connection-string" npm run db:push
   ```

---

## 🔐 Variables de Entorno Requeridas

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | URL de PostgreSQL |
| `SESSION_SECRET` | Secreto para sesiones (32+ chars) |
| `NODE_ENV` | `production` |

**Generar SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## ✅ Verificación

Después del deployment, verifica:

- [ ] Página principal carga
- [ ] Navegación funciona
- [ ] Imágenes se cargan
- [ ] Formulario de contacto funciona
- [ ] No hay errores en consola (F12)

---

## 🔧 Troubleshooting

**Build failed**: Verifica `npm run build` localmente
**Database error**: Verifica `DATABASE_URL` en variables de entorno
**404 en rutas**: Verifica que `vercel.json` esté en el repo

---

## 📞 Soporte

- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Issues](https://github.com/tu-usuario/ecored-comunal/issues)
