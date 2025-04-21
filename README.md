# Shipment Logistics Frontend

Sistema de gestión de envíos y logística desarrollado con React y TypeScript.

## 🚀 Tecnologías Utilizadas

- **React** - Biblioteca para interfaces de usuario
- **TypeScript** - Superset de JavaScript con tipado estático
- **Vite** - Bundler y herramienta de desarrollo
- **Tailwind CSS** - Framework de CSS utilitario
- **Shadcn/ui** - Componentes de UI reutilizables
- **React Router** - Enrutamiento
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **WebSocket** - Comunicación en tiempo real
- **Google Maps API** - Mapas y geocodificación

## 📁 Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
│   ├── ui/        # Componentes de interfaz básicos
│   ├── address/   # Componentes de dirección y mapas
│   └── shipments/ # Componentes específicos de envíos
├── hooks/         # Hooks personalizados
├── lib/           # Utilidades y helpers
├── pages/         # Páginas de la aplicación
├── providers/     # Proveedores de contexto
├── schemas/       # Esquemas de validación
├── services/      # Servicios de API
├── stores/        # Estado global (Zustand)
└── types/         # Tipos de TypeScript
```

## 📦 Módulos Principales

### 1. Autenticación y Autorización

- Login y registro de usuarios
- Manejo de roles (Admin/Usuario)
- Protección de rutas
- Persistencia de sesión

### 2. Gestión de Envíos

- Creación y edición de envíos
- Listado y búsqueda
- Filtros y ordenamiento
- Validación de formularios

### 3. Seguimiento de Estados

- Historial de estados en tiempo real
- Notificaciones WebSocket
- Visualización en mapa
- Timeline de eventos

### 4. Integración con Google Maps

- Autocompletado de direcciones
- Geocodificación
- Visualización de rutas
- Marcadores personalizados

## 🛣️ Rutas de la Aplicación

- `/` - Página de inicio
- `/login` - Inicio de sesión
- `/register` - Registro de usuarios
- `/shipments` - Lista de envíos
- `/shipments/new` - Crear nuevo envío
- `/shipments/:id` - Detalles y tracking
- `/profile` - Perfil de usuario
- `/settings` - Configuración

## 🔌 APIs Utilizadas

### Google Maps

- Places API (autocompletado)
- Geocoding API
- Maps JavaScript API
- Directions API

### Backend API

- REST API para CRUD de envíos
- WebSocket para actualizaciones en tiempo real
- Autenticación JWT

## 🔧 Configuración del Proyecto

### Prerequisitos

- Node.js (versión 18 o superior)
- pnpm (Gestor de paquetes)
- API Key de Google Maps

### Instalación de pnpm

```bash
# Instalar pnpm globalmente
npm install -g pnpm
```

### Pasos de Instalación

1. Clonar el repositorio:

```bash
git clone <repository-url>
cd shipment-logistics-frontend
```

2. Instalar dependencias:

```bash
pnpm install
```

3. Configurar variables de entorno:

```bash
cp .env.example .env
```

4. Iniciar en modo desarrollo:

```bash
pnpm dev
```

5. Construir para producción:

```bash
pnpm build
```

6. Vista previa de producción:

```bash
pnpm preview
```

## 🔐 Variables de Entorno Requeridas

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 🎨 Componentes UI Personalizados

### Address

- `AddressAutocomplete` - Campo de autocompletado de direcciones
- `AddressMap` - Visualización de mapa con marcador

### Shipments

- `ShipmentForm` - Formulario de creación/edición
- `ShipmentList` - Lista de envíos con filtros
- `ShipmentStatus` - Indicador de estado
- `TrackingTimeline` - Timeline de estados

### UI Base

- `Button` - Botones estilizados
- `Input` - Campos de entrada
- `Select` - Selectores personalizados
- `Dialog` - Modales y diálogos
- `Alert` - Mensajes de alerta
- `Toast` - Notificaciones

## 📱 Características Responsive

- Diseño mobile-first
- Navegación adaptativa
- Mapas responsivos
- Formularios optimizados para móvil

## 🔄 Estado Global

- Autenticación (Zustand)
- Tema y preferencias
- Notificaciones WebSocket
- Cache de datos

## 📝 Convenciones de Código

- ESLint para linting
- Prettier para formateo
- Husky para git hooks
- Commit convencional

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
