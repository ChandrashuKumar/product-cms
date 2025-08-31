# Products Management CMS

A full-stack content management system for product lifecycle management built with Next.js and MariaDB.

## Live Demo
🚀 **[View Live Application](https://product-cms-kohl.vercel.app/)**

## Features
- ✅ **Add/Edit/Delete Products** (soft delete for audit trail)
- ✅ **Status Management** (Draft/Published/Archived)
- ✅ **Live Publishing** (admin changes appear immediately on public site)
- ✅ **Audit Trail** (tracks who created/updated products and when)
- ✅ **Public View** (shows only published, non-deleted products)
- ✅ **Responsive Design** (works on desktop and mobile)

## Tech Stack
- **Frontend**: Next.js 13+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MariaDB (SkySQL Cloud)
- **Deployment**: Vercel

## Project Structure
```
products-cms/
├── app/
│   ├── api/products/          # CRUD API endpoints
│   ├── products/              # Admin product management
│   ├── live/                  # Public product view
│   └── page.tsx              # Dashboard
├── lib/
│   ├── db.ts                 # Database connection
│   └── types.ts              # TypeScript interfaces
├── components/               # Reusable UI components
└── README.md
```

## API Endpoints
- `GET /api/products` - List all products
- `POST /api/products` - Create new product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Soft delete product

## Database Schema
```sql
CREATE TABLE Products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    product_desc TEXT,
    status ENUM('Draft', 'Published', 'Archived') DEFAULT 'Draft',
    created_by VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);
```

## Local Development Setup
1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd products-cms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create `.env.local`:
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=product_cms
   DB_PORT=4047
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

## Key Functionality Demonstrated
- **Product Lifecycle Management**: Create → Draft → Published → Live
- **Soft Delete**: Products are never physically deleted, only marked as deleted
- **Real-time Updates**: Published products appear immediately on public site
- **Audit Trail**: Full tracking of who created/modified products and when
- **Status Filtering**: View products by status (Draft/Published/Archived)
