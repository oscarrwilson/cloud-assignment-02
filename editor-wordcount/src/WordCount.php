<?php
declare(strict_types=1);

// Autoload dependencies (if using Composer setup)
require 'vendor/autoload.php';

/**
 * Count the number of words in the given text, treating emojis as separate words.
 *
 * This function counts words by matching sequences of word characters (letters, numbers, apostrophes, hyphens)
 * and also counts emojis as individual words.
 *
 * @param string $text The input text to count words from.
 * @return int The word count.
 * @throws InvalidArgumentException if the input text is empty or consists only of whitespace.
 */
function wordcount(string $text): int
{
    // Trim the input text to handle edge cases with leading/trailing whitespace
    $trimmedText = trim($text);

    if (empty($trimmedText)) {
        throw new InvalidArgumentException('Input text cannot be empty or consist only of whitespace.');
    }

    // Use regular expression to match word-like sequences (letters, numbers, apostrophes, hyphens)
    // and also match individual emojis.
    preg_match_all('/[\p{L}\p{N}\'-]+|[\x{1F600}-\x{1F64F}\x{1F300}-\x{1F5FF}\x{1F680}-\x{1F6FF}\x{1F700}-\x{1F77F}\x{1F780}-\x{1F7FF}\x{1F800}-\x{1F8FF}\x{1F900}-\x{1F9FF}\x{1FA00}-\x{1FA6F}\x{1FA70}-\x{1FAFF}\x{2600}-\x{26FF}\x{2700}-\x{27BF}\x{2300}-\x{23FF}\x{2B50}\x{2764}\x{2763}]+/u', $trimmedText, $matches);

    return count($matches[0]);
}



