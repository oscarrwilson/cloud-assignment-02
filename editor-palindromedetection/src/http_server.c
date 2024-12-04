#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <microhttpd.h>
#include "palindrome.h"

#define DEFAULT_PORT 4006

static enum MHD_Result request_handler(void *cls, struct MHD_Connection *connection,
                                       const char *url, const char *method, const char *version,
                                       const char *upload_data, size_t *upload_data_size,
                                       void **ptr);

void start_http_server(int port) {
    struct MHD_Daemon *daemon;
    daemon = MHD_start_daemon(MHD_USE_SELECT_INTERNALLY, port, NULL, NULL, &request_handler, NULL, MHD_OPTION_END);
    if (NULL == daemon) {
        fprintf(stderr, "Failed to start server\n");
        exit(1);
    }

    printf("Server running on port %d\n", port);
    getchar();
    MHD_stop_daemon(daemon);
}

static enum MHD_Result request_handler(void *cls, struct MHD_Connection *connection,
                                       const char *url, const char *method, const char *version,
                                       const char *upload_data, size_t *upload_data_size,
                                       void **ptr) {
    static int dummy;
    if (0 != strcmp(method, "POST"))
        return MHD_NO;

    if (*ptr == NULL) {
        *ptr = &dummy;
        return MHD_YES;
    }

    *ptr = NULL;

    if (*upload_data_size > 0) {
        char buffer[512];
        strncpy(buffer, upload_data, *upload_data_size);
        buffer[*upload_data_size] = '\0';

        char cleaned[512];
        clean_string(buffer, cleaned);
        int palindrome_result = is_palindrome(cleaned);

        char response[256];
        snprintf(response, sizeof(response),
                 "{\"input\": \"%s\", \"is_palindrome\": %s}", buffer,
                 palindrome_result ? "true" : "false");

        struct MHD_Response *mhd_response;
        mhd_response = MHD_create_response_from_buffer(strlen(response),
                                                        (void *)response,
                                                        MHD_RESPMEM_MUST_COPY);
        enum MHD_Result ret = MHD_queue_response(connection, MHD_HTTP_OK, mhd_response);
        MHD_destroy_response(mhd_response);

        return ret;
    }
    return MHD_NO;
}