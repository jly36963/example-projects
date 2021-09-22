package graph

//go:generate go run github.com/99designs/gqlgen

import (
	"context"
	"fmt"
	"go-gqlgen-pg-gin/graph/generated"
	"go-gqlgen-pg-gin/graph/model"
	"go-gqlgen-pg-gin/providers"
	"go-gqlgen-pg-gin/types"

	"github.com/jinzhu/copier"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

// ---
// resolver
// ---

// Resolver -- used in resolver functions
type Resolver struct {
	Providers *providers.Providers
}

var resolver Resolver

// ---
// query/mutation resolvers
// ---

// implementation of QueryResolver interface
type queryResolver struct{ *Resolver }

// implementation of MutationResolver interface
type mutationResolver struct{ *Resolver }

// Mutation -- create graphql mutation resolver
func (r *Resolver) Mutation() generated.MutationResolver {
	return &mutationResolver{r}
}

// Query -- create graphql query resolver
func (r *Resolver) Query() generated.QueryResolver {
	return &queryResolver{r}
}

// ---
// query resolver functions
// ---

func (r *queryResolver) Hello(ctx context.Context) (string, error) {
	res := "Hello friend!"
	return res, nil
}

func (r *queryResolver) Ninja(ctx context.Context, id int) (*model.Ninja, error) {
	ninja, err := r.Providers.PGDAL.GetNinjaWithRelatedJutsu(id)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	var modelNinja model.Ninja
	copier.Copy(&modelNinja, &ninja)
	return &modelNinja, nil
}

func (r *queryResolver) Jutsu(ctx context.Context, id int) (*model.Jutsu, error) {
	jutsu, err := r.Providers.PGDAL.GetJutsuWithRelatedNinja(id)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	var modelJutsu model.Jutsu
	copier.Copy(&modelJutsu, &jutsu)
	return &modelJutsu, nil
}

// ---
// mutation resolver functions
// ---

func (r *mutationResolver) InsertNinja(ctx context.Context, ninja model.NinjaNew) (*model.Ninja, error) {
	var typeNinja types.Ninja
	copier.Copy(&typeNinja, &ninja)
	insertedNinja, err := r.Providers.PGDAL.InsertNinja(typeNinja)
	if err != nil {
		return nil, err
	}
	var modelNinja model.Ninja
	copier.Copy(&modelNinja, &insertedNinja)
	return &modelNinja, nil
}

func (r *mutationResolver) UpdateNinja(ctx context.Context, id int, updates *model.NinjaUpdates) (*model.Ninja, error) {
	var typeNinja types.Ninja
	copier.Copy(&typeNinja, &updates)
	updatedNinja, err := r.Providers.PGDAL.UpdateNinja(id, typeNinja)
	if err != nil {
		return nil, err
	}
	var modelNinja model.Ninja
	copier.Copy(&modelNinja, &updatedNinja)
	return &modelNinja, nil
}

func (r *mutationResolver) DeleteNinja(ctx context.Context, id int) (*model.Ninja, error) {
	// TODO -- get ninja first (so it can be returned)
	deletedNinja, err := r.Providers.PGDAL.DeleteNinja(id)
	if err != nil {
		return nil, err
	}
	var modelNinja model.Ninja
	copier.Copy(&modelNinja, &deletedNinja)
	return &modelNinja, nil
}

func (r *mutationResolver) InsertJutsu(ctx context.Context, jutsu model.JutsuNew) (*model.Jutsu, error) {
	var typeJutsu types.Jutsu
	copier.Copy(&typeJutsu, &jutsu)
	insertedJutsu, err := r.Providers.PGDAL.InsertJutsu(typeJutsu)
	if err != nil {
		return nil, err
	}
	var modelJutsu model.Jutsu
	copier.Copy(&modelJutsu, &insertedJutsu)
	return &modelJutsu, nil
}

func (r *mutationResolver) UpdateJutsu(ctx context.Context, id int, jutsuUpdates *model.JutsuUpdates) (*model.Jutsu, error) {
	var jutsu types.Jutsu
	copier.Copy(&jutsu, &jutsuUpdates)
	updatedJutsu, err := r.Providers.PGDAL.UpdateJutsu(id, jutsu)
	if err != nil {
		return nil, err
	}
	var modelJutsu model.Jutsu
	copier.Copy(&modelJutsu, &updatedJutsu)
	return &modelJutsu, nil
}

func (r *mutationResolver) DeleteJutsu(ctx context.Context, id int) (*model.Jutsu, error) {
	// TODO -- get jutsu first (so it can be returned)
	deletedJutsu, err := r.Providers.PGDAL.DeleteJutsu(id)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	var modelJutsu model.Jutsu
	copier.Copy(&modelJutsu, &deletedJutsu)
	return &modelJutsu, nil
}

func (r *mutationResolver) AddKnownJutsu(ctx context.Context, ninjaID int, jutsuID int) (*model.Ninja, error) {
	// add association
	_, err := r.Providers.PGDAL.AddKnownJutsu(ninjaID, jutsuID)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	// fetch related
	ninja, err := r.Providers.PGDAL.GetNinjaWithRelatedJutsu(ninjaID)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	var modelNinja model.Ninja
	copier.Copy(&modelNinja, &ninja)
	return &modelNinja, nil
}

func (r *mutationResolver) RemoveKnownJutsu(ctx context.Context, ninjaID int, jutsuID int) (*model.Ninja, error) {
	// add association
	_, err := r.Providers.PGDAL.RemoveKnownJutsu(ninjaID, jutsuID)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	// fetch related
	ninja, err := r.Providers.PGDAL.GetNinjaWithRelatedJutsu(ninjaID)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	var modelNinja model.Ninja
	copier.Copy(&modelNinja, &ninja)
	return &modelNinja, nil
}
