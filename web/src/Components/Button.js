import React from 'react';
import styled from 'styled-components';

const CoolButton = styled.a`
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
    transition: ease-in-out 0.1s;
    text-decoration: none;
    color: white;

    &:hover {
        background: white;
        border: solid 1px #cdc2fe;
        color: #cdc2fe;
        cursor: default; 
    }

`

const Button = ({ href, children }) => {
    return(
        <>
            <CoolButton
                href={href}
            >
                {children}
            </CoolButton>
        </>
    )
}

export default Button;