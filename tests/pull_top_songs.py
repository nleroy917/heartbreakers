import sys
sys.path.append('../')

from lib.Tinder import Tinder
from lib.TinderSMSAuth import TinderSMSAuth
from lib.Spotify import Spotify

if __name__ == '__main__':
    tndrAuth = TinderSMSAuth()
    tndr = Tinder(auth=tndrAuth)
    sp = Spotify()
    sp.check_playlist()
    matches = tndr.get_matches()
    # print(matches)
    track_list = []
    i = 1
    print('Scanning matches...')
    for match in matches:
        print('{} / {} matches scanned \r'.format(i,len(matches)), end='')
        user = tndr.get_user(match['person']['_id'])['results']
        if 'spotify_theme_track' in user:
            track_id = user['spotify_theme_track']['uri']
            track_list.append(track_id)
        i+=1
    print('')
    print('Adding songs to playlist')
    sp.create_playlist('heartbreakers', 'a playlist made for you by the ones who probably ghosted you')
    sp.add_songs(track_list)
    sp.add_cover_art('../imgs/cover_art.png')
    print('Done!')

            