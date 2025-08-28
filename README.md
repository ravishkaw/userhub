# UserHub

A full-stack system built with **Node.js/Express** backend and **Angular** frontend.

## 🛠️ Tech Stack

- **Node.js/Express**, **SQL Server**, **JWT**, **Bcrypt**, **Angular 20**, **Angular Material**

## 📋 Prerequisites

- **Node.js**
- **npm**
- **MSSQL Server** ( & SQL Server Management Studio)
- **Angular CLI** (`npm install -g @angular/cli`)

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ravishkaw/userhub.git
cd userhub
```

### 2. Database Setup

1. **Create the Database**: Open SQL Server Management Studio and Execute the contents of `docs/SQLQueries.sql file`.

### 3. Backend Setup

1. **Navigate to backend directory & Install dependencies**:

   ```bash
   cd backend
   npm install
   ```

2. **Create environment file**: Create a `.env` file in the `backend` directory:

   ```env
   # Server Configuration
   PORT=5000

   # Database Configuration
   DB_SERVER=server_name
   DB_NAME=Userhub
   DB_USER=user_name
   DB_PASSWORD=password

   # JWT Configuration
   JWT_SECRET=jwt_secret_key
   JWT_EXPIRES_IN=24h
   ```

3. **Start the backend server**:

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

   The backend will be available at `http://localhost:5000`

### 4. Frontend Setup

1. **Navigate to frontend directory & Install dependencies**:

   ```bash
   cd frontend
   npm install
   ```

2. **Update environment configuration**:
   `src/environments/environment.ts`:

   ```typescript
   export const environment: Environment = {
     apiUrl: "http://localhost:5000/api", // Backend url
   };
   ```

3. **Start the frontend application**:

   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:4200`

## 🚀 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Soft delete user
- `GET /api/auth/me` - Get currently logged in user details

### Roles

- `GET /api/roles` - Get all roles

## 🔒 Default Admin User

The application automatically creates a default admin user when the server starts for the first time.

### Default Credentials

- **Email**: `admin@userhub.com`
- **Password**: `Admin123@`

## 📋 API Testing

### Postman Collection

Import the Postman collection to test API endpoints:

1. Install [Postman](https://www.postman.com/downloads/)
2. Import `docs/Userhub.postman_collection.json`

