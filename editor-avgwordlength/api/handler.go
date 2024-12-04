package api

import (
	"strings"

	"github.com/gin-gonic/gin"
)

// RequestPayload represents the structure of the input request body
type RequestPayload struct {
	Text string `json:"text"`
}

// ResponsePayload represents the structure of the response
type ResponsePayload struct {
	AverageWordLength float64 `json:"average_word_length"`
}

// CalculateAverageWordLength calculates the average word length in a given text
func CalculateAverageWordLength(c *gin.Context) {
	var payload RequestPayload

	// Bind the JSON input to the payload struct
	if err := c.ShouldBindJSON(&payload); err != nil || payload.Text == "" {
		c.JSON(400, gin.H{"error": "Invalid request payload"})
		return
	}

	// Calculate the average word length
	words := strings.Fields(payload.Text)
	if len(words) == 0 {
		c.JSON(200, ResponsePayload{AverageWordLength: 0})
		return
	}

	var totalLength int
	for _, word := range words {
		totalLength += len(word)
	}

	averageWordLength := float64(totalLength) / float64(len(words))

	// Respond with the result
	c.JSON(200, ResponsePayload{AverageWordLength: averageWordLength})
}