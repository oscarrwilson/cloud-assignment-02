#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <microhttpd.h>
#include "palindrome.h"

#define DEFAULT_PORT 4006

static enum MHD_Result request_handler(void *cls, struct MHD_Connection *connection,
                                       const char *url, const char *method, const char *version,
                                       const char *upload_data, size_t *upload_data_size,
                                       void **ptr) {
    static int dummy;

    if (0 != strcmp(method, "GET")) {
        const char *error_response = "{\"error\": \"Only GET method is allowed\"}";
        struct MHD_Response *mhd_response = MHD_create_response_from_buffer(strlen(error_response),
                                                                            (void *)error_response,
                                                                            MHD_RESPMEM_PERSISTENT);
        int ret = MHD_queue_response(connection, MHD_HTTP_BAD_REQUEST, mhd_response);
        MHD_destroy_response(mhd_response);
        return ret;
    }

    if (*ptr == NULL) {
        *ptr = &dummy;
        return MHD_YES;
    }
    *ptr = NULL;

    const char *query_text = MHD_lookup_connection_value(connection, MHD_GET_ARGUMENT_KIND, "text");
    if (!query_text) {
        const char *error_response = "{\"error\": \"Missing 'text' query parameter\"}";
        struct MHD_Response *mhd_response = MHD_create_response_from_buffer(strlen(error_response),
                                                                            (void *)error_response,
                                                                            MHD_RESPMEM_PERSISTENT);
        int ret = MHD_queue_response(connection, MHD_HTTP_BAD_REQUEST, mhd_response);
        MHD_destroy_response(mhd_response);
        return ret;
    }

    char cleaned[512];
    clean_string(query_text, cleaned);
    int palindrome_result = is_palindrome(cleaned);

    char response[256];
    snprintf(response, sizeof(response),
             "{\"input\": \"%s\", \"is_palindrome\": %s}", query_text,
             palindrome_result ? "true" : "false");

    struct MHD_Response *mhd_response = MHD_create_response_from_buffer(strlen(response),
                                                                        (void *)response,
                                                                        MHD_RESPMEM_PERSISTENT);
    int ret = MHD_queue_response(connection, MHD_HTTP_OK, mhd_response);
    MHD_destroy_response(mhd_response);
    return ret;
}

void start_http_server(int port) {
    struct MHD_Daemon *daemon = MHD_start_daemon(MHD_USE_SELECT_INTERNALLY, port, NULL, NULL, 
                                                 &request_handler, NULL, MHD_OPTION_END);
    if (!daemon) {
        fprintf(stderr, "Failed to start server\n");
        exit(1);
    }
    printf("Server running on port %d\n", port);
    getchar(); // Keeps the server running
    MHD_stop_daemon(daemon);
}

int main() {
    start_http_server(DEFAULT_PORT);
    return 0;
}