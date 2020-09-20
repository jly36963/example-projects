# standard library
import sys
import os

# package imports
import uvicorn
from dotenv import load_dotenv  # python-dotenv
from quart import Quart, json, jsonify, request, Blueprint

# route imports
from routes.api.index import index_routes

# dotenv
load_dotenv()

# app
app = Quart(__name__)

# routes
app.register_blueprint(
    index_routes,
    url_prefix='/api'
)

@app.errorhandler(404)
def page_not_found(e):
    '''
    route -- *
    description -- 404
    access -- public
    '''
    # note that we set the 404 status explicitly
    return jsonify({"message": "Page not found"}), 404


# run
if __name__ == '__main__':
    dev = True
    if dev:
        app.run(debug=True, host='0.0.0.0', port=8000)
    else:
        uvicorn.run(app, host="0.0.0.0", port=8000)
