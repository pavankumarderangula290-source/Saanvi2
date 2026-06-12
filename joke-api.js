// Joke Generator Module
// Uses JokeAPI (https://jokeapi.dev/)

const JOKE_API_URL = 'https://v2.jokeapi.dev/joke/';

// Fetch a random joke
export async function getRandomJoke(type = 'any', format = 'single') {
  try {
    const response = await fetch(`${JOKE_API_URL}${type}?type=${format}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      joke: data,
      setup: data.setup,
      delivery: data.delivery,
      joke_text: data.joke,
      category: data.category,
      type: data.type
    };
  } catch (error) {
    console.error('Error fetching joke:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Fetch joke by specific category
export async function getJokeByCategory(category = 'programming') {
  try {
    const response = await fetch(`${JOKE_API_URL}${category}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      joke: data,
      setup: data.setup,
      delivery: data.delivery,
      joke_text: data.joke,
      category: data.category
    };
  } catch (error) {
    console.error('Error fetching joke:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Get available joke categories
export function getAvailableCategories() {
  return ['any', 'general', 'programming', 'knock-knock'];
}

// Format joke for display
export function formatJoke(jokeData) {
  if (jokeData.type === 'twopart') {
    return `${jokeData.setup}\n\n${jokeData.delivery}`;
  } else {
    return jokeData.joke_text || jokeData.joke;
  }
}

// Get random joke with specific type
export async function getRandomJokeByType(type) {
  const validTypes = ['general', 'programming', 'knock-knock'];
  
  if (!validTypes.includes(type)) {
    type = 'any';
  }
  
  return getRandomJoke(type);
}