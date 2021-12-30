import { useEffect, useRef, useState } from "react"
import { db } from "../firebase/config";
import { collection ,onSnapshot, query, where,orderBy } from "firebase/firestore";
// use to get data from collection (whole collection)
// collections = name of collection in terms of array
// example, want to collection(db, questions,"questions_id",comment)
// pass [ questions,"questions_id",comment]
export const useCollection=(collections, queries2,orderBy2)=>{
    const [document, setDocument] = useState(null);
    const [error, setError] = useState(null)

    // useref to prevent infinite loop
    // _quries is an array and it is different on every function call
    const queries = useRef(queries2).current;
    const orderBys = useRef(orderBy2).current;
    useEffect(()=>{

        let ref = collection(db, ...collections);
        if(queries){
            ref = query(ref,where(...queries));
        }
        if(orderBys){
            ref = query(ref, orderBy(...orderBys));
        }
        const unsub = onSnapshot(ref, (snapshot)=>{
            console.log("I keep running in collections");
            let results= [];
            snapshot.docs.forEach((doc)=>{
                results.push({...doc.data(), id: doc.id});
            });

            //update state
            setDocument(results);
            setError(null);
        },(error)=>{
            console.log(error);
            setError(error.message)
        })

        //handle unmount
        return()=>{
            unsub();
        }
    },[])

    return{document, error};
}