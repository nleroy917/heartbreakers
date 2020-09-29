import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Layout from '../Components/Layout';
import Button from '../Components/Button';
import ReactCodeInput from 'react-verification-code-input';

import axios from 'axios';

import tinder_logo from '../images/tinder-logo.png';

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

const OPTCodeValidator = styled(ReactCodeInput)`
    font-family: inherit;
`


const TinderAuth = () => {
    const [phone, setPhone] = useState('');
    const [SMSoptSent, setSMSoptSent] = useState(false);
    const [SMSoptCode, setSMSoptCode] = useState(null);
    const [API_BASE, set_API_BASE] = useState(process.env.REACT_APP_API_BASE)
    useEffect(()=>{
        // console.log(phone)
    },[])

    const sendSMSAuth = async () => {

        let data = {
            phone: phone
        }
        let res = await axios.post(`${API_BASE}/auth/tinder/sms`, {data: data})
        if(res.status === 200){
            setSMSoptSent(true)
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
                SMSoptSent ?  
                <>
                  <AuthFormText>
                    Enter Code Received:
                  </AuthFormText>
                  <br></br>
                  <OPTCodeValidator
                    onChange={(e) => {setSMSoptCode(e)}}
                  />
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