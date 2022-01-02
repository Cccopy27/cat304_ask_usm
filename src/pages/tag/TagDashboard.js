import styles from "./TagDashboard.module.css"
import TagFilter from "./TagFilter"
export default function TagDashboard() {

    return (
        <div className={styles.tagDashboard_container}>
            <TagFilter/>
            <div className={styles.TagDashboard_content}>
                some popular content
            </div>
            
        </div>
    )
}
