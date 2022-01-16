import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import {useState } from "react";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Navbar() {
    const navigate = useNavigate();
    const [search,setSearch] = useState("");
    const { logout, isPending } = useLogout();
    const { user } = useAuthContext();

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch("");
        navigate(`/question/search/${search}`);
    }


    return (
        <nav className={styles.navbar_horizontal}>
            <ul>
                <li className={styles.mainpage}>
                    <NavLink to = "/">ASK@USM</NavLink>
                </li>
                <li className={styles.aboutus}>
                    <NavLink to = "/aboutus">About Us</NavLink>
                </li>
                <li className={styles.contactus}>
                    <NavLink to = "/contactus">Contact us</NavLink>
                </li>
                <li className={styles.admin}>
                    <NavLink to = "/admin">Admin</NavLink>
                </li>
                <li className={styles.search_container}>
                    <form onSubmit={handleSearch}>
                        <label>
                            <input
                            type="text"
                            placeholder="Search keywords..."
                            value={search}
                            onChange={e=>{setSearch(e.target.value)}}
                            />
                            <AiOutlineSearch className={styles.search_btn} onClick={handleSearch}/>
                        </label>
                    </form>
                </li>

                {user && (
                    <>
                        <li className={styles.logout}>
                            <NavLink to = "/login" onClick={logout}>Logout</NavLink>
                        </li>
                        <li className={styles.username}>
                            <span>Hi {user.displayName}</span>
                        </li>
                    </>
                )}
                
                {!user && (
                    <>
                        <li className={styles.signup}>
                            <NavLink to = "/signup">Sign up</NavLink>
                        </li>
                        <li className={styles.login}>
                            <NavLink to = "/login">Log in</NavLink>
                        </li>
                    </>
                )}
            </ul>    
        </nav>
    )
}
