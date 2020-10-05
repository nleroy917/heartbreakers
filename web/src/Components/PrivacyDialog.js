import React from 'react';
import styled from 'styled-components';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const SubTitle = styled.h4`
  color: black;
  margin-bottom: 5px;
`
const InlineLink = styled.a`

`

const InlineCode = styled.div`
    font-family: Lucida Console, Courier, monospace;
`

const PrivacyDialog = ({open, onClickAway}) => {

    return(
        <>
          <Dialog
            open={open}
            aria-labelledby="alert-privacy-title"
            aria-describedby="alert-privacy-description"
            onBackdropClick={onClickAway}
          >
            <DialogTitle id="alert-privacy-title">{`How is your data being used?`}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-privacy-description">
              <SubTitle>Spotify:</SubTitle>
              <>
                The Spotify API requires <InlineLink href="https://oauth.net/articles/authentication/">OAuth 2.0 Authentication</InlineLink> to get access to user data. This means that I need the               user to not only request access, but log-in using their standard credentials to obtain a temporary token for which I can use to read your data. heartbreakers, however, <b>only requests access to read and write to your public and private playlists, view your profile, and upload an image to your playlists</b> - that's it. Specifically, I require the <InlineCode>user-library-read</InlineCode>, <InlineCode>user-library-modify</InlineCode>, <InlineCode>playlist-modify-public`, ugc-image-upload</InlineCode> scopes. You            can read more about these [here](https://developer.spotify.com/documentation/general/guides/scopes/). You can revoke heartbreakers access to your playlist              data at anytime by [logging in to Spotify](https://support.spotify.com/us/using_spotify/features/revoke-access-from-3rd-party-app/#:~:text=Remove%20access,              remove%20and%20click%20REMOVE%20ACCESS.) and removing access altogether.
              </>
              <SubTitle>Tinder:</SubTitle>
              <>
                The Tinder API is **not** public. Exposed endpoints, authentication flows, and API architecture has been repeatedly reverse-engineered by many people over               [here](https://github.com/fbessez/Tinder) in this repository. No robust wrapper exists for the Tinder API, since there is no official documentation, and                 it changes from time to time without warning. The authenitcaiton flow I use with heartbreakers appears to be their SMS authentication flow. The              heartbreakers UI and API do a complex dance to exchange tokens across the network in order to get an access-token. Your phone number and email is            **never** seen by me, **nor is it** saved/stored anywhere but your own browser as a cookie - once the access-token is recieved, the server-side phone and           email data is removed from memory.
              </>
              <>
                **BIG** shoutout to Jim Zhou and [his pull request](https://github.com/fbessez/Tinder/pull/117) that allowed this authentication flow to exist on my                 server. If you would like to see exactly how the SMS authentication flow is handled server-side, see [this code here](https://github.com/NLeRoy917/              heartbreakers/blob/master/lib/TinderSMSAuth.py)
              </>
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </>
    )
}

export default PrivacyDialog;