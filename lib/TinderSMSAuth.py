import requests
import random
import string
import uuid
from lib.authgateway import *
import secrets
from pathlib import Path


class SMSAuthException(BaseException):
    pass


class TinderSMSAuth(object):
    '''
    Tinder SMS authentication client
    
    This was directly pulled from https://github.com/jimtje's contributions to the Tinder API. He made all this possible go follow him on GitHub

    Thank you Jim!
    '''

    def __init__(self, email=None, phone=None, token=None, seconds=None):
        self.installid = ''.join(random.choices(string.ascii_uppercase + string.ascii_lowercase + string.digits, k=11))
        self.session = requests.Session()
        self.session.headers.update({"user-agent": "Tinder Android Version 11.23.0"})
        self.url = "https://api.gotinder.com"
        self.funnelid = str(uuid.uuid4())
        self.appsessionid = str(uuid.uuid4())
        self.deviceid = secrets.token_hex(8)
        self.authtoken = token
        self.refreshtoken = None
        self.userid = None
        self.email = email
        self.phone = phone
        self.email_required = False
        self.seconds = seconds

    def send_sms_verification(self):
        payload = {
                "device_id": self.installid,
                "experiments": ["default_login_token", "tinder_u_verification_method", "tinder_rules",
                                "user_interests_available"]
        }
        self.session.post(self.url + "/v2/buckets", json=payload)
        phonenumber = self.phone
        messageout = AuthGatewayRequest(Phone(phone=phonenumber))
        headers = {
                'tinder-version': "11.23.0", 'install-id': self.installid,
                'user-agent': "Tinder Android Version 11.23.0", 'connection': "close",
                'platform-variant': "Google-Play", 'persistent-device-id': self.deviceid,
                'accept-encoding': "gzip, deflate", 'appsflyer-id': "1600144077225-7971032049730563486",
                'platform': "android", 'app-version': "3994", 'os-version': "25", 'app-session-id': self.appsessionid,
                'x-supported-image-formats': "webp", 'funnel-session-id': self.funnelid,
                'app-session-time-elapsed': format(self.seconds, ".3f"), 'accept-language': "en-US",
                'content-type': "application/x-protobuf"
        }
        self.session.headers.update(headers)
        r = self.session.post(self.url + "/v3/auth/login", data=bytes(messageout))
        response = AuthGatewayResponse().parse(r.content).to_dict()
    
    def validate_phone_otp(self, optcode):
        otpresponse = optcode
        resp = PhoneOtp(phone=self.phone, otp=otpresponse)
        messageresponse = bytes(AuthGatewayRequest(phone_otp=resp))
        self.session.headers.update({"app-session-time-elapsed": format(self.seconds + random.uniform(30, 90), ".3f")})
        r = self.session.post(self.url + "/v3/auth/login", data=messageresponse)
        response = AuthGatewayResponse().parse(r.content).to_dict()
        if "validateEmailOtpState" in response.keys():
            self.email_required = True
            refreshtoken = response["validateEmailOtpState"]["refreshToken"]
            return None
        if "loginResult" in response.keys() and "authToken" in response["loginResult"].keys():
            self.refreshtoken = response["loginResult"]["refreshToken"]
            self.authtoken = response["loginResult"]["authToken"]
            self.session.headers.update({"X-Auth-Token": self.authtoken})
        else:
            raise SMSAuthException
    
    def validate_email_opt(self,optcode):
        resp = bytes(AuthGatewayRequest(
                    email_otp=EmailOtp(otp=emailoptresponse, email=email, refresh_token=refreshtoken)))
        r = self.session.post(self.url + "/v3/auth/login", data=resp)
        response = AuthGatewayResponse().parse(r.content).to_dict()
        if "loginResult" in response.keys() and "authToken" in response["loginResult"].keys():
            self.refreshtoken = response["loginResult"]["refreshToken"]
            self.authtoken = response["loginResult"]["authToken"]
            self.session.headers.update({"X-Auth-Token": self.authtoken})


if __name__ == '__main__':
    TinderSMSAuth() 