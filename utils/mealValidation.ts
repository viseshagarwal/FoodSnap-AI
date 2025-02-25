export interface MealValidation {
  name: string[];
  calories: string[];
  protein: string[];
  carbs: string[];
  fat: string[];
}

export const validateMeal = (data: any) => {
  const errors: Partial<MealValidation> = {};

  // Name validation
  if (!data.name?.trim()) {
    errors.name = ['Please enter a meal name'];
  } else if (data.name.length > 100) {
    errors.name = ['Meal name should be 100 characters or less'];
  }

  // Calories validation
  if (typeof data.calories !== 'number') {
    errors.calories = ['Please enter a valid number for calories'];
  } else if (data.calories < 0) {
    errors.calories = ['Calories must be 0 or greater'];
  } else if (data.calories > 5000) {
    errors.calories = ['Please verify the calories - value seems unusually high (max 5000)'];
  }

  // Protein validation
  if (typeof data.protein !== 'number') {
    errors.protein = ['Please enter a valid number for protein'];
  } else if (data.protein < 0) {
    errors.protein = ['Protein must be 0 or greater'];
  } else if (data.protein > 300) {
    errors.protein = ['Please verify the protein value - seems unusually high (max 300g)'];
  }

  // Carbs validation
  if (typeof data.carbs !== 'number') {
    errors.carbs = ['Please enter a valid number for carbohydrates'];
  } else if (data.carbs < 0) {
    errors.carbs = ['Carbohydrates must be 0 or greater'];
  } else if (data.carbs > 500) {
    errors.carbs = ['Please verify the carbohydrates value - seems unusually high (max 500g)'];
  }

  // Fat validation
  if (typeof data.fat !== 'number') {
    errors.fat = ['Please enter a valid number for fat'];
  } else if (data.fat < 0) {
    errors.fat = ['Fat must be 0 or greater'];
  } else if (data.fat > 200) {
    errors.fat = ['Please verify the fat value - seems unusually high (max 200g)'];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};