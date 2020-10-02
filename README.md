# heartbreakers
![heartbreakers](./imgs/banner.png)
Have you ever thought to yourself, "I wonder what my Tinder matches are listening to nowadays?" Well now you can know! Heartbreakers is a web application that will scan your Tinder matches for their "Spotify Anthem", curate a list of songs, and create a new playlist on Spotify made **JUST FOR YOU** by all of your heartbreakers :)

## To Use
To use heartbreakers, simply go to the most recent <link tbd>. You will be asked to log in to Spotify and Tinder - once done heartbreakers will scan your matches and create your list!

## Privacy and Data Use
### Spotify:
The Spotify API requires [OAuth 2.0 authentication](https://oauth.net/articles/authentication/) to get access to user data. This means that I need the user to not only request access, but log-in using their standard credentials to obtain a temporary token for which I can use to read your data. heartbreakers, however, **only requests access to read and write to your public and private playlists, view your profile, and upload an image to your playlists** - that's it. Specifically, I require the `user-library-read`, `user-library-modify`, `playlist-modify-public`, `ugc-image-upload` scopes. You can read more about these [here](https://developer.spotify.com/documentation/general/guides/scopes/). You can revoke heartbreakers access to your playlist data at anytime by [logging in to Spotify](https://support.spotify.com/us/using_spotify/features/revoke-access-from-3rd-party-app/#:~:text=Remove%20access,remove%20and%20click%20REMOVE%20ACCESS.) and removing access altogether.

### Tinder:
The Tinder API is **not** public. Exposed endpoints, authentication flows, and API architecture has been repeatedly reverse-engineered by many people over [here](https://github.com/fbessez/Tinder) in this repository. No robust wrapper exists for the Tinder API, since there is no official documentation, and it changes from time to time without warning. The authenitcaiton flow I use with heartbreakers appears to be their SMS authentication flow. The heartbreakers UI and API do a complex dance to exchange tokens across the network in order to get an access-token. Your phone number and email is **never** seen by me, **nor is it** saved/stored anywhere but your own browser as a cookie - once the access-token is recieved, the server-side phone and email data is removed from memory.

**BIG** shoutout to Jim Zhou and [his pull request](https://github.com/fbessez/Tinder/pull/117) that allowed this authentication flow to exist on my server. If you would like to see exactly how the SMS authentication flow is handled server-side, see [this code here](https://github.com/NLeRoy917/heartbreakers/blob/master/lib/TinderSMSAuth.py)

## Development

In the `web/` directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

Please reach out to me if you'd like access to the necessary development environment variables to contribute!
