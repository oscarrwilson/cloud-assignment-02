<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../src/WordCount.php';

class WordCountTest extends TestCase
{
    /**
     * Test that a basic sentence is counted correctly.
     */
    public function testWordCountForValidText(): void
    {
        $result = wordcount("Hello world!");
        $this->assertEquals(2, $result, "Word count for 'Hello world!' should be 2.");
    }

    /**
     * Test that an empty string throws an exception.
     *
     * @throws InvalidArgumentException if the input is empty.
     */
    public function testEmptyTextThrowsException(): void
    {
        $this->expectException(InvalidArgumentException::class);
        wordcount(""); // Should throw an exception for empty string
    }

    /**
     * Test that a string with only whitespace throws an exception.
     *
     * @throws InvalidArgumentException if the input contains only whitespace.
     */
    public function testWhitespaceTextThrowsException(): void
    {
        $this->expectException(InvalidArgumentException::class);
        wordcount("    "); // Should throw an exception for whitespace only
    }

    /**
     * Test that special characters are handled correctly.
     */
    public function testTextWithSpecialCharacters(): void
    {
        $result = wordcount("Hello @world #123!");
        $this->assertEquals(3, $result, "Word count for 'Hello @world #123!' should be 3.");
    }

    /**
     * Test that hyphenated words are counted as one word.
     */
    public function testTextWithHyphenatedWords(): void
    {
        $result = wordcount("hello world-well done!");
        $this->assertEquals(3, $result, "Word count for 'hello world-well done!' should be 3.");
    }

    /**
     * Test that apostrophes in contractions are treated correctly.
     */
    public function testTextWithApostrophes(): void
    {
        $result = wordcount("It's a nice day!");
        $this->assertEquals(4, $result, "Word count for 'It's a nice day!' should be 4.");
    }

    /**
     * Test that text with Unicode characters (e.g., Kanji) is counted correctly.
     */
    public function testUnicodeText(): void
    {
        $result = wordcount("漢字 testing!");
        $this->assertEquals(2, $result, "Word count for '漢字 testing!' should be 2.");
    }

    /**
     * Test that emojis are counted as separate words.
     */
    public function testEmojiText(): void
    {
        $result = wordcount("hello 😊 👍🏽");
        $this->assertEquals(3, $result, "Word count for 'hello 😊👍🏽' should be 3.");
    }

    /**
     * Test that emoji skin-tone variants are counted as one word.
     */
    public function testEmojiSkinToneVariants(): void
    {
        // Testing emoji variants with different skin tones (same emoji)
        $result = wordcount("hello 👍🏽 👍🏻");
        $this->assertEquals(3, $result, "Word count for 'hello 👍🏽 👍🏻' should be 3.");
    }
}