import React, { useState, useEffect } from 'react';

function ModalContentUser(props){
    const jToken = localStorage.getItem('jToken');
    const user = props.data;
    const roles = props.roles;
    const [name, setName] = useState(user.USER_NAME);
    const [userRole, setUserRole] = useState([]);


        //권한 선택 리스트 수정
    const onCheckedElement = (checked, item) => {
        if (checked)    setUserRole([...userRole, item]);
        else if (!checked)    setUserRole(userRole.filter(el => el !== item));
    };

    const updateHandler = () => {
        let url = process.env.REACT_APP_API_URL+'/users/'+user.USER_ID;
        console.log(url);
        console.log(JSON.stringify({name:name, roleCode:userRole}));
        console.log(jToken);
        fetch(url, 
        { method: "POST",
        headers: {
            'Content-type': 'application/json',
            'Authorization': jToken
            }, 
        body: JSON.stringify({name:name, roleCode:userRole})})
        .then(data => {
            if(data.status==='success') alert("변경이 완료되었습니다");
        })
        props.getModalCtl();
    };

    useEffect(()=>{roles.map((role, idx)=>{
        let tagInfo = document.querySelectorAll("#role"+idx);
        if(tagInfo[0] !== undefined) {
            for(let i = 0 ; i < user.ROLES.length ; i++) {
                if(tagInfo[0].value === user.ROLES[i].ROLE_CODE) {
                    tagInfo[0].checked = true;
                    setUserRole([user.ROLES[i].ROLE_CODE])
                }
            }
        }
})}, []);
    return(
        <div className="modal-form">
            <h1>사용자 정보 수정</h1>
            <table>
                <tbody>
                    <tr>
                        <td>이메일</td><td>{user.USER_EMAIL}</td>
                    </tr><tr>
                        <td>이름</td><td><input type="text" name="name" value= {name} onChange={(e)=>setName(e.target.value)}/></td>
                    </tr><tr>
                        <td>권한</td><td>
                            <div className='rolesCheck'>{roles.map((role, idx)=>{
                                return <><input type = 'checkbox' name={'roles'} id={"role"+idx} key = {idx} value = {role.ROLE_CODE}  
                                                    onChange={e => {onCheckedElement(e.target.checked, e.target.value);}}/> 
                                                    {role.ROLE_NAME} 
                                        </>
                                })}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <button className="btn btn-primary" onClick={() => updateHandler()} >저장</button>
        </div>
    )
}

export default ModalContentUser;