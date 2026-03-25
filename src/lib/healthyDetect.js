const HEALTHY_TERMS = [
  // Fruits
  'apple', 'banana', 'orange', 'strawberr', 'blueberr', 'raspberr', 'blackberr',
  'grape', 'mango', 'peach', 'pear', 'pineapple', 'watermelon', 'melon', 'kiwi',
  'cherry', 'lemon', 'lime', 'avocado', 'plum', 'apricot', 'fig', 'pomegranate',
  'clementine', 'mandarin', 'grapefruit', 'nectarine', 'papaya', 'guava',
  // Vegetables
  'tomato', 'carrot', 'broccoli', 'spinach', 'kale', 'lettuce', 'salad', 'cucumber',
  'celery', 'pepper', 'capsicum', 'cauliflower', 'zucchini', 'squash', 'beet',
  'radish', 'asparagus', 'arugula', 'cabbage', 'chard', 'collard', 'bok choy',
  'sweet potato', 'yam', 'edamame', 'artichoke', 'leek', 'fennel', 'shallot',
  'onion', 'garlic', 'ginger', 'turmeric', 'parsnip', 'turnip', 'rutabaga',
  'watercress', 'endive', 'radicchio', 'pumpkin', 'corn', 'pea', 'snap pea',
  // Legumes
  'lentil', 'chickpea', 'black bean', 'kidney bean', 'white bean', 'hummus',
  // Herbs
  'basil', 'mint', 'parsley', 'cilantro', 'dill', 'rosemary', 'thyme', 'sage',
  // Generic healthy tags
  'fruit', 'vegetable', 'veggie', 'veg ', 'produce', 'berr', 'greens', 'bean',
]

export function isHealthyItem(name) {
  const lower = name.toLowerCase()
  return HEALTHY_TERMS.some(kw => lower.includes(kw))
}
