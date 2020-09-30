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
    phone = data['optcode']
    tndrAuth = TinderSMSAuth(
        phone=phone,
    )
    resp = tndrAuth.validate_email_otp(optcode)

        

if __name__ == '__main__':
	app.run()