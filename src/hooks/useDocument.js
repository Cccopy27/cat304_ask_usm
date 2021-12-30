import { useEffect, useState } from "react"
import { db } from "../firebase/config"
import { collection,doc,onSnapshot } from "firebase/firestore";
// get single document 
// collections = name of collection, in terms of array
// example,want to collection(db, questions,"questions_id",comment)
// pass [ questions,"questions_id",comment]

// id = id of document u wan to fetch
export const useDocument =(collections,id)=>{
    const [document, setDocument] = useState(null);
    const [error, setError] = useState(null);

    useEffect(()=>{
        console.log("I keep running in document");
        const ref = doc(collection(db,collections),id);

        // real time listener
        const unsub = onSnapshot(ref, (snapshot)=>{
            if(snapshot.data()){
                setDocument({...snapshot.data(),id: snapshot.id});
                setError(null);
            }
            else{
                setError("no document found");
            }
            
        },(err)=>{
            console.log(err.message);
            setError(err.message);
        })
        return()=>{unsub()};

    },[])

    // return document with data
    // return error if there are
    return {document, error}

}