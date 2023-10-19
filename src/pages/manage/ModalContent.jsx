import React, { useState } from 'react';

function ModalContent(props){
    let fcType = props.fcType;
    const jToken = localStorage.getItem('jToken');

    const [obCode, setObCode] = useState(props.data[0]);
    const [obName, setObName] = useState(props.data[1]);
    const [obAddr, setObAddr] = useState(props.data[2]);

    function validChecker(){
        if(obCode === "") return false;
        else if(obName === "") return false;
        else if(obAddr === "") return false;
        else return true;
    }

    const createHandler = () => {
        console.groupCollapsed("createObs()");
        if (window.confirm('관측소를 등록하시겠습니까?')) {
            if(validChecker()===true){
                console.log(JSON.stringify({obCode : obCode, obName : obName, obAddr : obAddr}));
            fetch(process.env.REACT_APP_API_URL+'/obs-station', 
                { method: "POST",
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': jToken
                    }, 
                body: JSON.stringify({obCode: obCode, obName: obName, obAddr: obAddr}) })
//                .then(response => {response.json(); console.log("응답",response)})
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
        console.groupEnd("createObs()");
        props.getModalCnt();
    };

    const updateHandler = () => {
        console.groupCollapsed("obsStationUpdate()");
        let url = process.env.REACT_APP_API_URL+'/obs-station/'+obCode;
        fetch(url, 
        { method: "PUT",
        headers: {
            'Content-type': 'application/json',
            'Authorization': jToken
            }, 
        body: JSON.stringify({obName: obName,
                              obAddr: obAddr}) });
        alert("수정되었습니다");
        console.groupEnd("obsStationUpdate()");
        props.getModalCnt();
    };

    if(fcType === "C"){
            return(
                <div className="modal-form">
                    <h1>관측소 등록</h1>
                    <table>
                        <tbody>
                            <tr><td>관측소 코드</td><td><input type="text" name="obCode" value= {obCode} onChange={(e)=>setObCode(e.target.value)}/></td></tr>
                            <tr><td>관측소 이름</td><td><input type="text" name="obName" value= {obName} onChange={(e)=>setObName(e.target.value)}/></td></tr>
                            <tr><td>관측소 주소</td><td><input type="text" name="obAddr" value= {obAddr} onChange={(e)=>setObAddr(e.target.value)}/></td></tr>
                        </tbody>
                    </table>
                    <button className="btn btn-primary" onClick={() => {createHandler();}}>저장</button>
                </div>
            )
    } else {
            return(
                <div className="modal-form">
                    <h1>관측소 정보 수정</h1>
                    <table>
                        <tbody>
                            <tr><td>관측소 코드</td><td><input className="ipt-read" type="text" name="obCode" value= {obCode} readOnly/></td></tr>
                            <tr><td>관측소 이름</td><td><input type="text" name="obName" value= {obName} onChange={(e)=>setObName(e.target.value)}/></td></tr>
                            <tr><td>관측소 주소</td><td><input type="text" name="obAddr" value= {obAddr} onChange={(e)=>setObAddr(e.target.value)}/></td></tr>
                        </tbody>
                    </table>
                    <button type="submit" className="btn btn-primary" onClick={() => updateHandler()}>저장</button>
                </div>
            )
    }
}

export default ModalContent;