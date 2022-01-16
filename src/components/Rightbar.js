import styles from "./Rightbar.module.css";
import { NavLink } from "react-router-dom";

export default function RightBar() {
    return (
        <div className={styles.rightbar_container}>
            
            <div className={styles.rightbar_content}>
                <div className={styles.my_question}>
                    <button className={styles.my_question_btn}>Go to My Question</button>
                </div>

                <div className={styles.bookmark_container}>
                    <div className={styles.bookmark_title}>
                        <span className={styles.bookmark_word}>Bookmark</span>
                        <button className={styles.bookmark_edit}>Edit</button>
                    </div>
                    <div className={styles.bookmark_content}>

                        <div className={styles.bookmark_tag}>
                            <span className={styles.bookmark_tag_title}>Tag</span>
                            <ul className={styles.bookmark_ul}>
                                <li>tag 1</li>
                                <li>tag 2</li>
                                <li>tag 3</li>
                                <li>tag 4</li>
                                <li>tag 5</li>
                            </ul>
                            <span className={styles.viewmore}> + View more</span>
                        </div>
                        <div className={styles.bookmark_tag}>
                            <span className={styles.bookmark_tag_title}>User</span>
                            <ul className={styles.bookmark_ul}>
                                <li>User 1</li>
                                <li>User 2</li>
                                <li>User 3</li>
                                <li>User 4</li>
                                <li>User 5</li>
                            </ul>
                            <span className={styles.viewmore}> + View more</span>

                        </div>
                    </div>
                    
                </div>
                

            </div>
            
        </div>
    )
}
