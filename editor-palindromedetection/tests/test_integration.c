#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <curl/curl.h>

#define DEFAULT_PORT 4006
#define BASE_URL "http://localhost"

int main() {
    const char *port_env = getenv("PORT");
    int port = port_env ? atoi(port_env) : DEFAULT_PORT;

    char url[256];
    snprintf(url, sizeof(url), "%s:%d/palindrome", BASE_URL, port);

    CURL *curl = curl_easy_init();
    if (!curl) {
        fprintf(stderr, "Failed to initialize CURL\n");
        return 1;
    }

    const char *test_data = "{\"text\":\"madam\"}";

    struct curl_slist *headers = NULL;
    headers = curl_slist_append(headers, "Content-Type: application/json");

    curl_easy_setopt(curl, CURLOPT_URL, url);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, test_data);
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

    CURLcode res = curl_easy_perform(curl);
    if (res != CURLE_OK) {
        fprintf(stderr, "CURL request failed: %s\n", curl_easy_strerror(res));
    } else {
        printf("Test passed: %s\n", test_data);
    }

    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);

    return res == CURLE_OK ? 0 : 1;
}