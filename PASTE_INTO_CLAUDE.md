# Maya with Sidebar — Complete Source Code

> Paste this entire file into Claude (or any AI) to recreate the full project from scratch.

---

## Instructions for Claude

Please create a Next.js 14 app called **maya-with-sidebar** using the exact files below.
Create each file at the exact path shown. After creating all files, run `npm install` then `npm run build` to verify it works.

---

## FILE: package.json

```json
{
  "name": "maya-with-sidebar",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.6",
    "typescript": "^5"
  }
}
```

---

## FILE: next.config.ts

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

---

## FILE: tailwind.config.ts

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          bg: "#1e1e2e",
          text: "#cdd6f4",
          hover: "#313244",
          accent: "#89b4fa",
          border: "#313244",
        },
        main: {
          bg: "#1a1a2e",
          text: "#e2e8f0",
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## FILE: tsconfig.json

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## FILE: postcss.config.js

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

## FILE: app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
```

---

## FILE: app/layout.tsx

```tsx
import "./globals.css";
import type { Metadata } from "next";
import SidebarLayout from "@/components/SidebarLayout";

export const metadata: Metadata = {
  title: "Maya",
  description: "Maya — your AI assistant with sidebar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden bg-[#1a1a2e] text-[#e2e8f0]">
        <SidebarLayout>{children}</SidebarLayout>
      </body>
    </html>
  );
}
```

---

## FILE: app/page.tsx

```tsx
export default function Home() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-[#89b4fa] mb-2">
          Welcome to Maya
        </h1>
        <p className="text-[#cdd6f4] text-lg">
          Your intelligent assistant — ready to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {[
          { title: "💬 Chat", desc: "Start a conversation with Maya." },
          { title: "📋 Tasks", desc: "Manage your to-dos and projects." },
          { title: "🔍 Search", desc: "Find anything instantly." },
          { title: "⚙️ Settings", desc: "Customize your experience." },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5 hover:border-[#89b4fa] transition-colors cursor-pointer"
          >
            <h2 className="text-lg font-semibold text-[#cdd6f4] mb-1">{card.title}</h2>
            <p className="text-sm text-[#a6adc8]">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## FILE: components/SidebarLayout.tsx

```tsx
"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((o) => !o)} />
      <MainContent isOpen={sidebarOpen} onToggle={() => setSidebarOpen((o) => !o)}>
        {children}
      </MainContent>
    </>
  );
}
```

---

## FILE: components/Sidebar.tsx

```tsx
"use client";

import Link from "next/link";
import SidebarToggle from "./SidebarToggle";

const navItems = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "Chat", href: "/chat", icon: "💬" },
  { label: "Tasks", href: "/tasks", icon: "📋" },
  { label: "Search", href: "/search", icon: "🔍" },
  { label: "Settings", href: "/settings", icon: "⚙️" },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={[
          "fixed md:relative z-30 flex flex-col h-screen",
          "bg-[#1e1e2e] border-r border-[#313244]",
          "transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "w-64" : "w-0 md:w-16",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#313244] min-w-[4rem]">
          {isOpen && (
            <span className="text-[#89b4fa] font-bold text-xl tracking-wide whitespace-nowrap">
              Maya
            </span>
          )}
          <SidebarToggle isOpen={isOpen} onToggle={onToggle} />
        </div>

        <nav className="flex flex-col gap-1 p-2 mt-2 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2.5",
                "text-[#cdd6f4] hover:bg-[#313244] hover:text-[#89b4fa]",
                "transition-colors duration-150 whitespace-nowrap",
                isOpen ? "" : "justify-center",
              ].join(" ")}
              title={!isOpen ? item.label : undefined}
            >
              <span className="text-lg">{item.icon}</span>
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {isOpen && (
          <div className="px-4 py-4 border-t border-[#313244] text-xs text-[#585b70] whitespace-nowrap">
            Maya v1.0
          </div>
        )}
      </aside>
    </>
  );
}
```

---

## FILE: components/SidebarToggle.tsx

```tsx
"use client";

interface SidebarToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function SidebarToggle({ isOpen, onToggle }: SidebarToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      className="p-1.5 rounded-md text-[#cdd6f4] hover:bg-[#313244] hover:text-[#89b4fa] transition-colors duration-150 flex-shrink-0"
    >
      {isOpen ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18" />
          <path d="M15 9l-3 3 3 3" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18" />
          <path d="M13 9l3 3-3 3" />
        </svg>
      )}
    </button>
  );
}
```

---

## FILE: components/MainContent.tsx

```tsx
"use client";

interface MainContentProps {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export default function MainContent({ isOpen, onToggle, children }: MainContentProps) {
  return (
    <main className="flex flex-col flex-1 min-w-0 h-screen overflow-y-auto bg-[#1a1a2e] transition-all duration-300 ease-in-out">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#313244] bg-[#1e1e2e] sticky top-0 z-10">
        {!isOpen && (
          <button
            onClick={onToggle}
            aria-label="Open sidebar"
            className="p-1.5 rounded-md text-[#cdd6f4] hover:bg-[#313244] hover:text-[#89b4fa] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <span className="text-sm text-[#a6adc8] font-medium">Maya</span>
      </div>
      <div className="flex-1 p-4 md:p-6">{children}</div>
    </main>
  );
}
```

---

## After creating all files, run:

```bash
npm install
npm run build
npm run dev
```

## Deploy to Vercel:

```bash
# Push to GitHub first:
git add .
git commit -m "Initial Maya with sidebar"
git push origin main

# Then connect repo at https://vercel.com/new
```
