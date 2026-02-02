# Z-Systems - Modern Technology Company Website

A modern, professional website for Z-Systems, a technology company focused on software development and digital solutions.

## 🚀 Features

- **Modern Design**: Clean, professional UI based on the provided template
- **Responsive Layout**: Fully responsive design that works on all devices
- **Next.js 14**: Built with Next.js App Router and TypeScript
- **Tailwind CSS**: Styled with Tailwind CSS for rapid development
- **Complete Sections**:
  - Hero section with compelling CTA
  - About Us with company description
  - Services showcase (6 core services)
  - Team section with CEO profile
  - Projects/Portfolio section
  - Contact form with validation
  - Professional footer

## 🎨 Brand Identity

### Colors
- **Primary**: Dark Blue (#1e3a5f) - Professional, trustworthy
- **Secondary**: Blue (#3b82f6) - Modern, innovative
- **Accent**: Slate Gray (#64748b) - Balanced, professional

### Typography
- **Font**: Inter (Google Fonts) - Clean, modern, readable

### Slogan
**"Smart, Scalable IT Solutions for Your Business"**

## 📋 Core Services

1. Custom Software Development
2. Enterprise Software Solutions
3. API Development & Integration
4. Dashboard & Analytics Platforms
5. Digital Platform Development
6. Cloud Solutions & DevOps

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Font**: Inter (Google Fonts)

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (EmailJS contact form):

Create a `.env.local` file in the project root with:

```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

In your EmailJS template, map these variables (template params):
- `title` (optional)
- `name`
- `email`
- `from_name` (optional)
- `from_email` (optional)
- `phone`
- `company`
- `message`
- `language`

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
z-systems/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/
│   ├── Header.tsx       # Navigation header
│   ├── Hero.tsx         # Hero section
│   ├── About.tsx        # About section
│   ├── Services.tsx     # Services section
│   ├── Team.tsx         # Team section
│   ├── Projects.tsx     # Projects section
│   ├── Contact.tsx      # Contact section
│   └── Footer.tsx       # Footer
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🎯 Key Features

- **SEO Optimized**: Proper meta tags and semantic HTML
- **Accessible**: ARIA labels and keyboard navigation
- **Performance**: Optimized images and code splitting
- **Modern UI/UX**: Smooth animations and transitions
- **Mobile First**: Responsive design approach

## 📝 Customization

### Update Company Information
Edit the contact information in:
- `components/Header.tsx` (top bar)
- `components/Contact.tsx` (contact section)
- `components/Footer.tsx` (footer)

### Update Team Member
Edit CEO information in `components/Team.tsx`

### Update Services
Modify services array in `components/Services.tsx`

### Update Projects
Modify projects array in `components/Projects.tsx`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import your repository in Vercel
3. Deploy automatically

### Other Platforms
Build the production version:
```bash
npm run build
npm start
```

## 📄 License

This project is proprietary and confidential.

## 👥 Team

**Dr. Zainab Adeyemi** - Founder & CEO
- Vision-driven leader, software developer and systems engineer
- Over 10 years of experience in building scalable technology solutions

---

Built with ❤️ by Z-Systems

