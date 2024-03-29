import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
        navigate(`/post/search/${search}`);
    }

    useEffect(() => {
        if (!user) {
            navigate("/login")
        }
    }, [user])

    // console.log(user.displayName);
    return (
        <nav className={styles.navbar_horizontal}>
            <ul>
                <li className={styles.mainpage}>
                    <span>ASK@</span>
                    <span></span>
                    <span className={styles.orange}>USM</span>
                    
                </li>
                <li className={styles.aboutus}>
                    <NavLink to = "/aboutus">About Us</NavLink>
                </li>
                <li className={styles.contactus}>
                    <NavLink to = "/contactus">Contact us</NavLink>
                </li>
                {user && user.displayName === "admin" &&
                <li className={styles.admin}>
                    <NavLink to = "/admin">Admin</NavLink>
                </li>}
                
                {user && 
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
                }  

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
