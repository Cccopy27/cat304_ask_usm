import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
    return (
            <div className={styles.sidebar}>
                <div className={styles.sidebar_content}>
                    <nav className={styles.sidebar_links}>
                        <ul className={styles.sidebar_ul}>
                            {/* <li className={styles.mainpage}>
                                <NavLink to = "/">ASK@USM</NavLink>
                            </li> */}
                            <li className={styles.home}>
                                <NavLink to = "/home">Home</NavLink>
                            </li>
                            <li className={styles.post}>
                                <NavLink to = "/post">Posts</NavLink>
                            </li>
                            
                            <li className={styles.tag}>
                                <NavLink to = "/tag">Tags</NavLink>
                            </li>
                            <li className={styles.new}>
                                <NavLink to = "/tag/News">News</NavLink>
                            </li>
                            <li className={styles.club}>
                                <NavLink to = "/tag/Event">Event</NavLink>
                            </li>
                            <li className={styles.club}>
                                <NavLink to = "/user">User</NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
    )
}
