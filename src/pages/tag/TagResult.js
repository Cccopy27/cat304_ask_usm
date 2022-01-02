import styles from "./TagResult.module.css";
import { useParams } from "react-router-dom";
export default function TagResult() {
    const {result} = useParams();
    return (
        <div>
            {result}
        </div>
    )
}
