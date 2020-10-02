import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Cookies from 'universal-cookie';

import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';

import Layout from '../Components/Layout';
import Song from '../Components/Song';
import heart_bounce from '../images/heart_bounce.gif';

const cookies = new Cookies();

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    margin: 50px;
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
    width: 100%;
    height: 100%;
`

const SetListTitle = styled.h2`
    font-size: 2em;
    @media (max-width: 768px) {
		text-align: center;
    }
`

const Generate = () => {

    const [API_BASE, setAPIBASE] = useState(process.env.REACT_APP_API_BASE)
    const [tinderToken, setTinderToken] = useState(cookies.get('tinderAccessToken'))
    const [spotifyToken, setSpotifyToken] = useState(cookies.get('spotifyAccessToken'))
    const [matches, setMatches] = useState([])
    const [users, setUsers] = useState([])
    const [spotifyURIS, setSpotifyURIS] = useState([])
    const [spUsers, setSpUsers] = useState([])
    const [songs, setSongs] = useState([])

    const getMatches = async () => {
        let data = {
            access_token: tinderToken
        }
        let res = await axios.post(`${API_BASE}/tinder/matches`, {data: data})
        if(res.status === 200){
            let data = res.data
            // console.log(data.matches)
            setMatches(data.matches)
            analyzeMatches(data.matches)
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
            cookies.set('track_ids', data.tracks, {path: '/'})
        }
    }

    useEffect(() => {
        if(matches.length === 0){getMatches()}
        if(users.length === 0 && matches){analyzeMatches(matches)}
    }, [])

    return(
        <>
        <Layout style={{height: '100%'}}>
          <Wrapper>
            {
              matches.length === 0 ? 
              <>
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
                    <LinearProgress color="secondary" variant="determinate" value={(users.length/matches.length)*100} />
                </ProgressWrapper>
                </>
                :
                <>
                <SetListTitle>
                  Your Heartbreakers:
                </SetListTitle>
                { 
                  songs.map((song,i) => {
                    return(
                        <>
                          {
                              <SongEntry>
                                {`${song.name} by ${song.artists[0].name} - Thank you ${users[i].name}`}
                              </SongEntry>
                          }
                        </>
                      )
                    }
                  )
                }
            </>
            }
          </Wrapper>
        </Layout>
        </>
    )
}

export default Generate;