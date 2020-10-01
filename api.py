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

@app.route('/auth/tinder/sms', methods=['POST'])
def tinder_sms_auth_send():
    data = request.get_json()['data']
    phone = data['phone']
    
    if phone:
        tndrAuth = TinderSMSAuth(
            phone=phone,
        )
        tndrAuth.send_sms_verification()

    return_package = {
        'message': 'sms optcode sent',
        'seconds': tndrAuth.seconds,
        'installid': tndrAuth.installid,
        'funnelid': tndrAuth.funnelid,
        'appsessionid': tndrAuth.appsessionid,
        'deviceid': tndrAuth.deviceid
    }
    return jsonify(return_package)

@app.route('/auth/tinder/sms/validate', methods=['POST'])
def tinder_sms_auth_validate():
    data = request.get_json()['data']
    optcode = data['optcode']
    phone = data['phone']
    seconds = data['seconds']
    installid = data['installid']
    funnelid = data['funnelid']
    appsessionid = data['appsessionid']
    deviceid = data['deviceid']

    tndrAuth = TinderSMSAuth(
        phone=phone,
        seconds=seconds,
        installid=installid,
        funnelid=funnelid,
        appsessionid=appsessionid,
        deviceid=deviceid, 
    )
    tndrAuth.validate_phone_otp(optcode)
    return_package = {
        'message': None,
        'email_required': None,
        'seconds': tndrAuth.seconds,
        'installid': tndrAuth.installid,
        'funnelid': tndrAuth.funnelid,
        'appsessionid': tndrAuth.appsessionid,
        'deviceid': tndrAuth.deviceid,
        'refresh_token': tndrAuth.refreshtoken
    }
    if tndrAuth.authtoken:
        return_package['message'] = 'Successfully validated'
        return_package['email_required'] = 'false'
        return_package['access_token'] = tndrAuth.authtoken
        return jsonify(return_package)
    else:
        return_package['message'] = 'Successfully validated'
        return_package['email_required'] = 'true'
        return jsonify(return_package)

@app.route('/auth/tinder/email/validate', methods=['POST'])
def tinder_email_auth_validate():

    data = request.get_json()['data']
    optcode = data['optcode']
    phone = data['phone']
    seconds = data['seconds']
    installid = data['installid']
    funnelid = data['funnelid']
    appsessionid = data['appsessionid']
    deviceid = data['deviceid']
    email = data['email']
    refresh_token = data['refresh_token']

    tndrAuth = TinderSMSAuth(
        phone=phone,
        seconds=seconds,
        installid=installid,
        funnelid=funnelid,
        appsessionid=appsessionid,
        deviceid=deviceid, 
        email=email,
        refresh_token=refresh_token
    )
    resp = tndrAuth.validate_email_opt(optcode)
    return_package = {
        'message': 'Token recieved',
        'access_token': tndrAuth.authtoken
    }
    return jsonify(return_package)

@app.route('/tinder/matches', methods=['POST'])
def get_tinder_matches():
    data = request.get_json()['data']
    access_token = data['access_token']
    tndrAuth = TinderSMSAuth(token=access_token)
    tndr = Tinder(auth=tndrAuth)
    matches = tndr.get_matches()
    return_package = {
        'message': 'matches fetched',
        'matches': matches
    }
    return jsonify(return_package)
        

if __name__ == '__main__':
	app.run()