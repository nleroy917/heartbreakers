import sys
sys.path.append('../')

from lib.Tinder import Tinder
from lib.TinderSMSAuth import TinderSMSAuth

if __name__ == '__main__':
    tndrAuth = TinderSMSAuth()
    tndr = Tinder(auth=tndrAuth)
    profile = tndr.get_profile()
    print(profile)
