/// tests/test_integration_punctuationcount.rs
///
/// Integration tests for the punctuation counting service.

#[cfg(test)]
mod integration_tests {
    use actix_web::{test, web, App};
    use editor_punctuationcount::main; // Adjust based on crate/module name

    #[actix_web::test]
    async fn test_valid_input() {
        let app = test::init_service(App::new().configure(main)).await;
        let req = test::TestRequest::get().uri("/?text=Hello,%20world!").to_request();
        let resp = test::call_and_read_body_json(&app, req).await;

        assert_eq!(resp["error"], false);
        assert_eq!(resp["answer"], 2);
    }

    #[actix_web::test]
    async fn test_missing_input() {
        let app = test::init_service(App::new().configure(main)).await;
        let req = test::TestRequest::get().uri("/").to_request();
        let resp = test::call_and_read_body_json(&app, req).await;

        assert_eq!(resp["error"], true);
        assert_eq!(resp["message"], "Missing \"text\" query parameter");
    }

    #[actix_web::test]
    async fn test_too_long_input() {
        let long_text = "a".repeat(10_001);
        let app = test::init_service(App::new().configure(main)).await;
        let req = test::TestRequest::get()
            .uri(&format!("/?text={}", long_text))
            .to_request();
        let resp = test::call_and_read_body_json(&app, req).await;

        assert_eq!(resp["error"], true);
        assert_eq!(resp["message"], "Input exceeds the maximum allowed length of 10,000 characters");
    }

    #[actix_web::test]
    async fn test_internal_server_error() {
        let app = test::init_service(App::new().configure(main)).await;
        let req = test::TestRequest::get()
            .uri("/?text=simulate-error")
            .to_request();
        let resp = test::call_and_read_body_json(&app, req).await;

        assert_eq!(resp["error"], true);
        assert_eq!(resp["message"], "Internal server error");
    }

    #[actix_web::test]
    async fn test_cors_headers() {
        let app = test::init_service(App::new().configure(main)).await;
        let req = test::TestRequest::get().uri("/?text=hello").to_request();
        let resp = test::call_and_read_body(&app, req).await;

        let headers = resp.headers();
        assert_eq!(headers.get("access-control-allow-origin").unwrap(), "*");
    }

    #[actix_web::test]
    async fn test_sequential_requests() {
        let app = test::init_service(App::new().configure(main)).await;
        let text = "Hello, World!";
        let expected_count = 2;

        for _ in 0..5 {
            let req = test::TestRequest::get()
                .uri(&format!("/?text={}", text))
                .to_request();
            let resp = test::call_and_read_body_json(&app, req).await;

            assert_eq!(resp["error"], false);
            assert_eq!(resp["answer"], expected_count);
        }
    }
}