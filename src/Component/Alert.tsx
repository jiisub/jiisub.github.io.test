import { useNavigate } from "react-router-dom";

function Alert(){
  let navigate = useNavigate();

  return(
    <div className="alert-container">
      <div className="alert-bg">
        <h3>중복된 ID가 있습니다.</h3>
        <button onClick={() => {
          navigate('/register');
        }}>Back</button>
      </div>
    </div>
  )
}

export default Alert;