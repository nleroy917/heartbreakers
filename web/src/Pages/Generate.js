import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Cookies from 'universal-cookie';

import CircularProgress from '@material-ui/core/CircularProgress';

import Layout from '../Components/Layout';
import heart_bounce from '../images/heart_bounce.gif';

import Tinder from '../Utils/Tinder';



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

const Generate = () => {

    const [API_BASE, setAPIBASE] = useState(process.env.REACT_APP_API_BASE)
    const [tinderToken, setTinderToken] = useState(cookies.get('tinderAccessToken'))
    const [spotifyToken, setSpotifyToken] = useState(cookies.get('spotifyAccessToken'))
    const [matches, setMatches] = useState([])

    const tndr = Tinder(cookies.get('tinderAccessToken'))

    const getMatches = async () => {
        let data = {
            access_token: tinderToken
        }
        let res = await axios.post(`${API_BASE}/tinder/matches`, {data: data})
        if(res.status === 200){
            let data = res.data
            setMatches(data.matches)
        }
    }

    const analyzeMatches = async () => {
        for(let i; i < matches.length; i++) {
            let match = matches[i]
            let user = tndr.getUser()
        }
    }

    useEffect(() => {
        getMatches()
    }, [])

    return(
        <>
        <Layout style={{height: '100%'}}>
          <Wrapper>
            {
              matches.length === 0 ? 
              <>
                <CircularProgress /> 
                <LoadingText>
                  Finding matches...
                </LoadingText>
              </> 
              :
              <>
                
              </>
            }
          </Wrapper>
        </Layout>
        </>
    )
}

export default Generate;