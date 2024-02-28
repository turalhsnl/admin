import React, { useEffect, useState } from 'react';
import Title from '../../common/Title';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ProductServices = () => {
    const [show, setShow] = useState(false);
    const [slideId, setSlideId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState([]);
    const initialFormData = {
        category: '',
        title: "",
        url: "",
        project_image: "",
        imageLocal: "",
        detail: "",
    };
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:${import.meta.env.VITE_API_PORT}/products`);
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
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const isFormValid = formData.title && formData.category && formData.url && formData.detail

    const createSlide = (e) => {
        e.preventDefault();

        axios.post(`http://localhost:${import.meta.env.VITE_API_PORT}/products`, formData)
            .then((res) => {
                handleClose();
                fetchData();
            })
            .catch((error) => {
                console.error('Error creating slide:', error);
            });
    };

    const handleDelete = (slideId) => {
        const shouldDelete = window.confirm('Are you sure to delete?');

        if (shouldDelete) {
            axios.delete(`http://localhost:${import.meta.env.VITE_API_PORT}/products/${slideId}`)
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
            category: slide.category,
            url: slide.url,
            detail: slide.detail,
            project_image: slide.project_image,
            image_local: slide.image_local
        });
    };

    const handleUpdate = () => {
        axios.put(`http://localhost:${import.meta.env.VITE_API_PORT}/products/${slideId}`, formData)
            .then((res) => {
                fetchData();
                handleClose();
            })
            .catch((error) => {
                console.error('Error updating slide:', error);
            });
    };

    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const displayedData = data.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDetailChange = (content) => {
        setFormData({ ...formData, detail: content });
    };


    const handleDetailChangeImage = (value) => {
        const isImage = /<img.*?\/?>/g.test(value);

        setFormData((prev) => ({
            ...prev,
            image_local: isImage ? value : '',
        }));
    };
    return (
        <>
            <section className='slide-container'>
                <Title title='Products & Services' />
                <div className="table-container">
                    <div className="table-head">
                        <ul>
                            <li>Title</li>
                            <li>Category</li>
                            <li>Url</li>
                            <li>Image</li>
                            <li>Image Local</li>
                            <li>Detail</li>
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
                                    <li>{slide.category}</li>
                                    <li>{slide.url}</li>
                                    <li>{slide.project_image}</li>
                                    <li className='long-txt' dangerouslySetInnerHTML={{ __html: slide.image_local }}></li>
                                    <li className='long-txt' dangerouslySetInnerHTML={{ __html: slide.detail }}></li>
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
                    <Form>
                        <FloatingLabel label="Title" className="mb-3">
                            <Form.Control
                                onChange={handleChange}
                                value={formData.title}
                                name='title'
                                type="text"
                                placeholder="Title" />
                        </FloatingLabel>
                        <FloatingLabel label="Category" className="mb-3">
                            <Form.Control
                                onChange={handleChange}
                                value={formData.category}
                                name='category'
                                type="text"
                                placeholder="Category" />
                        </FloatingLabel>
                        <FloatingLabel label="Project image" className="mb-3">
                            <Form.Control
                                onChange={handleChange}
                                value={formData.project_image}
                                name='project_image'
                                type="text"
                                placeholder="Project image" />
                        </FloatingLabel>
                        <FloatingLabel>
                            <ReactQuill
                                value={formData.image_local}
                                onChange={handleDetailChangeImage}
                                className='mt-3 mb-3'
                                placeholder="Add image for local"
                                formats={'image'}
                                modules={{
                                    toolbar: [
                                        ['image'],
                                    ],
                                }}
                            />
                        </FloatingLabel>
                        <FloatingLabel label="Url" className="mb-3">
                            <Form.Control
                                onChange={handleChange}
                                value={formData.url}
                                name='url'
                                type="text"
                                placeholder="Url" />
                        </FloatingLabel>
                        <FloatingLabel>
                            <ReactQuill
                                value={formData.detail}
                                onChange={handleDetailChange}
                                placeholder="Enter your text here..."
                                formats={['bold', 'italic', 'link', 'image', 'video']}
                                modules={{
                                    toolbar: [
                                        ['bold', 'italic'],
                                        ['link', 'image', 'video'],
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
                        disabled={!isFormValid}
                        className={isFormValid ? '' : 'disabled-button'}
                    >
                        {isEditing ? 'Save Changes' : 'Create'}
                    </Button>
                </Modal.Footer>
            </Modal >
        </>
    );
};

export default ProductServices;
