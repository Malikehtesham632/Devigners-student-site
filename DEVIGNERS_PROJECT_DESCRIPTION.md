# Devigners Learning Institute — Project Description

## 1. Project Overview

**Devigners Learning Institute** is an IT education website designed around two main learning programs:

- **CUBE** — a computer fundamentals program for complete beginners.
- **COHORT** — a full-stack development program for students who already understand computer fundamentals.

The project was transformed from the previous Nexus/business-platform concept into a dedicated learning institute experience for Devigners.

The website uses a **red-and-white visual identity** based on the supplied Devigners branding and focuses on a clear student journey from computer fundamentals to professional full-stack development.

---

## 2. Main Goals

The project was built to:

1. Present Devigners as an IT learning institute.
2. Clearly explain the CUBE and COHORT programs.
3. Help students identify the appropriate starting point.
4. Provide a modern, responsive, animated user experience.
5. Allow prospective students to submit an admissions request.
6. Store admissions information in a Google Sheet.
7. Send confirmation emails to students.
8. Notify the Devigners/admin email whenever a new admissions request is submitted.
9. Keep sensitive email and Google Sheets credentials on the backend rather than exposing them in the browser.

---

## 3. Programs

### CUBE — Computer Fundamentals

CUBE is designed for students who are new to computers or need a strong foundation.

The program introduces areas such as:

- Computer basics and terminology
- Windows fundamentals
- Files and folders
- Internet and email basics
- Productivity tools
- Digital safety
- Everyday computer confidence

CUBE is intended to establish the foundation required before moving into more advanced technical learning.

### COHORT — Full-Stack Development

COHORT is designed for senior/advanced students who already understand computer fundamentals.

The program focuses on modern full-stack development concepts, including:

- Frontend development
- Backend development
- Databases
- APIs
- Authentication
- Git and GitHub
- Deployment
- Project development
- Practical software development workflows

The overall pathway is designed so that students can build a foundation first and then progress toward application development.

---

## 4. Frontend

The frontend is built with:

- React
- TypeScript
- Vite
- Tailwind CSS

### Main frontend areas

The website includes:

- Homepage
- CUBE program page
- COHORT program page
- About page
- Contact page
- Student profile page
- Authentication UI
- Join Us admissions modal
- Responsive navigation
- Animated learning-pathway sections
- Devigners branding/logo

### Homepage

The homepage introduces Devigners and presents:

- The institute introduction
- CUBE and COHORT pathways
- Program cards
- Student learning progression
- Starting-point guidance
- Calls to action
- External link to the main Devigners website

The **Explore Our Main Page** button opens:

`https://devigners.net/`

in a new browser tab.

---

## 5. Join Us Admissions Form

The navigation includes a **Join Us** button.

The form collects:

1. Full name
2. Email address
3. Program of interest
   - CUBE
   - COHORT
4. Preferred class format
   - In-person classes
   - Online classes

After submission, the student receives a confirmation message explaining that the request has been received and that the Devigners team will contact them as early as possible.

The form also provides loading, success, and error states.

---

## 6. Admissions Automation

Admissions submissions are processed by the FastAPI backend.

The workflow is:

```text
Student
   |
   v
Join Us Form
   |
   v
React Frontend
   |
   v
FastAPI Backend
   |
   +--------------------+
   |                    |
   v                    v
Google Sheets        Gmail SMTP
   |                    |
   v                    +--------------------+
Admissions Sheet        |                    |
                        v                    v
                 Student Email       Admin Email
```

### Google Sheets

Google Apps Script is used as a lightweight webhook.

Admissions data is stored with:

- Submitted At
- Full Name
- Email
- Program
- Class Mode

The Google Apps Script creates an `Admissions` sheet/tab when necessary.

### Email notifications

For each admissions submission:

**Student email**

The student receives a confirmation that Devigners received the request.

**Admin email**

The configured Devigners/admin address receives the student's submitted information and admissions details.

Sensitive credentials are kept in backend environment variables.

---

## 7. Backend

The backend uses **FastAPI** and includes:

- API routes
- Authentication support
- Contact/admissions submission handling
- Email notifications
- Google Sheets webhook integration
- CORS configuration
- Health diagnostics

### Important backend files

```text
backend/
├── main.py
├── auth.py
├── chat.py
├── database.py
├── models.py
├── schemas.py
├── notifications.py
├── requirements.txt
└── google_apps_script/
    └── Code.gs
```

### Health endpoint

A `/health` endpoint is included to help diagnose configuration problems.

It reports whether the required email and Google Sheets configuration values are present without exposing their actual secrets.

---

## 8. Database

The existing SQLite database structure is retained.

This was intentional so that existing account data is not unnecessarily discarded during the institute redesign.

The backend continues to use the existing database setup rather than requiring a new database migration for the admissions form.

---

## 9. Chat Assistant

The backend chat context has been rebranded for Devigners Learning Institute.

The assistant is aware of:

- Devigners
- CUBE
- COHORT
- The institute's learning pathway

The assistant is designed not to invent information such as:

- Fees
- Schedules
- Certificates
- Guarantees

When information is not available, users can be directed toward the admissions/contact process.

