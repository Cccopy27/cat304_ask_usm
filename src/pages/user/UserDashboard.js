import styles from "./UserDashboard.module.css"
import UserHeader from "./UserHeader"
import QuestionList from "../../components/QuestionList"
import { useEffect, useState } from "react";
import UserResult from "./UserResult";
import { useParams } from "react-router-dom";

export default function UserDashboard() {
    const [filterDoc, setFilterDoc] = useState(null);
    const {result} = useParams();
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        setUserName(result);
    },[result])


    return (
        <div className={styles.userdashboard_container}>
            <UserHeader/>
            <div className={styles.userdashboard}>
                 {filterDoc && <UserResult/>}
            </div>
        </div>
    )
}
