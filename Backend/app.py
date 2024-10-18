from flask import Flask
from flask_cors import CORS
from .config import Config
from .models import mysql
from .routes import api

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
mysql.init_app(app)

app.register_blueprint(api)

if __name__ == '__main__':
    app.run(debug=True)
