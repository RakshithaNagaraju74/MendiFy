// src/helpers/quoteHelper.js

export const fetchQuoteOfTheDay = async () => {
    try {
      const response = await fetch('/api/quote'); // Ensure this endpoint is correct
      const data = await response.json();
      
      // Check if data.quote exists
      if (data && data.quote) {
        return data.quote;
      } else {
        throw new Error('Quote not found in response');
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      return "Stay positive and keep moving forward!"; // Default fallback quote
    }
  };
  