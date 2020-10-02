import React, {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';
import Layout from '../Components/Layout';
import Button from '../Components/Button';
import OTPInput, { ResendOTP } from 'otp-input-react';

import Cookies from 'universal-cookie';
import axios from 'axios';

import tinder_logo from '../images/tinder-logo.png';

const cookies = new Cookies();

const VerticalCenter = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    height: 80vh;
    width: 100%;
    text-align: center;
`

const TinderLogo = styled.img`
    height: 100px;
    width: 100px;
    object-fit: cover;
    border: #fe4f68 solid 2px;
    border-radius: 20px;
`

const AuthTitle = styled.h2`
    margin-top: 10px;
    margin-bottom: 5px;
    font-size: 2em;
    @media (max-width: 768px) {
		text-align: center;
    }
`

const AuthFormText = styled.p`
    font-weight: 300;
    text-align: left;
    margin: 0px;
    font-size: 16px;
`

const PhoneNumberInput = styled.input`
    text-align: center;
    background-color: white;
    border: solid white 1px;
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    height: 40px;
    width: 200px;
    font-size: 18px;
    box-shadow: rgba(0, 0, 0, 0.6) 3px 3px;
    transition: ease-in-out 0.1s;
    margin: 20px;
    && {
	@media (max-width: 768px) {
        width: 70%
    }
    }
    
    &:focus {
        outline: none;
        box-shadow: rgba(0, 0, 0, 0.6) 6px 6px;
    }
`

const EmailInput = styled.input`
    text-align: center;
    background-color: white;
    border: solid white 1px;
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    height: 40px;
    width: 200px;
    font-size: 18px;
    box-shadow: rgba(0, 0, 0, 0.6) 3px 3px;
    transition: ease-in-out 0.1s;
    margin: 20px;
    && {
	@media (max-width: 768px) {
        width: 70%
    }
    }
    
    &:focus {
        outline: none;
        box-shadow: rgba(0, 0, 0, 0.6) 6px 6px;
    }
`

const TinderAuth = () => {

    const [phone, setPhone] = useState('');
    const [SMSoptSent, setSMSoptSent] = useState(false);
    const [SMSoptCode, setSMSoptCode] = useState(null);
    const [SMSVerified, setSMSVerified] = useState(false);
    const [seconds, setSeconds] = useState(null);
    const [installid, setinstallid] = useState(null);
    const [funnelid, setfunnelid] = useState(null);
    const [appsessionid, setappsessionid] = useState(null);
    const [deviceid, setdeviceid] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [emailRequired, setEmailRequired] = useState(false);
    const [email, setEmail] = useState(null);
    const [emailoptCode, setEmailoptCode] = useState(null);
    const [API_BASE, set_API_BASE] = useState(process.env.REACT_APP_API_BASE)

    let history = useHistory();

    useEffect(()=>{
        // console.log(phone)
        // console.log(SMSoptCode)
    },[])

    const sendSMSAuth = async () => {
        let data = {
            phone: phone
        }
        let res = await axios.post(`${API_BASE}/auth/tinder/sms`, {data: data})
        if(res.status === 200){
            let data = res.data
            setSMSoptSent(true)
            setSeconds(data.seconds)
            setinstallid(data.installid)
            setfunnelid(data.funnelid)
            setappsessionid(data.appsessionid)
            setdeviceid(data.deviceid)
        }
    }

    const verifySMSoptCode = async () => {
        let data = {
            optcode: SMSoptCode,
            phone: phone,
            seconds: seconds,
            installid: installid,
            funnelid: funnelid,
            appsessionid: appsessionid,
            deviceid: deviceid
        }
        let res = await axios.post(`${API_BASE}/auth/tinder/sms/validate`, {data: data})
        if(res.status === 200){
            setSMSVerified(true);
            let data = res.data
            if(!data.email_required){
                setAccessToken(data.access_token)
                setSeconds(data.seconds)
                setinstallid(data.installid)
                setfunnelid(data.funnelid)
                setappsessionid(data.appsessionid)
                setdeviceid(data.deviceid)
                setRefreshToken(data.refresh_token)
                history.push(`/login?tinder_access_token=${data.access_token}`)
            } else {
                setEmailRequired(true)
                setSeconds(data.seconds)
                setinstallid(data.installid)
                setfunnelid(data.funnelid)
                setappsessionid(data.appsessionid)
                setdeviceid(data.deviceid)
                setRefreshToken(data.refresh_token)
            }
        }
    }

    const verifyEmailoptCode = async () => {
        let data = {
            optcode: emailoptCode,
            phone: phone,
            seconds: seconds,
            installid: installid,
            funnelid: funnelid,
            appsessionid: appsessionid,
            deviceid: deviceid,
            email: email,
            refresh_token: refreshToken,
        }
        let res = await axios.post(`${API_BASE}/auth/tinder/email/validate`, {data: data})
        if (res.status === 200){
            let data = res.data
            setAccessToken(data.access_token)
            cookies.set('tinderAccessToken',data.access_token)
            history.push(`/login`)
        }
    }

    return(
        <>
        <Layout>
          <VerticalCenter>
          <TinderLogo src={tinder_logo} />
            <AuthTitle>
                Tinder Log In
            </AuthTitle>
            <br></br>
            {
                SMSoptSent ?  SMSVerified && emailRequired ? 
                <>
                  <AuthFormText>
                      Enter email:
                  </AuthFormText>
                  <EmailInput
                      placeholder="simp@lonely.com"
                      onChange={(e) => {setEmail(e.target.value)}}
                      value={email}
                  />
                  <AuthFormText>
                      Enter code received in email:
                  </AuthFormText>
                  <br></br>
                  <OTPInput
                    value={emailoptCode}
                    onChange={setEmailoptCode}
                    autoFocus
                    OTPLength={6}
                    otpType="number"
                    style={{outline: 'none'}}
                  />
                  <div onClick={() => {verifyEmailoptCode()}}>
                  <Button>
                      Verify
                  </Button>
                  </div>
                </>
                :
                <>
                  <AuthFormText>
                    Enter Code Received:
                  </AuthFormText>
                  <br></br>
                  <OTPInput
                    value={SMSoptCode}
                    onChange={setSMSoptCode}
                    autoFocus
                    OTPLength={6}
                    otpType="number"
                    style={{outline: 'none'}}
                  />
                  <br></br>
                  <div onClick={() => {verifySMSoptCode()}}>
                  <Button>
                      Verify
                  </Button>
                  </div>
                </>
                : 
                <>
                  <AuthFormText>
                      Enter Phone Number (include country code):
                  </AuthFormText>
                  <PhoneNumberInput 
                    placeholder="11234567890"
                    onChange={(e) => {setPhone(e.target.value)}}
                    value={phone}
                  />
                  <div onClick={() => { sendSMSAuth()}}>
                  <br></br>
                  <Button>
                      Send Code
                  </Button>
                  </div>
                </>
            }
          </VerticalCenter>
        </Layout>
        </>
    )
}

export default TinderAuth;