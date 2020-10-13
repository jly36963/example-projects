package api

// imports
import (
	// standard packages
	"encoding/json"
	"fmt"
	"log"
	"strconv"

	// local packages
	"go-fasthttp/middleware/auth"

	// external packages
	"github.com/fasthttp/router"
	"github.com/valyala/fasthttp"
)

func AddRouter(r *router.Router) {

	// subrouter (group)
	sr := r.Group("/api")

	// @route -- GET /api
	// @desc -- return 200 OK
	// @access -- public
	sr.GET("", func(ctx *fasthttp.RequestCtx) {
		// payload
		payload, _ := json.Marshal(struct{}{})
		// response
		ctx.SetContentType("application/json")
		ctx.SetStatusCode(fasthttp.StatusOK)
		ctx.SetBody(payload)
	})

	// @route -- GET /api/hello
	// @desc -- redirect to "/api/hello-world"
	// @access -- public
	sr.GET("/hello", func(ctx *fasthttp.RequestCtx) {
		ctx.Redirect("/hello-world", fasthttp.StatusMovedPermanently)
	})

	// @route -- GET /api/hello-world
	// @desc -- return "Hello World!"
	// @access -- public
	sr.GET("/hello-world", func(ctx *fasthttp.RequestCtx) {
		// payload
		payload, _ := json.Marshal(struct {
			Message string `json:"message"`
		}{
			"Hello World!",
		})
		// response
		ctx.SetContentType("application/json")
		ctx.SetStatusCode(fasthttp.StatusOK)
		ctx.SetBody(payload)
	})

	// @route -- GET /api/store/search
	// @desc -- return query param
	// @access -- public
	sr.GET("/store/search", func(ctx *fasthttp.RequestCtx) {
		// query
		q := string(ctx.QueryArgs().Peek("q"))
		// payload
		payload, _ := json.Marshal(struct {
			Q string `json:"q"`
		}{
			q,
		})
		// response
		ctx.SetContentType("application/json")
		ctx.SetStatusCode(fasthttp.StatusOK)
		ctx.SetBody(payload)
	})

	type User struct {
		Id        int    `json:"id"`
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
	}

	// @route -- GET /api/user/:id
	// @desc -- return user
	// @access -- private
	sr.GET("/user/{id}", auth.CheckToken(func(ctx *fasthttp.RequestCtx) {
		id, _ := strconv.Atoi(fmt.Sprintf("%s", ctx.UserValue("id")))
		// get user from db
		// *** db fetch logic here ***
		user := User{
			id,        // id
			"Kakashi", // firstName
			"Hatake",  // lastName
		}
		// payload
		payload, err := json.Marshal(user)
		if err != nil {
			log.Println(err)
		}
		// response
		ctx.SetContentType("application/json")
		ctx.SetStatusCode(fasthttp.StatusOK)
		ctx.SetBody(payload)
	}))

	// @route -- POST /api/user/create
	// @desc -- add user to db and return new user
	// @access -- private
	sr.POST("/user/create", auth.CheckToken(func(ctx *fasthttp.RequestCtx) {
		var user User
		b := ctx.PostBody() // []bytes
		err1 := json.Unmarshal(b, &user)
		if err1 != nil {
			ctx.Error(err1.Error(), fasthttp.StatusInternalServerError)
		}
		// get user from db
		// *** db fetch logic here ***
		newUser := User{
			46,             // id
			user.FirstName, // firstName
			user.LastName,  // lastName
		}
		// payload
		payload, err2 := json.Marshal(newUser)
		if err2 != nil {
			log.Println(err2)
		}
		// response
		ctx.SetContentType("application/json")
		ctx.SetStatusCode(fasthttp.StatusOK)
		ctx.SetBody(payload)
	}))
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
