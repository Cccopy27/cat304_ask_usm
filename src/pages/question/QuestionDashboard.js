import {useEffect, useState} from "react";
import QuestionList from "../../components/QuestionList";
import { useNavigate } from "react-router-dom";
import {collection, getDocs} from "firebase/firestore"; 
import "./QuestionDashboard.css";
import {db} from "../../firebase/config";
import { useCollection } from "../../hooks/useCollection";


export default function QuestionDashboard () {
    // const [document,setDocument] = useState(null);
    const [error, setError] = useState(null);
    const [loading,setLoading] = useState(false);
    const {document, response} = useCollection(["questions"]);

    let result = [];
    useEffect(()=>{
        window.scrollTo(0,0);
        // setLoading(true);
        // getDocs(collection(db,"questions"))
        // .then((querySnapshot) =>{
        //     querySnapshot.forEach((doc)=>{
        //         result.push({...doc.data(), id:doc.id});
        //     });
        // })
        // .then(()=>{
        //     setDocument(result);
        //     setLoading(false);
        // })
        // .catch(err=>{
        //     setError(err);
        // })
    },[])
    
    const navigate = useNavigate();
    // navigate to add question
    const handleAddQuestion = (e) =>{
        navigate("/addquestion");
    }
    return (
        <div className ="question-container">
            <div className="question-header">
                <div className="question-filter">
                    <h2 className="question-header-title">All Questions</h2>
                    <div className="question-tags">Tags</div>

                    <div className="question-sort">Sort-by</div>
                </div>
                <div className="question-add">
                    <button className="question-add-btn" onClick={handleAddQuestion}>Ask Questions</button>
                    {/* add question here */}
                </div>

            </div>
            <div className="question-list">
                {error && <p>Something went wrong... {error}</p>}
                {loading && <p>Loading...</p>}
                {!loading && document && <QuestionList questions={document}/>}
            </div>
        </div>
    )
}
