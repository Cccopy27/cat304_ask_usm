import { Link } from "react-router-dom";
import "./Navbar.css";
export default function Navbar() {
    return (
        <nav className="navbar-horizontal">
            <ul>
                <li className="logo">
                    <span>ASK@USM</span>
                </li>
                <>
                    <li className="aboutus">
                        <Link to = "/aboutus">About Us</Link>
                    </li>
                    <li className="contactus">
                        <Link to = "/contactus">Contact us</Link>
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
                        <Link to = "/signup">Sign up</Link>
                    </li>
                    <li className="login">
                        <Link to = "/login">Log in</Link>
                    </li>
                </>
            </ul>    
        </nav>
    )
}
