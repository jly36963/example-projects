from ariadne import make_executable_schema, load_schema_from_path
from src.graphql.resolvers import query, mutation

# resolvers
resolvers = [query, mutation]

# type schemas (from single file)
type_defs = load_schema_from_path(
    "./src/graphql/schema.graphql"
)

# executable schema
schema = make_executable_schema(type_defs, *resolvers)
