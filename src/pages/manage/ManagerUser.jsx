import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Modal from "./Modal";
import ModalContent from "./ModalContentUser";
import Pagination from 'pages/common/Pagenation';

function ManagerUser(props) {
    console.group("ManagerUser");
    console.log("[Start] ManagerUser ------------------------------");
    console.log("ManagerUser [props] : ", props);
    const location = useLocation();
    console.log("ManagerUser [location] : ", location);
    const jToken = localStorage.getItem('jToken');
    const [dataSheet, setdataSheet] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const [totalPosts, setTotalPosts] = useState(0);
    const [roles, setRoles] = useState([]);
    const [modalTags, setModalTags] = useState([]);

    //modal창 표출 상수 선언
    const [isModalOpen, setIsModalOpen] = useState(false);

    //modal창 표출 함수 선언
    const openModal = (data) => {
        let modalTag = [];
        setIsModalOpen(true)
        modalTag.push(<ModalContent data={data} roles={roles} getModalCtl ={getModalCtl}></ModalContent>);
        setModalTags(modalTag);
    };
    const closeModal = () => {setIsModalOpen(false); setModalTags([]);};

    const getModalCtl = () => {
        closeModal();
        dataList();
    };
    
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
            else setRoles([]);}); 
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
            .then(data=> {data.status === "success" && alert("삭제되었습니다")
            dataList();});
        };
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
            <Modal isOpen={isModalOpen} closeModal={closeModal}>
                 {modalTags}
             </Modal>
            <table className="boardTable">
                <thead>
                   <tr><td style={{display:"none"}}></td>{column.map((data, index)=><th key = {index}>{data.NAME}</th>)}</tr>
                </thead>
                <tbody><tr style={{display:"none"}}><td></td></tr>
                   {dataSheet.length === 0 && <tr style={{border:"0px"}}><td colSpan={column.length} style={{border:"0px"}}>검색 결과가 없습니다</td></tr>}
                   {dataSheet.length !== 0 && 
                       dataSheet.map((data, index) =>
                            <tr key = {index} className = 'label'>
                               <td><input type = 'text' name = 'userEmail' Value = {data.USER_EMAIL} onClick={()=>{openModal(data)}} readOnly/></td>
                               <td><input type = 'text' name = 'userNm'  Value = {data.USER_NAME} readOnly /></td>
                               <td> {rolesCd(data.ROLES)} </td>
                               <td><button className="btn btn-danger" onClick={() => deleteHandler(data.USER_ID)}>삭제</button></td>
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