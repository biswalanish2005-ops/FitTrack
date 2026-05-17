import axios from 'axios';

export interface NutritionData {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  sugars: number;
  servingSize: string;
  source: 'USDA' | 'OpenFoodFacts';
  createdAt?: Date; // To be set when saving to Firestore
}

// USDA API
// Base URL: https://api.nal.usda.gov/fdc/v1/foods/search

export async function searchUSDAFood(query: string): Promise<NutritionData[]> {
  const apiKey = process.env.USDA_API_KEY || 'DEMO_KEY';
  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(query)}&pageSize=10`;

  try {
    const response = await axios.get(url);
    const foods = response.data.foods || [];

    return foods.map((food: any): NutritionData => {
      // Extract nutrients
      const getNutrient = (nutrientName: string, defaultValue = 0) => {
        const nutrient = food.foodNutrients.find(
          (n: any) => n.nutrientName && n.nutrientName.toLowerCase().includes(nutrientName.toLowerCase())
        );
        return nutrient ? nutrient.value : defaultValue;
      };

      return {
        id: `usda_${food.fdcId}`,
        name: food.description,
        calories: getNutrient('Energy'),
        protein: getNutrient('Protein'),
        carbs: getNutrient('Carbohydrate, by difference'),
        fat: getNutrient('Total lipid (fat)'),
        fiber: getNutrient('Fiber, total dietary'),
        sugars: getNutrient('Sugars, total including NLEA'),
        sodium: getNutrient('Sodium, Na'),
        servingSize: food.servingSize ? `${food.servingSize} ${food.servingSizeUnit}` : '100g',
        source: 'USDA',
      };
    });
  } catch (error) {
    console.error("Error fetching from USDA API:", error);
    throw new Error("Failed to fetch USDA data");
  }
}

// Open Food Facts API
// Base URL: https://world.openfoodfacts.org/api/v0/product/[barcode].json

export async function fetchBarcodeNutrition(barcode: string): Promise<NutritionData | null> {
  const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status !== 1 || !data.product) {
      return null; // Product not found
    }

    const product = data.product;
    const nutriments = product.nutriments || {};

    return {
      id: `off_${barcode}`,
      name: product.product_name || 'Unknown Product',
      calories: nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0,
      protein: nutriments['proteins_100g'] || nutriments['proteins'] || 0,
      carbs: nutriments['carbohydrates_100g'] || nutriments['carbohydrates'] || 0,
      fat: nutriments['fat_100g'] || nutriments['fat'] || 0,
      fiber: nutriments['fiber_100g'] || nutriments['fiber'] || 0,
      sugars: nutriments['sugars_100g'] || nutriments['sugars'] || 0,
      sodium: nutriments['sodium_100g'] || nutriments['sodium'] || 0,
      // OpenFoodFacts typically gives data per 100g by default unless otherwise specified
      servingSize: product.serving_size || '100g',
      source: 'OpenFoodFacts',
    };
  } catch (error) {
    console.error("Error fetching from Open Food Facts API:", error);
    throw new Error("Failed to fetch Open Food Facts data");
  }
}
