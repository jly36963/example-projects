package utils

import (
	"encoding/json"
	"io"
	"net/http"
)

func ReadJSON[T any](r *http.Request, obj *T) error {
	bytes, err := io.ReadAll(r.Body)
	if err != nil {
		return err
	}
	err = json.Unmarshal(bytes, &obj)
	if err != nil {
		return err
	}
	return nil
}

/* Return json-stringified payload as response payload */
func SendJSON[T any](w http.ResponseWriter, status int, data T) {
	payload, err := json.Marshal(data)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(payload)
}

func SendStatus(w http.ResponseWriter, status int) {
	http.Error(w, http.StatusText(status), status)
}
