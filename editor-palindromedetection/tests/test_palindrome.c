#include <stdio.h>
#include <assert.h>
#include <string.h>
#include "palindrome.h"

void test_is_palindrome() {
    // Test cases for palindromes
    assert(is_palindrome("racecar") == true);
    assert(is_palindrome("madam") == true);
    assert(is_palindrome("a") == true);
    assert(is_palindrome("") == true);

    // Test cases for non-palindromes
    assert(is_palindrome("hello") == false);
    assert(is_palindrome("world") == false);

    printf("test_is_palindrome passed!\n");
}

void test_clean_string() {
    char output[256];

    // Test cleaning and converting to lowercase
    clean_string("A man, a plan, a canal: Panama!", output);
    assert(strcmp(output, "amanaplanacanalpanama") == 0);

    clean_string("No 'x' in Nixon", output);
    assert(strcmp(output, "noxinnixon") == 0);

    clean_string("", output);
    assert(strcmp(output, "") == 0);

    printf("test_clean_string passed!\n");
}

int main() {
    test_is_palindrome();
    test_clean_string();

    printf("All tests passed!\n");
    return 0;
}