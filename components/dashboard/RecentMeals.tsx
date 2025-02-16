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
    <div className="glass rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gradient-text">Recent Meals</h2>
        <a href="/dashboard/meals" className="button-primary text-sm">
          View All
        </a>
      </div>
      
      <div className="space-y-4">
        {meals.map((meal) => (
          <div key={meal.id} className="card group p-4 flex items-center space-x-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden ring-2 ring-indigo-50 group-hover:ring-indigo-100 transition-all">
              <Image
                src={meal.image || 'https://en.wikipedia.org/wiki/IMG_Academy#/media/File:IMG_Academy_Logo.svg'}
                alt={meal.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{meal.name}</h3>
              <div className="flex items-center space-x-3 text-sm">
                <div className="flex items-center text-gray-500 space-x-1">
                  <FaClock className="w-4 h-4 text-indigo-400" />
                  <span>{new Date(meal.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="text-indigo-500 font-medium">
                  {meal.calories} cal
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-indigo-500 transition-colors rounded-lg hover:bg-indigo-50">
                <FaEdit className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-pink-500 transition-colors rounded-lg hover:bg-pink-50">
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