# FoodSnap AI - Smart Nutrition Tracking with AI Food Analysis

FoodSnap AI is a modern web application that helps users track their nutrition by analyzing food photos using AI. Simply take a picture of your meal, and our AI will provide detailed nutritional information instantly, including calories, macronutrients, and ingredients.

## 🌟 Features

- **AI-Powered Food Analysis**: Instantly analyze food photos to get accurate nutritional information using Google Gemini Pro Vision
- **Comprehensive Nutrition Tracking**: Track calories, protein, carbs, fat, fiber, sugar, and sodium with detailed breakdowns
- **Interactive Dashboard**: Beautiful charts and analytics of your nutrition data with trend analysis
- **Meal History & Management**: Keep track of all your meals with photos, ingredients, and nutritional details
- **Personalized Meal Suggestions**: Get AI-generated meal recommendations based on your nutritional goals and preferences
- **Custom Goal Setting**: Set personalized nutrition targets and track your progress
- **User Profiles**: Configure personal details including dietary preferences, allergies, and health conditions
- **Recipe Management**: Save and organize recipes with instructions and nutritional information
- **Meal Planning**: Create and manage meal plans for better nutrition planning
- **Secure Authentication**: Protected user accounts with NextAuth support and email verification
- **Progressive Web App (PWA)**: Install on your device for offline access
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Tech Stack

- **Frontend**: 
  - Next.js 14.2.x (App Router)
  - React 18
  - TailwindCSS
  - Chart.js with react-chartjs-2
  - React Icons
  - Framer Motion for animations
  - Progressive Web App (PWA) support

- **Backend**:
  - Next.js API Routes
  - Prisma ORM v6
  - PostgreSQL (Neon DB)
  - NextAuth.js v4 for authentication
  - Vercel Blob Storage for image uploads

- **AI Integration**:
  - Google Gemini Pro Vision API for food image analysis
  - Gemini Pro for meal suggestions and nutritional insights

## 🛠️ Installation

### Prerequisites
- Node.js 20.x or later
- npm 10.x or later
- PostgreSQL database (local or hosted solution like Neon DB)
- Google Gemini API key

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/FoodSnap-AI.git
cd FoodSnap-AI
```

2. **Install dependencies**
```bash
npm install
```
Or use our Makefile for setup:
```bash
make setup
```

3. **Set up environment variables**

Create a `.env` file in the root directory by copying the example:
```bash
cp .env.example .env
```

Then edit the `.env` file with your credentials:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_jwt_secret_key
POSTGRES_PRISMA_URL=your_postgres_url
POSTGRES_URL_NON_POOLING=your_postgres_direct_url
GEMINI_API_KEY=your_gemini_api_key
```

4. **Initialize the database**
```bash
npx prisma generate
npx prisma db push
```
Or use our Makefile:
```bash
make db-migrate
```

5. **Start the development server**
```bash
npm run dev
```
Or use our Makefile:
```bash
make dev
```

Visit `http://localhost:3000` to see the application.

### Docker Development

For a containerized development experience:

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/FoodSnap-AI.git
cd FoodSnap-AI
```

2. **Set up environment variables**

Create a `.env` file with your environment variables. At minimum, you need:
```env
NEXTAUTH_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

3. **Start the Docker environment**
```bash
docker-compose up -d
```
Or use the provided setup script:
```bash
./scripts/docker-setup.sh
```
Or use the Makefile:
```bash
make docker-setup
```

4. **Access the application**
   - Web application: http://localhost:3000
   - Database admin (Adminer): http://localhost:8080
     - System: PostgreSQL
     - Server: db
     - Username: postgres
     - Password: postgres
     - Database: foodsnap

5. **Stop the containers**
```bash
docker-compose down
```
Or use the Makefile:
```bash
make docker-down
```

### Deployment on Vercel

1. **Fork and Deploy**
   - Fork this repository
   - Connect your fork to Vercel
   - Vercel will automatically detect Next.js and deploy

