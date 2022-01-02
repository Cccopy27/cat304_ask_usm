import { useParams } from "react-router-dom";

export default function TagResult({tag}) {
    console.log(tag.length);
    // format tag result
    let resultString = "";
    // if(tag.length == )
    // tag.forEach(element => {
    //     resultString += element+" ";
    // });
    return (
        <div className="result_container">
            <div className="result_header">
                questions regarding {resultString}
                
            </div>
            
        </div>
    )
}
