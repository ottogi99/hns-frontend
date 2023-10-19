import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import URL from 'constants/url';

const Header = ({onChangeLogin}) => {
    let loginUser = {};
    let sesseionUserId = "" ;
    let sesseionUserName = "" ;
    let pathNm = window.location.pathname
    const navigate = useNavigate();

    if(JSON.parse(sessionStorage.getItem('loginUser'))){
        loginUser = JSON.parse(sessionStorage.getItem('loginUser'));
        sesseionUserId =  loginUser.id;
        sesseionUserName = loginUser.name;
        console.log(localStorage.getItem('jToken'))
    }

    const logoutHandler = () =>{
        if(window.confirm("로그아웃 하시겠습니까?")){
            onChangeLogin({loginVO : {id : "", name : "", email: ""}})
            localStorage.clear();
            sessionStorage.clear();
                if(pathNm === '/manager') alert("접근 권한이 없습니다. 다시 로그인 후 접근해주세요");
            navigate(URL.LOGIN);
        }
    }

    useEffect(()=>{
        if(pathNm === '/manager') {
            if(!sesseionUserId){
                alert("접근 권한이 없습니다.")
                navigate(URL.LOGIN);
            }
        }
    },[loginUser]);

    return (
        <div style={{padding: '20px 20px 0 20px', marginBottom: '10px', width: '100%', height:'90px', clear: 'center'  }}>
            <div style={{float: 'left'}}>
                <h1 style={{float: 'left', fontSize:'40px'}}>HNS해양 배출 시스템</h1>
                {sesseionUserId && pathNm !== '/manager' && <button className='btn btn-login' onClick={()=>navigate(URL.MANAGER)}  style={{marginTop: '17px'}}>관리자 페이지</button>}
            </div>
            {!sesseionUserId &&
                <button className='btn btn-login' style={{float: 'right', marginTop: '17px'}} onClick={()=>navigate(URL.LOGIN)}>로그인</button>
            }
            {sesseionUserId &&
                <div  style={{float: 'right', marginTop: '17px'}}>
                    <span> {sesseionUserName} </span> 님
                    <button className='btn btn-signup' onClick={()=>logoutHandler()}>로그아웃</button>
                </div>
            }
        </div>
    )
  }
  export default Header;