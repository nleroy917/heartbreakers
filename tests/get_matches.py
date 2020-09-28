import sys
sys.path.append('../')

from lib.Tinder import Tinder
from lib.TinderSMSAuth import TinderSMSAuth

if __name__ == '__main__':
    tndrAuth = TinderSMSAuth()
    tndr = Tinder(auth=tndrAuth)
    matches = tndr.get_matches()
    # print(matches)
    for match in matches:
        user = tndr.get_user(match['person']['_id'])['results']
        if 'spotify_top_artists' in user:
            print("Spotify found")