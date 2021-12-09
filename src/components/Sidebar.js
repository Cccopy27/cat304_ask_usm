import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebar-content">
                <nav className="sidebar-links">
                    <ul>
                        <li className="home">
                            <NavLink to = "/home">Home</NavLink>
                        </li>
                        <li className="question">
                            <NavLink to = "/question">Questions</NavLink>
                        </li>
                        <li className="tag">
                            <NavLink to = "/tag">Tags</NavLink>
                        </li>
                        <li className="new">
                            <NavLink to = "/questions/:tag=news">News</NavLink>
                        </li>
                        <li className="club">
                            <NavLink to = "/questions/:tag=clubs">Clubs</NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}
