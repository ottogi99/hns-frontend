import React, { useState } from 'react';

function ModalContent(props){
    let fcType = props.fcType;
    const obStation = props.obStation;

    const jToken = localStorage.getItem('jToken');
    const [obCode, setObCode] = useState(props.data[0]);
    const [cdCode, setCdCode] = useState(props.data[1]);
    const [cdName, setCdName] = useState(props.data[2]);

    function validChecker(){
        if(obCode === "") {console.log("obCode"); return false;}
        else if(cdCode === "") {console.log("cdCode"); return false;}
        else if(cdName === "") {console.log("cdName"); return false;}
        else return true;
    }

    const createHandler = () => {
        console.groupCollapsed("cdMasterCreate()");
        if (window.confirm('수집자원를 등록하시겠습니까?')) {
            if(validChecker()===true){
            fetch(process.env.REACT_APP_API_URL+'/cd-master', 
                { method: "POST",
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': jToken
                    }, 
                body: JSON.stringify({obCode: obCode, cdCode: cdCode, cdName: cdName}) })
                .then(response => {response.json()})
                .catch(err => console.error(err));
            alert("등록완료");
            } else {
                alert("정보를 모두 입력해주세요");
                return false;
            };
        }
        else {
           alert('등록이 취소되었습니다.');
        }
        console.groupEnd("cdMasterCreate()");
        props.getModalCnt();
    };

    const updateHandler = () => {
        console.groupCollapsed("cdMasterUpdate()");
        let url = process.env.REACT_APP_API_URL+'/cd-master/'+cdCode+'/'+obCode;
        console.log(url);
        fetch(url, 
        { method: "PUT",
        headers: {
            'Content-type': 'application/json',
            'Authorization': jToken
            }, 
        body: JSON.stringify({cdName: cdName}) })
        alert("수정되었습니다");
        console.groupEnd("cdMasterUpdate()");
        props.getModalCnt();
    };

    if(fcType === "C"){
            return(
                <div className="modal-form">
                    <h1>수집자원 등록</h1>
                    <table>
                        <tbody>
                            <tr>
                                <td>관측소 코드</td> <td><select  name= 'obStation' onChange={(e)=>setObCode(e.target.value)}>
                                    {
                                        obStation.map((data, index)=>{
                                            return <option key = {index} value = {data.OB_CODE}>{data.OB_NAME}</option>
                                        })
                                        
                                    }
                                </select></td>
                            </tr><tr>
                                <td>수집자원 코드</td> <td><input type="text" name="cdCode" value= {cdCode} onChange={(e)=>setCdCode(e.target.value)}/></td>
                            </tr><tr>
                                <td>수집자원 이름</td> <td><input type="text" name="cdName" value= {cdName} onChange={(e)=>setCdName(e.target.value)}/></td>
                            </tr>
                        </tbody>
                    </table>
                    <button className="btn btn-primary" onClick={() => createHandler()} >저장</button>
                </div>
            )
    } else {
            return(
                <div className="modal-form">
                    <h1>수집자원 정보 수정</h1>
                    <table>
                        <tbody>
                            <tr>
                                <td>관측소 코드</td> <td><input className="ipt-read" type="text" name="obCode" value= {obCode} readOnly /></td>
                            </tr><tr>
                                <td>수집자원 코드</td> <td><input className="ipt-read" type="text" name="cdCode" value= {cdCode} readOnly/></td>
                            </tr><tr>
                                <td>수집자원 이름</td> <td><input type="text" name="cdName" value= {cdName} onChange={(e)=>setCdName(e.target.value)}/></td>
                            </tr>
                        </tbody>
                    </table>
                    <button className="btn btn-primary" onClick={() => updateHandler()}>저장</button>
                </div>
            )
    }
}

export default ModalContent;