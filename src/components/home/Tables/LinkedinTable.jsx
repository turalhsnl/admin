import React, { useEffect, useState } from 'react';
import Title from '../../common/Title';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

const LinkedinTable = () => {
    const [show, setShow] = useState(false);
    const [slideId, setSlideId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState([]);
    const initialFormData = {
        embed: '',
    };
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:${import.meta.env.VITE_API_PORT}/linkedins`);
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

    const isFormValid = formData.embed;

    const createSlide = (e) => {
        e.preventDefault();

        axios.post(`http://localhost:${import.meta.env.VITE_API_PORT}/linkedins`, formData)
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
            axios.delete(`http://localhost:${import.meta.env.VITE_API_PORT}/linkedins/${slideId}`)
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
            embed: slide.embed,
        });
    };

    const handleUpdate = () => {
        axios.put(`http://localhost:${import.meta.env.VITE_API_PORT}/linkedins/${slideId}`, formData)
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

    return (
        <>
            <section className='slide-container'>
                <Title title='Linkedin news' />
                <div className="table-container">
                    <div className="table-head">
                        <ul>
                            <li>Embed</li>
                            <li>Action</li>
                        </ul>
                    </div>
                    <div className="table-body">
                        {displayedData.length === 0 ? (
                            <p className='p-3 pb-0 text-center fs-5'>No data</p>
                        ) : (
                            displayedData.map((slide, index) => (
                                <ul key={index}>
                                    <li>{slide.embed}</li>
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
                        <FloatingLabel label="Embed" className="mb-3">
                            <Form.Control
                                onChange={handleChange}
                                value={formData.embed}
                                name='embed'
                                type="text"
                                placeholder="Embed" />
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
            </Modal>
        </>
    );
};

export default LinkedinTable;
