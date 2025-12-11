package model

// Jutsu -- graphql type
type Jutsu struct {
	ID           int    `json:"id"`
	Name         string `json:"name"`
	ChakraNature string `json:"chakra_nature"`
	Description  string `json:"description"`
}

// JutsuNew -- graphql input
type JutsuNew struct {
	Name         string  `json:"name"`
	ChakraNature string  `json:"chakra_nature"`
	Description  *string `json:"description"`
}

// JutsuUpdates -- graphql input
type JutsuUpdates struct {
	Name         *string `json:"name"`
	ChakraNature *string `json:"chakra_nature"`
	Description  *string `json:"description"`
}

// Ninja -- graphql type
type Ninja struct {
	ID        int      `json:"id"`
	FirstName string   `json:"first_name"`
	LastName  string   `json:"last_name"`
	Jutsus    []*Jutsu `json:"jutsus"`
}

// NinjaNew -- graphql input
type NinjaNew struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

// NinjaUpdates -- graphql input
type NinjaUpdates struct {
	FirstName *string `json:"first_name"`
	LastName  *string `json:"last_name"`
}
