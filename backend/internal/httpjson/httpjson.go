// Package httpjson provides small helpers for JSON HTTP responses and
// request decoding with validation errors.
package httpjson

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strings"
)

// Write marshals v as a JSON response with the given status code.
func Write(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		// Nothing sensible left to do; the response is already committed.
		http.Error(w, `{"error":"failed to encode response"}`, http.StatusInternalServerError)
	}
}

// Error writes a JSON error response.
func Error(w http.ResponseWriter, status int, msg string) {
	Write(w, status, map[string]any{"error": msg})
}

// Decode reads and validates the request body into dst.
// Returns a user-facing message on failure.
func Decode(r *http.Request, dst any) error {
	defer r.Body.Close()
	// Reject bodies larger than 2 MB to protect the API.
	body, err := io.ReadAll(io.LimitReader(r.Body, 2<<20))
	if err != nil {
		return errors.New("failed to read request body")
	}
	if len(body) == 0 {
		return errors.New("empty request body")
	}
	dec := json.NewDecoder(strings.NewReader(string(body)))
	dec.DisallowUnknownFields()
	if err := dec.Decode(dst); err != nil {
		return errors.New("invalid JSON body")
	}
	return nil
}

// FieldError represents a single invalid field.
type FieldError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

// ValidationError is returned when request validation fails.
type ValidationError struct {
	Fields []FieldError `json:"fields"`
}

func (e *ValidationError) Error() string {
	return "validation failed"
}

// Fail writes a 422 validation error response.
func Fail(w http.ResponseWriter, fields []FieldError) {
	Write(w, http.StatusUnprocessableEntity, map[string]any{
		"error":  "validation failed",
		"fields": fields,
	})
}

// Field builds a FieldError.
func Field(name, message string) FieldError {
	return FieldError{Field: name, Message: message}
}
