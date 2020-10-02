import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Cookies from 'universal-cookie';

import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';

import Button from '../Components/Button';
import Layout from '../Components/Layout';
import Song from '../Components/Song';
import SongList from '../Components/SongList';
import heart_bounce from '../images/heart_bounce.gif';

const cookies = new Cookies();

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100%;
    margin: 50px;
    @media (max-width: 768px) {
		  margin: 0px;
    }
`

const LoadingText = styled.p`
    font-size: 20px;
`

const SongEntry = styled.p`
    font-size: 18px;
    text-align: left;
    margin: 5px;
`

const ProgressWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`

const SetListTitle = styled.h2`
    font-size: 2em;
    @media (max-width: 768px) {
		text-align: center;
    }
`

const SpotifyButton = styled.a`
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

const AddButtonWrapper = styled.div`
  padding: 10px;
  margin: 10px
`

const Generate = () => {

    const [API_BASE, setAPIBASE] = useState(process.env.REACT_APP_API_BASE)
    const [tinderToken, setTinderToken] = useState(cookies.get('tinderAccessToken'))
    const [spotifyToken, setSpotifyToken] = useState(cookies.get('spotifyAccessToken'))
    const [matches, setMatches] = useState(cookies.get('matches') || [])
    const [users, setUsers] = useState(cookies.get('users') || [])
    const [spotifyURIS, setSpotifyURIS] = useState([])
    const [spUsers, setSpUsers] = useState([])
    const [songs, setSongs] = useState(cookies.get('tracks') || [])
    const [creating, setCreating] = useState(false);
    const [playlistLink, setPlaylistLink] = useState(''); 
    const [spAdded, setSpAdded] = useState(false);

    const getMatches = async () => {
        let data = {
            access_token: tinderToken
        }
        let res = await axios.post(`${API_BASE}/tinder/matches`, {data: data})
        if(res.status === 200){
            let data = res.data
            // console.log(data.matches)
            setMatches(data.matches)
            if(songs.length === 0){analyzeMatches(data.matches)}
            cookies.set('matches', data.matches, {path: '/'})
        }
    }

    const analyzeMatches = async (matches) => {
        let hdrs = {
            access_token: tinderToken
        }
        let uris = []
        let spUsers = []
        for(let i = 0; i < matches.length; i++) {
            let match = matches[i]
            let res = await axios.get(`${API_BASE}/tinder/user/${match.person._id}`, {headers: hdrs})
            if(res.status === 200) {
                let data = res.data
                let user = data.user
                setUsers(users => [...users, user])
                if (user.spotify_theme_track) {
                    spUsers.push(user)
                    uris.push(user.spotify_theme_track.uri)
                }   
            }
        }
        setSpUsers(spUsers)
        setSpotifyURIS(uris)
        fetchSongs(uris)
        cookies.set('users', users, {path: '/'})
    }

    const fetchSongs = async (uris) => {
        let config = {
            headers: { access_token: spotifyToken }
        }
        let data = {
            track_ids: uris
        }
        let res = await axios.post(`${API_BASE}/spotify/tracks`, {data: data}, config )
        if(res.status === 200) {
            let data = res.data
            setSongs(data.tracks)
            cookies.set('tracks', data.tracks, {path: '/'})
        }
    }

    const addToSpotify = async () => {
      setCreating(true)
      let config = {
        headers: { access_token: spotifyToken }
      }
      let data = {
        track_ids: spotifyURIS
      }
      let res = await axios.put(`${API_BASE}/spotify/playlists`, {data: data}, config )
      setCreating(false)
      if(res.status === 200) {
        let data = res.data
        setPlaylistLink(data.link)
        setSpAdded(true)
      }
      
    }

    const clearCookies = () => {
      cookies.remove('tracks')
      cookies.remove('users')
      cookies.remove('matches')
    }

    useEffect(() => {
        console.log(matches)
        console.log(users)
        console.log(songs)
        if(matches.length === 0){getMatches()}
        if(users.length === 0 && matches){analyzeMatches(matches)}
    }, [])

    return(
        <>
        <Layout style={{height: '100%'}}>
          <Wrapper>
          {
            spAdded ? 
            <>
            <LoadingText>
              Thanks for using hearbreakers!
            </LoadingText>
            <Button
              href={playlistLink}
            >
              View your playlist on Spotify!
            </Button>
            </>
            :
              matches.length === 0 ? 
              <>
                <br></br>
                <CircularProgress 
                  color="secondary"
                /> 
                <LoadingText>
                  Finding matches...
                </LoadingText>
              </> 
              :
                (users.length < matches.length) ?
                <>
                <LoadingText>
                    {users.length}/{matches.length} Analyzed 
                </LoadingText>
                <ProgressWrapper>
                    <CircularProgress 
                      size={100} 
                      color="secondary" 
                      variant="static" 
                      value={(users.length/matches.length)*100} 
                    />
                </ProgressWrapper>
                </>
                :
                <>
                <SetListTitle>
                  Your Heartbreakers:
                </SetListTitle>
                <AddButtonWrapper onClick={()=>addToSpotify()}>
                  <SpotifyButton>
                    Add to Spotify!
                  </SpotifyButton>
                  {
                    creating ? <CircularProgress color="secondary" /> : ''
                  }
                </AddButtonWrapper>
                  <SongList
                    users={users}
                    songs={songs}
                  />
                </>
            }
          </Wrapper>
        </Layout>
        </>
    )
}

export default Generate;