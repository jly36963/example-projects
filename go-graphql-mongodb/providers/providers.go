package providers

import (
	"go-graphql-example/dal/mongodal"
)

// Providers -- context/dependencies
type Providers struct {
	MongoDAL mongodal.IMongoDAL
}
