import sys
sys.path.append('../')

from lib.Tinder import Tinder
from lib.TinderSMSAuth import TinderSMSAuth
from lib.Spotify import Spotify

if __name__ == '__main__':
    tndrAuth = TinderSMSAuth()
    tndr = Tinder(auth=tndrAuth)
    sp = Spotify()
    matches = tndr.get_matches()
    # print(matches)
    for match in matches:
        user = tndr.get_user(match['person']['_id'])['results']
        if 'spotify_theme_track' in user:
            track_id = user['spotify_theme_track']['uri']
            track = sp.get_song(track_id)
            print('Adding {}... Thank you {} for the song rec!'.format(track['name'], user['name']))
            