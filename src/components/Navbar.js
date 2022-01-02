import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
export default function Navbar() {
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate("/question")
    }
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
                    <form onSubmit={handleSearch}>
                        <label>
                            <input
                            type="text"
                            placeholder="Search keywords..."
                            
                            />
                            <AiOutlineSearch className={styles.search_btn} onClick={handleSearch}/>
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
