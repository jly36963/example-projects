from src.dal.pg import PostgresDAL

# instantiate pg_dal
pg_dal = PostgresDAL()


def get_context_value(request):
    """
    Function used by araiadne.asgi.GraphQL to create context
    """
    return {
        'request': request,
        'pg_dal': pg_dal,
    }
