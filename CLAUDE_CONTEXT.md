# Maya with Sidebar — Claude Context File

> Copy and paste everything below this line into Claude to continue or recreate this project.

---

## Project Name
Maya_with_sidebar (also called Maya_sidebar_claudebuild)

## Goal
Build and deploy a web app called **Maya** that has a collapsible sidebar UI. The app should be deployable to **Vercel**.

## Tech Stack (preferred)
- **Framework:** Next.js (App Router) — best for Vercel deployment
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Package manager:** npm

## Project Structure to Generate
```
maya-with-sidebar/
├── app/
│   ├── layout.tsx        # Root layout with sidebar wrapper
│   ├── page.tsx          # Main page / home
│   └── globals.css       # Global styles
├── components/
│   ├── Sidebar.tsx       # Collapsible sidebar component
│   ├── SidebarToggle.tsx # Button to open/close sidebar
│   └── MainContent.tsx   # Main content area
├── public/
├── .gitignore
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Sidebar Requirements
- Collapsible (open/close toggle button)
- Smooth slide animation
- Navigation links inside sidebar
- Responsive: on mobile, sidebar overlays content; on desktop, it pushes content
- State persisted via React useState (or localStorage for persistence across refreshes)

## Vercel Deployment Requirements
- Must include a valid `package.json` with `build` and `start` scripts
- No hardcoded secrets — use `.env.local` for any env vars
- All routes must work on Vercel (use Next.js App Router)

## Commands to run after generation
```bash
npm install
npm run dev       # local development
npm run build     # verify it builds before pushing to GitHub
```

## GitHub Repo
https://github.com/cre8veheart-ai/Maya_with_sidebar

## Prompt to use with Claude
"Please generate the complete source code for the Maya_with_sidebar Next.js app described above. Output every file in full so I can copy each one directly into my project. Start with package.json, then next.config.ts, then tailwind.config.ts, tsconfig.json, then all files under app/ and components/."
