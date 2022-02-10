
import styles from "./AboutUs.module.css";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import { BiNews } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";


export default function AboutUs() {
    
    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <span className={styles.title}>ASK@</span>
                <span className={`${styles.orange} ${styles.title}`}>USM</span>
            </div>
            
            <span className={styles.description}>An Integrated Platform used to know more about USM</span>
            <div className={styles.sectionContainer}>
                <div className={styles.section}>
                    <MdOutlineQuestionAnswer/>
                    <span>Quesiton & Answer</span>
                </div>
                <div className={styles.section}>
                    <BiNews/>
                    <span>News & Event</span>
                </div>
                <div className={styles.section}>
                    <AiOutlineSearch/>
                    <span>Searching & Tag</span>
                </div>
            </div>
            <div className={styles.memberList}>
                {/* <span>Develop by:  </span> */}
                <span>CAT304 Group 20 ChunChunMaru</span>
                
                <span> Loh Wen Hao, Lee Yu Xiong, Antonio Sia Guang Yang, Tay Ying Zhe</span>
                
            </div>

        </div>
    )
}