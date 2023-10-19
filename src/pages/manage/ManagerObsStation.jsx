import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Modal from "./Modal";
import ModalContent from "./ModalContent";
import Pagination from 'pages/common/Pagenation';

function ManagerObsStation(props) {
    console.group("ObsStationTable");
    console.log("[Start] ObsStationTable ------------------------------");
    console.log("ObsStationTable [props] : ", props);
    const location = useLocation();
    console.log("ObsStationTable [location] : ", location);
    const [obstation, setobstation] = useState([]);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState([]);
    //modal창 표출 상수 선언
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uModalOpen, setUModalOpen] = useState(false);

    //pagenation 
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;

    const jToken = localStorage.getItem('jToken');

    const currentPosts = (posts) => {
      let currentPosts = 0;
      currentPosts = posts.slice(indexOfFirst, indexOfLast);
      return currentPosts;
    };

    //modal창 표출 함수 선언
    const openModal = () => {setIsModalOpen(true)};
    const closeModal = () => {setIsModalOpen(false)};

    const openUModal = (data) => {
        let modalTag = [];
        setUModalOpen(true);
        modalTag.push(<ModalContent fcType={"U"} data={data} getModalCnt ={getModalCnt}/>);
        setModalOpen(modalTag);
    };
    const closeUModal = () => {setUModalOpen(false); setModalOpen([])};

    const getModalCnt = () => {
        closeUModal();
        closeModal();

        obsStationList("");
        };

    const column = [
        {NAME: '관측소 코드' , field:'OB_CODE'},
        {NAME: '관측소 이름' , field:'OB_NAME'},
        {NAME: '관측소 주소' , field:'OB_ADDR'},
        {NAME: '생성일시'    , field:'CREATED_DT'},
        {NAME: '수정일시'    , field:'UPDATED_DT'},
        {NAME: '기능'        , field:'DATA_MANAGER'}
    ];

    const obsStationList = (search) => {
        console.groupCollapsed("obsStationList()");
        let url = process.env.REACT_APP_API_URL+'/obs-station/';
        if (search !== "") url = url + 'search?keyword=' + search;
        console.log(url);
        fetch(url, {headers: {'Authorization': jToken}})
                .then(response => response.json())
                .then(data => {
                    if(data.length > 0) setobstation(data);
                    else setobstation([]);
                })
                .catch(err => console.error(err))
        console.groupEnd("obsStationList()");
    };

    const deleteHandler = (obCode) =>{
        console.groupCollapsed("ObsDelete()");
        let url = "";
        url = process.env.REACT_APP_API_URL+'/obs-station/'+obCode;
        if (window.confirm("관측소를 삭제하시겠습니까?")) {
            fetch(url, {method:"DELETE", headers: {'Authorization': jToken}});
            alert("삭제되었습니다.");
        } else
        console.groupEnd("ObsDelete()");
        obsStationList("");
    };

    function dateFormat(date){
        if (date === null || date ==="") return '-'; 
        else return date.slice(0,10)+' '+date.slice(11,16); 
    }

    useEffect(()=>{obsStationList("")}, []);

    console.log("------------------------------ObsStationTable [End]");
    console.groupEnd("ObsStationTable");

    return (
    	 <div className="C_BOARD">
             <h1>관측소 관리</h1>
             <div className='right-box'>
                 <input className='search-box' type="text" placeholder="코드를 입력하세요." onChange={(e)=>setSearch(e.target.value)} />
                 <button className="btn btn-search " onClick={() => obsStationList(search)} >검색</button>
                 <button className="btn btn-primary " onClick={openModal} >등록</button>
             </div>
             <Modal isOpen={isModalOpen} closeModal={closeModal}>
                 <ModalContent fcType={"C"} data={["","",""]} getModalCnt ={getModalCnt}></ModalContent>
             </Modal>
             <table className="boardTable">
                 <thead>
                     <tr><td style={{display:"none"}}></td>{column.map((data, index)=><th key = {index}>{data.NAME}</th>)}</tr>
                 </thead>
                 <tbody><tr style={{display:"none"}}><td></td></tr>
                    {obstation.length === 0 && <tr style={{border:"0px"}}><td colSpan={column.length} style={{border:"0px"}}>검색 결과가 없습니다</td></tr>}
                    {obstation.length !== 0 && 
                         currentPosts(obstation).map((data, index) =>
                             <tr key = {index}>
                                <td>{data.OB_CODE}</td>
                                <td>{data.OB_NAME}</td>
                                <td>{data.OB_ADDR}</td>
                                <td>{dateFormat(data.CREATED_DT)}</td>
                                <td>{dateFormat(data.UPDATED_DT)}</td>
                                <td>
                                    <button className="btn btn-warning" onClick={()=>openUModal([data.OB_CODE,data.OB_NAME,data.OB_ADDR])}>수정</button>
                                    <Modal isOpen={uModalOpen} closeModal={closeUModal}>{modalOpen}</Modal>
                                    <button className="btn btn-danger" onClick={() => deleteHandler(data.OB_CODE)}>삭제</button>
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
                {obstation.length >= postsPerPage && 
                <Pagination postsPerPage={postsPerPage} totalPosts={obstation.length} paginate={setCurrentPage}></Pagination>}
             </div>
         </div>
    );
}


export default ManagerObsStation;