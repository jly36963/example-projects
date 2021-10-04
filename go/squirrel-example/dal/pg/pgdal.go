package pg

import (
	"context"
	"database/sql"
	"squirrel-example/types"
	"time"

	sq "github.com/Masterminds/squirrel"
	pgx "github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/pgxpool"
)

// ---
// dal
// ---

type IPostgresDAL interface {
	GetClient(s string)

	// ninjas
	CreateNinja(ninjaNew types.NinjaNew) (types.Ninja, error)
	GetNinja(ninjaId string) (types.Ninja, error)

	// TODO: update ninja
	// TODO: delete ninja

	// jutsus
	// TODO: create jutsu
	// TODO: select jutsu
	// TODO: update jutsu
	// TODO: delete jutsu

	// ninjas_jutsus
	// TODO: create ninja_jutsu
	// TODO: delete ninja_jutsu
}

type PostgresDAL struct {
	client *pgxpool.Pool
}

// GetClient gets a client to the postgres database
func (dal *PostgresDAL) GetClient(connString string) {
	pool, err := pgxpool.Connect(context.Background(), connString)
	if err != nil {
		panic("Could not connect to postgres database")
	}
	dal.client = pool
}

// GetQB gets a squirrel query builder (statement builder)
func (dal *PostgresDAL) GetQB() sq.StatementBuilderType {
	return sq.StatementBuilder
}

func (dal *PostgresDAL) ExecuteRaw(query string, args ...interface{}) (pgx.Rows, error) {
	return dal.client.Query(context.Background(), query, args)
}

// ExecuteSelect takes a select statement query builder and executes it
func (dal *PostgresDAL) ExecuteSelectMany(sb sq.SelectBuilder) (pgx.Rows, error) {
	// convert ? to $1 (postgres specific)
	sb = sb.PlaceholderFormat(sq.Dollar)
	// get query and args from query builder
	query, args, err := sb.ToSql()
	if err != nil {
		return nil, err
	}
	// execute query
	return dal.client.Query(context.Background(), query, args...)
}

// ExecuteSelect takes a select statement query builder and executes it
func (dal *PostgresDAL) ExecuteSelect(sb sq.SelectBuilder) (pgx.Row, error) {
	// convert ? to $1 (postgres specific)
	sb = sb.PlaceholderFormat(sq.Dollar)
	// get query and args from query builder
	query, args, err := sb.ToSql()
	if err != nil {
		return nil, err
	}
	// execute query
	return dal.client.QueryRow(context.Background(), query, args...), nil
}

// ExecuteInsert takes a select statement query builder and executes it
func (dal *PostgresDAL) ExecuteInsert(ib sq.InsertBuilder) (pgx.Row, error) {
	// convert ? to $1 (postgres specific)
	ib = ib.PlaceholderFormat(sq.Dollar)
	// get query and args from query builder
	query, args, err := ib.ToSql()
	if err != nil {
		return nil, err
	}
	// execute query
	return dal.client.QueryRow(context.Background(), query, args...), nil
}

// ---
// convert
// ---

func (dal *PostgresDAL) rowToNinja(row pgx.Row) (types.Ninja, error) {
	var id string
	var firstName string
	var lastName string
	var age int64
	var createdAt time.Time
	var updatedAt sql.NullTime

	if err := row.Scan(&id, &firstName, &lastName, &age, &createdAt, &updatedAt); err != nil {
		return types.Ninja{}, err
	}

	ninja := types.Ninja{
		ID:        id,
		FirstName: firstName,
		LastName:  lastName,
		Age:       age,
		CreatedAt: createdAt,
	}

	if updatedAt.Valid {
		ninja.UpdatedAt = updatedAt.Time
	}

	return ninja, nil
}

// ---
// ninjas
// ---

func (dal *PostgresDAL) CreateNinja(ninjaNew types.NinjaNew) (types.Ninja, error) {
	qb := dal.GetQB()
	ib := qb.
		Insert("ninjas").
		Columns("first_name", "last_name", "age").
		Values(ninjaNew.FirstName, ninjaNew.LastName, ninjaNew.Age).
		Suffix("RETURNING *")
	row, err := dal.ExecuteInsert(ib)

	if err != nil {
		return types.Ninja{}, err
	}

	ninja, err := dal.rowToNinja(row)

	return ninja, err
}

func (dal *PostgresDAL) GetNinja(ninjaId string) (types.Ninja, error) {
	qb := dal.GetQB()
	sb := qb.
		Select("*").
		From("ninjas").
		Where(sq.Eq{"id": ninjaId})
	row, err := dal.ExecuteSelect(sb)

	if err != nil {
		return types.Ninja{}, err
	}

	ninja, err := dal.rowToNinja(row)

	return ninja, err
}

// ---
// jutsus
// ---

// TODO

// ---
// ninjas_jutsus
// ---

// TODO
