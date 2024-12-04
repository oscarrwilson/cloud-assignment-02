#include "palindrome.h"
#include <ctype.h>
#include <string.h>

// Function to check if a string is a palindrome
bool is_palindrome(const char *str) {
    size_t len = strlen(str);
    size_t left = 0;
    size_t right = len - 1;

    while (left < right) {
        if (str[left] != str[right]) {
            return false;
        }
        left++;
        right--;
    }

    return true;
}

// Function to clean a string (remove non-alphanumeric and convert to lowercase)
void clean_string(const char *input, char *output) {
    size_t j = 0;
    for (size_t i = 0; input[i] != '\0'; i++) {
        if (isalnum(input[i])) {
            output[j++] = tolower((unsigned char)input[i]);
        }
    }
    output[j] = '\0'; // Null-terminate the cleaned string
}