import styles from "./SubCommentSection.module.css";
import SubComment from "./SubComment";

export default function SubCommentSection({subComment, question_id, comment_id}) {
    
    return (
        <div>
            {subComment && subComment.map(item => (
               <SubComment question_id={question_id} item={item} comment_id={comment_id} subComment={subComment} key={item.id}/>
            ))}
        </div>
    )
}
