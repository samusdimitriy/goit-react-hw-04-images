import React, { useState, useEffect } from 'react';
import { fetchImages } from '../../services/Api';

import { Container } from './App.styled';
import Searchbar from '../Searchbar/Searchbar';
import ImageGallery from '../ImageGallery/ImageGallery';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import Loader from '../Loader/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [images, setImages] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');
  const [showModal, setShowModal] = useState(false);
  const [modalSrc, setModalSrc] = useState('');
  const [modalAlt, setModalAlt] = useState('');

  useEffect(() => {
    const fetchImagesFromApi = async () => {
      try {
        const imagesData = await fetchImages(searchQuery, currentPage);
        const { hits, total } = imagesData;
        setImages(prevImages =>
          currentPage === 1 ? hits : [...prevImages, ...hits]
        );
        setTotal(total);

        if (currentPage !== 1) {
          setTimeout(() => {
            scrollToBottom();
          }, 0);
        }
        setStatus('resolved');
      } catch (error) {
        setError(error);
        setStatus('rejected');
      }
    };

    if (searchQuery !== '' || currentPage !== 1) {
      setStatus('pending');
      fetchImagesFromApi();
    }
  }, [searchQuery, currentPage]);

  useEffect(() => {
    if (status === 'resolved') {
      console.log(total);
      if (images.length === 0 && searchQuery !== '') {
        toast.error(`Sorry, but we couldn't find any images for your request`);
      } else if (images.length === total) {
        toast.warning(
          `We found ${images.length} images for your request, but that's all we have`
        );
      } else {
        toast.success(`We found ${images.length} images for your request`);
      }
    } else if (status === 'rejected' && error) {
      toast.error(error.message);
    }
  }, [status, images, searchQuery, error, total]);

  const handleFormSubmit = query => {
    const trimmedQuery = query.trim();

    if (trimmedQuery === '') {
      toast.error('Please enter your query!');
      setSearchQuery('');
      return;
    }

    setSearchQuery(trimmedQuery);
    setCurrentPage(1);
    setImages([]);
    setError(null);
  };

  const handleImageClick = (src, alt) => {
    setShowModal(true);
    setModalSrc(src);
    setModalAlt(alt);
  };

  const toggleModal = () => {
    setShowModal(prevShowModal => !prevShowModal);
  };

  const handleLoadMore = () => {
    setCurrentPage(prevCurrentPage => prevCurrentPage + 1);
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <Container>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Searchbar onSubmit={handleFormSubmit} />
      {status === 'pending' && total > 0 && <Loader />}
      {status === 'rejected' && <h1>{error.message}</h1>}
      {status === 'resolved' && (
        <>
          {images.length > 0 && (
            <ImageGallery images={images} onClick={handleImageClick} />
          )}
          {!!images.length && total > images.length && (
            <Button onClick={handleLoadMore} />
          )}
          {showModal && (
            <Modal
              modalSrc={modalSrc}
              modalAlt={modalAlt}
              onClose={toggleModal}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default App;
