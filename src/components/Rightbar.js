import styles from "./Rightbar.module.css";

export default function RightBar() {
    return (
        <div className={styles.rightbar_container}>
            
            <div className={styles.rightbar_content}>
                <div className={styles.rightbar_content1}>random content 1</div>
                <div className={styles.rightbar_content2}>random content 2</div>
                <div className={styles.rightbar_content3}>random content 3</div>

            </div>
            
        </div>
    )
}
