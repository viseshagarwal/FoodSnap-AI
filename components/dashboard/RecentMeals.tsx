import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaEdit, FaTrash, FaClock } from "react-icons/fa";

interface Meal {
  id: string;
  name: string;
  calories: number;
  time: string;
  imageUrl: string;
}

interface RecentMealsProps {
  meals?: Meal[];
}

export default function RecentMeals({ meals = [] }: RecentMealsProps) {
  const router = useRouter();

  if (meals.length === 0) {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold gradient-text">Recent Meals</h2>
          <a href="/dashboard/meals" className="button-primary text-sm">
            View All
          </a>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No meals logged yet today</p>
          <button
            onClick={() => router.push("/dashboard/meals/add")}
            className="button-primary"
          >
            Add Your First Meal
          </button>
        </div>
      </div>
    );
  }

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
          <div
            key={meal.id}
            className="card group p-4 flex items-center space-x-4"
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden ring-2 ring-indigo-50 group-hover:ring-indigo-100 transition-all">
              <Image
                src={meal.imageUrl}
                alt={meal.name}
                className="object-cover"
                fill
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {meal.name}
              </h3>
              <div className="flex items-center space-x-3 text-sm">
                <div className="flex items-center text-gray-500 space-x-1">
                  <FaClock className="w-4 h-4 text-indigo-400" />
                  <span>{meal.time}</span>
                </div>
                <div className="text-indigo-500 font-medium">
                  {meal.calories} cal
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                aria-label="Edit meal"
                className="p-2 text-gray-400 hover:text-indigo-500 transition-colors rounded-lg hover:bg-indigo-50"
              >
                <FaEdit className="w-4 h-4" />
              </button>
              <button
                aria-label="Delete meal"
                className="p-2 text-gray-400 hover:text-pink-500 transition-colors rounded-lg hover:bg-pink-50"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
