package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"editor-avgwordlength/internal/avgwordlength"
)

var messages = map[string]string{
	"missingText": "Missing 'text' query parameter",
	"tooLong":     "Input exceeds the maximum allowed length of 10,000 characters",
	"internalError": "Internal server error",
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "4005"
	}

	http.HandleFunc("/", avgWordLengthHandler)

	log.Printf("Server starting on port %s\n", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func avgWordLengthHandler(w http.ResponseWriter, r *http.Request) {
	// Set response headers
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	output := map[string]interface{}{
		"error":  false,
		"string": "",
		"answer": 0,
	}

	// Only handle GET requests
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		output["error"] = true
		output["string"] = "Invalid request method"
		json.NewEncoder(w).Encode(output)
		return
	}

	// Get the "text" query parameter
	text := r.URL.Query().Get("text")
	if text == "" {
		w.WriteHeader(http.StatusBadRequest)
		output["error"] = true
		output["string"] = messages["missingText"]
		json.NewEncoder(w).Encode(output)
		return
	}

	// Validate input length
	if len(text) > 10000 {
		w.WriteHeader(http.StatusBadRequest)
		output["error"] = true
		output["string"] = messages["tooLong"]
		json.NewEncoder(w).Encode(output)
		return
	}

	// Calculate the average word length
	avgLength, err := avgwordlength.CalculateAverageWordLength(text)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		output["error"] = true
		output["string"] = messages["internalError"]
		json.NewEncoder(w).Encode(output)
		return
	}

	// Format the response
	output["string"] = "Contains an average word length of " + formatFloat(avgLength)
	output["answer"] = avgLength
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(output)
}

// Helper function to format floats
func formatFloat(value float64) string {
	return fmt.Sprintf("%.2f", value)
}