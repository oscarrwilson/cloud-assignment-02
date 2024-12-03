import { expect } from 'chai';
import charcount from '../src/charcount.js'; // Use `.js` extension for ESM

describe('charcount.counter', () => {
  it('should return the correct character count for a valid string', () => {
    const result = charcount.counter('hello world');
    expect(result).to.equal(11);
  });

  it('should return 0 for an empty string', () => {
    const result = charcount.counter('');
    expect(result).to.equal(0);
  });

  it('should handle null input gracefully', () => {
    const result = charcount.counter(null);
    expect(result).to.equal(0);
  });

  it('should throw an error for non-string input', () => {
    expect(() => charcount.counter(123)).to.throw("Invalid input: 'text' must be a string");
  });

  it('should correctly count spaces and special characters', () => {
    const result = charcount.counter('!@# $%^');
    expect(result).to.equal(7);
  });

  it('should correctly count emojis', () => {
    const result = charcount.counter('😊👍🏽💯');
    expect(result).to.equal(4);
  });

  it('should correctly count characters in mixed content (emojis, text, spaces)', () => {
    const result = charcount.counter('hello 😊 world 👍🏽');
    expect(result).to.equal(16); // 10 text + 3 spaces + 2 emojis + 1 modifier (skin tone)
  });

  it('should handle Unicode surrogate pairs (e.g., non-BMP characters)', () => {
    const result = charcount.counter('𐍈𐍉𐍊');
    expect(result).to.equal(3); // Each surrogate pair represents one character
  });

  it('should correctly count wide characters (e.g., CJK ideographs)', () => {
    const result = charcount.counter('漢字');
    expect(result).to.equal(2);
  });

  it('should correctly count accented characters', () => {
    const result = charcount.counter('café');
    expect(result).to.equal(4);
  });

  it('should handle very long strings', () => {
    const longString = 'a'.repeat(1000) + '😊'.repeat(500);
    const result = charcount.counter(longString);
    expect(result).to.equal(1500);
  });
});
