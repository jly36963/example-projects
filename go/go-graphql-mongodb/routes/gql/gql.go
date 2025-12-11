package gql

import (
	"github.com/gin-gonic/gin"
	"github.com/graphql-go/graphql"
	"github.com/graphql-go/handler"

	"go-graphql-example/providers"
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

// getSchemaWithProviders
func getSchemaWithProviders(providers *providers.Providers) graphql.Schema {
	// resolver
	resolver = Resolver{providers: providers}
	// Schema -- graphql schema
	Schema, _ := graphql.NewSchema(graphql.SchemaConfig{
		Query:    rootQuery,
		Mutation: rootMutation,
	})
	return Schema
}

// Graphql handler
func graphqlHandler(providers *providers.Providers) gin.HandlerFunc {
	// inject providers
	Schema := getSchemaWithProviders(providers)
	h := handler.New(&handler.Config{
		Schema: &Schema,
		Pretty: true,
	})
	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}

// Playground handler
func playgroundHandler(providers *providers.Providers) gin.HandlerFunc {
	// inject providers
	Schema := getSchemaWithProviders(providers)
	h := handler.New(&handler.Config{
		Schema:     &Schema,
		Pretty:     true,
		GraphiQL:   false,
		Playground: true,
	})
	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}
