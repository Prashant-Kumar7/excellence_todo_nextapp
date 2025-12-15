# Todo App

A modern, full-featured Todo web application built with Next.js (SSR), Supabase, and shadcn UI.

## Features

- 🔐 **Authentication**: Secure login and signup using Supabase Auth
- ✅ **Todo Management**: Create, update, delete, and mark todos as completed/uncompleted
- 📊 **Dashboard**: Three organized tabs - Today's Todos, Completed Todos, and Pending Todos
- 👥 **Admin Panel**: Manage users - view, block, delete, and assign admin roles
- 🎨 **Theme Support**: Dark, light, and system theme toggle with proper theming across all components
- 🚀 **Server-Side Rendered**: All pages are SSR for optimal performance and SEO

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database & Auth**: Supabase
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod
- **Theme**: next-themes

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase project (sign up at [supabase.com](https://supabase.com))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd todo-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the SQL script from `supabase-schema.sql` to create the necessary tables, policies, and triggers

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses two main tables:

1. **user_profiles**: Stores user information including admin status and blocked status
2. **todos**: Stores todo items with title, description, completion status, and due dates

Row Level Security (RLS) is enabled to ensure users can only access their own data, with admin users having additional permissions.

## Project Structure

```
├── app/
│   ├── admin/          # Admin panel pages
│   ├── dashboard/      # Dashboard pages
│   ├── login/          # Login page
│   ├── signup/         # Signup page
│   └── layout.tsx      # Root layout with theme provider
├── components/
│   ├── admin/          # Admin panel components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   ├── ui/             # shadcn UI components
│   ├── navbar.tsx      # Navigation bar
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── lib/
│   ├── supabase/       # Supabase client utilities
│   ├── types/          # TypeScript types
│   └── auth.ts         # Authentication helpers
└── middleware.ts       # Next.js middleware for auth
```

## Features in Detail

### Authentication
- Secure email/password authentication via Supabase
- Protected routes with middleware
- Automatic profile creation on signup

### Todo Management
- Create todos with title, description, and optional due date
- Mark todos as completed/uncompleted
- Edit existing todos
- Delete todos with confirmation
- Filter todos by Today, Completed, or Pending

### Admin Panel
- View all users in a table
- Toggle admin role for users
- Block/unblock users
- Delete users (with cascade deletion of todos)

### Theme Support
- Dark mode
- Light mode
- System preference detection
- Smooth theme transitions
- Proper theming for all components

## Building for Production

```bash
npm run build
npm start
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
