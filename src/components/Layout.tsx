import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BsNavbar from "react-bootstrap/Navbar";
import { Button } from "react-bootstrap";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

interface IProps {
  children: JSX.Element[] | JSX.Element;
}

const Layout = ({ children }: IProps) => {
  return (
    <>
      <BsNavbar expand="lg" className="bg-body-tertiary">
        <Container>
          <BsNavbar.Brand href="#home">Apatrment info</BsNavbar.Brand>
          <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
          <BsNavbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/beaches">Beaches</Nav.Link>
              <Nav.Link href="/restaurants">Restaurants</Nav.Link>
              <Nav.Link href="/messages">Messages</Nav.Link>
              <Nav.Link href="/shops">Shops</Nav.Link>
              <Nav.Link href="/attractions">Attractions</Nav.Link>
              <Nav.Link href="/reviews">Reviews</Nav.Link>
              <Nav.Link href="/devices">Devices</Nav.Link>
              <Nav.Link href="/aboutUs/edit">About Us</Nav.Link>
              <Button variant="secondary" onClick={() => signOut(auth)}>
                Sign Out
              </Button>
            </Nav>
          </BsNavbar.Collapse>
        </Container>
      </BsNavbar>
      <Container className="mt-3 mb-3">{children}</Container>
    </>
  );
};

export default Layout;
