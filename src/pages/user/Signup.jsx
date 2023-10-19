import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import URL from 'constants/url';

function Login() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rpassword, setRPassword] = useState("");
//    const [company, setCompany] = useState("");

    const [alertMsg, setAlertMsg] = useState([]);
    const [tokenInfo, setTokenInfo] = useState({ name : "", email: "", signUpVerifyToken : ""});
    const [isToken, setIsToken] = useState(false);

    const idfocus = useRef();
    const pwfocus = useRef();
    const rpwfocus = useRef();
    const namefocus = useRef();
//    const companyfocus = useRef();

    const navigate = useNavigate();

    const signupHandler = () =>{
        if(name === "" ) {
            setAlertMsg(<p>※ 이름을 입력해주세요</p>);
            namefocus.current.focus();
        }else if(email === "" ) {
            setAlertMsg(<p>※ 이메일을 입력해주세요</p>);
            idfocus.current.focus();
        } else if (!email.includes('@') || !email.includes('.')) {
            setAlertMsg(<p>※ 이메일 형식이 올바르지 않습니다</p>);
            idfocus.current.focus();
        } else if (password === "") {
            setAlertMsg(<p>※ 패스워드를 입력해주세요</p>);
            pwfocus.current.focus();
        } else if (rpassword === "") {
            setAlertMsg(<p>※ 패스워드확인을 입력해주세요</p>);
            rpwfocus.current.focus();
        } else if (password !== rpassword) {
            setAlertMsg(<p>※ 패스워드가 일치하지 않습니다</p>);
            rpwfocus.current.focus();
//        } else if (company === "") {
//            setAlertMsg(<p>※ 소속을 입력해주세요</p>);
//            companyfocus.current.focus();
        } else{
            setAlertMsg(<></>);
            console.log(JSON.stringify({ name : name, email: email, password : password}));
            fetch(process.env.REACT_APP_API_URL+'/auth/signup', 
                { method: "POST", 
                 headers: {
                    'Content-type': 'application/json'
                    }, 
                    body: JSON.stringify({ email: email, name : name, password : password})})
            .then(response => response.json())
            .then(data => { setTokenInfo(data); console.log(data);})
            .catch(err => console.error(err));
        }
    }

    useEffect(()=>{
        if(tokenInfo.signUpVerifyToken !== ""){
            if(isToken === false){
            let url = process.env.REACT_APP_API_URL+'/auth/email-verify?signupVerifyToken=' + tokenInfo.signUpVerifyToken;
            fetch( url , 
                { method: "POST", 
                 headers: {
                    'Content-type': 'application/json',
                    }, 
                    body: JSON.stringify({ email: email, name : name, password : password})})
            .then(response => response.json())
            .then(data => { alert(data.message); navigate(URL.LOGIN);})
            .catch(err => console.error(err));
            setIsToken(true);
            }
        } else setIsToken(false);
    },[tokenInfo]);

    return (
        <div className='U-BOARD'>
            <p>회원가입</p>
            <div className='user-form'>
                <input onChange={(e)=>setName(e.target.value)} ref={namefocus} placeholder='이름'/>
                <input onChange={(e)=>setEmail(e.target.value)} ref={idfocus} placeholder='이메일'/>
                <input onChange={(e)=>setPassword(e.target.value)} ref={pwfocus} placeholder='패스워드' type='password'/>
                <input onChange={(e)=>setRPassword(e.target.value)} ref={rpwfocus} placeholder='패스워드확인' type='password'/>
{/*                <input onChange={(e)=>setCompany(e.target.value)} ref={companyfocus} placeholder='소속'/> */}
                <div className='alertMsg'>{alertMsg}</div>
                <button className='btn-signup'  onClick={()=>signupHandler()}>등록</button>
            </div>
        </div>
    );
}

export default Login;

