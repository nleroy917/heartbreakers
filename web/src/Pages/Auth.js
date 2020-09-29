import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Cookies from 'universal-cookie';

import Layout from '../Components/Layout';
import Button from '../Components/Button';

import InfoIcon from '@material-ui/icons/Info';

import axios from 'axios';

const querystring = require('querystring');
const cookies = new Cookies();

const VerticalCenter = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    height: 80vh;
    width: 100%;
    text-align: left;
`

const AuthTitle = styled.h2`
    font-size: 2em;
    @media (max-width: 768px) {
		text-align: center;
    }
`

const PrivacyWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 5px;
    margin: 10px;
    &:hover {
        opacity: 0.6;
    }
`

const PrivacyText = styled.a`
    cursor: default;

`

const TinderButton = styled.a`
    -webkit-appearance: button;
    -moz-appearance: button;
    appearance: button;
    text-decoration: none;
    margin: 10px;
    padding: 10px;
    padding-left: 30px;
    padding-right: 30px;
    border-radius: 30px;
    border: white solid 1px;
    transition: ease-in-out 0.05s;
    text-decoration: none;
    color: ${props => props.token ? '#fd5465' : 'white'};

    &:hover {
        background: white;
        border: solid 1px #fd5465;
        color: #fd5465;
        cursor: default; 
    }
    background: ${props => props.token ? 'white' : '#fd5465'};
`

const SpotifyButton = styled.a`
    -webkit-appearance: button;
    -moz-appearance: button;
    appearance: button;
    text-decoration: none;
    margin: 10px;
    padding: 10px;
    padding-left: 30px;
    padding-right: 30px;
    border-radius: 30px;
    border: ${props => props.token ? '#1ad860 solid 1px' : 'white solid 1px'};
    transition: ease-in-out 0.05s;
    text-decoration: none;
    color: ${props => props.token ? '#1ad860' : 'white'};

    &:hover {
        background: white;
        border: solid 1px #1ad860;
        color: #1ad860;
        cursor: default; 
    }
    background: ${props => props.token ? 'white' : '#1ad860'};
`
const LogOutWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
    align-items: center;
    padding: 10px;
    font-size: 12px;
    color: blue;
`

const BackLink = styled.a`
    cursor: default;
    margin-top: 10px;
    color: white;
    &:hover {
        opacity: 0.6;
    }
`

const LogOutLink = styled.a`
    cursor: default;
    &:hover {
        opacity: 0.6;
    }
`

const sp_base_url =  'https://accounts.spotify.com/authorize?'
const sp_payload = {
	client_id: process.env.REACT_APP_CLIENT_ID,
	response_type: 'code',
	scope: 'user-library-read user-library-modify playlist-modify-public ugc-image-upload',
	redirect_uri: process.env.REACT_APP_REDIRECT_URI,
	show_dialog: true
}

const sp_authorize_url = sp_base_url + querystring.stringify(sp_payload)

const Auth = ({ }) => {
    const [spotifyAuthCode, setSpotifyAuthCode] = useState(querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).code || null);
    const [spotifyAccessToken, setSpotifyAccessToken] = useState(cookies.get('spotifyAccessToken') || null)
    const [spotifyRefreshToken, setSpotifyRefreshToken] = useState(cookies.get('spotifyRefreshToken') || null)
    const [tinderAccessToken, setTinderAccessToken] = useState(cookies.get('tinderAccessToken') || null)
    const [tinderRefreshToken, setTinderRefreshToken] = useState(cookies.get('tinderRefreshToken') || null)
    const [spUser, setSpUser] = useState(null);
    const [error, setError] = useState(false);

    useEffect( () => {
        console.log(tinderAccessToken)

        if(spotifyAuthCode || spotifyAccessToken){
            spAuthorizationCodeFlow()
        }
    },[])

    const fetchSpotifyName = async (accessToken) => {
        console.log('here')
        let hdrs = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
 
        let res  = await axios.get('https://api.spotify.com/v1/me', {headers: hdrs})
        
        if(res.status === 200) {

            let data = await res.data
            cookies.set('userName', data.display_name, {path: '/'})
            cookies.set('userID', data.id, {path: '/'})
            cookies.set('user', data, {path: '/'})
            console.log(data)
            setSpUser(data)
        }
    }

    const spotifyTokenRefresh = async (refreshToken) => {
        return null
    }

    const spAuthorizationCodeFlow = async () => {
        if(spotifyAccessToken) {
            if(!spUser){fetchSpotifyName(spotifyAccessToken)}
        } else if(spotifyRefreshToken) {
            spotifyTokenRefresh(spotifyRefreshToken)
        } else{
        try {
            let authBody = {
                grant_type: 'authorization_code',
                code: spotifyAuthCode,
                redirect_uri: process.env.REACT_APP_REDIRECT_URI
            }
            let authHeaders = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(process.env.REACT_APP_CLIENT_ID + ':' + process.env.REACT_APP_CLIENT_SECRET,)
        }
            var res = await axios.post(`https://accounts.spotify.com/api/token`, querystring.stringify(authBody), {headers: authHeaders})
            var data = await res.data
            setSpotifyAccessToken(data.access_token)
            setSpotifyRefreshToken(data.refresh_token)
            cookies.set('spotifyRefreshToken',data.refresh_token,{path: '/'})
            cookies.set('spotifyAccessToken',data.access_token,{ path: '/', expires: new Date(Date.now()+ data.expires_in*3600)})

            fetchSpotifyName(data.access_token)
            
        } catch (error) {
            setError(true)
        }
    }
        
    }

    const clearSpotifyCookies = () => {
        cookies.remove('spotifyAccessToken')
        cookies.remove('spotifyRefreshToken')
        setSpotifyAccessToken(null)
        setSpotifyRefreshToken(null)
    }

    const clearTinderCookies = () => {
        cookies.remove('tinderAccessToken')
        cookies.remove('tinderRefreshToken')
        setTinderAccessToken(null)
        setTinderRefreshToken(null)
    }

    return (
        <>
          <Layout>
            <VerticalCenter>
            <AuthTitle>
                Lets find those heartbreakers...
            </AuthTitle>
                <TinderButton
                  href="/tinder-auth"
                >
                    Login to Tinder
                </TinderButton>
                <SpotifyButton
                    href={spotifyAccessToken ? null : sp_authorize_url}
                    token={spotifyAccessToken}
                >
                    {
                        spotifyAccessToken ?
                        <>Spotify Connected!</>
                        :
                        <>Login to Spotify</>
                        
                    }
                </SpotifyButton>
                    <BackLink href="/">
                        Back
                    </BackLink>
                <LogOutWrapper>
                {
                 spotifyAccessToken ? 
                  <LogOutLink
                    onClick={clearSpotifyCookies}
                  >
                    Log Out of Spotify
                  </LogOutLink>
                  :
                  ''
                }
                {
                 tinderAccessToken ? 
                  <LogOutLink
                    onClick={clearSpotifyCookies}
                  >
                    Log Out of Tinder
                  </LogOutLink>
                  :
                  ''
                }
                </LogOutWrapper>

                <PrivacyWrapper>
                <InfoIcon />
                <PrivacyText>
                    <>Privacy Info</>
                </PrivacyText>
                </PrivacyWrapper>          
            </VerticalCenter>
          </Layout>
        </>
      )
    }

export default Auth;