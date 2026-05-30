package coursework.exception

import jakarta.validation.ConstraintViolationException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.server.ResponseStatusException

data class ApiError(val status: Int, val message: String, val fields: Map<String, String> = emptyMap())

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(ConstraintViolationException::class)
    fun handleConstraintViolation(ex: ConstraintViolationException): ResponseEntity<ApiError> {
        val fields = ex.constraintViolations.associate { v ->
            v.propertyPath.last().name to v.message
        }
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiError(400, "Validation failed", fields))
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleMethodArgumentNotValid(ex: MethodArgumentNotValidException): ResponseEntity<ApiError> {
        val fields = ex.bindingResult.fieldErrors.associate { it.field to (it.defaultMessage ?: "invalid") }
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiError(400, "Validation failed", fields))
    }

    @ExceptionHandler(ResponseStatusException::class)
    fun handleResponseStatus(ex: ResponseStatusException): ResponseEntity<ApiError> {
        return ResponseEntity
            .status(ex.statusCode)
            .body(ApiError(ex.statusCode.value(), ex.reason ?: ex.message))
    }

    @ExceptionHandler(Exception::class)
    fun handleGeneric(ex: Exception): ResponseEntity<ApiError> {
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiError(500, ex.message ?: "Unexpected error"))
    }
}
