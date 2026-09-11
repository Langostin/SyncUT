# Squad 2 — Autenticación, Roles, Sesiones y Auditoría

Material de referencia y exposición del módulo de seguridad transversal.

## Contenido

| Archivo | Descripción |
|---------|-------------|
| `SyncUT_Auth_Roles_Logs.pdf` | Resumen técnico del estado real del módulo + guía de exposición (17 páginas). |
| `resumen-auth-roles-logs.html` | Fuente HTML del PDF. Para regenerarlo tras editarlo, ver abajo. |

## Qué cubre el documento

1. Panorama general y las cuatro piezas del módulo
2. Arquitectura de tres capas (UI → SDK → Supabase)
3. Las cuatro tablas: `profiles`, `role_permissions`, `session_tokens`, `audit_logs`
4. Sistema de roles (RBAC) y el trigger `handle_new_user()`
5. Políticas RLS implementadas, con los huecos detectados
6. Flujos de registro y login: diseño frente a implementación actual
7. Protección de rutas y sesión
8. Logs y auditoría (escritura pendiente, lectura y Realtime funcionando)
9. Tabla de estado real del módulo y los cinco siguientes pasos
10. Guion de exposición de 10 minutos
11. Preguntas frecuentes con respuestas
12. Chuleta de archivos y glosario

## Regenerar el PDF

```bash
chromium --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=docs/squad-2-autenticacion/SyncUT_Auth_Roles_Logs.pdf \
  docs/squad-2-autenticacion/resumen-auth-roles-logs.html
```

## Documentación relacionada

- `apps/web/app/(auth)/AUTH_DATABASE.md` — especificación completa del esquema de seguridad
- `apps/web/app/(auth)/README.md` — alcance y responsables del módulo
- `supabase/migrations/` — migraciones SQL del esquema, trigger y políticas RLS