2. **Environment Variables**
   - Add the following environment variables in Vercel:
     ```
     NEXTAUTH_URL=https://your-domain.com
     NEXTAUTH_SECRET=your_jwt_secret_key
     POSTGRES_PRISMA_URL=your_postgres_url
     POSTGRES_URL_NON_POOLING=your_postgres_direct_url
     GEMINI_API_KEY=your_gemini_api_key
     ```

3. **Database Setup**
   - Create a new database in [Neon](https://neon.tech) or your preferred PostgreSQL provider
   - Use the connection strings in your environment variables
   - The schema will be automatically pushed during deployment via the build command

## 📁 Project Structure

```
FoodSnap-AI/
├── app/                      # Next.js app directory (App Router)
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── dashboard/       # Dashboard data endpoints
│   │   ├── gemini/          # AI integration endpoints
│   │   ├── goals/           # Nutritional goals endpoints
│   │   ├── images/          # Image processing endpoints
│   │   ├── meals/           # Meal management endpoints
│   │   └── profile/         # User profile endpoints
│   ├── dashboard/           # Dashboard pages
│   │   ├── analytics/       # Detailed nutrition analytics
│   │   ├── goals/           # Nutrition goal setting
│   │   ├── meals/           # Meal history and management
│   │   ├── profile/         # User profile settings
│   │   └── settings/        # Application settings
│   ├── about/               # About page
│   ├── blog/                # Blog page
│   ├── careers/             # Careers page
│   ├── contact/             # Contact page
│   ├── docs/                # Documentation page
│   ├── features/            # Features page
│   ├── forgot-password/     # Password recovery page
│   ├── help/                # Help and support page
│   ├── how-it-works/        # How it works page
│   ├── login/               # Login page
│   ├── onboarding/          # User onboarding page
│   ├── pricing/             # Pricing page
│   ├── privacy/             # Privacy policy page
│   ├── register/            # Registration page
│   ├── reset-password/      # Password reset page
│   ├── terms/               # Terms of service page
│   └── verify-email/        # Email verification page
├── components/              # Reusable components
│   ├── dashboard/           # Dashboard-specific components
│   │   ├── GoalProgress.tsx # Goal progress tracker
│   │   ├── MacroDistribution.tsx # Macronutrient distribution chart
│   │   ├── MealSuggestions.tsx # AI meal suggestions
│   │   ├── NutritionChart.tsx # Nutrition data charts
│   │   ├── ProfileCard.tsx  # User profile card
│   │   ├── QuickAdd.tsx     # Quick meal addition
│   │   ├── RecentMeals.tsx  # Recent meal history
│   │   └── StatsGrid.tsx    # Statistics display grid
│   ├── cards/               # Card components
│   │   ├── DataCard.tsx     # Data visualization card
│   │   ├── DetailCard.tsx   # Detailed information card
│   │   └── StatsCard.tsx    # Statistics card
│   ├── icons/               # Icon components
│   │   ├── AIIcon.tsx       # AI feature icon
│   │   ├── CaloriesIcon.tsx # Calories icon
│   │   ├── CarbsIcon.tsx    # Carbohydrates icon
│   │   ├── FatIcon.tsx      # Fat icon
│   │   ├── ProteinIcon.tsx  # Protein icon
│   │   └── ...              # Other icons
│   ├── Button.tsx           # Button component
│   ├── Card.tsx             # Base card component
│   ├── DashboardFooter.tsx  # Dashboard footer
│   ├── DashboardNav.tsx     # Dashboard navigation
│   ├── EmailInput.tsx       # Email input component
│   ├── Footer.tsx           # Main footer component
│   ├── ImageUpload.tsx      # Image upload component
│   ├── LoadingSpinner.tsx   # Loading indicator
│   ├── Logo.tsx             # App logo component
│   ├── MealAnalyzer.tsx     # Meal analysis component
│   ├── Modal.tsx            # Modal dialog component
│   ├── Navbar.tsx           # Main navigation bar
│   └── PasswordInput.tsx    # Password input component
├── hooks/                   # Custom React hooks
│   └── useForm.ts           # Form state hook
├── lib/                     # Utility libraries
│   ├── auth.ts              # Authentication utilities
│   ├── auth-options.ts      # NextAuth configuration
│   ├── blob.ts              # Blob storage utilities
│   └── prisma.ts            # Prisma client configuration
├── prisma/                  # Prisma ORM
│   ├── schema.prisma        # Database schema definition
│   └── migrations/          # Database migrations
├── public/                  # Static assets
│   ├── icons/               # App icons
│   ├── images/              # Static images
│   ├── uploads/             # User uploaded content
│   ├── favicon.svg          # Favicon
│   ├── logo.png             # App logo
│   ├── manifest.json        # PWA manifest
│   └── sw.js                # Service worker for PWA
├── scripts/                 # Utility scripts
│   ├── generate-logo.js     # Logo generation script
│   └── generate-pwa-assets.js # PWA assets generator
├── types/                   # TypeScript type definitions
│   ├── globals.d.ts         # Global type declarations
│   └── next-auth.d.ts       # NextAuth type extensions
├── utils/                   # Helper utilities
│   ├── mealValidation.ts    # Meal data validation
│   └── validation.ts        # General validation utilities
├── .env.example             # Example environment variables
├── Makefile                 # Project automation scripts
├── next.config.js           # Next.js configuration
├── package.json             # Project dependencies
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vercel.json              # Vercel deployment configuration
```

## 🔐 API Routes

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user information
- `POST /api/auth/reset-password` - Request password reset
- `POST /api/auth/verify-email` - Verify email address

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/profile/preferences` - Get user preferences
- `PUT /api/profile/preferences` - Update user preferences

### Meals
- `POST /api/meals` - Create new meal entry
- `GET /api/meals` - Get user's meal history with filtering and pagination
- `GET /api/meals/recent` - Get most recent meals
- `GET /api/meals/daily-totals` - Get nutritional totals for the day
- `GET /api/meals/:id` - Get specific meal details
- `PUT /api/meals/:id` - Update a meal entry
- `DELETE /api/meals/:id` - Delete a meal entry
- `POST /api/meals/analyze` - Analyze a food image using AI
- `GET /api/meals/statistics` - Get meal statistics and trends

### Goals
- `POST /api/goals` - Create nutritional goal
- `GET /api/goals` - Get all user goals
- `GET /api/goals/active` - Get currently active goal
- `PUT /api/goals/:id` - Update a goal
- `DELETE /api/goals/:id` - Delete a goal
- `GET /api/goals/progress` - Get progress toward active goal

### Images
- `POST /api/images/upload` - Upload new image
- `GET /api/images` - Get user's uploaded images
- `DELETE /api/images/:id` - Delete an image

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard summary stats
- `GET /api/dashboard/trends` - Get nutrition trends
- `GET /api/dashboard/recommendations` - Get personalized recommendations

### AI Integration
- `POST /api/gemini/analyze` - Process food images with Gemini Vision
- `GET /api/gemini/suggestions` - Get AI-powered meal suggestions based on nutritional goals
- `POST /api/gemini/ingredient-analysis` - Get detailed ingredient breakdown

## 🔄 Database Schema

```prisma
model User {
  id             String    @id @default(cuid())
  name           String?
  email          String    @unique
  hashedPassword String?
  resetToken     String?   @unique
  resetTokenExpiry DateTime?
  emailVerified  Boolean   @default(true)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  meals          Meal[]
  goals          Goal[]
  profile        Profile?
  preferences    UserPreferences?
  mealPlans      MealPlan[]
  foodImages     FoodImage[]
}

model Profile {
  id              String   @id @default(cuid())
  age             Int?
  weight          Float?   // in kg
  height          Float?   // in cm
  gender          String?  // "MALE", "FEMALE", "OTHER"
  activityLevel   String?  // "SEDENTARY", "LIGHT", "MODERATE", "VERY_ACTIVE", "EXTRA_ACTIVE"
  dietaryType     String?  // "OMNIVORE", "VEGETARIAN", "VEGAN", "PESCATARIAN", "KETO", "PALEO"
  weightGoal      String?  // "LOSE", "MAINTAIN", "GAIN"
  allergies       String[] // Array of allergy strings
  healthConditions String[] // Array of health conditions
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model UserPreferences {
  id                String   @id @default(cuid())
  measurementSystem String   // "METRIC", "IMPERIAL"
  mealReminders     Boolean  @default(false)
  reminderTime      DateTime?
  weeklyReport      Boolean  @default(true)
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Meal {
  id          String      @id @default(cuid())
  name        String
  calories    Int
  protein     Float
  carbs       Float
  fat         Float
  notes       String?
  mealTime    DateTime    @default(now())
  mealType    MealType    @default(SNACK)
  userId      String
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  images      FoodImage[]
  ingredients Ingredient[]
  recipe      Recipe?
  mealPlans   MealPlan[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @default(now())
}

model Ingredient {
  id            String   @id @default(cuid())
  name          String
  calories      Int
  protein       Float?
  carbs         Float?
  fat           Float?
  fiber         Float?
  sugar         Float?
  sodium        Float?
  amount        Float    // Amount in base unit (g/ml)
  unit          String   // "g", "ml", "oz", "cup"
  isVerified    Boolean  @default(false)
  source        String?  // Source of nutritional information
  mealId        String
  meal          Meal     @relation(fields: [mealId], references: [id], onDelete: Cascade)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @default(now())
}

model FoodImage {
  id          String    @id @default(cuid())
  url         String
  fileName    String
  fileSize    Int
  fileType    String
  isProcessed Boolean   @default(false)
  mealId      String?
  meal        Meal?     @relation(fields: [mealId], references: [id], onDelete: Cascade)
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Goal {
  id              String   @id @default(cuid())
  dailyCalories   Int
  dailyProtein    Float
  dailyCarbs      Float
  dailyFat        Float
  dailyFiber      Float?
  dailySugar      Float?
  dailySodium     Float?
  startDate       DateTime @default(now())
  endDate         DateTime?
  isActive        Boolean  @default(true)
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @default(now())
}

model MealPlan {
  id          String   @id @default(cuid())
  name        String
  startDate   DateTime
  endDate     DateTime
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  meals       Meal[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @default(now())
}

model Recipe {
  id              String   @id @default(cuid())
  name            String
  instructions    String[]
  prepTime        Int?     // in minutes
  cookTime        Int?     // in minutes
  servings        Int?
  difficulty      String?  // "EASY", "MEDIUM", "HARD"
  cuisine         String?
  tags           String[]
  mealId         String   @unique
  meal           Meal     @relation(fields: [mealId], references: [id], onDelete: Cascade)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @default(now())
}

enum MealType {
  BREAKFAST
  LUNCH
  DINNER
  SNACK
}
```

## 🛠️ Available Scripts

The project includes a `Makefile` for convenient development workflows:

```bash
# Show all available commands
make help

# Setup project dependencies
make setup

# Start development server
make dev

# Build production application
make build

# Start production server
make start

# Run ESLint
make lint

# Run database migrations
make db-migrate

# Reset database to initial state
make db-reset

# Check environment
make env-check
```

Additionally, there are npm scripts available:

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Analyze bundle size
npm run analyze
```

## 🔧 Advanced Configuration

### PWA Configuration

FoodSnap AI includes Progressive Web App (PWA) support, which allows users to install the application on their devices. The PWA is configured in `next.config.js` with various caching strategies for different types of assets.

### Docker Configuration

The application is containerized with Docker for consistent development and deployment environments:

#### Dockerfile

The multi-stage `Dockerfile` optimizes the application build:
1. **deps stage**: Installs dependencies
2. **builder stage**: Builds the Next.js application
3. **runner stage**: Creates a slim production image

#### Docker Compose

The `docker-compose.yml` configures the following services:
- **app**: Next.js application container
- **db**: PostgreSQL database
- **migrate**: Runs database migrations automatically
- **adminer**: Web interface for database management

Key configuration elements:
- **Networks**: All services are connected through a shared network
- **Volumes**: 
  - PostgreSQL data is persisted in a named volume
  - Upload directory is mapped from host to container
- **Environment Variables**: Database connections are configured for the containerized environment

### Vercel Configuration

For deployment on Vercel, the application includes optimized configurations in `vercel.json`:

```json
{
  "buildCommand": "prisma generate && next build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    }
  ]
}
```

### Environment Variables

Here's a complete list of environment variables used by the application:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_URL` | Base URL of your application | Yes |
| `NEXTAUTH_SECRET` | Secret key for NextAuth sessions | Yes |
| `POSTGRES_PRISMA_URL` | PostgreSQL connection URL for Prisma | Yes |
| `POSTGRES_URL_NON_POOLING` | Direct PostgreSQL connection URL | Yes |
| `GEMINI_API_KEY` | API key for Google Gemini AI services | Yes |
| `NEXTAUTH_DEBUG` | Enable NextAuth debugging | No |

## 🎯 Upcoming Features

- [ ] Social sharing capabilities for meal achievements
- [ ] Custom meal categories and tags for better organization
- [ ] Nutritionist integration for professional guidance
- [ ] Export data to PDF/CSV for external analysis
- [ ] Barcode scanning for packaged foods
- [ ] Integration with fitness tracking apps
- [ ] Advanced meal planning with automated grocery lists
- [ ] Community features and recipe sharing
- [ ] Multi-language support

## 🐛 Troubleshooting

### Database Connection Issues

If you encounter database connection issues, ensure your PostgreSQL server is running and your connection URLs in the `.env` file are correct.

For Neon DB users:
```bash
# Test connection with Prisma
npx prisma db pull
```

### Image Processing Issues

If image uploads or processing fail:
1. Ensure `GEMINI_API_KEY` is correctly set
2. Check that the image format is supported (JPG, PNG)
3. Verify that image file size is under limits (< 20MB)

### Development Server Issues

If the development server fails to start:
```bash
# Clear Next.js cache
rm -rf .next
# Reinstall dependencies
rm -rf node_modules
npm install
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

This project uses ESLint and TypeScript for code quality. Before submitting pull requests:

```bash
# Run linter
npm run lint

# Check TypeScript types
tsc --noEmit
```

### Testing

When adding new features, please consider adding corresponding tests.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Prisma](https://www.prisma.io/) - ORM
- [TailwindCSS](https://tailwindcss.com/) - CSS Framework
- [Chart.js](https://www.chartjs.org/) - Charts
- [Framer Motion](https://www.framer.com/motion/) - Animation Library
- [Neon Database](https://neon.tech/) - PostgreSQL Database
- [Google Gemini](https://ai.google.dev/) - AI Image Analysis
- [Vercel](https://vercel.com) - Hosting and Deployment
- [NextAuth.js](https://next-auth.js.org/) - Authentication

## 🔒 Security & Performance

### Security Considerations

FoodSnap AI implements several security best practices:

- **Authentication**: Secure user authentication through NextAuth.js with email verification
- **Password Security**: Passwords are hashed using bcrypt before storage
- **CSRF Protection**: Built-in CSRF protection through Next.js API routes
- **Secure Headers**: HTTP security headers configured in Vercel deployment
- **Input Validation**: Server-side validation for all user inputs
- **Rate Limiting**: API rate limiting to prevent abuse
- **Database Security**: Parameterized queries through Prisma to prevent SQL injection
- **Image Storage**: Secure blob storage for user-uploaded images

### Performance Optimization

The application is optimized for performance:

- **Server Components**: Next.js App Router with server components for optimal rendering
- **Image Optimization**: Automatic image optimization through Next.js Image component
- **Caching Strategies**: Configured caching for static assets and API responses
- **Bundle Analysis**: Bundle size monitoring with `@next/bundle-analyzer`
- **Code Splitting**: Automatic code splitting for optimized page loads
- **Progressive Web App**: Offline capabilities and instant loading with service worker
- **Database Indexes**: Strategic database indexes for query performance
- **Edge Network**: Deployment on Vercel's Edge Network for global low-latency access
