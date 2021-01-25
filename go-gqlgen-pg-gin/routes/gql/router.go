package gql

import (
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-gonic/gin"

	"go-gqlgen-pg-gin/graph"
	"go-gqlgen-pg-gin/graph/generated"
	"go-gqlgen-pg-gin/providers"
)

// Routes is a subrouter containing gin route handlers
func Routes(r *gin.Engine, providers *providers.Providers) {

	// subrouter (grouped routes)
	sr := r.Group("/graphql")
	{
		// graphql
		sr.POST("", graphqlHandler(providers))
		// graphiql playground
		sr.GET("", playgroundHandler(providers))

	}
}

// Graphql handler
func graphqlHandler(providers *providers.Providers) gin.HandlerFunc {
	resolver := &graph.Resolver{
		Providers: providers,
	}
	h := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: resolver}))
	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}

// Playground handler
func playgroundHandler(providers *providers.Providers) gin.HandlerFunc {
	h := playground.Handler("GraphQL", "/graphql")
	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}
