package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"runtime"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"go-graphql-example/dal/mongodal"
	"go-graphql-example/middleware/logger"
	"go-graphql-example/providers"
	"go-graphql-example/routes/api"
	"go-graphql-example/routes/gql"
	"go-graphql-example/types"
)

// ---
// main
// ---

func main() {
	// runtime
	getRuntimeDetails()
	// load .env
	loadDotenv()
	// get providers
	providers := getProviders()
	// start server
	startServer(providers)

}

// ---
// helper func (dotenv)
// ---

func loadDotenv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

// ---
// providers
// ---

func getProviders() (p *providers.Providers) {
	p = &providers.Providers{
		MongoDAL: &mongodal.MongoDAL{},
	}
	// connect providers
	var err error
	err = p.MongoDAL.GetConnection()
	if err != nil {
		fmt.Println("error while getting connection")
		fmt.Println(err)
	}
	// return
	return
}

func startServer(providers *providers.Providers) {
	// instantiate gin server
	r := gin.New()

	// middleware
	r.Use(gin.Recovery())                               // use default recovery
	r.Use(gin.LoggerWithFormatter(logger.PrettyLogger)) // use custom logger

	// multipart memory threshold
	r.MaxMultipartMemory = 8 << 20 // 8 MiB (default is 32 MiB)

	// add api router
	api.Routes(r, providers) // index router
	// add graphql router
	gql.Routes(r, providers)
	// handle 404s or serve SPA
	r.LoadHTMLFiles("client/build/index.html")
	r.NoRoute(func(c *gin.Context) {
		// get path and determine if it is an api request
		path := c.Request.URL.Path
		isAPI := strings.HasPrefix(path, "/api")
		if isAPI {
			// unknown api route
			c.JSON(http.StatusNotFound, gin.H{"message": "Not found"})
		} else {
			// serve html page (SPA)
			c.HTML(http.StatusOK, "index.html", gin.H{
				"title": "Gin Example",
			})
		}
	})

	// server config
	port := os.Getenv("PORT")
	fmt.Println("port:", port)
	// start server
	r.Run() // 0.0.0.0:8080 (unless PORT in .env)
}

// ---
// helper func
// ---

func stringify(thing ...interface{}) (str string) {
	thingAsJSON, err := json.MarshalIndent(thing, "", "  ")
	if err != nil {
		str = "Invalid input, could not stringify"
		return
	}
	str = string(thingAsJSON)
	return
}

func bulkPrint(args ...interface{}) {
	for _, a := range args {
		fmt.Println(a)
		fmt.Println("")
	}
}

func printSectionTitle(title string) {
	fmt.Println("")
	fmt.Println(strings.ToUpper(title))
	fmt.Println("")
}

func getRuntimeDetails() {
	printSectionTitle("runtime")

	fmt.Printf("%+v\n", types.RuntimeDetails{
		Os:      runtime.GOOS,
		Arch:    runtime.GOARCH,
		CPUs:    runtime.NumCPU(),
		Version: runtime.Version(),
	})
}
