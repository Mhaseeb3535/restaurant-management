import {
    Navbar,
    Container,
    Form,
    InputGroup
} from "react-bootstrap";

import {
    FaBell,
    FaSearch,
    FaUserCircle
} from "react-icons/fa";

function Header() {

    return (

        <Navbar
            bg="white"
            className="shadow-sm px-4 py-3 mb-4 rounded-4"
        >

            <Container fluid>

                <InputGroup
                    style={{ maxWidth: 350 }}
                >

                    <InputGroup.Text>

                        <FaSearch />

                    </InputGroup.Text>

                    <Form.Control
                        placeholder="Search..."
                    />

                </InputGroup>

                <div
                    className="d-flex align-items-center gap-4"
                >

                    <FaBell
                        size={22}
                    />

                    <FaUserCircle
                        size={35}
                    />

                </div>

            </Container>

        </Navbar>

    );

}

export default Header;