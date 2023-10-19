import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Pagination from 'pages/common/Pagenation';

function ManagerUser(props) {
    console.group("ManagerUser");
    console.log("[Start] ManagerUser ------------------------------");
    console.log("ManagerUser [props] : ", props);
    const location = useLocation();
    console.log("ManagerUser [location] : ", location);
    const jToken = localStorage.getItem('jToken');
    const [dataSheet, setdataSheet] = useState([]);
    const [roles, setRoles] = useState([]);
    const [search, setSearch] = useState("");

    const [userNm, setUserNm] = useState();
    const [userRole, setUserRole] = useState([]);

    //권한 선택 리스트 수정
    const onCheckedElement = (checked, item) => {
        if (checked) {
            setUserRole([...userRole, item]);
        } else if (!checked) {
            setUserRole(userRole.filter(el => el !== item));
        }
        console.log(userRole);
      };
    let upCtl = false; //한 개의 row만 수정할 수 있도록 함

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const [totalPosts, setTotalPosts] = useState(0);
    
    const column = [
        {NAME: '이메일'  , field:'USER_EMAIL'},
        {NAME: '이름'    , field:'USER_NAME'},
        {NAME: '권한이름'        , field:'ROLE_NAME'},
        {NAME: '기능'           , field:'DATA_MANAGER'}
    ];

    const roleList = () => {
        fetch(process.env.REACT_APP_API_URL+'/roles/', 
            { headers: {
               'Authorization': jToken
            }})
        .then(response => response.json())
        .then(data => {console.log(data);
            if(data.meta.total > 0) setRoles(data.data);
            else setRoles([]);}) 
            
    };


    const dataList = () => {
        let url = process.env.REACT_APP_API_URL+'/users';
        if(search !== "") url += '?keyword=' + search;
        if(postsPerPage !== 10) {
            if(!url.includes('?')) url +='?'; 
            else url +='&';
            url += 'take=' + postsPerPage;
        }
        if(currentPage !== 1) {
            if(!url.includes('?')) url +='?'; 
            else url +='&';
            url += 'page=' + currentPage;
        }
        fetch(url, 
            { headers: {
               'Authorization': jToken
            }})
                .then(response => response.json())
                .then(data => {console.log(data.data)
                    if(data.meta.total > 0) {setdataSheet(data.data); setTotalPosts(data.meta.total);}
                    else setdataSheet([]);}) 
            };

    const deleteHandler = (ids) =>{
        let url = process.env.REACT_APP_API_URL+'/users/'+ids;
        if (window.confirm("사용자를 삭제하시겠습니까?")) {
            fetch(url, {method:"DELETE", headers: {'Authorization': jToken}})
            .then(response => response.json())
            .then(data=> data.status === "success" && alert("삭제되었습니다"));
        };
        dataList();
    };

    const updateHandler = (data) => {

        userNm === "" && setUserNm(data.USER_NAME);
        userRole === "" && setUserRole(data.ROLES.ROLE_CODE);

        let url = process.env.REACT_APP_API_URL+'/users/'+data.USER_ID;
        console.log(data.USER_ID);
        console.log(JSON.stringify({ name: userNm, roleCodes: [userRole]}));

        fetch(url, { method: "PUT", 
                    headers: { 'Content-type': 'application/json', 'Authorization': jToken}, 
                       body: JSON.stringify({ roleName: userNm, roleCodes: userRole})})
        .then(response => response.json())
        .then(data => {
            if(data.status==='success') alert("변경이 완료되었습니다");
        });
        dataList();
    };

    function modifyHandler(obj, roles) {
        if(upCtl === false){
        upCtl = true;
        obj.className = 'btn-hidden';
        obj.nextSibling.className = 'btn-block';
        obj.parentElement.parentElement.className = 'modify';
        obj.parentElement.previousSibling.firstChild.style.display = 'none';
        obj.parentElement.previousSibling.lastChild.style.display = 'block';

        for(let i = 0 ; i < roles.length ; i++) setUserRole([...userRole, roles[i].ROLE_CODE]);

        let inpCtl = obj.parentElement.parentElement.children;
        for(let i = 1; i < inpCtl.length; i++) inpCtl[i].children[0].readOnly = false;
        } else alert("현재 수정중인 데이터가 있습니다. 수정완료 후 재시도해주세요.");
    };

    function modifyAct(obj){
        obj.className = 'btn-hidden';
        obj.previousSibling.className = 'btn-block';
        obj.parentElement.parentElement.className = 'label';
        upCtl = false;
        obj.parentElement.previousSibling.firstChild.style.display = 'block';
        obj.parentElement.previousSibling.lastChild.style.display = 'none';
        let inpCtl = obj.parentElement.parentElement.children;
        for(let i = 1; i < inpCtl.length; i++) inpCtl[i].children[0].readOnly = true;
        
    };

    function saveHandler(obj, data) {
        modifyAct(obj);
        if(window.confirm("저장하시겠습니까?")){
            updateHandler(data);
        }
    };

    function rolesCd(data){
        let roleCd = '';
        for(let i = 0; i < data.length; i++){
            if (roleCd === '') roleCd = data[i].ROLE_NAME;
            else roleCd = roleCd +', ' + data[i].ROLE_NAME
        }
        return roleCd
    }
    useEffect(()=>{
        dataList(); 
        roleList(); 
        if(document.querySelector('.modify') !== null) modifyAct(document.querySelector('.modify').children[4].children[1]);
    }, [currentPage]);
    useEffect(dataList, [postsPerPage]);

    console.log("------------------------------ManagerUser [End]");
    console.groupEnd("ManagerUser");

    return (
    	 <div className="C_BOARD">
            <div>
                <h1>사용자 관리</h1>
                    <div className='right-box'>
                    <input className='search-box' type="text" placeholder="권한코드/이름, 설명을 입력하세요." onChange={(e)=>setSearch(e.target.value)} value={search} />
                    <button className="btn btn-search " onClick={() => dataList()} >검색</button>
                    <img className = "refresh-img" src="/assets/images/ico_refresh_grey.png" onClick={() => {dataList(); setSearch(""); }} alt=""/>
                </div>
            </div>
            <table className="boardTable">
                <thead>
                   <tr><td style={{display:"none"}}></td>{column.map((data, index)=><th key = {index}>{data.NAME}</th>)}</tr>
                </thead>
                <tbody><tr style={{display:"none"}}><td></td></tr>
                   {dataSheet.length === 0 && <tr style={{border:"0px"}}><td colSpan={column.length} style={{border:"0px"}}>검색 결과가 없습니다</td></tr>}
                   {dataSheet.length !== 0 && 
                       dataSheet.map((data, index) =>
                            <tr key = {index} className = 'label'>
                               <td><input type = 'text' name = 'userEmail' Value = {data.USER_EMAIL} readOnly/></td>
                               <td><input type = 'text' name = 'userNm'  Value = {data.USER_NAME} onChange={(e)=>setUserNm(e.target.value)} readOnly /></td>
                               <td>
                                    <div>{rolesCd(data.ROLES)}</div>
                                    <div className='rolesCheck'>{roles.map((role, idx)=>{
                                        return <><input type = 'checkbox' name={'roles'+index} id={"role"+index+idx} key = {idx} value = {role.ROLE_CODE}  
                                                    onChange={e => {onCheckedElement(e.target.checked, e.target.value);
                                          }}/> 
                                                    {role.ROLE_NAME} 
                                                </>
                                        })}</div></td>
                               <td>
                                   <div className='btn-block'>
                                       <button className="btn btn-warning" onClick={(e)=> modifyHandler(e.target.parentElement, data.ROLES)}>수정</button>
                                       <button className="btn btn-danger" onClick={() => deleteHandler(data.USER_ID)}>삭제</button>
                                   </div>
                                   <div className='btn-hidden'>
                                       <button className="btn btn-primary" onClick={(e)=> saveHandler(e.target.parentElement, data)}>저장</button>
                                       <button className="btn btn-danger" onClick={(e)=> modifyAct(e.target.parentElement)}>취소</button>
                                   </div>
                               </td>
                               {roles.map((role, idx)=>{
                                        let tagInfo = document.querySelectorAll("#role"+index+idx);
                                        if(tagInfo[0] !== undefined) for(let i = 0 ; i < data.ROLES.length ; i++) if(tagInfo[0].value === data.ROLES[i].ROLE_CODE) tagInfo[0].checked = true;
                                    })}
                            </tr>
                            
                        )
                   }
                </tbody>
            </table>
             <div>
                <select className='select-post' name= 'postCnt' onChange={(e)=>setPostsPerPage(e.target.value)}>
                       <option value = '10'>10</option>
                       <option value = '15'>15</option>
                       <option value = '20'>20</option>
                   </select>
                {totalPosts >= postsPerPage && 
                <Pagination postsPerPage={postsPerPage} totalPosts={totalPosts} paginate={setCurrentPage}></Pagination>}
             </div>
         </div>
    );
}

export default ManagerUser;