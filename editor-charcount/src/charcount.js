export default {
    /**
     * Count the number of Unicode (visible) characters in a given string.
     * @param {string} text - The input string to analyse.
     * @returns {number} - The character count.
     * @throws {Error} - Throws an error if the input is not a valid string.
     */
    counter: function (text) {
      if (text == null) {
        return 0; // Return 0 immediately for null or undefined
      }
      
      // Validate input type
      if (typeof text !== 'string') {
        throw new Error("Invalid input: 'text' must be a string");
      }
      
      // Accurate Unicode character count
      return [...text].length;
    }
  };  