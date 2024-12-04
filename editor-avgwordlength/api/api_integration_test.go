package api_test

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"editor-avgwordlength/api"
)

func TestAvgWordLengthHandler(t *testing.T) {
	tests := []struct {
		name           string
		requestBody    string
		expectedStatus int
		expectedOutput string
	}{
		{
			name:           "Valid text",
			requestBody:    `{"text": "hello world"}`,
			expectedStatus: http.StatusOK,
			expectedOutput: `{"average_word_length":5}`,
		},
		{
			name:           "Empty text",
			requestBody:    `{"text": ""}`,
			expectedStatus: http.StatusBadRequest,
			expectedOutput: `{"error":"Invalid request payload"}`,
		},
		{
			name:           "Invalid JSON",
			requestBody:    `{"text":}`,
			expectedStatus: http.StatusBadRequest,
			expectedOutput: `{"error":"Invalid request payload"}`,
		},
		{
			name:           "Missing text field",
			requestBody:    `{"content": "hello"}`,
			expectedStatus: http.StatusBadRequest,
			expectedOutput: `{"error":"Invalid request payload"}`,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			router := gin.Default()
			router.POST("/avgwordlength", api.CalculateAverageWordLength)

			req := httptest.NewRequest(http.MethodPost, "/avgwordlength", bytes.NewBufferString(test.requestBody))
			req.Header.Set("Content-Type", "application/json")
			rr := httptest.NewRecorder()

			router.ServeHTTP(rr, req)

			if rr.Code != test.expectedStatus {
				t.Errorf("Expected status %d, got %d", test.expectedStatus, rr.Code)
			}

			if rr.Body.String() != test.expectedOutput {
				t.Errorf("Expected body %s, got %s", test.expectedOutput, rr.Body.String())
			}
		})
	}
}