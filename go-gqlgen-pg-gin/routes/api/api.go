package api

import (
	"net/http"

	"go-gqlgen-pg-gin/providers"

	"github.com/gin-gonic/gin"
)

// Routes is a subrouter containing gin route handlers
func Routes(r *gin.Engine, providers *providers.Providers) {

	// subrouter (grouped routes)
	sr := r.Group("/api")
	{
		// @route -- GET /api
		// @desc -- return 200 OK
		// @access -- public
		sr.GET("", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{})
		})

		// @route -- GET /api/hello
		// @desc -- redirect to /api/hello-world (status 301)
		// @access -- public
		sr.GET("/hello", func(c *gin.Context) {
			c.Redirect(http.StatusMovedPermanently, "/hello-world")
		})

		// @route -- GET /api/hello-world
		// @desc -- return "Hello World"
		// @access -- public
		sr.GET("/hello-world", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "Hello world!",
			})
		})
	}
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
