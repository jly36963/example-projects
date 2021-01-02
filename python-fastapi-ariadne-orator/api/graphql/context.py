from utils.pg import PostgresDAL

# instantiate pg_dal
pg_dal = PostgresDAL()


# function used by araiadne.asgi.GraphQL to create context
def get_context_value(request):
    return {
        'request': request,
        'pg_dal': pg_dal,
    }
