package api

import (
	// standard packages
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	// local packages
	"go-gorilla/middleware/auth" // auth middleware

	// external packages
	"github.com/gorilla/mux"
)

func AddRouter(r *mux.Router) {

	// prefix (subrouter)
	sr := r.PathPrefix("/api").Subrouter()

	// @route -- GET /api
	// @desc -- return 200 OK
	// @access -- public
	sr.HandleFunc("", func(w http.ResponseWriter, r *http.Request) {
		// payload
		payload, err := json.Marshal(struct{}{})
		if err != nil {
			log.Println(err)
		}
		// response
		w.Header().Set("Content-Type", "application/json") // content type
		w.WriteHeader(http.StatusOK)                       // status code
		w.Write(payload)                                   // body
	}).Methods("GET")

	// @route -- GET /api/hello
	// @desc -- redirect to /api/hello-world
	// @access -- public
	sr.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/hello-world", http.StatusMovedPermanently)
	}).Methods("GET")

	// @route -- GET /api/hello-world
	// @desc -- return "Hello World!"
	// @access -- public
	sr.HandleFunc("/hello-world", func(w http.ResponseWriter, r *http.Request) {
		// payload
		payload, err := json.Marshal(struct {
			Message string `json:"message"`
		}{
			"Hello World!",
		})
		if err != nil {
			log.Println(err)
		}
		// response
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(payload)
	}).Methods("GET")

	// @route -- GET /api/user/:id
	// @desc -- return user
	// @access -- private
	sr.HandleFunc("/user/{id}", auth.CheckToken(func(w http.ResponseWriter, r *http.Request) {
		// get route params
		routeParams := mux.Vars(r)
		id, _ := strconv.Atoi(routeParams["id"])
		// get user from db
		// ** db fetch logic here ***
		// payload
		payload, err := json.Marshal(struct {
			Id   int    `json:"id"`
			Name string `json:"name"`
		}{
			id,               // id
			"Kakashi Hatake", // name
		})
		if err != nil {
			log.Println(err)
		}
		// response
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(payload)

	})).Methods("GET")

	// not found
	sr.NotFoundHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// payload
		payload, err := json.Marshal(struct {
			Message string `json:"message"`
		}{
			"Not found",
		})
		if err != nil {
			log.Println(err)
		}
		// response
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		w.Write(payload)
	})

}

// ---
// statuses
// ---

// 200 -- StatusOK
// 300 -- StatusMovedPermanently
// 400 -- StatusBadRequest
// 401 -- StatusUnauthorized
// 402 -- StatusPaymentRequired
// 403 -- StatusForbidden
// 404 -- StatusNotFound
// 500 -- StatusInternalServerError
// 503 -- StatusServiceUnavailable

// ---
// simplejson
// ---

/*

import "github.com/bitly/go-simplejson"

// payload
sjson := simplejson.New()
sjson.Set("message", "Hello World!")
payload, err := sjson.MarshalJSON()

// response
w.Header().Set("Content-Type", "application/json")
w.WriteHeader(http.StatusOK)
w.Write(payload)

*/
