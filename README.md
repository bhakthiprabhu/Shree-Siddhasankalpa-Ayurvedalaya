# Shree Siddhasankalpa Ayurvedalaya

A modern web-based responsive application for an Ayurvedic clinic to handle patient records, complaints, history, follow-ups, reports, and authentication. Designed to streamline clinic operations and improve patient record management.

## Features

- Patient Management
  - Add new patients
  - View patient history
  - Track follow-ups
- Complaint Management
  - Record patient complaints
  - Track treatment progress
- Reporting System
  - Generate detailed patient reports
  - Treatment history documentation
- Secure Authentication
  - Protected routes
  - Login system

## Project Structure

```
src/
├── app/                            # Next.js app router configuration
│   ├── error.js                    # Global error handling
│   ├── layout.js                   # Root layout component
│   ├── globals.css                 # Global styles
│   └── pages/                      # Application pages
│       ├── add-complaint/          # Patient complaint management
│       ├── add-patient/            # New patient registration
│       ├── login/                  # Authentication
│       ├── patient-follow-ups/     # Follow-up tracking
│       ├── patient-history/        # Patient history views
│       └── report/                 # Report generation
├── assets/                         # Static assets
│   ├── fonts/                      # Custom fonts
│   │   └── SamarkanNormal.ttf
│   └── images/                     # Image assets
│       ├── backgroundImage.jpg
│       ├── loading-icon.gif
│       └── Logo.jpg
├── components/                     # Reusable UI components
│   ├── Button/                     # Custom button component
│   ├── Dropdown/                   # Dropdown select component
│   ├── ErrorMessage/               # Error display component
│   ├── ErrorPage/                  # Error page component
│   ├── Input/                      # Form input component
│   ├── LoadingIcon/                # Loading indicator
│   ├── NavBar/                     # Navigation component
│   └── Textarea/                   # Multiline input component
├── hoc/                            # Higher-order components
│   └── withAuth.js                 # Authentication wrapper
└── utils/                          # Utility functions
    ├── api.js                      # API integration
    ├── auth.js                     # Authentication utilities
    ├── Constants.js                # Global constants
    ├── handlers.js                 # Event handlers
    └── reportGenerator.js          # PDF report generation
```

## Tech Stack

- **Frontend Framework:** Next.js 15
- **UI Library:** React 19
- **Styling:** CSS Modules
- **PDF Generation:** jsPDF
- **HTTP Client:** Axios
- **UI Components:** React Bootstrap
- **Authentication:** Custom auth with js-cookie
- **Icons:** React Icons

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/bhakthiprabhu/Shree-Siddhasankalpa-Ayurvedalaya.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## License

This project is licensed under the MIT License.
