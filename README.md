# Sistema de Gestion de Citas Medicas

Sistema web para la gestion de Empresas.
Cuenta con un **backend ASP.NET Core MVC** que sirve tanto vistas Razor como una **API REST con JWT**,
y un **frontend Angular ** que consume dicha API.

---

## Tecnologias Utilizadas

### Backend
- ASP.NET Core MVC (.NET 10)
- Entity Framework Core (SQL Server)
- ASP.NET Identity (autenticacion con cookies para MVC)
- JWT Bearer (autenticacion con tokens para la API REST)
- Arquitectura en capas: Controllers -> Services -> Data (DbContext)

### Frontend
- Angular 20 (standalone components)
- Bootstrap 5 + ng-bootstrap
- RxJS (programacion reactiva)
- TypeScript

---

## Estructura del Proyecto

### Backend (SisGestionCitasMedicas/)

```
SisGestionCitasMedicas/
├── Controllers/                    # Controladores MVC (vistas Razor)
│   ├── HomeController.cs           #   Pagina de inicio
│   ├── EmpresasController.cs       #   CRUD de empresas (vistas)
│   └── Api/                        # Controladores API REST (JSON)
│       ├── AuthController.cs       #   Login y registro con JWT
│       └── EmpresasApiController.cs#   CRUD de empresas (API)
│
├── Models/                         # Entidades de base de datos
│   ├── Empresa.cs                  #   Modelo de empresa
│   ├── ApplicationUser.cs          #   Usuario de Identity
│   └── ErrorViewModel.cs           #   Modelo para pagina de error
│
├── Services/                       # Capa de logica de negocio
│   ├── Interfaces/
│   │   └── IEmpresaService.cs      #   Contrato del servicio
│   └── EmpresaService.cs           #   Implementacion (acceso a BD)
│
├── DTOs/Api/                       # Objetos de transferencia para la API
│   ├── LoginRequestDto.cs          #   Datos de login (email, password)
│   ├── RegisterRequestDto.cs       #   Datos de registro
│   ├── AuthResponseDto.cs          #   Respuesta con token JWT
│   └── ApiResponse.cs              #   Envoltorio generico de respuesta
│
├── Data/
│   └── ApplicationDbContext.cs     # DbContext de Entity Framework
│
├── Middleware/
│   └── ExceptionHandlingMiddleware.cs # Captura excepciones globales
│
├── Views/                          # Vistas Razor (.cshtml)
│   ├── Home/
│   ├── Empresas/
│   └── Shared/
│
├── Program.cs                      # Punto de entrada y configuracion
├── appsettings.json                # Cadena de conexion y config JWT
└── SisGestionCitasMedicas.csproj   # Dependencias NuGet
```

### Frontend (Frontend/)

```
Frontend/src/
├── app/
│   ├── core/                       # Capa central (singleton)
│   │   ├── models/                 #   Interfaces TypeScript
│   │   │   ├── empresa.model.ts    #     Modelo de Empresa
│   │   │   ├── auth.model.ts       #     Login/Register/AuthResponse
│   │   │   └── api-response.model.ts#    Respuesta generica de la API
│   │   ├── services/               #   Servicios HTTP
│   │   │   ├── auth.service.ts     #     Login, register, logout, token
│   │   │   └── empresa.service.ts  #     CRUD de empresas
│   │   ├── guards/
│   │   │   └── auth.guard.ts       #   Protege rutas (requiere login)
│   │   └── interceptors/
│   │       └── auth.interceptor.ts #   Agrega token JWT a cada peticion
│   │
│   ├── shared/                     # Componentes reutilizables
│   │   ├── navbar/                 #   Barra de navegacion
│   │   └── confirm-dialog/         #   Modal de confirmacion (eliminar)
│   │
│   ├── features/                   # Modulos funcionales
│   │   ├── auth/                   #   Login y Registro
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── auth.routes.ts
│   │   ├── home/                   #   Pagina de inicio
│   │   └── empresas/               #   CRUD de empresas
│   │       ├── empresa-list/       #     Tabla con listado
│   │       ├── empresa-form/       #     Formulario (crear/editar)
│   │       ├── empresa-detail/     #     Vista detalle
│   │       └── empresas.routes.ts
│   │
│   ├── app.ts                      # Componente raiz
│   ├── app.html                    # Plantilla raiz (navbar + router-outlet)
│   ├── app.config.ts               # Providers globales (router, http, interceptor)
│   └── app.routes.ts               # Rutas principales con lazy loading
│
├── environments/
│   ├── environment.ts              # Config desarrollo (localhost:5270)
│   └── environment.prod.ts         # Config produccion
│
└── styles.css                      # Estilos globales (Bootstrap)
```

