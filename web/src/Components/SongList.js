import React from 'react';
import styled from 'styled-components';

const TableWrapper = styled.div`
`

const Table = styled.table`
    width: 100%;
    color: inherit;
    text-align: left;
    border-bottom: white solid 1px;
`

const Thead = styled.thead`
    border-bottom: solid white 1px;
    font-size: 18px;
    font-weight: 500;
    border-collapse: collapse;
    @media (max-width: 768px) {
		font-size: 14px;
    }
`

const Th = styled.th`

`

const Td = styled.td`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 10px;
  padding-right: 10px;
    @media (max-width: 768px) {
		font-size: 10px;
        max-width: 150px;
        padding-left: 5px;
        padding-right: 5px;
    }
`


const SongList = ({songs, users}) => {

    const TableHead = () => {
        return(
            <>
              <Thead>
                <tr>
                  <Th>Song</Th>
                  <Th>Artist</Th>
                  <Th>Added By</Th>
                </tr>
              </Thead>
            </>
        )
    }

    const TableBody = (props) => {
        return(
            <>
              <tbody>
                  {props.children}
              </tbody>
            </>
        )
    }

    const TableRow = ({song, user}) => {
        return(
            <>
              <tr>
                <Td>{song.name}</Td>
                <Td>{song.artists[0].name}</Td>
                <Td>{user.name}</Td>
              </tr>
            </>
        )
    }

    return(
        <>
          <TableWrapper>
              <Table>
                <TableHead />
                <TableBody>
                {
                 songs.map((song,i) => 
                  <TableRow
                    song={song}
                    user={users[i]}
                  />
                 )
                }
                </TableBody>
              </Table>
          </TableWrapper>
        </>
    )
}

export default SongList;