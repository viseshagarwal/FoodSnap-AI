import Image from 'next/image';
import { FaEdit, FaTrash, FaClock } from 'react-icons/fa';

interface Meal {
  id: string;
  name: string;
  calories: number;
  image?: string;
  timestamp: string;
}

export default function RecentMeals() {
  // This will be replaced with actual data from your API
  const meals: Meal[] = [
    {
      id: '1',
      name: 'Grilled Chicken Salad',
      calories: 350,
      timestamp: '2024-02-15T12:00:00Z',
      image: 'https://en.wikipedia.org/wiki/IMG_Academy#/media/File:IMG_Academy_Logo.svg'
    },
    // Add more mock meals here
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Recent Meals</h2>
        <a href="/dashboard/meals" className="text-teal-600 hover:text-teal-700 text-sm font-medium">
          View All
        </a>
      </div>
      
      <div className="space-y-4">
        {meals.map((meal) => (
          <div key={meal.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
              <Image
                src={meal.image || 'https://en.wikipedia.org/wiki/IMG_Academy#/media/File:IMG_Academy_Logo.svg'}
                alt={meal.name} 
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{meal.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FaClock className="w-4 h-4" />
                <span>{new Date(meal.timestamp).toLocaleTimeString()}</span>
                <span className="text-teal-600">{meal.calories} kcal</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="p-2 text-gray-500 hover:text-teal-600 transition-colors">
                <FaEdit className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-500 hover:text-red-600 transition-colors">
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        
        {meals.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No meals logged yet today</p>
            <button className="mt-2 text-teal-600 hover:text-teal-700 font-medium">
              Add Your First Meal
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 