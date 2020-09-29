import React from 'react';
import styled from 'styled-components';

import Layout from '../Components/Layout';
import Button from '../Components/Button';

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

`

const Auth = ({ }) => {
    return (
        <>
          <Layout>
            <VerticalCenter>
                <AuthTitle>
                    Login to Tinder
                </AuthTitle>
                <AuthTitle>
                    Login to Spotify
                </AuthTitle>
            </VerticalCenter>
          </Layout>
        </>
      )
    }

export default Auth;