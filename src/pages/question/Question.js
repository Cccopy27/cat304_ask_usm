import "./Question.css";
import { useState, useEffect } from "react";
import {useParams} from "react-router-dom";
import {useDocument} from "../../hooks/useDocument";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useFirestore } from "../../hooks/useFirestore";
import { useNavigate } from "react-router";
import { getStorage, ref, deleteObject } from "firebase/storage";
import {storage} from "../../firebase/config";
import Swal from "sweetalert2";
import EditQuestion from "./EditQuestion";
import AddComment from "./AddComment";

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
    const[loading,setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    useEffect(() => {
        window.scrollTo(0,0);
        const tempArray = [];
        // get all image
        // only show image if the document is fetched and got image to show
        if(document && document.question_image_url){
            document.question_image_url.forEach(item=>{
                tempArray.push(item);
            })
            setImageURL(tempArray);
        }   
    }, [document]);
    // delete question
    const handleDelete=(e)=>{
        e.preventDefault();
        // alert user
        Swal.fire({
            title: 'Do you want to delete the question?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            denyButtonText: `Don't delete`,
            
          }).then(async(result) => {
              // delete
            if (result.isConfirmed) {
                // loading
                setLoading(true);
                Swal.fire({
                    title:"Now Loading...",
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                })
                Swal.showLoading();

                // delete storage image
                // loop each image
                
                document.question_image_name.forEach(image_name=>{
                    // Create a reference to the file to delete
                    const desertRef = ref(storage, `question/${document.id}/${image_name}`);
                    // Delete the file
                    deleteObject(desertRef).then(() => {
                        // File deleted successfully

                    }).catch((error) => {
                        console.log(error);
                    // Uh-oh, an error occurred!
                    });
                })
                deleteDocument(document.id)
              Swal.fire('Deleted!', '', 'success');
              setLoading(false);
              navigate("/question");
            } else if (result.isDenied) {
              Swal.fire('Question not deleted', '', 'info')
            }
          })
    };
    if(error){
        return <div>{error}</div>
    };
    if(!document){
        return <div>Loading...</div>
    };
    const handleEdit=()=>{
        setEditMode(true);
    }
    return (
        <div>
            {!editMode && 
                <div className="question-details">
                    <h2>{document.question_title}</h2>
                    
                    <p>added {formatDistanceToNow(document.added_at.toDate(),{addSuffix:true})}</p>
                    <p>tags:{document.question_tag}</p>

                    <p>{document.question_description}</p>
                    
                    {imageURL && imageURL.map(imageSrc=>
                            <img className="image-preview" key={imageSrc}src={imageSrc}/>)}

                    <p>created_by: {document.created_by}</p>
                    
                    <button onClick={handleDelete}>delete</button>
                    
                    <button onClick={handleEdit}>edit</button>
                </div>
            }
            <EditQuestion document = {document}editMode={editMode} setEditMode={setEditMode}/>
            <AddComment question_id={document.id}/>
            
        </div>
    )
}
