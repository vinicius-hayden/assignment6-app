import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';
import { addToHistory } from "@/lib/userData";
import { readToken, removeToken } from "@/lib/authenticate";

export default function MainNav() {
    const router = useRouter();
    const [ searchText, setSearchText ] = useState('');
    const [ isExpanded, setIsExpanded ] = useState(false);
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
    const token = readToken();
    const searchTextRef = useRef(null);
    const navbarRef = useRef(null);

    const handleOutsideClick = (event) => {
        if (navbarRef.current && !navbarRef.current.contains(event.target)) {
            setIsExpanded(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [isExpanded]);

    function logout() {
        setIsExpanded(false);
        removeToken();
        router.push("/login");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsExpanded(false);
        if (searchText.trim() != '') {
            let queryString = `title=true&q=${searchText}`;
            setSearchHistory(await addToHistory(queryString));
            router.push(`/artwork?title=true&q=${searchText}`);
        }
        setSearchText('');
        searchTextRef.current.value = '';
    }

    return (
        <>
            <Navbar ref={navbarRef} expand="lg" className="bg-primary navbar-dark fixed-top nav-bar" expanded={isExpanded}>
                <Container>
                    <Navbar.Brand className="m-2">Vinicius Souza da Silva</Navbar.Brand>
                    <Navbar.Toggle onClick={() => setIsExpanded(!isExpanded)} aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav className="me-auto">
                            <Link href="/" passHref legacyBehavior><Nav.Link active={router.pathname === "/"} onClick={() => setIsExpanded(false)}>Home</Nav.Link></Link>
                            <Link href="/search" passHref legacyBehavior><Nav.Link active={router.pathname === "/search"} onClick={() => setIsExpanded(false)}>Advanced Search</Nav.Link></Link>
                        </Nav>
                        <Form className="d-flex" onSubmit={handleSubmit}>
                            <Form.Control ref={searchTextRef} onChange={(e) => {setSearchText(e.target.value)}} type="search" placeholder="Search" className="me-2" aria-label="Search" />
                            <Button type='submit' variant="outline-light" onClick={() => setIsExpanded(false)}>Search</Button>
                        </Form>
                        {token ? (
                            <Nav>
                                <NavDropdown title={token.userName} id="user-nav-dropdown" className="ms-2">
                                    <Link href="/favourites" passHref legacyBehavior>
                                        <NavDropdown.Item active={router.pathname === "/favourites"} onClick={() => setIsExpanded(false)}>Favourites</NavDropdown.Item>
                                    </Link>
                                    <Link href="/history" passHref legacyBehavior>
                                        <NavDropdown.Item active={router.pathname === "/history"} onClick={() => setIsExpanded(false)}>Search History</NavDropdown.Item>
                                    </Link>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={() => logout()}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        ) : (
                            <Nav>
                                <Link href="/register" passHref legacyBehavior><Nav.Link active={router.pathname === "/register"} onClick={() => setIsExpanded(false)}>Register</Nav.Link></Link>
                                <Link href="/login" passHref legacyBehavior><Nav.Link active={router.pathname === "/login"} onClick={() => setIsExpanded(false)}>Login</Nav.Link></Link>
                            </Nav>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <br /><br /><br /> 
        </>
    );
}
