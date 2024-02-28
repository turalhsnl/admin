import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const [activeNavItem, setActiveNavItem] = useState('/slider');

    const navItems = [
        { name: 'Slider', path: '/' },
        { name: 'Cards', path: '/cards' },
        { name: 'Product & Services', path: '/Product-Services' },
        { name: 'Linkedin News', path: '/linkedin' },
        { name: 'Faq', path: '/faqs' },
        { name: 'Partner', path: '/partner' },
    ];

    useEffect(() => {
        setActiveNavItem(location.pathname);
    }, [location]);

    return (
        <aside id='aside'>
            <div className="side-top">
                <span> GEO <br /> PRO </span>
            </div>
            <ul>
                {navItems.map((item) => (
                    <li key={item.path}>
                        <Link
                            to={item.path}
                            className={location.pathname === item.path ? 'active' : ''}
                        >
                            {item.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;
