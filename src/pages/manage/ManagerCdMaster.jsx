import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Modal from "./Modal";
import ModalContentCD from "./ModalContentCD";
import Pagination from 'pages/common/Pagenation';

function ManagerCdMaster(props) {
    console.group("CdMasterTable");
    console.log("[Start] CdMasterTable ------------------------------");
    console.log("CdMasterTable [props] : ", props);
    const location = useLocation();
    console.log("CdMasterTable [location] : ", location);
    const [allObstation, setAllObstation] = useState([]);
    const [cdMaster, setCdMaster] = useState([]);
    const [search, setSearch] = useState([]);
    const [modalCDOpen, setModalCDOpen] = useState([]);

    //modal창 표출 상수 선언
    const [cModalOpenCD, setCModalOpenCD] = useState(false);
    const [uModalOpenCD, setUModalOpenCD] = useState(false);

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
    const openModalCD = () => {setCModalOpenCD(true);};
    const closeModalCD = () => {setCModalOpenCD(false)};

    const openUModalCD = (data) => {
        let modalTag = [];
        setUModalOpenCD(true)
        modalTag.push(<ModalContentCD fcType={"U"} data={data}  obStation={[]} getModalCnt={getModalCnt}/>);
        setModalCDOpen(modalTag);
    };
    const closeUModalCD = () => {setUModalOpenCD(false); setModalCDOpen([]);};

    const column = [
        {NAME: '관측소 코드'   , field:'OB_CODE'},
        {NAME: '수집자원 코드' , field:'CD_CODE'},
        {NAME: '수집자원 이름' , field:'CD_NAME'},
        {NAME: '생성일시'      , field:'CREATED_DT'},
        {NAME: '수정일시'      , field:'UPDATED_DT'},
        {NAME: '기능'         , field:'DATA_MANAGER'}
    ];

    const obsList = () => {
        fetch(process.env.REACT_APP_API_URL+'/obs-station/', {headers: {'Authorization': jToken}})
                .then(response => response.json())
                .then(data => {setAllObstation(data);})
                .catch(err => console.error(err));
    };

    const getModalCnt = () => {
        closeModalCD();
        closeUModalCD();

        cdStationList("");
        };

    const cdStationList = (search) => {
        console.groupCollapsed("cdMasterList()");
        let url = process.env.REACT_APP_API_URL+'/cd-master/'
        if(search !== "") url = url + 'search?keyword=' + search;
        fetch(url, {headers: {'Authorization': jToken}})
                .then(response => response.json())
                .then(data => {
                    if(data.length > 0) setCdMaster(data);
                    else setCdMaster([]);
                })
                .catch(err => console.error(err))
        console.groupEnd("cdMasterList()");
    };


    const deleteHandler = (obCode, cdCode) =>{
        console.groupCollapsed("CdDelete()");
        let url = process.env.REACT_APP_API_URL+'/cd-master/'+cdCode+'/'+obCode;
        if (window.confirm("수집자원을 삭제하시겠습니까?")) {
            fetch(url, {method:"DELETE", headers: {'Authorization': jToken}});
            alert("삭제되었습니다.");
        } else
        console.groupEnd("CdDelete()");
        cdStationList("");
    };

    function dateFormat(date){
        if (date === null || date ==="") return '-'; 
        else return date.slice(0,10)+' '+date.slice(11,16); 
    }

    useEffect(()=>{cdStationList(""); obsList(); }, []);

    console.log("------------------------------CdMasterTable [End]");
    console.groupEnd("CdMasterTable");

    return (
        <div className="C_BOARD">
            <h1>수집자원 관리</h1>
            <div className='right-box'>
                <input className='search-box' type="text" placeholder="수집자원 코드를 입력하세요." onChange={(e)=>setSearch(e.target.value)} />
                <button className="btn btn-search " onClick={() => cdStationList(search)} >검색</button>
                <button className="btn btn-primary btn-c" onClick={openModalCD} >등록</button>
            </div>
            
            <Modal isOpen={cModalOpenCD} closeModal={closeModalCD}>
                <ModalContentCD fcType={"C"} data={["","",""]} obStation={allObstation} getModalCnt={getModalCnt}></ModalContentCD>
            </Modal>
            <table className="boardTable">
                <thead>
                    <tr><td style={{display:"none"}}></td>{column.map((data, index)=><th key = {index}>{data.NAME}</th>)}</tr>
                </thead>
                <tbody><tr style={{display:"none"}}><td></td></tr>
                    {cdMaster.length === 0 && <tr style={{border:"0px"}}><td colSpan={column.length} style={{border:"0px"}}>검색 결과가 없습니다</td></tr>}
                    {cdMaster.length !== 0 && 
                        currentPosts(cdMaster).map((data, index) =>
                            <tr key = {index}>
                                <td>{data.OB_CODE}</td>
                                <td>{data.CD_CODE}</td>
                                <td>{data.CD_NAME}</td>
                                <td>{dateFormat(data.CREATED_DT)}</td>
                                <td>{dateFormat(data.UPDATED_DT)}</td>
                                <td>
                                    <button className="btn btn-warning" onClick={()=>openUModalCD([data.OB_CODE,data.CD_CODE,data.CD_NAME])}>수정</button>
                                        <Modal isOpen={uModalOpenCD} closeModal={closeUModalCD}>{modalCDOpen}</Modal>
                                    <button className="btn btn-danger" onClick={() => deleteHandler(data.OB_CODE, data.CD_CODE)}>삭제</   button>
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
                {cdMaster.length >= postsPerPage && 
                <Pagination postsPerPage={postsPerPage} totalPosts={cdMaster.length} paginate={setCurrentPage}></Pagination>}
            </div>
        </div>
    );
}


export default ManagerCdMaster;