---

## Endpoints de la API REST

Todos los endpoints (excepto auth) requieren token JWT en el header `Authorization: Bearer {token}`.

### Autenticacion (`/api/auth`)

| Metodo | Ruta               | Descripcion                        |
|--------|--------------------|------------------------------------|
| POST   | `/api/auth/login`    | Inicia sesion, retorna token JWT   |
| POST   | `/api/auth/register` | Registra usuario, retorna token JWT|

### Empresas (`/api/empresas`)

| Metodo | Ruta                | Descripcion                 |
|--------|---------------------|-----------------------------|
| GET    | `/api/empresas`       | Lista todas las empresas    |
| GET    | `/api/empresas/{id}`  | Obtiene empresa por ID      |
| POST   | `/api/empresas`       | Crea nueva empresa          |
| PUT    | `/api/empresas/{id}`  | Actualiza empresa existente |
| DELETE | `/api/empresas/{id}`  | Elimina empresa             |

---

## Autenticacion

El sistema usa **dos esquemas de autenticacion** que coexisten:

| Esquema  | Usado por      | Como funciona                                    |
|----------|----------------|--------------------------------------------------|
| Cookies  | Vistas MVC     | Identity maneja login/logout con cookies de sesion|
| JWT      | API REST       | El frontend envia el token en cada peticion HTTP  |

### Flujo JWT (Frontend Angular):
1. El usuario se registra o inicia sesion en `/api/auth/login`
2. El backend genera un token JWT firmado y lo retorna
3. El frontend guarda el token en `localStorage`
4. El interceptor agrega automaticamente el token a cada peticion HTTP
5. El backend valida el token en cada endpoint protegido con `[Authorize]`

---

## Instalacion y Ejecucion

### Requisitos
- .NET 10 SDK
- SQL Server
- restaurar la base de datos de prueba cob_hospital.bak ( opcional)
- Node.js 20+ y npm
- Angular CLI (`npm install -g @angular/cli`)

### 1. Configurar la base de datos

Editar la cadena de conexion en `appsettings.json`:

```json
"ConnectionStrings": {
  "cnn": "Data Source=TU_SERVIDOR;Initial Catalog=cob_hospital;User ID=tu_usuario;TrustServerCertificate=True"
}
```

### 2. Ejecutar el backend

```bash
cd SisGestionCitasMedicas
dotnet restore
dotnet run
```

El backend inicia en `http://localhost:5270`.

### 3. Ejecutar el frontend

```bash
cd Frontend
npm install
ng serve
```

El frontend inicia en `http://localhost:4200`.

### 4. Probar la aplicacion

1. Abrir `http://localhost:4200` en el navegador
2. Registrar un usuario nuevo en la pagina de registro
3. Iniciar sesion con las credenciales creadas
4. Navegar al modulo de Empresas para crear, editar, ver y eliminar registros

---

## Arquitectura

```
┌─────────────────────┐       HTTP/JSON        ┌─────────────────────────┐
│   Frontend Angular   │ ◄──────────────────► │    Backend ASP.NET Core   │
│   (localhost:4200)   │    JWT en header       │    (localhost:5270)       │
├─────────────────────┤                        ├─────────────────────────┤
│ Components           │                        │ Controllers/Api/         │
│ Services (HTTP)      │                        │   ├── AuthController     │
│ Guards (auth)        │                        │   └── EmpresasApi...     │
│ Interceptor (JWT)    │                        │ Services/                │
│ Models (interfaces)  │                        │   └── EmpresaService     │
└─────────────────────┘                        │ Data/                    │
                                               │   └── DbContext          │
                                               └────────┬────────────────┘
                                                        │ EF Core
                                                ┌───────▼───────┐
                                                │   SQL Server   │
                                                │  cob_hospital  │
                                                └───────────────┘
```

---

## Clonar el Repositorio

```bash
git clone https://github.com/oscarofpcc-coder/SisGestHospitalEP1.git
```
