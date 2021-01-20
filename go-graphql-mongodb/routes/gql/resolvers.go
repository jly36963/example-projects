package gql

import (
	"fmt"
	"go-graphql-example/providers"
	"go-graphql-example/types"

	"github.com/graphql-go/graphql"
	"github.com/mitchellh/mapstructure"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Resolver -- struct with resolver methods and providers
type Resolver struct {
	providers *providers.Providers
}

var resolver Resolver

func (r *Resolver) resolveHello(p graphql.ResolveParams) (interface{}, error) {
	res := "Hello friend!"
	return res, nil
}

func (r *Resolver) resolveNinja(p graphql.ResolveParams) (interface{}, error) {
	id, _ := p.Args["id"].(string)
	_id, _ := primitive.ObjectIDFromHex(id)

	ninja, err := r.providers.MongoDAL.GetNinja(_id)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	return ninja, nil
}
func (r *Resolver) resolveNinjaWithRelatedJutsu(p graphql.ResolveParams) (interface{}, error) {
	id, _ := p.Args["id"].(string)
	_id, _ := primitive.ObjectIDFromHex(id)

	ninja, err := r.providers.MongoDAL.GetNinjaWithRelatedJutsu(_id)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	return ninja, nil
}

func (r *Resolver) resolveJutsu(p graphql.ResolveParams) (interface{}, error) {
	id, _ := p.Args["id"].(string)
	_id, _ := primitive.ObjectIDFromHex(id)

	jutsu, err := r.providers.MongoDAL.GetJutsu(_id)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	return jutsu, nil
}
func (r *Resolver) resolveJutsuWithRelatedNinja(p graphql.ResolveParams) (interface{}, error) {
	id, _ := p.Args["id"].(string)
	_id, _ := primitive.ObjectIDFromHex(id)

	jutsu, err := r.providers.MongoDAL.GetJutsuWithRelatedNinja(_id)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	return jutsu, nil
}

// mutation resolvers

func (r *Resolver) resolveInsertNinja(p graphql.ResolveParams) (interface{}, error) {
	ninjaMap := p.Args["ninja"].(map[string]interface{})
	var ninja types.Ninja
	err := mapstructure.Decode(ninjaMap, &ninja)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	insertedNinja, err := r.providers.MongoDAL.InsertNinja(ninja)
	if err != nil {
		return nil, err
	}
	return insertedNinja, nil
}

func (r *Resolver) resolveUpdateNinja(p graphql.ResolveParams) (interface{}, error) {
	// id
	id, _ := p.Args["id"].(string)
	_id, _ := primitive.ObjectIDFromHex(id)
	// updates
	ninjaUpdatesMap := p.Args["updates"].(map[string]interface{})
	var ninjaUpdates types.Ninja
	err := mapstructure.Decode(ninjaUpdatesMap, &ninjaUpdates)
	updatedNinja, err := r.providers.MongoDAL.UpdateNinja(_id, ninjaUpdates)
	if err != nil {
		return nil, err
	}
	return updatedNinja, nil
}

func (r *Resolver) resolveDeleteNinja(p graphql.ResolveParams) (interface{}, error) {
	// TODO -- delete ninja
	id, _ := p.Args["id"].(primitive.ObjectID)
	ninja := types.Ninja{
		ID:        id,
		FirstName: "Kakashi",
		LastName:  "Hatake",
	}
	return ninja, nil
}

func (r *Resolver) resolveInsertJutsu(p graphql.ResolveParams) (interface{}, error) {
	jutsuMap := p.Args["jutsu"].(map[string]interface{})
	var jutsu types.Jutsu
	err := mapstructure.Decode(jutsuMap, &jutsu)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	insertedJutsu, err := r.providers.MongoDAL.InsertJutsu(jutsu)
	if err != nil {
		return nil, err
	}
	return insertedJutsu, nil
}

func (r *Resolver) resolveUpdateJutsu(p graphql.ResolveParams) (interface{}, error) {
	// id
	id, _ := p.Args["id"].(string)
	_id, _ := primitive.ObjectIDFromHex(id)
	fmt.Println(_id)
	// updates
	jutsuUpdatesMap := p.Args["updates"].(map[string]interface{})
	var jutsuUpdates types.Jutsu
	err := mapstructure.Decode(jutsuUpdatesMap, &jutsuUpdates)
	updatedJutsu, err := r.providers.MongoDAL.UpdateJutsu(_id, jutsuUpdates)
	if err != nil {
		return nil, err
	}
	return updatedJutsu, nil
}

func (r *Resolver) resolveDeleteJutsu(p graphql.ResolveParams) (interface{}, error) {
	id, _ := p.Args["id"].(string)
	_id, _ := primitive.ObjectIDFromHex(id)

	jutsu, err := r.providers.MongoDAL.DeleteJutsu(_id)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	return jutsu, nil
}

func (r *Resolver) resolveAddKnownJutsu(p graphql.ResolveParams) (interface{}, error) {
	// ids
	ninjaID, _ := p.Args["ninjaId"].(string)
	jutsuID, _ := p.Args["jutsuId"].(string)
	_ninjaID, _ := primitive.ObjectIDFromHex(ninjaID)
	_jutsuID, _ := primitive.ObjectIDFromHex(jutsuID)
	// add association
	_, err := r.providers.MongoDAL.AddKnownJutsu(_ninjaID, _jutsuID)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	// fetch related
	ninja, err := r.providers.MongoDAL.GetNinjaWithRelatedJutsu(_ninjaID)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	return ninja, nil
}

func (r *Resolver) resolveRemoveKnownJutsu(p graphql.ResolveParams) (interface{}, error) {
	// ids
	ninjaID, _ := p.Args["ninjaId"].(string)
	jutsuID, _ := p.Args["jutsuId"].(string)
	_ninjaID, _ := primitive.ObjectIDFromHex(ninjaID)
	_jutsuID, _ := primitive.ObjectIDFromHex(jutsuID)
	// add association
	_, err := r.providers.MongoDAL.RemoveKnownJutsu(_ninjaID, _jutsuID)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	// fetch related
	ninja, err := r.providers.MongoDAL.GetNinjaWithRelatedJutsu(_ninjaID)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	return ninja, nil
}
