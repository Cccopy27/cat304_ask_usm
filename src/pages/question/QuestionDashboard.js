import {useEffect, useState} from "react";
import QuestionList from "../../components/QuestionList";
import { useNavigate } from "react-router-dom";
import {collection, onSnapshot, getDocs} from "firebase/firestore"; 
import "./QuestionDashboard.css";
import {db} from "../../firebase/config";

export default function QuestionDashboard () {
    const [document,setDocument] = useState(null);
    const [error, setError] = useState(null);

    // fetch data
    // useEffect(()=>{
    //     const ref = collection(db,"questions");
    //     const unsub = onSnapshot(ref, (snapshot)=>{
    //         let result = [];
    //         snapshot.docs.forEach((doc)=>{
    //             result.push({...doc.data(), id: doc.id});
    //         });

    //         // update state
    //         setDocoument(result);
    //         console.log(document);
    //         setError(null);
    //     },(error)=>{
    //         setError(error.message);
    //         console.log(error);
    //     })

    //     // handle unmount
    //     return()=>{
    //         unsub();
    //     }
    // },[]);
    let result = [];
    useEffect(()=>{
        getDocs(collection(db,"questions"))
        .then((querySnapshot) =>{
            querySnapshot.forEach((doc)=>{
                console.log("hi");
                result.push({...doc.data(), id:doc.id});
            });
        })
        .then(()=>{
            setDocument(result);
        })
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
                {document && <QuestionList questions={document}/>}
            </div>
        </div>
    )
}