---

## 10. Design and User Experience

The visual direction was changed to match Devigners branding.

### Design characteristics

- Red-and-white color direction
- Clean educational presentation
- Responsive layouts
- Modern cards and sections
- Smooth transitions
- Hover interactions
- Fade and slide animations
- Staggered content animations
- Reduced-motion support for accessibility

Animation utility classes were added to make interactions feel smoother without requiring additional frontend dependencies.

---

## 11. Responsive Navigation

The navigation supports both desktop and mobile layouts.

Main navigation includes:

- Home
- CUBE
- COHORT
- About
- Contact
- Join Us

The Join Us form can be opened from the navigation on supported screen sizes.

---

## 12. Security and Environment Variables

Sensitive values are not hard-coded into the frontend.

The backend expects environment variables for values such as:

```text
SENDER_EMAIL
SENDER_APP_PASSWORD
NOTIFY_EMAIL
GOOGLE_SHEETS_WEBHOOK_URL
GOOGLE_SHEETS_WEBHOOK_SECRET
```

The frontend can optionally use:

```text
VITE_API_BASE_URL
```

### Gmail requirement

The email integration uses Gmail SMTP and requires a **Google App Password** rather than the normal Gmail account password.

The sender Gmail account must have 2-Step Verification enabled before an App Password can be used.

No Gmail password or App Password should be committed to Git or placed in frontend source code.

---

## 13. Deployment

The project is structured for:

### Frontend

**Vercel**

The frontend is a Vite/React application.

### Backend

**Railway**

The backend is a FastAPI application.

### Admissions storage

**Google Sheets + Google Apps Script**

### Email

**Gmail SMTP**

---

## 14. Environment Configuration

An example configuration is provided in `.env.example`.

Example:

```text
VITE_API_BASE_URL=https://nexus-brand-production.up.railway.app
SENDER_EMAIL=your-devigners-gmail@gmail.com
SENDER_APP_PASSWORD=your-16-character-google-app-password
NOTIFY_EMAIL=your-admin-email@gmail.com
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
GOOGLE_SHEETS_WEBHOOK_SECRET=replace-with-a-long-random-secret
```

Real credentials should be configured through the hosting platform's environment-variable settings.

---

## 15. Project Structure

```text
Devigners Learning Institute/
│
├── backend/
│   ├── main.py
│   ├── auth.py
│   ├── chat.py
│   ├── database.py
│   ├── models.py
│   ├── notifications.py
│   ├── schemas.py
│   ├── requirements.txt
│   └── google_apps_script/
│       └── Code.gs
│
├── frontend/
│   ├── public/
│   │   └── devigners-logo.gif
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   └── vercel.json
│
├── .env.example
├── .gitignore
├── README.md
├── CHANGES.md
├── CHANGES_ADMISSIONS_WORKFLOW.md
├── GOOGLE_SHEETS_EMAIL_SETUP.md
├── GMAIL_TESTING.md
└── JOIN_US_FORM.md
```

---

## 16. Verification

The project includes documentation for testing the admissions workflow.

Backend Python compilation was checked successfully.

Earlier frontend checks included:

- TypeScript typecheck
- ESLint

A production frontend build depends on installing the correct platform-specific Vite/Rollup dependencies in the deployment environment.

`node_modules` should not be committed to source control.

---

## 17. Important Git / Source Control Note

### Why changes may not appear in VS Code Source Control

The delivered project ZIP is a **source-code package**, not a clone of the Git repository.

The ZIP does **not** contain the `.git` directory/history.

Therefore, if you extracted the ZIP into a folder and opened that folder in VS Code, VS Code may show:

> No source control providers registered

or it may show no Git changes.

This does **not** mean the project files were unchanged.

It means the extracted folder is not currently connected to the Git repository.

### If this folder should become a Git repository

Open the project root in VS Code and run:

```bash
git init
```

Then check:

```bash
git status
```

If the project is supposed to connect to an existing GitHub repository, add its remote:

```bash
git remote add origin YOUR_GITHUB_REPOSITORY_URL
```

Then verify:

```bash
git remote -v
```

After that:

```bash
git add .
git status
git commit -m "Rebuild Devigners learning institute and admissions workflow"
```

If the repository already exists on GitHub and you want to push the local project to that repository, the exact push command depends on the current branch and remote configuration.

### Important

Do **not** commit:

```text
.env
node_modules/
__pycache__/
*.pyc
```

Never commit Gmail App Passwords, SMTP passwords, or Google Sheets webhook secrets.

---

## 18. Summary

The project has been transformed into a dedicated **Devigners Learning Institute** website with a clear two-stage learning pathway:

**CUBE → Computer Fundamentals**

**COHORT → Full-Stack Development**

It includes a modern React frontend, FastAPI backend, responsive navigation, smooth animations, authentication support, a Join Us admissions form, Google Sheets admissions storage, student/admin email notifications, Devigners branding, and deployment-oriented configuration.

The most important source-control point is that the ZIP contains the project source but **not the Git repository metadata**. To see Git changes in VS Code Source Control, the project must be opened from an existing Git clone or initialized/connected to the appropriate Git repository.
