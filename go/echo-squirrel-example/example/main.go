package main

import (
	"encoding/json"
	"errors"
	"fiber-squirrel-example/types"
	"fmt"

	resty "github.com/go-resty/resty/v2"
)

func main() {
	baseUrl := "http://127.0.0.1:5000/api"

	client := resty.New()

	// Create ninja
	res, err := client.R().
		EnableTrace().
		SetBody(types.NinjaNew{
			FirstName: "Kakashi",
			LastName:  "Hatake",
			Age:       27,
		}).
		SetResult(types.Ninja{}).
		Post(baseUrl + "/ninja")
	if err != nil {
		panic(err)
	}
	status := res.StatusCode()
	if status >= 400 {
		panic(errors.New("error returned from server"))
	}
	ninja := res.Result().(*types.Ninja)
	fmt.Println("Create ninja")
	prettyPrint(ninja)

	// Select ninja
	res, err = client.R().
		EnableTrace().
		SetResult(types.Ninja{}).
		Get(baseUrl + "/ninja/" + ninja.ID)
	if err != nil {
		panic(err)
	}
	status = res.StatusCode()
	if status >= 400 {
		panic(errors.New("error returned from server"))
	}
	ninja = res.Result().(*types.Ninja)
	fmt.Println("Select ninja")
	prettyPrint(ninja)

	// Update ninja
	res, err = client.R().
		EnableTrace().
		SetBody(types.NinjaNew{
			FirstName: "Kaka",
			LastName:  "Sensei",
		}).
		SetResult(types.Ninja{}).
		Put(baseUrl + "/ninja/" + ninja.ID)
	if err != nil {
		panic(err)
	}
	status = res.StatusCode()
	if status >= 400 {
		panic(errors.New("error returned from server"))
	}
	ninja = res.Result().(*types.Ninja)
	fmt.Println("Update ninja")
	prettyPrint(ninja)

	// Create jutsu
	res, err = client.R().
		EnableTrace().
		SetBody(types.JutsuNew{
			Name:         "Chidori",
			ChakraNature: "Lightning",
			Description:  "Plover / a thousand birds",
		}).
		SetResult(types.Jutsu{}).
		Post(baseUrl + "/jutsu")
	if err != nil {
		panic(err)
	}
	status = res.StatusCode()
	fmt.Println(status)
	if status >= 400 {
		panic(errors.New("error returned from server"))
	}
	jutsu := res.Result().(*types.Jutsu)
	fmt.Println("Create jutsu")
	prettyPrint(jutsu)

	// Select jutsu
	res, err = client.R().
		EnableTrace().
		SetResult(types.Jutsu{}).
		Get(baseUrl + "/jutsu/" + jutsu.ID)
	if err != nil {
		panic(err)
	}
	status = res.StatusCode()
	if status >= 400 {
		panic(errors.New("error returned from server"))
	}
	jutsu = res.Result().(*types.Jutsu)
	fmt.Println("Select jutsu")
	prettyPrint(jutsu)

	// Update jutsu
	res, err = client.R().
		EnableTrace().
		SetResult(types.Jutsu{}).
		SetBody(types.JutsuNew{
			Description: "Lightning blade",
		}).
		Put(baseUrl + "/jutsu/" + jutsu.ID)
	if err != nil {
		panic(err)
	}
	status = res.StatusCode()
	if status >= 400 {
		panic(errors.New("error returned from server"))
	}
	jutsu = res.Result().(*types.Jutsu)
	fmt.Println("Update jutsu")
	prettyPrint(jutsu)

	// Associate ninja & jutsu
	res, err = client.R().
		EnableTrace().
		Post(baseUrl + "/ninja-jutsu/" + ninja.ID + "/" + jutsu.ID)
	if err != nil {
		panic(err)
	}
	status = res.StatusCode()
	if status >= 400 {
		panic(errors.New("error returned from server"))
	}
	fmt.Println("Associate ninja & jutsu: ok")

	// Select ninja with jutsus
	res, err = client.R().
		EnableTrace().
		SetResult(types.Ninja{}).
		Get(baseUrl + "/ninja/" + ninja.ID + "/jutsus")
	if err != nil {
		panic(err)
	}
	status = res.StatusCode()
	if status >= 400 {
		panic(errors.New("error returned from server"))
	}
	ninja = res.Result().(*types.Ninja)
	fmt.Println("Select ninja with jutsus")
	prettyPrint(ninja)

	// Dissociate ninja & jutsu
	res, err = client.R().
		EnableTrace().
		Delete(baseUrl + "/ninja-jutsu/" + ninja.ID + "/" + jutsu.ID)
	if err != nil {
		panic(err)
	}
	status = res.StatusCode()
	if status >= 400 {
		fmt.Println(status)
		panic(errors.New("error returned from server"))
	}
	fmt.Println("Dissociate ninja & jutsu: ok")

	// Select ninja with jutsus (post dissociation)
	res, err = client.R().
		EnableTrace().
		SetResult(types.Ninja{}).
		Get(baseUrl + "/ninja/" + ninja.ID + "/jutsus")
	if err != nil {
		panic(err)
	}
	status = res.StatusCode()
	if status >= 400 {
		panic(errors.New("error returned from server"))
	}
	ninja = res.Result().(*types.Ninja)
	fmt.Println("Select ninja with jutsus (post dissociation)")
	prettyPrint(ninja)

	// Delete ninja
	res, err = client.R().
		EnableTrace().
		SetResult(types.Ninja{}).
		Delete(baseUrl + "/ninja/" + ninja.ID)
	if err != nil {
		panic(err)
	}
	status = res.StatusCode()
	if status >= 400 {
		panic(errors.New("error returned from server"))
	}
	ninja = res.Result().(*types.Ninja)
	fmt.Println("Delete ninja")
	prettyPrint(ninja)

	// Delete jutsu
	res, err = client.R().
		EnableTrace().
		SetResult(types.Jutsu{}).
		Delete(baseUrl + "/jutsu/" + jutsu.ID)
	if err != nil {
		panic(err)
	}
	status = res.StatusCode()
	if status >= 400 {
		panic(errors.New("error returned from server"))
	}
	jutsu = res.Result().(*types.Jutsu)
	fmt.Println("Delete jutsu")
	prettyPrint(jutsu)
}

// prettyPrint prints a json-compatible value
func prettyPrint(item interface{}) {
	b, _ := json.MarshalIndent(item, "", "  ")
	fmt.Println(string(b))
}
