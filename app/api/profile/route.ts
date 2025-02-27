import { NextApiRequest, NextApiResponse } from 'next';

// Placeholder function to simulate fetching user from database
async function getUserFromDatabase() {
  return {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    hashedPassword: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function getUserProfile(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromDatabase();
  const userData = {
    name: user.name || 'User',
    email: user.email,
    dailyGoal: 2000, // Default value
    streakDays: 0,
    achievements: [],
  };
  return res.json(userData);
}