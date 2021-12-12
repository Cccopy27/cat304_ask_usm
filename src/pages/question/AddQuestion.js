import { useState } from "react"

export default function AddQuestion() {
    const [title, settitle] = useState("");
    const [des, setdes] = useState(""); 
    const [tag, settag] = useState([]);
    const [image, setimage] = useState([]);

    // when user submit the form
    const handleSubmit=(e)=>{
        e.preventDefault();
        const object={
            question_title: title,
            question_description: des,
            question_tag: tag,
            question_image: image
        }
        console.log(object);
    }
    return (
        <div className="add-question-form">
            <h2>Add new question</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Question title:</span>
                    <input
                    required
                    type="text"
                    onChange={e => {settitle(e.target.value)}}
                    value={title}
                    />
                </label>

                <label>
                    <span>Question description:</span>
                    <textarea
                    required
                    onChange={e => {setdes(e.target.value)}}
                    value={des}
                    />
                </label>

                {/* add tag here  */}

                <label>
                    <span>Image:</span>
                    <input
                    type="file"
                    onChange={e => {setimage(e.target.value)}}
                    value={image}
                    multiple accept="image/*"
                    />
                </label>

                <button>Add question</button>
                
            </form>
        </div>
    )
}
