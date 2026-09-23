# Pedidos360 · Frontend

React + JavaScript + Vite. Login con Microsoft Entra ID (MSAL) y autorización por rol
(`admin`, `operador`, `cliente`, `auditor`). Consume `/api/orders` y `/api/catalog`.

## Puesta en marcha

```bash
npm install
cp .env.example .env      # completar con los valores de Entra ID y del API Gateway
npm run dev               # http://localhost:5173
```

Requisitos en Azure / AWS:
- La app Frontend debe tener `http://localhost:5173` registrado como redirect URI de tipo **SPA**.
- El API Gateway debe permitir CORS desde ese origen con los headers `Authorization` y `Content-Type`.
- El access token debe traer el claim `roles` (App Roles asignados al usuario).

## Estructura

```
src/
├─ app/                 Ensamblado: providers, router, layout autenticado, registro de módulos
│  └─ modules.js        ← única lista a tocar para agregar un módulo
├─ core/                Infraestructura sin UI de negocio
│  ├─ auth/             MSAL, SessionProvider (roles del access token), RequireAuth, RequireRole, permisos
│  ├─ api/              Cliente HTTP con Bearer token, ApiError
│  └─ config/           Variables de entorno
├─ design-system/       Diseño atómico (solo UI genérica, sin lógica de negocio)
│  ├─ atoms/            Button, Chip, Dot, Avatar, LogoMark, Kbd, Input/Select/Textarea, iconos
│  ├─ molecules/        SearchInput, FilterChips, FactsList, Field, Notice, EmptyState
│  ├─ organisms/        Sidebar, Topbar, DataTable, DetailPanel
│  └─ templates/        AppLayout, PageLayout, AuthGateLayout, CenteredMessage
├─ features/            Un módulo por carpeta, con todo lo suyo adentro
│  ├─ auth/  dashboard/  orders/  catalog/
│  └─ <modulo>/{api,hooks,constants,utils,components,pages,index.js}
└─ shared/utils/        cx, formateadores (CLP, fechas)
```

Los componentes propios de un dominio (`OrderStatusBadge`, `OrderStatusStepper`, `OrderDetail`,
`ProductCard`, `StockMeter`…) viven en `features/<modulo>/components`: son moléculas y organismos
armados con piezas del `design-system`.

## Agregar un módulo

1. Crea `src/features/<modulo>/` con su `pages/`, `api/` y `hooks/`.
2. Exporta un manifiesto en `src/features/<modulo>/index.js`:
   ```js
   export default { id, path, label, icon, roles: PERMISSIONS.<recurso>.read, Page: lazy(() => import('./pages/MiPage')) };
   ```
3. Agrégalo a la lista de `src/app/modules.js`.

El menú lateral, la ruta y el guard por rol se generan solos. Para indicadores en el dashboard,
registra widgets en `features/dashboard/widgets.js`.

## Roles y permisos

`core/auth/permissions.js` es un espejo del backend (`libs/constants/permissions.js`).
La UI lo usa solo para mostrar u ocultar acciones: **la validación real es la del backend**.

## Estados del pedido

`PENDING → CONFIRMED → SHIPPED → DELIVERED` (o `CANCELLED` desde `PENDING`/`CONFIRMED`).
Las transiciones viven en `features/orders/constants/orderStatus.js`.
El stock lo descuenta el backend al crear el pedido.
