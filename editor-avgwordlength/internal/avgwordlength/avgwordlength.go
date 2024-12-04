package avgwordlength

import (
    "fmt"
    "strings"
    "unicode"
)

// CalculateAverageWordLength calculates the average word length in a given text.
// A word is defined as a sequence of Unicode letters, and word separators are any non-letter characters.
// Returns 0.0 if the input is empty or no words are found.
func CalculateAverageWordLength(text string) (float64, error) {
    if text == "" {
        fmt.Println("Input text is empty.")
        return 0.0, nil
    }

    words := []string{}
    currentWord := strings.Builder{}

    for _, r := range text {
        if unicode.IsLetter(r) {
            currentWord.WriteRune(r)
        } else {
            if currentWord.Len() > 0 {
                word := currentWord.String()
                words = append(words, word)
                fmt.Printf("Collected word: '%s'\n", word)
                currentWord.Reset()
            }
        }
    }

    // Check for the last word
    if currentWord.Len() > 0 {
        word := currentWord.String()
        words = append(words, word)
        fmt.Printf("Collected word: '%s'\n", word)
    }

    if len(words) == 0 {
        fmt.Println("No words found in the text.")
        return 0.0, nil
    }

    // Calculate total word lengths using runes
    totalLength := 0
    for _, word := range words {
        length := len([]rune(word)) // Use runes to handle wide characters
        fmt.Printf("Word: '%s', Length: %d\n", word, length)
        totalLength += length
    }

    average := float64(totalLength) / float64(len(words))
    fmt.Printf("Total Length: %d, Number of Words: %d, Average: %f\n", totalLength, len(words), average)
    return average, nil
}