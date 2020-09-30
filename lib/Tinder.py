import sys
import requests

class TinderException(BaseException):
    pass

class Tinder():
    '''
    Python class to interface the Tinder API
    '''
    _session = requests.Session()
    _SLEEP_MIN = 0.2  # Enforce minimum wait time between API calls (seconds)

    def __init__(self,auth):
        '''
        init object of the Tinder class
            :param: - auth - a tinder SMS auth object - required fo 
        '''
        if not auth.authtoken:
            print('Please authenticate first!')
            raise TinderException
            sys.exit(1)

        self._token = auth.authtoken
        self._session.headers = {
            'X-Auth-Token': self._token,
            'Content-type': 'application/json',
            'User-agent': 'Tinder Android Version 11.23.0'
        }
        self._url = 'https://api.gotinder.com'
    
    def get_matches(self):
        '''
        Get the current authenticated user's matches
        '''
        uri = self._url + '/v2/matches?count=100'
        matches = self._get(uri=uri)
        return matches.json()['data']['matches']
    
    def get_profile(self):
        '''
        Get the current authenticated user's profile
        '''
        uri = self._url + '/profile'
        profile = self._get(uri=uri)
        return profile.json()
    
    def get_match(self,id):
        '''
        Get a specific match from the available authenicated user's matches
        
        id - the match id for the match you want to obtain
        '''
        uri = self._url + '/user/matches/{}'.format(id)
        user = self._get(uri=uri)
        return user.json()
    
    def get_user(self,id):
        '''
        Get a user's profile

        id - the profile id for the user you want to obtain a profile from
        '''
        uri = self._url + '/user/{}?locale=en'.format(id)
        user = self._get(uri=uri)
        return user.json()
    
    def get_spotify(self):
        '''
        Get the current authenticated user's spotify anthem/theme
        '''
        uri = self._url + '/v3/profile/spotify/theme'
        spotify = self._get(uri=uri)
        return spotify.json()
    
    def teasers(self):
        '''
        Get the current authenticated user's teasers  (only gets 10)
        '''
        uri = self._url + '/v2/fast-match/teasers'
        teasers = self._get(uri=uri)
        return teasers.json()['data']['results']

    def _get(self, uri):
        '''
        Submit a GET request to the API - this is an internal command - do not directly use
        '''
        return self._session.request('GET',uri)
        



