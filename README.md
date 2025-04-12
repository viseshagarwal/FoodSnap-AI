# FoodSnap - AI-Powered Food Analysis

FoodSnap is a modern web application that helps users track their nutrition by analyzing food photos using AI. Simply take a picture of your meal, and our AI will provide detailed nutritional information instantly, including calories, macronutrients, and ingredients.

## 🌟 Features

- **AI-Powered Analysis**: Instantly analyze food photos to get accurate nutritional information using Gemini Pro Vision
- **Nutrition Tracking**: Track calories, protein, carbs, and fat intake with detailed breakdowns
- **Visual Dashboard**: Beautiful charts and analytics of your nutrition data with trend analysis
- **Meal History**: Keep track of all your meals with photos, ingredients, and nutritional details
- **Smart Meal Suggestions**: Get AI-generated meal recommendations based on your nutritional goals
- **Custom Goal Setting**: Set personalized nutrition targets and track your progress
- **Secure Authentication**: Protected user accounts with both JWT and NextAuth support
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Tech Stack

- **Frontend**: 
  - Next.js 14 (App Router)
  - React
  - TailwindCSS
  - Chart.js with react-chartjs-2
  - React Icons

- **Backend**:
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL (Neon DB)
  - JWT Authentication
  - NextAuth.js

- **AI Integration**:
  - Google Gemini 2.0 Flash API for food image analysis
  - Gemini Pro for meal suggestions and nutritional insights

## 🛠️ Installation

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/foodsnap.git
cd foodsnap
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
POSTGRES_PRISMA_URL=your_neon_db_prisma_url
POSTGRES_URL_NON_POOLING=your_neon_db_direct_url
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

4. **Initialize the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Start the development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Deployment on Vercel

1. **Fork and Deploy**
   - Fork this repository
   - Connect your fork to Vercel
   - Vercel will automatically detect Next.js and deploy

2. **Environment Variables**
   - Add the following environment variables in Vercel:
     ```
     POSTGRES_PRISMA_URL=your_neon_db_prisma_url
     POSTGRES_URL_NON_POOLING=your_neon_db_direct_url
     JWT_SECRET=your_jwt_secret
     GEMINI_API_KEY=your_gemini_api_key
     ```

3. **Database Setup**
   - Create a new database in [Neon](https://neon.tech)
   - Use the connection strings in your environment variables
   - The schema will be automatically pushed during deployment

## 📁 Project Structure

```
foodsnap/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── meals/          # Meal management endpoints
│   │   └── gemini/         # AI integration endpoints
│   ├── dashboard/          # Dashboard and analytics pages
│   │   ├── analytics/      # Detailed nutrition analytics
│   │   ├── meals/          # Meal history and management
│   │   └── goals/          # Nutrition goal setting
│   ├── about/              # About page
│   ├── blog/               # Blog page
│   ├── docs/               # Documentation page
│   ├── how-it-works/       # How it works page
│   ├── login/              # Login page
│   └── register/           # Registration page
├── components/             # Reusable components
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── GoalProgress    # Goal progress tracker
│   │   ├── MacroDistribution # Macronutrient distribution chart
│   │   ├── MealSuggestions # AI meal suggestions
│   │   ├── NutritionChart  # Nutrition data charts
│   │   └── StatsGrid       # Statistics display grid
│   ├── cards/              # Card components
│   ├── icons/              # Icon components
│   └── shared UI elements  # Buttons, inputs, etc.
├── lib/                    # Utility functions
│   ├── auth.ts             # Authentication setup
│   └── prisma.ts           # Prisma client configuration
├── utils/                  # Helper functions
│   └── mealValidation.ts   # Meal data validation
└── prisma/                 # Database schema
```

## 🔐 API Routes

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Meals
- `POST /api/meals` - Create new meal entry
- `GET /api/meals` - Get user's meal history with filtering and pagination
- `GET /api/meals/recent` - Get most recent meals
- `GET /api/meals/daily-totals` - Get nutritional totals for the day
- `GET /api/meals/:id` - Get specific meal details
- `DELETE /api/meals/:id` - Delete a meal entry
- `POST /api/meals/analyze` - Analyze a food image using AI

### AI Integration
- `POST /api/gemini` - Process food images with Gemini Vision
- `GET /api/gemini/suggestions` - Get AI-powered meal suggestions based on nutritional goals

## 🔄 Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  meals     Meal[]
  goals     Goal[]
  images    Image[]
}

model Meal {
  id          String       @id @default(cuid())
  userId      String
  user        User         @relation(fields: [userId], references: [id])
  name        String
  calories    Int
  protein     Float
  carbs       Float
  fat         Float
  mealType    String       @default("SNACK")
  notes       String?
  mealTime    DateTime     @default(now())
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  images      Image[]
  ingredients Ingredient[]
}

model Image {
  id        String   @id @default(cuid())
  url       String
  fileName  String
  fileSize  Int
  fileType  String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  mealId    String?
  meal      Meal?    @relation(fields: [mealId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}

model Ingredient {
  id        String   @id @default(cuid())
  name      String
  calories  Int      @default(0)
  amount    Float    @default(0)
  unit      String   @default("g")
  mealId    String
  meal      Meal     @relation(fields: [mealId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}

model Goal {
  id             String   @id @default(cuid())
  userId         String
  user           User     @relation(fields: [userId], references: [id])
  name           String
  dailyCalories  Int
  dailyProtein   Float
  dailyCarbs     Float
  dailyFat       Float
  startDate      DateTime @default(now())
  endDate        DateTime?
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

## 🎯 Upcoming Features

- [ ] Social sharing capabilities
- [ ] Custom meal categories and tags
- [ ] Nutritionist integration
- [ ] Export data to PDF/CSV

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Prisma](https://www.prisma.io/) - ORM
- [TailwindCSS](https://tailwindcss.com/) - CSS Framework
- [Chart.js](https://www.chartjs.org/) - Charts
- [Neon Database](https://neon.tech/) - PostgreSQL Database
- [Google Gemini](https://ai.google.dev/) - AI Image Analysis
