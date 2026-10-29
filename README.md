# 👞 JH Shoe Gallery

**JH Shoe Gallery** is a full-stack, modern, high-performance E-commerce web application specifically designed for premium footwear retail. Built with a robust Node.js/Express backend and a cutting-edge Next.js frontend, it offers a seamless shopping experience for customers and a comprehensive administrative dashboard for store management.

---

## 🌟 Key Features

### 🛍️ Customer Experience
- **Dynamic Catalog & Search:** Browse shoes by categories, hierarchical subcategories, tags, and promotional badges (e.g., Fresh Stock, New In, Hot, Limited).
- **Product Variations & Inventory:** Size-wise stock tracking (`ProductVariant`) ensuring real-time availability.
- **Flash Sales:** Time-limited promotional sales with start/end timers.
- **Cart & Secure Checkout:** Manage cart items, select sizes, and place orders with guest or registered user checkout.
- **Flexible Payment Methods:** Cash on Delivery (COD), bKash, Nagad, Card, and Bank transfer support.
- **User Authentication & Profiles:** Secure JWT-based authentication, address management, and order history tracking.
- **Interactive UI:** Responsive modern design with Hero sliders, Promo banner grids, toast notifications, search modal, and splash screen.

### 📊 Admin & Staff Dashboard
- **Analytics & Statistics:** Overview of total sales, orders, customers, and inventory.
- **Product Management:** Add, edit, delete products with multiple gallery images and size-wise inventory.
- **Category & Taxonomy Management:** Hierarchical categories, tags, and badge management.
- **Order Management:** Update order statuses (Pending, Confirmed, Processing, Shipped, Delivered, Cancelled, Returned) and payment tracking.
- **Inventory Control:** Monitor and adjust size-specific stock levels in real time.
- **Customer Management:** View customer lists and manage user accounts.
- **CMS & Banners:** Configure hero sliders and promotional banners dynamically.

---

## 🛠️ Tech Stack

### Backend (`/server`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database & ORM:** PostgreSQL with Prisma ORM
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Validation:** Zod schemas
- **File Uploads:** Multer & Cloudinary SDK
- **Logging & Utilities:** Morgan, dotenv, cors

### Frontend (`/client`)
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4)
- **State Management:** Zustand
- **Data Fetching & Caching:** TanStack React Query (v5) & Axios
- **Icons & UI Utilities:** Custom icon system & reactive contexts

---

## 📂 Project Structure

```text
JH-Shoe-Gallery/
├── client/                # Next.js Frontend Application
│   ├── app/               # Next.js App Router (Shop & Admin routes)
│   ├── src/
│   │   ├── components/    # UI components (Home, Product, Admin, Layout)
│   │   ├── hooks/         # React Query hooks & mutations
│   │   ├── lib/           # API clients, services, store, query config
│   │   ├── store/         # Zustand global state stores
│   │   └── types/         # TypeScript interfaces & types
│   ├── public/            # Static assets (Images, fonts, SVGs)
│   └── package.json
│
└── server/                # Express.js Backend API
    ├── prisma/            # Database schema, migrations, and seed script
    ├── src/
    │   ├── config/        # Database & Cloudinary configurations
    │   ├── controllers/   # Route controllers (Auth, Product, Order, Cart, CMS, Admin)
    │   ├── middlewares/   # Authentication, validation, error handling, upload
    │   ├── routes/        # API route definitions
    │   ├── utils/         # API response & error handling helpers
    │   └── validations/   # Zod validation schemas
    ├── server.js          # App entry point
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **PostgreSQL** database instance
- **Cloudinary** account (for image uploads)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/jh-shoe-gallery.git
cd JH-Shoe-Gallery
```

### 2. Backend Setup (`/server`)
Navigate to the server directory, install dependencies, and configure environment variables.

```bash
cd server
npm install
```

Create a `.env` file in `server/` based on `.env.example`:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/jh_shoe_gallery?schema=public"
JWT_SECRET="your_jwt_secret_key"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

Run database migrations and seed initial data:
```bash
npx prisma migrate dev
npm run prisma:seed
```

Start the development server:
```bash
npm run dev
```

### 3. Frontend Setup (`/client`)
Navigate to the client directory and install dependencies.

```bash
cd ../client
npm install
```

Create a `.env.local` file if needed (defaults to connecting to `http://localhost:5000/api`):
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

Start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📜 Available Scripts

### Server (`/server`)
- `npm run dev` - Start development server with nodemon
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio GUI
- `npm run prisma:seed` - Seed database with initial products and admin user

### Client (`/client`)
- `npm run dev` - Start Next.js development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code checks

---

## 🔒 License
This project is proprietary and confidential.
