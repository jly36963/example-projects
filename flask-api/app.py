# standard library
import sys
import os

# package imports
from gevent.pywsgi import WSGIServer
from dotenv import load_dotenv  # python-dotenv
from flask import Flask, json, jsonify, request, Blueprint

# route imports
from routes.api.index import index_routes

# dotenv
load_dotenv()

# app
app = Flask(__name__)

# routes
app.register_blueprint(
    index_routes,
    url_prefix='/api'
)

# 404


@app.errorhandler(404)
def page_not_found(e):
    # note that we set the 404 status explicitly
    return jsonify({'data': None, 'error': 'Page not found'}), 404


# run
if __name__ == '__main__':
    # determine env
    try:
        env = os.environ['PYTHON_ENV']
    except:
        env = None

    # which server
    if env == 'production':
        # production WSGI server (gevent)
        print('Starting WSGI server.')
        http_server = WSGIServer(('', 8080), app)
        http_server.serve_forever()
    else:
        # development server
        print('Starting development server.')
        app.run(debug=True, host='0.0.0.0', port=8080)
