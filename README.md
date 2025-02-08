# FoodSnap - AI-Powered Food Analysis

FoodSnap is a modern web application that helps users track their nutrition by analyzing food photos using AI. Simply take a picture of your meal, and our AI will provide detailed nutritional information instantly.

## 🌟 Features

- **AI-Powered Analysis**: Instantly analyze food photos to get nutritional information
- **Nutrition Tracking**: Track calories, protein, carbs, and fat intake
- **Visual Dashboard**: Beautiful charts and analytics of your eating habits
- **Meal History**: Keep track of all your meals with photos and details
- **Secure Authentication**: Protected user accounts and data
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Tech Stack

- **Frontend**: 
  - Next.js 14 (App Router)
  - React
  - TailwindCSS
  - Chart.js with react-chartjs-2

- **Backend**:
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL (Neon DB)
  - JWT Authentication

- **AI Integration**:
  - Google Gemini API (coming soon)

## 🛠️ Installation

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

## 📁 Project Structure

```
foodsnap/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── auth/         # Authentication endpoints
│   ├── dashboard/        # Dashboard page
│   ├── login/           # Login page
│   └── register/        # Registration page
├── components/           # Reusable components
│   └── Logo.tsx         # FoodSnap logo component
├── lib/                 # Utility functions
│   └── prisma.ts       # Prisma client configuration
└── prisma/             # Database schema
```

## 🔐 API Routes

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Meals
- `POST /api/meals` - Create new meal entry with AI analysis
- `GET /api/meals` - Get user's meal history
- `GET /api/meals/:id` - Get specific meal details
- `DELETE /api/meals/:id` - Delete a meal entry

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
}

model Meal {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  name        String
  description String?
  imageUrl    String
  calories    Int
  protein     Float?
  carbs       Float?
  fat         Float?
  mealTime    DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🎯 Upcoming Features

- [ ] AI-powered food recognition using Gemini API
- [ ] Meal recommendations based on nutritional goals
- [ ] Weekly and monthly nutrition reports
- [ ] Social sharing capabilities
- [ ] Custom meal categories and tags
- [ ] Nutritionist integration
- [ ] Export data to PDF/CSV
- [ ] Mobile app version

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
