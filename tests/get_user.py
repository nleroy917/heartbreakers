# https://api.gotinder.com/user/5f67a07853de0d01004a010f?locale=en
# https://api.gotinder.com/user/5e2253f2f4e8fe0100d6d7435f67a07853de0d01004a010f?locale=en

import sys
sys.path.append('../')

from lib.Tinder import Tinder
from lib.TinderSMSAuth import TinderSMSAuth

if __name__ == '__main__':
    tndrAuth = TinderSMSAuth()
    tndr = Tinder(auth=tndrAuth)
    user = tndr.get_user('5f67a07853de0d01004a010f')
    print(user)