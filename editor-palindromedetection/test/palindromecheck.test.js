import { expect } from 'chai';
import palindromecheck from '../src/palindromecheck.js'; // Use `.js` extension for ESM

describe('palindromecheck.isPalindrome', () => {
    it('should return true for a valid palindrome', () => {
        const result = palindromecheck.isPalindrome('madam');
        expect(result).to.be.true;
    });

    it('should return false for a non-palindrome', () => {
        const result = palindromecheck.isPalindrome('hello');
        expect(result).to.be.false;
    });

    it('should handle case insensitivity', () => {
        const result = palindromecheck.isPalindrome('MadAm');
        expect(result).to.be.true;
    });

    it('should ignore non-alphanumeric characters', () => {
        const result = palindromecheck.isPalindrome('A man, a plan, a canal: Panama');
        expect(result).to.be.true;
    });

    it('should handle empty string as a palindrome', () => {
        const result = palindromecheck.isPalindrome('');
        expect(result).to.be.true;
    });

    it('should handle null input gracefully with an error', () => {
        expect(() => palindromecheck.isPalindrome(null)).to.throw("Invalid input: 'text' must not be null or undefined");
    });

    it('should throw an error for non-string input', () => {
        expect(() => palindromecheck.isPalindrome(123)).to.throw("Invalid input: 'text' must be a string");
    });
});