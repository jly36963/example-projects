package index

import (
	// standard packages
	"net/http"

	// local packages
	"go-gin/middleware/auth" // auth middleware

	// external packages
	"github.com/gin-gonic/gin" // gin framework
)

func Routes(r *gin.Engine) {

	// @route -- GET /api
	// @desc -- return 200 OK
	// @access -- public
	r.GET("/api", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{})
	})

	// @route -- GET /api/hello
	// @desc -- redirect to /api/hello-world (status 301)
	// @access -- public
	r.GET("/api/hello", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/api/hello-world")
	})

	// @route -- GET /api/hello-world
	// @desc -- return "Hello World"
	// @access -- public
	r.GET("/api/hello-world", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello world!",
		})
	})

	// @route -- GET /api/user/:id
	// @desc -- return user
	// @access -- protected
	r.GET("/api/user/:id", auth.CheckToken, func(c *gin.Context) {
		id := c.Param("id")
		// *** db fetch logic here ***
		c.JSON(http.StatusOK, gin.H{
			"id":   id,
			"name": "Kakashi Hatake",
		})
	})

	// @route -- GET /api/store/search
	// @desc -- return query
	// @access -- public
	r.GET("/api/store/search", func(c *gin.Context) {
		// c.DefaultQuery("name", "Kakashi") // default
		// c.Query("lastName") // c.Request.URL.Query().Get("lastname")
		// c.Request.URL.Query() // map (type url.Values)
		query := c.Request.URL.Query() // map[string][]string
		c.JSON(http.StatusOK, gin.H{
			"query": query,
		})
	})

	// @route -- *
	// @desc -- not found
	// @access -- public
	r.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{"message": "Page not found"})
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
