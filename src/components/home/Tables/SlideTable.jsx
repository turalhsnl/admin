import React, { useEffect, useState } from 'react';
import Title from '../../common/Title';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const SlideTables = () => {
    const [show, setShow] = useState(false);
    const [slideId, setSlideId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState([]);
    const initialFormData = {
        title: '',
        url: '',
        imageLocal: '',
        video: '',
    };
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:${import.meta.env.VITE_API_PORT}/slidesCard`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleClose = () => {
        setShow(false);
        setIsEditing(false);
        setFormData(initialFormData);
    };

    const handleShow = () => {
        setShow(true);
        setSlideId(null);
        setIsEditing(false);
        setFormData(initialFormData);
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            setFormData((prev) => ({
                ...prev,
                [name]: files[0],
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const createSlide = (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('url', formData.url);
        formDataToSend.append('imageLocal', formData.imageLocal);
        formDataToSend.append('video', formData.video);

        axios.post(`http://localhost:${import.meta.env.VITE_API_PORT}/slidesCard`, formDataToSend)
            .then((res) => {
                handleClose();
                fetchData();
            })
            .catch((error) => {
                console.error('Error creating slide:', error);
            });
    };

    const handleUpdate = () => {
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('url', formData.url);
        formDataToSend.append('imageLocal', formData.imageLocal);
        formDataToSend.append('video', formData.video);

        axios.put(`http://localhost:${import.meta.env.VITE_API_PORT}/slidesCard/${slideId}`, formDataToSend)
            .then((res) => {
                fetchData();
                handleClose();
            })
            .catch((error) => {
                console.error('Error updating slide:', error);
            });
    };

    const handleDelete = (slideId) => {
        const shouldDelete = window.confirm('Are you sure to delete?');

        if (shouldDelete) {
            axios.delete(`http://localhost:${import.meta.env.VITE_API_PORT}/slidesCard/${slideId}`)
                .then((res) => {
                    fetchData();
                })
                .catch((error) => {
                    console.error('Error deleting slide:', error);
                });
        }
    };

    const handleEdit = (slide) => {
        setShow(true);
        setSlideId(slide._id);
        setIsEditing(true);
        setFormData({
            title: slide.title,
            url: slide.url,
            imageLocal: slide.imageLocal,
            video: '',
        });
    };
    

    const handleDetailChange = (value) => {
        const isImage = /<img.*?src="(.*?)".*?\/?>/g.test(value);
        setFormData((prev) => ({
            ...prev,
            imageLocal: isImage ? value : '',
        }));
    };

    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const displayedData = data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    return (
        <>
            <section className='slide-container'>
                <Title title='Slider' />
                <div className="table-container">
                    <div className="table-head">
                        <ul>
                            <li>Title</li>
                            <li>Url</li>
                            <li>Video Url</li>
                            <li>Image Local</li>
                            <li>Action</li>
                        </ul>
                    </div>
                    <div className="table-body">
                        {displayedData.length === 0 ? (
                            <p className='p-3 pb-0 text-center fs-5'>No data</p>
                        ) : (
                            displayedData.map((slide, index) => (
                                <ul key={index}>
                                    <li>{slide.title}</li>
                                    <li>{slide.url}</li>
                                    <li>{slide.video}</li>
                                    <li className='long-txt' dangerouslySetInnerHTML={{ __html: slide.imageLocal }}></li>
                                    <li>
                                        <>
                                            <button onClick={() => handleEdit(slide)} className='buttons'>Edit</button>
                                            <button onClick={() => handleDelete(slide._id)} className='buttons'>Delete</button>
                                        </>
                                    </li>
                                </ul>
                            ))
                        )}
                    </div>

                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={currentPage === index + 1 ? 'active' : ''}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <button onClick={handleShow} className='add'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                        </svg> Create
                    </button>
                </div>
            </section>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit' : 'Create'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form action=''>
                        <FloatingLabel label="Title" className="mb-3">
                            <Form.Control
                                onChange={handleChange}
                                value={formData.title}
                                name='title'
                                type="text"
                                placeholder="Title" />
                        </FloatingLabel>
                        <FloatingLabel label="Slide backgorund photo for image adress">
                            <Form.Control
                                onChange={handleChange}
                                value={formData.url}
                                name='url'
                                type="text"
                                placeholder="Slide backgorund photo for image adress" />
                        </FloatingLabel>
                        <FloatingLabel label="Video Url">
                            <Form.Control
                                onChange={handleChange}
                                name="video"
                                type="file"
                                className="mt-3"
                                placeholder="Video"
                            />
                        </FloatingLabel>
                        <FloatingLabel>
                            <ReactQuill
                                value={formData.imageLocal}
                                onChange={handleDetailChange}
                                className='mt-3'
                                placeholder="Add image for local"
                                formats={'image'}
                                modules={{
                                    toolbar: [
                                        ['image'],
                                    ],
                                }}
                            />
                        </FloatingLabel>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={isEditing ? handleUpdate : createSlide}
                        variant="outline-primary"
                    >
                        {isEditing ? 'Save Changes' : 'Create'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default SlideTables;
