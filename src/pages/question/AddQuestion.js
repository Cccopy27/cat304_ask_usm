import { useEffect, useState } from "react";
import { db, storage } from "../../firebase/config";
import {collection, addDoc, Timestamp, updateDoc, arrayUnion, doc} from "firebase/firestore";
import {ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./AddQuestion.css";

export default function AddQuestion() {
    const [title, settitle] = useState("");
    const [des, setdes] = useState(""); 
    const [tag, settag] = useState([]);
    const [image, setimage] = useState([]);
    const [imageURLs,setImageURLs] = useState([]);
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

    // preview image
    useEffect(()=>{
        const newImageURLs = [];
        image.forEach(image=>{
            newImageURLs.push(URL.createObjectURL(image));
        });
        setImageURLs(newImageURLs);
    },[image]);

    
    return (
        <div className="add-question-container">
            <div className="add-question-header">
                <h2 className="add-question-title">Add new question</h2>
            </div>
            <div className="add-question-form-container">
                <form className="add-question-form" onSubmit={handleSubmit}>
                    <label className="add-question-title">
                        <span className="span-title">Question title:</span>
                        <input
                        required
                        type="text"
                        className="input-style"
                        onChange={e => {settitle(e.target.value)}}
                        value={title}
                        />
                    </label>

                    <label className="add-question-tag">
                        <span className="span-title">Question Tags:</span>
                        {/* add tag here  */}
                    </label>

                    <label className="add-question-des">
                        <span className="span-title">Question description:</span>
                        <textarea 
                        className="add-question-des-input input-style"
                        required
                        onChange={e => {setdes(e.target.value)}}
                        value={des}
                        />
                    </label>


                    <label className="add-question-img">
                        <span className="span-title">Image:</span>
                        <input
                        className="input-style"
                        type="file"
                        onChange={e => {setimage([...e.target.files])}}
                        multiple accept="image/*"
                        />
                    </label>

                    <div className="image-preview-container">
                        {imageURLs.map(imageSrc=>
                        <img className="image-preview" key={imageSrc}src={imageSrc}/>)}
                    </div>

                    {!loading && <button className="submit-btn">Add question</button>}
                    {loading && <button className="submit-btn"disabled>loading</button>}
                </form>
            </div>
            
        </div>
    )
}
