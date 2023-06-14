import React from 'react';
import { Image } from './ImageGalleryItem.styled';

const ImageGalleryItem = ({ src, alt, onClick }) => {
  return <Image src={src} alt={alt} onClick={onClick} />;
};

export default ImageGalleryItem;
