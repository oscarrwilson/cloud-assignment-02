#include <stdio.h>
#include <string.h>
#include <assert.h>
#include "../src/palindrome.h"

void test_is_palindrome() {
    assert(is_palindrome("madam") == true);
    assert(is_palindrome("racecar") == true);
    assert(is_palindrome("hello") == false);
    assert(is_palindrome("A man a plan a canal Panama") == false); // Requires cleaning
    printf("is_palindrome tests passed.\n");
}

void test_clean_string() {
    char output[100];
    clean_string("Hello, World!", output);
    assert(strcmp(output, "helloworld") == 0);

    clean_string("A man, a plan, a canal, Panama!", output);
    assert(strcmp(output, "amanaplanacanalpanama") == 0);

    clean_string("12345 6789", output);
    assert(strcmp(output, "123456789") == 0);

    printf("clean_string tests passed.\n");
}

int main() {
    test_is_palindrome();
    test_clean_string();
    printf("All tests passed.\n");
    return 0;
}