import { useState } from "react";
import { db, storage } from "../../firebase/config";
import {collection, addDoc, Timestamp, updateDoc, arrayUnion, doc} from "firebase/firestore";
import {ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./AddQuestion.css";

export default function AddQuestion() {
    const [title, settitle] = useState("");
    const [des, setdes] = useState(""); 
    const [tag, settag] = useState([]);
    const [image, setimage] = useState([]);
    const [loading,setloading] = useState(false);
    

    // when user submit the form
    const handleSubmit=async(e)=>{
        setloading(true);
        e.preventDefault();
        
        // user input as object
        const question_object={
            question_title: title,
            question_description: des,
            question_tag: tag,
            question_image_url:"",
            question_comments:[],
            added_at: Timestamp.now(),
            created_by:""
        }

        //add to database
        const addedDoc = await addDoc(collection(db,"questions"),question_object);

        // convert filelist to array to user array method
        const image_arr = Array.from(image);

        // upload photo to storage firebase to get its photo URL
        image_arr.forEach(img=>{
            // the image will store in question/question.id/image.name
            const uploadPath = `question/${addedDoc.id}/${img.name}`;
            const storageRef = ref(storage, uploadPath);

            uploadBytes(storageRef, img)
            .then((storageImg) =>{
                // get image URL from storage
                getDownloadURL(storageRef)
                .then((imgURL)=>{
                    // update doc imgURL
                    updateDoc(doc(db,"questions",addedDoc.id),{
                        question_image_url: arrayUnion(imgURL)
                    })
                })
                console.log("added question successful");
                setloading(false);
            })
            .catch(err => {
                console.log(err);
            })            
        });
    }
    return (
        <div className="add-question-form">
            <h2>Add new question</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Question title:</span>
                    <input
                    required
                    type="text"
                    onChange={e => {settitle(e.target.value)}}
                    value={title}
                    />
                </label>

                <label>
                    <span>Question description:</span>
                    <textarea
                    required
                    onChange={e => {setdes(e.target.value)}}
                    value={des}
                    />
                </label>

                {/* add tag here  */}

                <label>
                    <span>Image:</span>
                    <input
                    type="file"
                    onChange={e => {setimage(e.target.files)}}
                    multiple accept="image/*"
                    />
                </label>

                {!loading && <button>Add question</button>}
                {loading && <button disabled>loading</button>}
            </form>
        </div>
    )
}
