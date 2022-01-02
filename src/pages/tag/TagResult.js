import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TagResult() {
    const [popularMode, setPopularMode] = useState(true);
    const {result} = useParams();
    const [tag, setTag] = useState(result.split("&"));
    let resultString = "";

    // format tag result for output purpose
    tag.forEach(element => {
        console.log(element);
        resultString += element+", ";
    });

    // check should show popular or normal pages
    useEffect(()=>{
        tag[0] === "popular" ? setPopularMode(true) : setPopularMode(false);
    },[tag]);

    // update tag when changing pages
    useEffect(()=>{
        setTag(result.split("&"));
    },[result]);

    return (
        <div className="result_container">
            {popularMode && 
                <div className="result_header">
                Popular tags...
                </div>
            }
            {!popularMode && 
                <div className="result_header">
                    Question related to {resultString}
                </div>
            }
            
            
        </div>
    )
}
