import "./Question.css";
import { useState, useEffect } from "react";
import {useParams} from "react-router-dom";
import {useDocument} from "../../hooks/useDocument";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useFirestore } from "../../hooks/useFirestore";
import { useNavigate } from "react-router";
import { getStorage, ref, deleteObject } from "firebase/storage";
import {storage} from "../../firebase/config";

export default function Question() {
    // get id from param
    const {id} = useParams();
    // fetch document with specific id
    const {error, document} = useDocument("questions",id);
    // get delete and update function from hooks
    const {deleteDocument,updateDocument } = useFirestore("questions");
    // navigation
    const navigate = useNavigate();
    // image listing usage
    const [imageURL,setImageURL] = useState([]);
    console.log(document);
    useEffect(() => {
        const tempArray = [];
        // get all image
        if(document){
            document.question_image_url.forEach(item=>{
                tempArray.push(item);
            })
            setImageURL(tempArray);
        }
        
    }, [document]);
    // delete question
    const handleDelete=(e)=>{
        e.preventDefault();
        deleteDocument(document.id);

        // delete storage image
        // Create a reference to the file to delete
        const desertRef = ref(storage, `question/${document.id}`);
        
        // Delete the file
        deleteObject(desertRef).then(() => {
            // File deleted successfully
            console.log("good");
            navigate("/question");
        }).catch((error) => {
            console.log(error);
        // Uh-oh, an error occurred!
        });
    };
    if(error){
        return <div>{error}</div>
    };
    if(!document){
        return <div>Loading...</div>
    };
    
    
    return (
        <div>
            <div className="question-details">
                <h2>{document.question_title}</h2>
                <p>{document.question_description}</p>
                <p>tags:{document.question_tag}</p>
                {/* <img className="question-image"src={document.question_image_url}></img> */}
                {imageURL && imageURL.map(imageSrc=>
                        <img className="image-preview" key={imageSrc}src={imageSrc}/>)}
                {/* {document.question_image_url.forEach((image_url)=>{
                    <img className="question-image"src={image_url}></img>
                })} */}
                
                <p>added {formatDistanceToNow(document.added_at.toDate(),{addSuffix:true})}</p>
                <p>created_by: {document.created_by}</p>
                <button onClick={handleDelete}>delete</button>

            </div>
        </div>
    )
}
