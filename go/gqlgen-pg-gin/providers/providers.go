package providers

import "go-gqlgen-pg-gin/dal/pgdal"

// Providers -- context/dependencies
type Providers struct {
	PGDAL pgdal.IPGDAL
}
