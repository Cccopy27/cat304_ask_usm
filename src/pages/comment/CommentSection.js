import styles from "./CommentSection.module.css";
import { useCollection } from "../../hooks/useCollection";
import SubCommentSection from "../comment/SubCommentSection";
import AddSubComment from "./AddSubComment";
import Comment from "./Comment";

export default function CommentSection({question_id}) {
    const {document,error} = useCollection(["questions",question_id,"comment"],null,["upVote","desc"]);
    
    if(error){
        return <div>{error}</div>
    };
    if(!document){
        return <div>Loading...</div>
    };
    
    return (
        <div className={styles.comment_container}>
            {document.length === 0 && <h2 className={styles.comment_header}>No Comment</h2>}
            {document.length !== 0 && <h2 className={styles.comment_header}>{document.length} Comments</h2>}

            <div className={styles.comment_content}>
                {document.map(item => (
                    <div className={styles.comment_each} key={item.id}>
                        <div className={styles.comment_each2}>
                            <Comment comment={item} question_id={question_id} />
                            <div className={styles.subComment}>
                            <SubCommentSection subComment={item.subComment} question_id={question_id} comment_id={item.id}/>
                            </div>
                            <AddSubComment question_id={question_id} comment_id={item.id} />
                        </div>
                        
                        
                    </div>
                ))}
            </div>
            
        </div>
    )
}
