import { NavLink } from "react-router-dom";
import "./Navbar.css";
export default function Navbar() {
    return (
        <nav className="navbar-horizontal">
            <ul>
                <li className="aboutus">
                    <NavLink to = "/aboutus">About Us</NavLink>
                </li>
                <li className="contactus">
                    <NavLink to = "/contactus">Contact us</NavLink>
                    </li>
                <li className="search-container">
                    <form>
                        <label>
                            <input
                            type="text"
                            placeholder="Search..."
                            />
                        </label>
                    </form>
                </li>
                <li className="signup">
                    <NavLink to = "/signup">Sign up</NavLink>
                </li>
                <li className="login">
                    <NavLink to = "/login">Log in</NavLink>
                </li>
                
            </ul>    
        </nav>
    )
}
