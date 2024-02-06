
import { useNavigate } from "react-router-dom";


function Login () {
  let navigate = useNavigate();

  return(
    <div className="login-container">
      <form action="/login" method="POST">
        <div>
          <label htmlFor="username">
            <h4>ID</h4>
            <input className="id-input" type="text" name="username" />
          </label>
          <div className="id-alert">ID를 입력해주세요.</div>
        </div>
        <div>
          <label htmlFor="password">
            <h4>PW</h4>
            <input className="pw-input" type="password" name="password" />
          </label>
          <div className="pw-alert">PW를 입력해주세요.</div>
        </div>
        <div className="login-btn-container">
          <button className="signup-btn" onClick={(e) => {
            navigate('/register');
            e.preventDefault();
          }}>Sign up</button>
          <button type="submit" className="login-btn" onClick={(e) => {
            const idValue = document.querySelector('.id-input');
            const pwValue = document.querySelector('.pw-input');
            if(idValue instanceof HTMLInputElement && pwValue instanceof HTMLInputElement){
              const idAlert = document.querySelector('.id-alert');
              const pwAlert = document.querySelector('.pw-alert');

              if(idAlert instanceof HTMLElement && pwAlert instanceof HTMLElement){
                idAlert.style.opacity = '0';
                pwAlert.style.opacity = '0';
              }

              if(idValue.value.length === 0){
                if(idAlert instanceof HTMLElement){
                  idAlert.style.opacity = '1';
                  e.preventDefault();
                }
              }
              if(pwValue.value.length === 0){
                if(pwAlert instanceof HTMLElement){
                  pwAlert.style.opacity = '1';
                  e.preventDefault();
                }
              }
            }
          }}>Log in</button>
        </div>
      </form>
    </div>
  )
}

export default Login 
