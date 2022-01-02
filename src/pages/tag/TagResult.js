import { useParams } from "react-router-dom";

export default function TagResult({tag}) {
    console.log(tag.length);

    // format tag result
    let resultString = "";

    tag.forEach(element => {
        resultString += element+", ";
    });
    return (
        <div className="result_container">
            <div className="result_header">
                Questions related to {resultString}
                
            </div>
            
        </div>
    )
}
