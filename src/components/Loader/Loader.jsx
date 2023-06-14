import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { LoaderWrapper } from './Loader.styled';

const Loader = () => (
  <LoaderWrapper>
    <CircularProgress color="inherit" size={100} thickness={4} />
  </LoaderWrapper>
);

export default Loader;
