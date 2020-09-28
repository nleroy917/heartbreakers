import sys
import webbrowser
sys.path.append('../')

from lib.Tinder import Tinder
from lib.TinderSMSAuth import TinderSMSAuth

if __name__ == '__main__':
    tndrAuth = TinderSMSAuth()
    tndr = Tinder(auth=tndrAuth)
    teasers = tndr.teasers()
    for teaser in teasers:
        url = teaser['user']['photos'][0]['url']
        print(url)
        webbrowser.open(url)
