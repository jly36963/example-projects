package gql

import (
	"github.com/graphql-go/graphql"
)

// ---
// field properties
// ---

// type -- return type
// description -- description
// args -- input types
// resolve -- resolver function

// ---
// query
// ---

var rootQuery = graphql.NewObject(graphql.ObjectConfig{
	Name: "Query",
	Fields: graphql.Fields{
		"hello": &graphql.Field{
			Type:        graphql.String,
			Description: "Say hello",
			Resolve:     resolver.resolveHello,
		},
		"ninja": &graphql.Field{
			Type:        ninjaType,
			Description: "Get Ninja using id",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: resolver.resolveNinja,
		},
		"ninjaWithRelatedJutsu": &graphql.Field{
			Type:        ninjaWithRelatedJutsuType,
			Description: "Get Ninja using id (with jutsus)",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: resolver.resolveNinjaWithRelatedJutsu,
		},
		"jutsu": &graphql.Field{
			Type:        jutsuType,
			Description: "Get Jutsu using id",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: resolver.resolveJutsu,
		},
		"jutsuWithRelatedNinja": &graphql.Field{
			Type:        jutsuWithRelatedNinjaType,
			Description: "Get Jutsu using id (with ninjas)",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: resolver.resolveJutsuWithRelatedNinja,
		},
	},
})

// ---
// mutation
// ---

var rootMutation = graphql.NewObject(graphql.ObjectConfig{
	Name: "Mutation",
	Fields: graphql.Fields{
		"insertNinja": &graphql.Field{
			Type:        ninjaType,
			Description: "Insert new ninja, return ninja",
			Args: graphql.FieldConfigArgument{
				"ninja": &graphql.ArgumentConfig{
					Type: ninjaNewInput,
				},
			},
			Resolve: resolver.resolveInsertNinja,
		},
		"updateNinja": &graphql.Field{
			Type:        ninjaType,
			Description: "Update ninja with given id, return ninja",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
				"updates": &graphql.ArgumentConfig{
					Type: ninjaUpdatesInput,
				},
			},
			Resolve: resolver.resolveUpdateNinja,
		},
		"deleteNinja": &graphql.Field{
			Type:        ninjaType,
			Description: "Delete ninja with given id, return ninja",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: resolver.resolveDeleteNinja,
		},
		"insertJutsu": &graphql.Field{
			Type:        jutsuType,
			Description: "Insert new jutsu, return jutsu",
			Args: graphql.FieldConfigArgument{
				"jutsu": &graphql.ArgumentConfig{
					Type: jutsuNewInput,
				},
			},
			Resolve: resolver.resolveInsertJutsu,
		},
		"updateJutsu": &graphql.Field{
			Type:        jutsuType,
			Description: "Update jutsu with given id, return jutsu",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
				"updates": &graphql.ArgumentConfig{
					Type: jutsuUpdatesInput,
				},
			},
			Resolve: resolver.resolveUpdateJutsu,
		},
		"deleteJutsu": &graphql.Field{
			Type:        jutsuType,
			Description: "Delete jutsu with given id, return jutsu",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: resolver.resolveDeleteNinja,
		},
		"addKnownJutsu": &graphql.Field{
			Type:        ninjaWithRelatedJutsuType,
			Description: "Add association between ninja/jutsu",
			Args: graphql.FieldConfigArgument{
				"ninjaId": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
				"jutsuId": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: resolver.resolveAddKnownJutsu,
		},
		"removeKnownJutsu": &graphql.Field{
			Type:        ninjaWithRelatedJutsuType,
			Description: "Remove association between ninja/jutsu",
			Args: graphql.FieldConfigArgument{
				"ninjaId": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
				"jutsuId": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: resolver.resolveRemoveKnownJutsu,
		},
	},
})
