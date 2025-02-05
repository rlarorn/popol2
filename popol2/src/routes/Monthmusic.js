import React from 'react';
import { CssBaseline, Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { NavLink, useNavigate } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import Footer from './Footer'
import axios from 'axios';
import { getCookie, removeCookie } from "../cookie";
import { API_URL } from '../config/contansts';
import useAsync from '../customHook/useAsync';
import './Monthmusic.scss';

const MainContent = styled('div')({
  padding: '2vw',
});

const PlaylistItem = styled(Box)({
  borderRadius: '8px',
  textAlign: 'center',
  position: 'relative',
  '&:hover .play-icon': {
    opacity: 1,
    cursor: 'pointer',
  },
  '&:hover img': {
    opacity: 0.8,
    cursor: 'pointer',
  },
});       

const PlaylistImage = styled('img')({
  width: '5%',
  transition: 'opacity 0.3s ease',
});

const PlayIcon = styled(PlayArrowIcon)({
  position: 'absolute',
  bottom: '5%',
  left: '2.5%',
  transform: 'translate(-50%, -50%)',
  opacity: 0,
  transition: 'opacity 0.3s ease',
});

const Monthmusic = (props) => {
  const navigate = useNavigate();

  //전체곡 조회함수
  const getMusics = async () => {
    const res = await axios.get(`${API_URL}/api/musics`);
    console.log("res.data:", res.data);
    return res.data;
  };

  const [state] = useAsync(getMusics, []);
  const { loading, data: musics, error } = state; //state구조분해
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: 'white', backgroundColor: '#000', height: '100vh', display: "flex", flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" gutterBottom>
          잠시만 기다려주세요...
        </Typography>
        <CircularProgress style={{ marginTop: '10px' }} />
      </div>
    )
  }
  if (error) return <div>에러가 발생했습니다.</div>;
  if (!musics) {
    return <div>로딩중입니다.</div>;
  }

  const addPlayList = async (music) => {
    const login = getCookie('accessToken');
    if (getCookie('accessToken') != null) {
      await axios({
        url: `${API_URL}/api/playlist`,
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + login
        },
        data: {
          playList: music,
        }
      })
      .then(() => {
        alert("추가되었습니다!");
      })
      .catch(err => {
        console.error(err);
      });
    }else {
      alert('다시 로그인해주세요');
      removeCookie('accessToken');
      navigate('/');
    }
  }

  return (
    <div style={{ display: 'flex', background: 'black' }}>
      <CssBaseline />
      <MainContent style={{ color: 'white' }} className='mcmain'>
          <h1 style={{ paddingBottom: '1vw' }}>이달의 차트</h1>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow className='tbhead'>
                    <TableCell>#</TableCell>
                    <TableCell>이미지</TableCell>
                    <TableCell>음악</TableCell>
                    <TableCell>가수</TableCell>
                    <TableCell>추가</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {musics.map((music, index) => (
                    <TableRow key={music.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <PlaylistImage src={API_URL + music.imageUrl} alt={music.name} onClick={() => { props.onMusic(music) }} />
                        <PlayIcon className="play-icon" fontSize="large" onClick={() => { props.onMusic(music) }} />
                      </TableCell>
                      <TableCell>
                        <NavLink to='/login-main/detail' state={{ music }}>
                          <Typography variant="subtitle1" gutterBottom>{music.name}</Typography>
                        </NavLink>
                      </TableCell>
                      <TableCell>
                        <NavLink to='/login-main/detail' state={{ music }}>
                          <Typography variant="subtitle1" gutterBottom>{music.singer}</Typography>
                        </NavLink>
                      </TableCell>
                      <TableCell>
                        <PlaylistAddIcon style={{ cursor: 'pointer' }} onClick={() => { addPlayList(music) }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          <Footer />
      </MainContent>
    </div>
  );
};

export default Monthmusic;
