import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TagResult({tag}) {
    const [popularMode, setPopularMode] = useState(true);
    // format tag result
    let resultString = "";

    tag.forEach(element => {
        resultString += element+", ";
    });
    useEffect(()=>{
        tag[0] === "popular" ? setPopularMode(true) : setPopularMode(false);
    },[tag])
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
