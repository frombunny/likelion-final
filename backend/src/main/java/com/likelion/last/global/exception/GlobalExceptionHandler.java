package com.likelion.last.global.exception;

import com.likelion.last.global.response.ErrorResponse;
import com.likelion.last.global.response.code.GlobalErrorResponseCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    /***
     * @Valid, @Validated로 요청 dto 검증 중 필드 제약 조건이 일치하지 않을 경우
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    private ResponseEntity<ErrorResponse<?>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        log.error("MethodArgumentNotValidException : {}", e.getMessage(), e);
        ErrorResponse<?> errorResponse = ErrorResponse.of(
                GlobalErrorResponseCode.INVALID_HTTP_MESSAGE_BODY,
                e.getFieldError().getDefaultMessage()
        );
        return ResponseEntity.status(errorResponse.getHttpStatus()).body(errorResponse);
    }

    /**
     * RequestPart가 누락된 경우
     */
    @ExceptionHandler(MissingServletRequestPartException.class)
    private ResponseEntity<ErrorResponse<?>> handleMissingServletRequestPartException(
            MissingServletRequestPartException e) {
        log.error("MissingServletRequestPartException : {}", e.getMessage(), e);
        ErrorResponse<?> errorResponse = ErrorResponse.from(
                GlobalErrorResponseCode.INVALID_HTTP_MESSAGE_BODY
        );
        return ResponseEntity.status(errorResponse.getHttpStatus()).body(errorResponse);
    }

    /**
     * 쿼리 파라미터가 누락된 경우
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    private ResponseEntity<ErrorResponse<?>> handleMissingServletRequestParameterException(
            MissingServletRequestParameterException e) {
        log.error("MissingServletRequestParameterException : {}", e.getMessage(), e);
        ErrorResponse<?> errorResponse = ErrorResponse.from(GlobalErrorResponseCode.MISSING_REQUEST_PARAMETER);
        return ResponseEntity.status(errorResponse.getHttpStatus()).body(errorResponse);
    }

    /**
     * 헤더가 누락된 경우
     */
    @ExceptionHandler(MissingRequestHeaderException.class)
    private ResponseEntity<ErrorResponse<?>> handleMissingRequestHeaderException(MissingRequestHeaderException e) {
        log.error("MissingRequestHeaderException : {}", e.getMessage(), e);
        String errorMessage = String.format("필수 요청 헤더 '%s' 가 누락되었습니다.", e.getHeaderName());
        ErrorResponse<?> errorResponse = ErrorResponse.of(
                GlobalErrorResponseCode.MISSING_REQUEST_HEADER,
                errorMessage
        );
        return ResponseEntity.status(errorResponse.getHttpStatus()).body(errorResponse);
    }

    /**
     * @ModelAttribute, @PathVariable, @RequestParam 의 바인딩 Query String, Path Variable, Form-data 등의 검증 오류의 경우
     */
    @ExceptionHandler(BindException.class)
    private ResponseEntity<ErrorResponse<?>> handleBindException(BindException e) {
        log.error("BindException : {}", e.getMessage(), e);
        ErrorResponse<?> errorResponse = ErrorResponse.of(
                GlobalErrorResponseCode.INVALID_HTTP_MESSAGE_BODY,
                e.getFieldError().getDefaultMessage()
        );
        return ResponseEntity.status(errorResponse.getHttpStatus()).body(errorResponse);
    }

    /**
     * 지원하지 않는 HTTP 메소드를 호출할 경우
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    private ResponseEntity<ErrorResponse<?>> handleHttpRequestMethodNotSupportedException(
            HttpRequestMethodNotSupportedException e) {
        log.error("HttpRequestMethodNotSupportedException : {}", e.getMessage(), e);
        ErrorResponse<?> errorResponse = ErrorResponse.from(
                GlobalErrorResponseCode.UNSUPPORTED_HTTP_METHOD
        );
        return ResponseEntity.status(errorResponse.getHttpStatus()).body(errorResponse);
    }

    /**
     * @PathVariable, @RequestParam 등에서 타입 변환에 실패했을 경우 (ENUM, 숫자 타입 등 공통)
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    private ResponseEntity<ErrorResponse<?>> handleMethodArgumentTypeMismatchException(
            MethodArgumentTypeMismatchException e) {
        log.error("MethodArgumentTypeMismatchException : {}", e.getMessage(), e);
        ErrorResponse<?> errorResponse = ErrorResponse.from(GlobalErrorResponseCode.INVALID_HTTP_MESSAGE_BODY);
        return ResponseEntity.status(errorResponse.getHttpStatus()).body(errorResponse);
    }

    /**
     * 잘못된 엔드포인트를 호출했을 경우
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    private ResponseEntity<ErrorResponse<?>> handleNoHandlerFoundException(NoHandlerFoundException e) {
        log.error("NoHandlerFoundException : {}", e.getMessage(), e);
        ErrorResponse<?> errorResponse = ErrorResponse.from(GlobalErrorResponseCode.NOT_FOUND_ENDPOINT);
        return ResponseEntity.status(errorResponse.getHttpStatus()).body(errorResponse);
    }

    /**
     * 정적 리소스 조차 찾지 못했을 경우
     */
    @ExceptionHandler(NoResourceFoundException.class)
    private ResponseEntity<ErrorResponse<?>> handleNoResourceFoundException(NoResourceFoundException e) {
        log.error("NoResourceFoundException : {}", e.getMessage(), e);
        ErrorResponse<?> errorResponse = ErrorResponse.from(GlobalErrorResponseCode.NOT_FOUND_ENDPOINT);
        return ResponseEntity.status(errorResponse.getHttpStatus()).body(errorResponse);
    }

    /**
     * JSON 파싱/역직렬화 실패할 경우
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    private ResponseEntity<ErrorResponse<?>> handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {
        log.error("HttpMessageNotReadableException : {}", e.getMessage(), e);
        ErrorResponse<?> errorResponse = ErrorResponse.from(GlobalErrorResponseCode.INVALID_HTTP_MESSAGE_BODY);
        return ResponseEntity.status(errorResponse.getHttpStatus()).body(errorResponse);
    }

    /**
     * BaseException을 상속받은 예외가 터질 경우
     */
    @ExceptionHandler(BaseException.class)
    private ResponseEntity<ErrorResponse<?>> handleBaseException(BaseException e) {
        log.error("BaseException : {}", e.getMessage(), e);
        ErrorResponse<?> errorResponse = ErrorResponse.from(e.getBaseResponseCode());
        return ResponseEntity.status(errorResponse.getHttpStatus()).body(errorResponse);
    }

    /**
     * 나머지 예외 처리
     */
    @ExceptionHandler(Exception.class)
    private ResponseEntity<ErrorResponse<?>> handleException(Exception e) {
        log.error("UnhandledException : {}", e.getMessage(), e);
        ErrorResponse<?> errorResponse = ErrorResponse.from(GlobalErrorResponseCode.SERVER_ERROR);
        return ResponseEntity.status(errorResponse.getHttpStatus()).body(errorResponse);
    }


}
