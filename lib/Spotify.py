import spotipy
from spotipy.oauth2 import SpotifyOAuth

class Spotify():
    '''
    Python class to interface the Spotify API - makes use of spotipy
    '''

    def __init__(self):
        '''
        Must set client_id and client secret as environment variables:
            SPOTIPY_CLIENT_ID=client_id_here
            SPOTIPY_CLIENT_SECRET=client_secret_here
            SPOTIPY_CLIENT_USERNAME=client_username_here # This is actually an id not spotify display name
            SPOTIPY_REDIRECT_URI=http://localhost:8080 # Make url is set in app you created to get your ID and SECRET
        '''
        self._scope = "user-library-read user-library-modify playlist-modify-public"
        self._sp = spotipy.Spotify(auth_manager=SpotifyOAuth(scope=self._scope))
    
    def get_song(self,id):
        '''
        Get song/track object from spotify given an id
            :param: - id - string - track ID
        '''
        track = self._sp.track(id)
        return track