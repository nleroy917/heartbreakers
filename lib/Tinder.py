import sys
import requests

class Tinder():
    '''
    Python class to interface the Tinder API
    '''
    _session = requests.Session()
    _SLEEP_MIN = 0.2  # Enforce minimum wait time between API calls (seconds)
    class TinderException(BaseException):
        pass

    def __init__(self,auth):
        '''
        init object of the Tinder class
            :param: - auth - a tinder SMS auth object - required fo 
        '''
        if not auth.authtoken:
            print('Please authenticate first!')
            raise TinderException()
            sys.exit(1)

        self._token = auth.authtoken
        self._session.headers = {
            'X-Auth-Token': self._token,
            'Content-type': 'application/json',
            'User-agent': 'Tinder Android Version 11.23.0'
        }
        self._url = 'https://api.gotinder.com'
    
    def get_matches(self):
        uri = self._url + '/v2/matches?count=100'
        matches = self._get(uri=uri)
        return matches.json()['data']['matches']
    
    def get_profile(self):
        uri = self._url + '/profile'
        profile = self._get(uri=uri)
        return profile.json()
    
    def get_match(self,id):
        uri = self._url + '/user/matches/{}'.format(id)
        user = self._get(uri=uri)
        return user.json()
    
    def get_user(self,id):
        uri = self._url + '/user/{}?locale=en'.format(id)
        user = self._get(uri=uri)
        return user.json()
    
    def get_spotify(self):
        uri = self._url + '/v3/profile/spotify/theme'
        spotify = self._get(uri=uri)
        return spotify.json()
    
    def teasers(self):
        uri = self._url + '/v2/fast-match/teasers'
        teasers = self._get(uri=uri)
        return teasers.json()['data']['results']

    def _get(self, uri):
        return self._session.request('GET',uri)
        



