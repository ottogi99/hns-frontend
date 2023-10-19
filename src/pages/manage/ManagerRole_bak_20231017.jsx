import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Pagination from 'pages/common/Pagenation';

function ManagerRole(props) {
    console.group("ManagerRole");
    console.log("[Start] ManagerRole ------------------------------");
    console.log("ManagerRole [props] : ", props);
    const location = useLocation();
    console.log("ManagerRole [location] : ", location);
    const jToken = localStorage.getItem('jToken');
    const [dataSheet, setdataSheet] = useState([]);
    const [search, setSearch] = useState("");

    const [roleNm, setRoleNm] = useState();
    const [roleDesc, setRoleDesc] = useState();
    const [roleSort, setRoleSort] = useState();
    
    let upCtl = false; //한 개의 row만 수정할 수 있도록 함
    let modifyIdx = -1;
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const [totalPosts, setTotalPosts] = useState(0);
    
    const column = [
        {NAME: '권한 코드'    , field:'ROLE_CODE'},
        {NAME: '권한 이름'  , field:'ROLE_NAME'},
        {NAME: '설명'        , field:'ROLE_DESC'},
        {NAME: '순위'        , field:'ROLE_SORT'},
        {NAME: '기능'           , field:'DATA_MANAGER'}
    ];

    const dataList = () => {
        let url = process.env.REACT_APP_API_URL+'/roles';
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
                .then(data => {
                    if(data.meta.total > 0) {setdataSheet(data.data); setTotalPosts(data.meta.total);}
                    else setdataSheet([]);}) 
            };

    const deleteHandler = (roleCd) =>{
        let url = process.env.REACT_APP_API_URL+'/roles/'+roleCd;
        if (window.confirm("데이터를 삭제하시겠습니까?")) {
            fetch(url, {method:"DELETE", headers: {'Authorization': jToken}})
            .then(response => response.json())
            .then(data=> data.status === "success" && alert("삭제되었습니다"));
        };
        dataList();
    };

    const updateHandler = (data) => {

        roleNm === "" && setRoleNm(data.ROLE_NAME);
        roleDesc === "" && setRoleDesc(data.ROLE_DESC);
        roleSort === "" && setRoleSort(data.ROLE_SORT);

        let url = process.env.REACT_APP_API_URL+'/roles/'+data.ROLE_CODE;
        fetch(url, { method: "PUT", 
                    headers: { 'Content-type': 'application/json', 'Authorization': jToken}, 
                       body: JSON.stringify({ roleName: roleNm, roleDesc: roleDesc, roleSort: parseInt(roleSort)})})
        .then(response => response.json())
        .then(data => {
            if(data.status==='success') alert("변경이 완료되었습니다");
        });
        dataList();
    };

    function modifyHandler(obj, idx) {
        let tagInfo = document.querySelectorAll(".roleNm"+idx);
        if(upCtl === false){
        upCtl = true;
        modifyIdx = idx;
        obj.className = 'btn-hidden';
        obj.nextSibling.className = 'btn-block';
        obj.parentElement.parentElement.className = 'modify';
        let inpCtl = obj.parentElement.parentElement.children;
        for(let i = 1; i < inpCtl.length; i++) inpCtl[i].children[0].readOnly = false;
        } else alert("현재 수정중인 데이터가 있습니다. 수정완료 후 재시도해주세요.");
    };

    function modifyAct(obj){
        obj.className = 'btn-hidden';
        obj.previousSibling.className = 'btn-block';
        obj.parentElement.parentElement.className = 'label';
        upCtl = false;
        let inpCtl = obj.parentElement.parentElement.children;
        for(let i = 1; i < inpCtl.length; i++) inpCtl[i].children[0].readOnly = true;
    };

    function saveHandler(obj, data) {
        modifyAct(obj);
        if(window.confirm("저장하시겠습니까?")){
            updateHandler(data);
        }
    };

    useEffect(dataList, []);
    useEffect(()=>{dataList(); 
        if(document.querySelector('.modify') !== null) modifyAct(document.querySelector('.modify').children[4].children[1]);
    }, [currentPage]);
    useEffect(dataList, [postsPerPage]);

    console.log("------------------------------ManagerRole [End]");
    console.groupEnd("ManagerRole");

    return (
    	 <div className="C_BOARD">
            <div>
                <h1>권한 관리</h1>
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
//                       currentPosts(dataSheet).map((data, index) =>
                       dataSheet.map((data, index) =>
                            <tr key = {index} className = 'label'>
                               <td><input type = 'text' className = 'roleCd'  value = {data.ROLE_CODE } readOnly /></td>
                               <td><input type = 'text' className = {'roleNm'+index} value = {modifyIdx===index ? roleNm: data.ROLE_NAME} onChange={(e)=>setRoleNm(e.target.value)} readOnly/></td>
                               <td><input type = 'text' className = {'roleDesc'+index} value = {modifyIdx===index ? roleDesc : data.ROLE_DESC} onChange={(e)=>setRoleDesc(e.target.value)} readOnly/></td>
                               <td><input type = 'number' className = {'roleSort'+index} value = {modifyIdx===index ? roleSort : data.ROLE_SORT} onChange={(e)=>setRoleSort(e.target.value)} readOnly/></td>
                               <td>
                                   <div className='btn-block'>
                                       <button className="btn btn-warning" onClick={(e)=> modifyHandler(e.target.parentElement, index)}>수정</button>
                                       <button className="btn btn-danger" onClick={() => deleteHandler(data.ROLE_CODE)}>삭제</button>
                                   </div>
                                   <div className='btn-hidden'>
                                       <button className="btn btn-primary" onClick={(e)=> saveHandler(e.target.parentElement, data)}>저장</button>
                                       <button className="btn btn-danger" onClick={(e)=> modifyAct(e.target.parentElement)}>취소</button>
                                   </div>
                               </td>
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

export default ManagerRole;