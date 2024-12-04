package avgwordlength_test

import (
    "testing"

    "editor-avgwordlength/internal/avgwordlength"
    "github.com/stretchr/testify/assert"
)

func TestCalculateAverageWordLength(t *testing.T) {
    tests := []struct {
        name     string
        text     string
        expected float64
        hasError bool
    }{
        {
            name:     "Valid text with multiple words",
            text:     "hello world",
            expected: 5.0,
            hasError: false,
        },
        {
            name:     "Empty string input",
            text:     "",
            expected: 0.0,
            hasError: false,
        },
        {
            name:     "Text with special characters",
            text:     "hello, world! 123",
            expected: 5.0,
            hasError: false,
        },
        {
            name:     "Text with only special characters and spaces",
            text:     "!@# $%^&*()",
            expected: 0.0,
            hasError: false,
        },
        {
            name:     "Text with Unicode characters (CJK ideographs)",
            text:     "漢字 テキスト",
            expected: 3.0, // Corrected expected value
            hasError: false,
        },
        {
            name:     "Text with emojis",
            text:     "hello 😊 world!",
            expected: 5.0,
            hasError: false,
        },
        {
            name:     "Text with a single word",
            text:     "supercalifragilisticexpialidocious",
            expected: 34.0,
            hasError: false,
        },
        {
            name:     "Text with wide Unicode characters",
            text:     "𐍈𐍉𐍈 𐍈𐍉",
            expected: 2.5, // Corrected expected value
            hasError: false,
        },
        {
            name:     "Text with mixed content",
            text:     "The quick brown fox jumps over 13 lazy dogs.",
            expected: 4.125,
            hasError: false,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result, err := avgwordlength.CalculateAverageWordLength(tt.text)

            if tt.hasError {
                assert.Error(t, err)
            } else {
                assert.NoError(t, err)
                assert.InDelta(t, tt.expected, result, 0.01, "Result should match expected value with precision")
            }
        })
    }
}