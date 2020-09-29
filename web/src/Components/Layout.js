import React from 'react';
import Cookies from 'universal-cookie';
import './css/Layout.css'
import styled from 'styled-components'
const cookies = new Cookies();

const Wrapper = styled.div`
    min-height: 100vh;
	padding-left: 100px;
	padding-right: 100px;
	@media (max-width: 768px) {
		padding: 10px;
  }
`

const Layout = ({ children }) => {

    return(
    <div className="base">
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0px 1.0875rem 1.45rem`,
          paddingTop: 0,
        }}
      >
        <main>{children}</main>
      </div>
      </div>
    )

}

export default Layout;