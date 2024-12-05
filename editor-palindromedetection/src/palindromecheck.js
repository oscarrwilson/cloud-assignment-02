export default {
  /**
   * Check if a given string is a palindrome.
   * @param {string} text - The input string to check.
   * @returns {boolean} - True if the input is a palindrome, otherwise false.
   * @throws {Error} - Throws an error if the input is not a valid string.
   */
  isPalindrome: function (text) {
      if (text == null) {
          throw new Error("Invalid input: 'text' must not be null or undefined");
      }

      // Validate input type
      if (typeof text !== 'string') {
          throw new Error("Invalid input: 'text' must be a string");
      }

      // Clean the string (remove non-alphanumeric characters and convert to lowercase)
      const cleanedText = text.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

      // Check if the cleaned text is a palindrome
      return cleanedText === cleanedText.split('').reverse().join('');
  }
};