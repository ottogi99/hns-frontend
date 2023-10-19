import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import URL from 'constants/url';

function Login({onChangeLogin}) {
    const [loginID, setLoginID] = useState("mg311@onthesys.com");
    const [loginPw, setLoginPw] = useState("Kimmj@31");

    const [alertMsg, setAlertMsg] = useState([]);
    
    const idfocus = useRef();
    const pwfocus = useRef();

    const jToken = localStorage.getItem('jToken');

    const navigate = useNavigate();


    const loginHandler = () =>{
        if(loginID === "" ) {
            setAlertMsg(<p>※ 이메일을 입력해주세요</p>);
            idfocus.current.focus();
        } else if (!loginID.includes('@') || !loginID.includes('.')) {
            setAlertMsg(<p>※ 이메일 형식이 올바르지 않습니다</p>);
            idfocus.current.focus();
        } else if (loginPw === "") {
            setAlertMsg(<p>※ 패스워드를 입력해주세요</p>);
            pwfocus.current.focus();
        } else{
            setAlertMsg(<></>);
            console.log(process.env.REACT_APP_API_URL);
            fetch(process.env.REACT_APP_API_URL+'/auth/signin', 
            { method: "POST",
             headers: {
                'Content-type': 'application/json',
                'Authorization': jToken
                }, 
                body: JSON.stringify({ email: loginID, password : loginPw })})
            .then(response => response.json())
            .then(data => { console.log(data);
                setAlertMsg(<p>{data.message}</p>)
                            if(data.statusCode === 401 ) setAlertMsg(<p>{data.message}</p>);
                            else if(data.statusCode === 404 ) setAlertMsg(<p>{data.message}</p>);
                            else{
                                localStorage.setItem('jToken', data.jwt_token)
                                onChangeLogin({loginVO : {id : data.userId, name : data.userName, email : data.userEmail}}); // resultVO : 사용자 정보 중 어떤것인지 확인 필요
                                sessionStorage.setItem('loginUser',JSON.stringify({id : data.userId, name : data.userName, email : data.userEmail}));
                                navigate(URL.MAIN);
                            }
            })
            .catch(err => {console.error(err); setAlertMsg(<p>로그인 할 수 없습니다. 관리자에게 문의하세요.</p>)});
        }
    }
    return (
        <div className='U-BOARD'>
            <p>로그인</p>
            <div className='user-form'>
                <input onChange={(e)=>setLoginID(e.target.value)} ref={idfocus} placeholder='이메일' value={loginID}/>
                <input onChange={(e)=>setLoginPw(e.target.value)} ref={pwfocus} placeholder='패스워드' type='password' value={loginPw}/>
                <div className='alertMsg'>{alertMsg}</div>
                <button className='btn-login' onClick={loginHandler}>로그인</button>
                <button className='btn-signup'  onClick={()=>navigate(URL.SIGNUP)}>회원가입</button>
            </div>
        </div>
    );
}

export default Login;

