#ifndef PALINDROME_H
#define PALINDROME_H

#include <stdbool.h>

// Function to check if a string is a palindrome
bool is_palindrome(const char *str);

// Function to clean a string (remove non-alphanumeric and convert to lowercase)
void clean_string(const char *input, char *output);

#endif // PALINDROME_H