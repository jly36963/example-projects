# standard library
import json
# package imports
from ariadne import QueryType, make_executable_schema, load_schema_from_path
# graphql resolvers
from api.graphql.resolvers import query, mutation


# resolvers
resolvers = [query, mutation]

# type schemas (from single file)
type_defs = load_schema_from_path(
    "./api/graphql/schema.graphql"
)

# executable schema
schema = make_executable_schema(type_defs, *resolvers)
