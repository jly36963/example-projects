package main

import (
	"errors"
	"fiber-squirrel-example/types"
	"fmt"

	resty "github.com/go-resty/resty/v2"
)

func main() {
	baseUrl := "http://127.0.0.1:5000/api"

	client := resty.New()

	// create ninja
	res, err := client.R().
		EnableTrace().
		SetBody(types.NinjaNew{
			FirstName: "Kakashi",
			LastName:  "Hatake",
			Age:       27,
		}).
		SetResult(types.Ninja{}).
		Post(baseUrl + "/ninja/")
	if err != nil {
		panic(err)
	}
	status := res.StatusCode()
	if status >= 400 {
		panic(errors.New("error returned from server"))
	}
	ninja := res.Result().(*types.Ninja)
	fmt.Println("Create ninja")
	fmt.Printf("%+v\n", ninja)

	// select ninja
	res, err = client.R().
		EnableTrace().
		SetResult(types.Ninja{}).
		Get(baseUrl + "/ninja/" + ninja.ID + "/")
	if err != nil {
		panic(err)
	}
	status = res.StatusCode()
	if status >= 400 {
		panic(errors.New("error returned from server"))
	}
	ninja = res.Result().(*types.Ninja)
	fmt.Println("Select ninja")
	fmt.Printf("%+v\n", ninja)

	// update ninja
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
	fmt.Printf("%+v\n", ninja)

	// create jutsu
	res, err = client.R().
		EnableTrace().
		SetBody(types.JutsuNew{
			Name:         "Chidori",
			ChakraNature: "Lightning",
			Description:  "Plover / a thousand birds",
		}).
		SetResult(types.Jutsu{}).
		Post(baseUrl + "/jutsu/")
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
	fmt.Printf("%+v\n", jutsu)

	// select jutsu
	res, err = client.R().
		EnableTrace().
		SetResult(types.Jutsu{}).
		Get(baseUrl + "/jutsu/" + jutsu.ID + "/")
	if err != nil {
		panic(err)
	}
	status = res.StatusCode()
	if status >= 400 {
		panic(errors.New("error returned from server"))
	}
	jutsu = res.Result().(*types.Jutsu)
	fmt.Println("Select jutsu")
	fmt.Printf("%+v\n", jutsu)

	// update jutsu
	res, err = client.R().
		EnableTrace().
		SetResult(types.Jutsu{}).
		SetBody(types.JutsuNew{
			Description: "Lightning blade",
		}).
		Put(baseUrl + "/jutsu/" + jutsu.ID + "/")
	if err != nil {
		panic(err)
	}
	status = res.StatusCode()
	if status >= 400 {
		panic(errors.New("error returned from server"))
	}
	jutsu = res.Result().(*types.Jutsu)
	fmt.Println("Update jutsu")
	fmt.Printf("%+v\n", jutsu)

	// associate ninja & jutsu
	_, err = client.R().
		EnableTrace().
		Post(baseUrl + "/ninja-jutsu/" + ninja.ID + "/" + jutsu.ID + "/")
	if err != nil {
		panic(err)
	}
	status = res.StatusCode()
	if status >= 400 {
		panic(errors.New("error returned from server"))
	}
	fmt.Println("Associate ninja & jutsu: ok")

	// select ninja with jutsus
	res, err = client.R().
		EnableTrace().
		SetResult(types.Ninja{}).
		Get(baseUrl + "/ninja/" + ninja.ID + "/jutsus/")
	if err != nil {
		panic(err)
	}
	status = res.StatusCode()
	if status >= 400 {
		panic(errors.New("error returned from server"))
	}
	ninja = res.Result().(*types.Ninja)
	fmt.Println("Select ninja with jutsus")
	fmt.Printf("%+v\n", ninja)

	// dissociate ninja & jutsu
	_, err = client.R().
		EnableTrace().
		Delete(baseUrl + "/ninja-jutsu/" + ninja.ID + "/" + jutsu.ID + "/")
	if err != nil {
		panic(err)
	}
	status = res.StatusCode()
	if status >= 400 {
		panic(errors.New("error returned from server"))
	}
	fmt.Println("Dissociate ninja & jutsu: ok")

	// select ninja with jutsus (post dissociation)
	res, err = client.R().
		EnableTrace().
		SetResult(types.Ninja{}).
		Get(baseUrl + "/ninja/" + ninja.ID + "/jutsus/")
	if err != nil {
		panic(err)
	}
	status = res.StatusCode()
	if status >= 400 {
		panic(errors.New("error returned from server"))
	}
	ninja = res.Result().(*types.Ninja)
	fmt.Println("Select ninja with jutsus (post dissociation)")
	fmt.Printf("%+v\n", ninja)

	// delete ninja
	res, err = client.R().
		EnableTrace().
		SetResult(types.Ninja{}).
		Delete(baseUrl + "/ninja/" + ninja.ID + "/")
	if err != nil {
		panic(err)
	}
	status = res.StatusCode()
	if status >= 400 {
		panic(errors.New("error returned from server"))
	}
	ninja = res.Result().(*types.Ninja)
	fmt.Println("Delete ninja")
	fmt.Printf("%+v\n", ninja)

	// select jutsu
	res, err = client.R().
		EnableTrace().
		SetResult(types.Jutsu{}).
		Delete(baseUrl + "/jutsu/" + jutsu.ID + "/")
	if err != nil {
		panic(err)
	}
	status = res.StatusCode()
	if status >= 400 {
		panic(errors.New("error returned from server"))
	}
	jutsu = res.Result().(*types.Jutsu)
	fmt.Println("Delete jutsu")
	fmt.Printf("%+v\n", jutsu)

}
