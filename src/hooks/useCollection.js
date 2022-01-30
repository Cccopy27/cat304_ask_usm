import { useEffect, useRef, useState } from "react"
import { db } from "../firebase/config";
import { collection ,onSnapshot, query, where,orderBy } from "firebase/firestore";
// use to get data from collection (whole collection)
// collections = name of collection in terms of array
// example, want to collection(db, posts,"posts_id",comment)
// pass [ posts,"posts_id",comment]
export const useCollection=(collections, queries2,orderBy2)=>{
    const [document, setDocument] = useState(null);
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);
    // useref to prevent infinite loop
    // _quries is an array and it is different on every function call
    // const queries = useRef(queries2).current;
    // console.log(queries2.current);
    // const orderBys = useRef(orderBy2).current;
    
    useEffect(()=>{
        setLoading(true);
        let ref = collection(db, ...collections);
        if(queries2){
            ref = query(ref,where(...queries2));
        }
        if(orderBy2){
            ref = query(ref, orderBy(...orderBy2));
        }
        const unsub = onSnapshot(ref, (snapshot)=>{
            console.log("I keep running in onSnapShot collections");

            let results= [];
            snapshot.docs.forEach((doc)=>{
                results.push({...doc.data(), id: doc.id});
            });

            //update state
            setDocument(results);
            setError(null);
            setLoading(false);
        },(error)=>{
            console.log(error);
            setError(error.message);
            setLoading(false);
        })

        //handle unmount
        return()=>{
            unsub();
            console.log("unmount");
        }
    },[])

    return{document, error, loading};
}