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

    def __init__(self, 
        email=None, 
        phone=None, 
        token=None, 
        seconds=None,
        installid=None,
        funnelid=None,
        appsessionid=None,
        deviceid=None,
        refresh_token=None,
    ):
        if installid:
            self.installid = installid
        else:
            self.installid = ''.join(random.choices(string.ascii_uppercase + string.ascii_lowercase + string.digits, k=11))

        if funnelid:
            self.funnelid = funnelid
        else:
            self.funnelid = str(uuid.uuid4()) 

        if appsessionid:
            self.appsessionid = appsessionid
        else:
            self.appsessionid = str(uuid.uuid4())

        if deviceid:
            self.deviceid = deviceid
        else:
            self.deviceid = secrets.token_hex(8)

        if seconds:
            self.seconds = seconds
        else:
            self.seconds = random.uniform(100, 250)

        self.session = requests.Session()
        self.session.headers.update({"user-agent": "Tinder Android Version 11.23.0"})
        self.url = "https://api.gotinder.com"
        self.authtoken = token
        self.refreshtoken = refresh_token
        self.userid = None
        self.email = email
        self.phone = phone
        self.email_required = False

    def send_sms_verification(self):
        # print(self.seconds, flush=True)
        # print(self.installid, flush=True)
        # print(self.funnelid, flush=True)
        # print(self.appsessionid, flush=True)
        # print(self.deviceid, flush=True)
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
        # print(self.seconds, flush=True)
        # print(self.installid, flush=True)
        # print(self.funnelid, flush=True)
        # print(self.appsessionid, flush=True)
        # print(self.deviceid, flush=True)
        otpresponse = optcode
        resp = PhoneOtp(phone=self.phone, otp=otpresponse)
        messageresponse = bytes(AuthGatewayRequest(phone_otp=resp))
        # print(format(self.seconds + random.uniform(30, 90), ".3f"), flush=True)
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
        self.seconds = self.seconds + random.uniform(30, 90)
        self.session.headers.update({"app-session-time-elapsed": format(self.seconds, ".3f")})
        r = self.session.post(self.url + "/v3/auth/login", data=messageresponse)
        # print(r.text,flush=True)
        response = AuthGatewayResponse().parse(r.content).to_dict()
        if "validateEmailOtpState" in response.keys():
            self.email_required = True
            self.refreshtoken = response["validateEmailOtpState"]["refreshToken"]
            return None
        if "loginResult" in response.keys() and "authToken" in response["loginResult"].keys():
            self.refreshtoken = response["loginResult"]["refreshToken"]
            self.authtoken = response["loginResult"]["authToken"]
            self.session.headers.update({"X-Auth-Token": self.authtoken})
        else:
            raise SMSAuthException
    
    def validate_email_opt(self, emailoptresponse):
        headers = {
                'tinder-version': "11.23.0", 'install-id': self.installid,
                'user-agent': "Tinder Android Version 11.23.0", 'connection': "close",
                'platform-variant': "Google-Play", 'persistent-device-id': self.deviceid,
                'accept-encoding': "gzip, deflate", 'appsflyer-id': "1600144077225-7971032049730563486",
                'platform': "android", 'app-version': "3994", 'os-version': "25", 'app-session-id': self.appsessionid,
                'x-supported-image-formats': "webp", 'funnel-session-id': self.funnelid,
                'app-session-time-elapsed': format(self.seconds + random.uniform(30, 90), ".3f"), 'accept-language': "en-US",
                'content-type': "application/x-protobuf"
        }
        self.session.headers.update(headers)
        resp = bytes(AuthGatewayRequest(
                    email_otp=EmailOtp(otp=emailoptresponse, email=self.email, refresh_token=self.refreshtoken)))
        r = self.session.post(self.url + "/v3/auth/login", data=resp)
        response = AuthGatewayResponse().parse(r.content).to_dict()
        if "loginResult" in response.keys() and "authToken" in response["loginResult"].keys():
            self.refreshtoken = response["loginResult"]["refreshToken"]
            self.authtoken = response["loginResult"]["authToken"]
            self.session.headers.update({"X-Auth-Token": self.authtoken})
        else:
            raise SMSAuthException


if __name__ == '__main__':
    TinderSMSAuth() 