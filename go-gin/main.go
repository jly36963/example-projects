// ---
// entry point
// ---

package main

// ---
// imports
// ---

import (
	// standard packages
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"runtime"
	"time"

	// external packages
	"github.com/gin-gonic/gin" // gin framework
	"github.com/joho/godotenv" // dotenv

	// local packages
	"go-gin/routes/api/index"
)

func main() {
	// runtime details
	getRuntimeDetails()
	// dotenv
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	// instantiate gin server
	r := gin.New()
	// middleware
	r.Use(gin.Recovery())                        // use default recovery
	r.Use(gin.LoggerWithFormatter(prettyLogger)) // use custom logger
	// add router
	index.Routes(r) // index router
	// serve html page (SPA)
	r.LoadHTMLFiles("client/build/index.html")
	r.NoRoute(func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"title": "Gin Example",
		})
	})

	// server config
	port := os.Getenv("PORT")
	log.Println("port:", port)
	// start server
	r.Run() // 0.0.0.0:8080 (unless PORT in .env)
}

// ---
// runtime details
// ---

func getRuntimeDetails() {
	// get runtime details (string slice)
	details := []string{
		fmt.Sprintf("os: %v", runtime.GOOS),
		fmt.Sprintf("arch: %v", runtime.GOARCH),
		fmt.Sprintf("CPUs: %v", runtime.NumCPU()),
		fmt.Sprintf("GR: %v", runtime.NumGoroutine()),
		fmt.Sprintf("v: %v", runtime.Version()),
	}
	// print each detail (for loop)
	for _, d := range details {
		log.Print(d)
	}
}

// ---
// formatted logger
// ---

type formattedLogEntry struct {
	Method   string `json:"method"`
	Path     string `json:"path"`
	Status   int    `json:"status"`
	Duration string `json:"duration"`
	Time     string `json:"time"`
	Error    string `json:"error"`
}

func prettyLogger(param gin.LogFormatterParams) string {
	// pretty json
	entry, _ := json.MarshalIndent(formattedLogEntry{
		param.Method,
		param.Path,
		param.StatusCode,
		fmt.Sprintf("%s", param.Latency),
		param.TimeStamp.Format(time.RFC1123),
		param.ErrorMessage,
	}, "", "  ")
	// return entry
	return fmt.Sprintf("%s\n\n", entry)
}

// gin docs -- https://github.com/gin-gonic/gin

// ---
// gin default instance
// ---

/*
r := gin.Default() // gin instance with logger and recovery
*/

// ---
// todo
// ---

// serve file -- https://github.com/gin-gonic/gin#serving-static-files
// handle file -- https://github.com/gin-gonic/gin#upload-files
// post
// serve data from file -- https://github.com/gin-gonic/gin#serving-static-files
// grouping routes -- https://github.com/gin-gonic/gin#grouping-routes
