package providers

import (
	"echo-squirrel-example/dal/pg"
)

type Providers struct {
	PGDAL pg.IPostgresDAL
}

func SetupProviders() Providers {
	providers := Providers{
		PGDAL: &pg.PostgresDAL{},
	}
	providers.PGDAL.GetClient("postgresql://postgres:postgres@localhost:5432/practice")
	return providers
}
