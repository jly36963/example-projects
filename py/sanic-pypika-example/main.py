import os
from sanic import Sanic
from src.api.utils.utils import custom_serializer
from src.api.ninja import ninja
from src.api.jutsu import jutsu
from src.db.providers import attach_providers

# Env
dev = os.getenv('PYTHON_ENV') != 'production'

# App
app = Sanic("ninjas_and_jutsus", dumps=custom_serializer)

# Providers
app.register_listener(attach_providers, "before_server_start")

# Routers
app.blueprint(ninja.router)
app.blueprint(jutsu.router)

# Start server
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, auto_reload=dev)
