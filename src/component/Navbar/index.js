import {Nav} from "react-bootstrap";
import {k_home_route, k_immersive_view_route} from "../../App";

const NavbarItems = () => {
    return (
        <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
            activeKey={window.location.pathname}
        >
            {/*left aligned items of navbar*/}
            <Nav.Link href={k_home_route}>
                Home
            </Nav.Link>
            <Nav.Link href={k_immersive_view_route}>
                Immersive View
            </Nav.Link>
        </Nav>
    );
}

export default NavbarItems;