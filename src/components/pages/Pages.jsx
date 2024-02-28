import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from '../common/Header';
import Sidebar from '../common/Sidebar';
import SlideTables from '../home/Tables/SlideTable';
import CardTable from '../home/Tables/CardTable';
import LinkedinTable from '../home/Tables/LinkedinTable';
import ProductServices from '../home/Tables/ProductServices';
import Faq from '../home/Tables/FaqTable';
import PartnerTable from '../home/Tables/PartnerTable';


export default function Pages() {
    return (
        <>
            <BrowserRouter>
                <Header />
                <Sidebar />
                <Routes>
                    <Route path='/' element={<SlideTables />} />
                    <Route path='/cards' element={<CardTable />} />
                    <Route path='/linkedin' element={<LinkedinTable />} />
                    <Route path='/Product-Services' element={<ProductServices />} />
                    <Route path='/faqs' element={<Faq />} />
                    <Route path='/partner' element={<PartnerTable />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}