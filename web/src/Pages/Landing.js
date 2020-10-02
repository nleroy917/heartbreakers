import React from 'react';
import styled from 'styled-components';

import heart_bounce from '../images/heart_bounce.gif';

import Layout from '../Components/Layout';
import Button from '../Components/Button';

const Wrapper = styled.div`
    text-align: left;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    height: 100%;
    width: 100%;
`

const VerticalCenter = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-wrap: wrap;
    align-items: flex-start;
    height: 90vh;
    width: 100%;
    text-align: left;
    @media (max-width: 768px) {
		align-items: center;
    }
`

const PageTitle = styled.p`
    font-weight: 700;
    font-size: 6em;
    margin-bottom: 0px;
    @media (max-width: 768px) {
		font-size: 2.5em;
    }
`

const PageText = styled.h4`

`

const Footer = styled.footer`
    opacity: 0.8;
    font-size: 12px;
    @media (max-width: 768px) {
        text-align: center;
        font-size: 10px;
    }
`

const BouncingHeart = styled.img`

    height: 150px;
    width: auto;
    @media (max-width: 768px) {
        height: 50px;
        width: auto;
    }

`

const Landing = () => {
    return(
        <>
        <Layout>
         <Wrapper>
          <VerticalCenter>
          <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center'}}>
            <PageTitle>
                heartbreakers
            </PageTitle>
            <BouncingHeart src={heart_bounce} />
            </div>
            <div>
            <PageText>
                a playlist (involuntarily) created for u by the ones who probably ghosted u.
            </PageText>
            <Button
                href="/login"
            >
                Lets Go
            </Button>
            <Button
                href="https://github.com/NLeRoy917/heartbreakers"
            >
                GitHub
            </Button>
            </div>
          </VerticalCenter>
          </Wrapper>
          <Footer>
                Created by Nathan LeRoy
          </Footer>
        </Layout>
        </>
    )
}

export default Landing;