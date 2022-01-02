import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
export default function Navbar() {
    return (
        <nav className={styles.navbar_horizontal}>
            <ul>
                <li className={styles.aboutus}>
                    <NavLink to = "/aboutus">About Us</NavLink>
                </li>
                <li className={styles.contactus}>
                    <NavLink to = "/contactus">Contact us</NavLink>
                    </li>
                <li className={styles.search_container}>
                    <form>
                        <label>
                            <input
                            type="text"
                            placeholder="Search keywords..."
                            />
                        </label>
                    </form>
                </li>
                <li className={styles.signup}>
                    <NavLink to = "/signup">Sign up</NavLink>
                </li>
                <li className={styles.login}>
                    <NavLink to = "/login">Log in</NavLink>
                </li>
                
            </ul>    
        </nav>
    )
}
