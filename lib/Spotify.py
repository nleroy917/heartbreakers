import spotipy
from spotipy.oauth2 import SpotifyOAuth
import base64
import sys

class Spotify():
    '''
    Python class to interface the Spotify API - makes use of spotipy
    '''

    def __init__(self, access_token):
        '''
        Must set client_id and client secret as environment variables:
            SPOTIPY_CLIENT_ID=client_id_here
            SPOTIPY_CLIENT_SECRET=client_secret_here
            SPOTIPY_CLIENT_USERNAME=client_username_here # This is actually an id not spotify display name
            SPOTIPY_REDIRECT_URI=http://localhost:8080 # Make url is set in app you created to get your ID and SECRET
        '''
        self._sp = spotipy.Spotify(auth=access_token)
        self._user = self._sp.current_user()['id']
        self._playlist_id = None
    
    def check_playlist(self):
        '''
        This is to check and see if the user already has a 'heartbreakers' playlist made
            if it is made - asks you to delete before making another

            in future need to ask if you want to update current one or make a new one
        '''
        playlists = self._sp.user_playlists(self._user)['items']
        for playlist in playlists:
            if playlist['name'] == 'heartbreakers':
                print('heartbreakers already exists! Delete it to create a new one first!')
                sys.exit(1)

    def get_song(self,id):
        '''
        Get song/track object from spotify given an id
            :param: - id - string - track ID
        '''
        track = self._sp.track(id)
        return track
    
    def create_playlist(self, name, desc):
        '''
        Create a new playlist for the user
            :param: - name - string - the name you want the playlist to be
            :param: - desc -string - the description of the playlist
        '''
        result = self._sp.user_playlist_create(self._user,name,description=desc)
        self._playlist_id = result['id']
    
    def add_songs(self, track_list):
        '''
        Add a list of songs to the heartbreakers playlist
            :param: - track_list - list - a list of track id's (or URIS) from spotify
        '''
        self._sp.user_playlist_add_tracks(self._user, self._playlist_id, track_list)
    
    def add_cover_art(self, img_link):
        '''
        Update the cover art for the playlist created to my custom cover art
        '''
        if not self._playlist_id:
            print('Generate playlist first!')
            sys.exit(1)
        with open(img_link, 'rb') as image_file:
            encoded_string = base64.b64encode(image_file.read())
        self._sp.playlist_upload_cover_image(self._playlist_id, encoded_string)
    
    def get_tracks(self, track_ids):
        '''
        Get a list of track objects for a list of track id's
        '''
        if len(track_ids) > 50:
            tracks1 = self._sp.tracks(track_ids[:50])
            tracks2 = self._sp.tracks(track_ids[50:])
            tracks = tracks1 + tracks2
        else:
            tracks = self._sp.tracks(track_ids)
        return tracks