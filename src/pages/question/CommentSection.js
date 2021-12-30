import "./CommentSection.css";
import { useCollection } from "../../hooks/useCollection";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import SubCommentSection from "./SubCommentSection";
import AddSubComment from "./AddSubComment";

export default function CommentSection({question_id}) {
    const {document,error} = useCollection(["questions",question_id,"comment"]);
    if(error){
        return <div>{error}</div>
    };
    if(!document){
        return <div>Loading...</div>
    };

    return (
        <div>
            <h3>Comments</h3>
            {document.map(item => (
                
                <div key={item.id}>
                    <h4>{item.comments}</h4>
                    {item.comment_image_url && item.comment_image_url.map(imageSrc=>
                        <img className="image-preview" key={imageSrc}src={imageSrc}/>)}
                    <div>added {formatDistanceToNow(item.added_at.toDate(),{addSuffix:true})}</div>
                    <div>{item.created_by}</div>
                    <AddSubComment question_id={question_id} comment_id={item.id} />
                    <SubCommentSection subComment={item.subComment}/>
                </div>
            ))}
        </div>
    )
}
