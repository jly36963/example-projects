package gql

import (
	"github.com/graphql-go/graphql"
)

var ninjaType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Ninja",
	Fields: graphql.FieldsThunk(func() graphql.Fields {
		return graphql.Fields{
			"id": &graphql.Field{
				Type: graphql.ID,
			},
			"firstName": &graphql.Field{
				Type: graphql.String,
			},
			"lastName": &graphql.Field{
				Type: graphql.String,
			},
		}
	}),
})

var ninjaWithRelatedJutsuType = graphql.NewObject(graphql.ObjectConfig{
	Name: "NinjaWithRelatedJutsu",
	Fields: graphql.FieldsThunk(func() graphql.Fields {
		return graphql.Fields{
			"id": &graphql.Field{
				Type: graphql.ID,
			},
			"firstName": &graphql.Field{
				Type: graphql.String,
			},
			"lastName": &graphql.Field{
				Type: graphql.String,
			},
			"jutsus": &graphql.Field{
				Type: graphql.NewList(jutsuType),
			},
		}
	}),
})

var ninjaNewInput = graphql.NewInputObject(
	graphql.InputObjectConfig{
		Name: "NinjaNew",
		Fields: graphql.InputObjectConfigFieldMap{
			"firstName": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"lastName": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
	},
)

var ninjaUpdatesInput = graphql.NewInputObject(
	graphql.InputObjectConfig{
		Name: "NinjaUpdates",
		Fields: graphql.InputObjectConfigFieldMap{
			"firstName": &graphql.InputObjectFieldConfig{
				Type: graphql.String,
			},
			"lastName": &graphql.InputObjectFieldConfig{
				Type: graphql.String,
			},
		},
	},
)

var jutsuType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Jutsu",
	Fields: graphql.FieldsThunk(func() graphql.Fields {
		return graphql.Fields{
			"id": &graphql.Field{
				Type: graphql.ID,
			},
			"name": &graphql.Field{
				Type: graphql.String,
			},
			"chakraNature": &graphql.Field{
				Type: graphql.String,
			},
			"description": &graphql.Field{
				Type: graphql.String,
			},
		}
	}),
})

var jutsuWithRelatedNinjaType = graphql.NewObject(graphql.ObjectConfig{
	Name: "JutsuWithRelatedNinja",
	Fields: graphql.FieldsThunk(func() graphql.Fields {
		return graphql.Fields{
			"id": &graphql.Field{
				Type: graphql.ID,
			},
			"name": &graphql.Field{
				Type: graphql.String,
			},
			"chakraNature": &graphql.Field{
				Type: graphql.String,
			},
			"description": &graphql.Field{
				Type: graphql.String,
			},
			"ninjas": &graphql.Field{
				Type: graphql.NewList(ninjaType),
			},
		}
	}),
})

var jutsuNewInput = graphql.NewInputObject(
	graphql.InputObjectConfig{
		Name: "JutsuNew",
		Fields: graphql.InputObjectConfigFieldMap{
			"name": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"chakraNature": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"description": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
	},
)

var jutsuUpdatesInput = graphql.NewInputObject(
	graphql.InputObjectConfig{
		Name: "JutsuUpdates",
		Fields: graphql.InputObjectConfigFieldMap{
			"name": &graphql.InputObjectFieldConfig{
				Type: graphql.String,
			},
			"chakraNature": &graphql.InputObjectFieldConfig{
				Type: graphql.String,
			},
			"description": &graphql.InputObjectFieldConfig{
				Type: graphql.String,
			},
		},
	},
)
