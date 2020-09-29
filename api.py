from dotenv import load_dotenv
import os
import random

load_dotenv()
CLIENT_ID=os.getenv('CLIENT_ID')
CLIENT_SECRET=os.getenv('CLIENT_SECRET')
GENIUS_API_SECRET=os.getenv('GENIUS_ACCESS_TOKEN')

from lib.Tinder import Tinder
from lib.TinderSMSAuth import TinderSMSAuth
from lib.Spotify import Spotify

# import flask
from flask import Flask
from flask import jsonify
from flask import request
from flask import render_template
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

#import other necessary modules
import json

# Testing route/main route
@app.route('/')
def api_base():
    return_package = {
        'message': 'This is the heartbreakers api'
    }
    return jsonify(return_package)

if __name__ == '__main__':
	app.run()