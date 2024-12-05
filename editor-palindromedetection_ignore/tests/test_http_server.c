#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <curl/curl.h>
#include <assert.h>

#define SERVER_URL "http://localhost:4006"

struct Memory {
    char *response;
    size_t size;
};

// Callback to handle response data
static size_t write_callback(void *data, size_t size, size_t nmemb, void *userp) {
    size_t total_size = size * nmemb;
    struct Memory *mem = (struct Memory *)userp;

    char *ptr = realloc(mem->response, mem->size + total_size + 1);
    if (!ptr) {
        fprintf(stderr, "Not enough memory\n");
        return 0;
    }

    mem->response = ptr;
    memcpy(&(mem->response[mem->size]), data, total_size);
    mem->size += total_size;
    mem->response[mem->size] = '\0';

    return total_size;
}

void test_palindrome_valid_input() {
    CURL *curl = curl_easy_init();
    assert(curl != NULL);

    struct Memory chunk = {0};
    curl_easy_setopt(curl, CURLOPT_URL, SERVER_URL);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, "Able was I saw Elba");
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, (void *)&chunk);

    CURLcode res = curl_easy_perform(curl);
    assert(res == CURLE_OK);
    printf("Response: %s\n", chunk.response);

    // Validate the response
    assert(strstr(chunk.response, "\"is_palindrome\": true") != NULL);

    free(chunk.response);
    curl_easy_cleanup(curl);
}

void test_palindrome_invalid_input() {
    CURL *curl = curl_easy_init();
    assert(curl != NULL);

    struct Memory chunk = {0};
    curl_easy_setopt(curl, CURLOPT_URL, SERVER_URL);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, "Hello, World!");
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, (void *)&chunk);

    CURLcode res = curl_easy_perform(curl);
    assert(res == CURLE_OK);
    printf("Response: %s\n", chunk.response);

    // Validate the response
    assert(strstr(chunk.response, "\"is_palindrome\": false") != NULL);

    free(chunk.response);
    curl_easy_cleanup(curl);
}

void test_missing_data() {
    CURL *curl = curl_easy_init();
    assert(curl != NULL);

    struct Memory chunk = {0};
    curl_easy_setopt(curl, CURLOPT_URL, SERVER_URL);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, "");
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, (void *)&chunk);

    CURLcode res = curl_easy_perform(curl);
    assert(res == CURLE_OK);
    printf("Response: %s\n", chunk.response);

    // Validate the response
    assert(strstr(chunk.response, "\"is_palindrome\": false") != NULL);

    free(chunk.response);
    curl_easy_cleanup(curl);
}

int main() {
    printf("Running test_palindrome_valid_input...\n");
    test_palindrome_valid_input();
    printf("test_palindrome_valid_input passed.\n");

    printf("Running test_palindrome_invalid_input...\n");
    test_palindrome_invalid_input();
    printf("test_palindrome_invalid_input passed.\n");

    printf("Running test_missing_data...\n");
    test_missing_data();
    printf("test_missing_data passed.\n");

    printf("All tests passed!\n");
    return 0;
}