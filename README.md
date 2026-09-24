# Pedidos360 · Frontend

Aplicación web para la gestión de pedidos y catálogo. Está construida con React,
JavaScript y Vite. Usa Microsoft Entra ID para el inicio de sesión y consume el
API Gateway mediante tokens Bearer.

## Funcionalidades

- Inicio de sesión con Microsoft Entra ID (MSAL).
- Autorización por App Roles: `admin`, `operador`, `cliente` y `auditor`.
- Dashboard inicial para usuarios autenticados.
- Catálogo con búsqueda, filtros por categoría, vista de grilla o lista y filtro de stock bajo.
- Alta, edición y eliminación de productos para administradores.
- Carga de imágenes de productos en alta y edición.
- Creación de pedidos con validación de stock, cantidades y total en CLP.
- Seguimiento de pedidos y avance por estados según el rol del usuario.
- Diseño responsive con componentes reutilizables.
- Deploy automático a un bucket S3 mediante GitHub Actions.

## Requisitos

- Node.js 20 o superior.
- npm.
- Una aplicación SPA registrada en Microsoft Entra ID.
- Un API Gateway desplegado y accesible desde el navegador.
- Un bucket S3 configurado para servir los archivos estáticos del frontend.

## Desarrollo local

```bash
npm install
cp .env.example .env
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

También están disponibles estos scripts:

```bash
npm run build     # genera la versión de producción en dist/
npm run preview   # sirve localmente el build generado
```

## Variables de entorno

Completa `.env` a partir de `.env.example`:

| Variable | Descripción |
| --- | --- |
| `VITE_AZURE_CLIENT_ID` | Client ID de la aplicación SPA del frontend. |
| `VITE_AZURE_TENANT_ID` | Tenant ID de Microsoft Entra ID. |
| `VITE_AZURE_REDIRECT_URI` | URL registrada como redirect URI de tipo SPA. En local suele ser `http://localhost:5173`. |
| `VITE_API_BASE_URL` | URL base del API Gateway, sin slash final. |
| `VITE_API_SCOPE_BASE` | Identificador `api://...` de la aplicación del backend. |

Los paths `/api/orders` y `/api/catalog` se agregan desde el código. No subas
`.env` al repositorio: contiene la configuración específica del entorno.

## Configuración de Entra ID y API

En Microsoft Entra ID:

1. Registra el frontend como una aplicación de tipo SPA.
2. Registra `http://localhost:5173` como redirect URI para desarrollo.
3. Registra también la URL pública del bucket S3 cuando se use en producción.
4. Concede al frontend permisos para solicitar los scopes expuestos por el backend.
5. Asigna a los usuarios los App Roles correspondientes.

El API Gateway debe permitir CORS desde los orígenes usados por la aplicación y
aceptar los headers `Authorization` y `Content-Type`. El access token solicitado
para la API debe incluir el claim `roles`.

## Módulos y rutas

| Módulo | Ruta | Descripción |
| --- | --- | --- |
| Inicio | `/dashboard` | Vista inicial para cualquier usuario autenticado. |
| Pedidos | `/orders` | Consulta, creación y gestión de pedidos. |
| Catálogo | `/catalog` | Consulta y administración de productos. |

El router y el menú lateral se generan desde `src/app/modules.js`. Cada módulo
define su ruta, etiqueta, icono, roles permitidos y página lazy-loaded en su
propio `index.js`.

## Roles y permisos

`src/core/auth/permissions.js` mantiene el espejo de los permisos del backend y
se usa para mostrar u ocultar acciones en la interfaz:

| Recurso | Acción | Roles |
| --- | --- | --- |
| Catálogo | Leer | `admin`, `operador`, `cliente` |
| Catálogo | Crear, editar, eliminar | `admin` |
| Pedidos | Leer, crear, cambiar estado, cancelar | `admin`, `operador`, `cliente` |

La interfaz no reemplaza la autorización del backend. La validación definitiva
de cada operación debe mantenerse en la API.

## Flujo de pedidos

Los estados disponibles son:

```text
PENDING → CONFIRMED → PREPARING → READY → DELIVERED
```

Un pedido puede pasar a `CANCELLED` desde `PENDING` o `CONFIRMED`. Las reglas y
etiquetas se encuentran en `src/features/orders/constants/orderStatus.js`.
El backend descuenta el stock al crear el pedido.

## Estructura del proyecto

```text
src/
├─ app/                 Providers, router, layouts y registro de módulos
├─ core/                API, autenticación, sesión, permisos y configuración
├─ design-system/       Atoms, molecules, organisms y templates reutilizables
├─ features/
│  ├─ auth/             Pantalla de inicio de sesión
│  ├─ dashboard/        Inicio y widgets del dashboard
│  ├─ orders/           API, hooks, formularios, lista y detalle de pedidos
│  └─ catalog/          API, hooks, formularios, grilla y detalle de productos
└─ shared/utils/        Utilidades compartidas y formateadores
```

La lógica de cada dominio vive dentro de `features/<modulo>`. Los componentes
genéricos pertenecen a `design-system`; los componentes específicos, como
`ProductCard`, `OrderModal` o `StockMeter`, permanecen en su módulo.

## Agregar un módulo

1. Crea `src/features/<modulo>/` con sus carpetas `api/`, `hooks/`, `pages/` y `components/`.
2. Exporta un manifiesto desde `src/features/<modulo>/index.js`:

   ```js
   export default {
     id,
     path,
     label,
     icon,
     roles: PERMISSIONS.<recurso>.read,
     Page: lazy(() => import('./pages/MiPage')),
   };
   ```

3. Agrega el manifiesto a `src/app/modules.js`.

Para agregar indicadores al dashboard, registra widgets en
`src/features/dashboard/widgets.js`.

## Deploy automático

El workflow `.github/workflows/deploy.yml` se ejecuta en cada push a `main` o
manualmente desde la pestaña **Actions** de GitHub. Sus pasos son:

1. Instalar Node.js 20 y dependencias con `npm ci`.
2. Construir el frontend con `npm run build`.
3. Configurar credenciales temporales de AWS.
4. Sincronizar `dist/` con el bucket S3 configurado.

Configura estos **Repository secrets** en GitHub:

| Secret | Uso |
| --- | --- |
| `AWS_ACCESS_KEY_ID` | Access key temporal de AWS Academy. |
| `AWS_SECRET_ACCESS_KEY` | Secret key temporal de AWS Academy. |
| `AWS_SESSION_TOKEN` | Session token temporal de AWS Academy. |
| `AWS_REGION` | Región del bucket S3, por ejemplo `us-east-1`. |
| `FRONTEND_S3_BUCKET` | Nombre del bucket donde se publica el frontend. |
| `VITE_AZURE_CLIENT_ID` | Client ID de Entra ID usado durante el build. |
| `VITE_AZURE_TENANT_ID` | Tenant ID usado durante el build. |
| `VITE_AZURE_REDIRECT_URI` | Redirect URI pública del frontend. |
| `VITE_API_BASE_URL` | URL base del API Gateway. |
| `VITE_API_SCOPE_BASE` | Scope base de la API del backend. |

Las credenciales de AWS Academy son temporales y deben actualizarse cuando
expiren. El workflow no las renueva automáticamente.

El bucket debe permitir servir `index.html` como documento principal y tener
configurados los permisos y CORS necesarios para el uso desde el navegador.
