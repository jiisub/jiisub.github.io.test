import { useNavigate } from "react-router-dom";

function SignUp(){
  let navigate = useNavigate();

  return(
    <div className="signup-container">
      <form action="/register" method="POST">
        <h3>Sign Up</h3>
        <div className="signup-id-container">
          <label htmlFor="username">
            <h4>ID</h4>
            <input className="signup-id-input" type="text" name="username" />
          </label>
          <div className="signup-id-alert">ID를 입력해주세요.</div>
        </div>
        <div>
          <label htmlFor="password">
            <h4>PW</h4>
            <input className="signup-pw-input" type="password" name="password" />
          </label>
          <div className="signup-pw-alert">12자 이하로 영어,숫자를 포함시켜주세요.</div>
        </div>
        <div className="signup-btn-container">
          <button type="submit" className="register-btn" onClick={(e) => {
            const idValue = document.querySelector('.signup-id-input');
            const pwValue = document.querySelector('.signup-pw-input');
            if(pwValue instanceof HTMLInputElement && idValue instanceof HTMLInputElement){
              const idAlert = document.querySelector('.signup-id-alert');
              const pwAlert = document.querySelector('.signup-pw-alert');
              if(pwAlert instanceof HTMLElement && idAlert instanceof HTMLElement){
                idAlert.style.opacity = '0';
                pwAlert.style.opacity = '0';
              }

              if(idValue.value.length === 0){
                if(idAlert instanceof HTMLElement){
                  idAlert.style.opacity = '1';
                  e.preventDefault();
                }
              }
              if(pwValue.value.length > 12 || pwValue.value.length === 0 || !/[0-9]/.test(pwValue.value) || !/[a-z]/i.test(pwValue.value)){
                if(pwAlert instanceof HTMLElement){
                  pwAlert.style.opacity = '1';
                  e.preventDefault();
                }
              }
            }
          }}>Register</button>
          <button className="close-btn" onClick={() => {
            navigate('/login');
          }}>Close</button>
        </div>
      </form>
    </div>
  )
}

export default SignUp