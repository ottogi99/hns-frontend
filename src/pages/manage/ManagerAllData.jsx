import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Pagination from 'pages/common/Pagenation';
import DatePicker from "react-datepicker";
import'react-datepicker/dist/react-datepicker.css';

function ManagerAllData(props) {
    console.group("DataTable");
    console.log("[Start] DataTable ------------------------------");
    console.log("DataTable [props] : ", props);
    const location = useLocation();
    console.log("DataTable [location] : ", location);
    const jToken = localStorage.getItem('jToken');
    const [dataSheet, setdataSheet] = useState([]);
    const [search, setSearch] = useState("");
    const [values, setValues] = useState();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    let upCnt = false; //한 개의 row만 수정할 수 있도록 함

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;
    
    const currentPosts = (posts) => {
      let currentPosts = 0;
      currentPosts = posts.slice(indexOfFirst, indexOfLast);
      return currentPosts;
    };

    const column = [
        {NAME: '측정일시'       , field:'OBSDH'},
        {NAME: '관측소 코드'    , field:'OB_NAME'},
        {NAME: '수집자원 코드'  , field:'CD_NAME'},
        {NAME: '측정 값'        , field:'VALUE'},
        {NAME: '기능'           , field:'DATA_MANAGER'}
    ];

    const dataList = (keyword, type) => {
        let url = process.env.REACT_APP_API_URL+'/d-data/';
        let stDt = dateFormat(startDate, 'picker');
        let edDt = dateFormat(endDate, 'picker');
        if(type === "search") url = url + 'search?keyword=' + keyword + '&startDt=' + stDt + '0000&endDt=' + edDt + '2359' ;
        fetch(url, 
            { headers: {
               'Authorization': jToken
            }})
                .then(response => response.json())
                .then(data => {
                    if(data.length > 0) setdataSheet(data);
                    else setdataSheet([]);}) 
                .catch(err => console.error(err));
                console.log(url)
            };

    const deleteHandler = (obsdh, cdcode, obcode) =>{
        console.groupCollapsed("dataDelete()");
        let url = process.env.REACT_APP_API_URL+'/d-data/'+obsdh+'/'+cdcode+'/'+obcode;
        if (window.confirm("데이터를 삭제하시겠습니까?")) {
            fetch(url, {method:"DELETE", headers: {'Authorization': jToken}});
            alert("삭제되었습니다.");
        } else
        console.groupEnd("dataDelete()");
        dataList(search, "search");
    };

    const updateHandler = (obsdh, cdCode, obCode, value) => {
        console.groupCollapsed("dataUpdate()");
        let url = process.env.REACT_APP_API_URL+'/d-data/'+obsdh+'/'+cdCode+'/'+obCode;
        console.log(url + JSON.stringify({ value: value }) );
        fetch(url, 
        { method: "PUT",
        headers: {
            'Content-type': 'application/json',
            'Authorization': jToken
            }, 
        body: JSON.stringify({ value: value })})
        console.groupEnd("dataUpdate()");
        dataList(search, "search");
    };

    function modifyHandler(obj) {
        if(upCnt === false){
        upCnt = true;
        obj.className = 'btn-hidden';
        obj.nextSibling.className = 'btn-block';
        obj.parentElement.parentElement.className = 'modify';
        } else alert("현재 수정중인 데이터가 있습니다. 수정완료 후 재시도해주세요.");
        
    };

    function modifyAct(obj){
        obj.className = 'btn-hidden';
        obj.previousSibling.className = 'btn-block';
        obj.parentElement.parentElement.className = 'label';
        upCnt = false;
    };

    function saveHandler(obj, data) {
        modifyAct(obj);
        if(window.confirm("저장하시겠습니까?")){
            updateHandler(data.OBSDH, data.CD_CODE, data.OB_CODE, values);
        }
    };

    function dateFormat(date, form){
        if (form === 'picker'){
            let dtForm = date.getFullYear() 
                        + ((date.getMonth()+1) < 9 ? '0'+(date.getMonth()+1) : (date.getMonth()+1)) 
                        + ((date.getDate()) < 9 ? '0'+(date.getDate()) : (date.getDate()));
            return dtForm;
        }
        else {
            if (date === null || date ==="") return '-'; 
            else return date.slice(0,4)+'-'+date.slice(4,6)+'-'+date.slice(6,8)+' '+date.slice(8,10)+':'+date.slice(10,12);
        }
    }

    useEffect(()=>{dataList("", "")}, []);

    console.log("------------------------------DataTable [End]");
    console.groupEnd("DataTable");

    return (
    	 <div className="C_BOARD">
            <div>
                <h1>측정 데이터 조회 및 관리</h1>
                    <div className='right-box'>
                    <DatePicker className='date-picker'
                      id = 'stDt'
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      dateFormat={"yyyy-MM-dd"}
                      endDate={endDate}
                    />
                    ~
                    <DatePicker className='date-picker'
                      id = 'edDt'
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      dateFormat={"yyyy-MM-dd"}
                      endDate={endDate}
                      minDate={startDate}
                    />
                    <input className='search-box' type="text" placeholder="수집자원코드를 입력하세요." onChange={(e)=>setSearch(e.target.value)} value={search} />
                    <button className="btn btn-search " onClick={() => dataList(search, "search")} >검색</button>
                    <img className = "refresh-img" src="/assets/images/ico_refresh_grey.png" onClick={() => {dataList("", ""); setSearch(""); }} alt=""/>
                </div>
            </div>
            <table className="boardTable">
                <thead>
                   <tr><td style={{display:"none"}}></td>{column.map((data, index)=><th key = {index}>{data.NAME}</th>)}</tr>
                </thead>
                <tbody><tr style={{display:"none"}}><td></td></tr>
                   {dataSheet.length === 0 && <tr style={{border:"0px"}}><td colSpan={column.length} style={{border:"0px"}}>검색 결과가 없습니다</td></tr>}
                   {dataSheet.length !== 0 && 
                       currentPosts(dataSheet).map((data, index) =>
                            <tr key = {index} className = 'label'>
                               <td><input type = 'text' name = 'obsdh'  value = {dateFormat(data.OBSDH, "")} readOnly /></td>
                               <td><input type = 'text' name = 'obname' value = {data.OB_CODE} readOnly /></td>
                               <td><input type = 'text' name = 'cdname' value = {data.CD_CODE} readOnly /></td>
                               <td><input type = 'text' name = 'value'  Value = {data.VALUE} onChange={(e)=>setValues(e.target.value)}/></td>
                               <td>
                                   <div className='btn-block'>
                                       <button className="btn btn-warning" onClick={(e)=> modifyHandler(e.target.parentElement)}>수정</button>
                                       <button className="btn btn-danger" onClick={() => deleteHandler(data.OBSDH, data.CD_CODE, data.OB_CODE)}>삭제</button>
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
                {dataSheet.length >= postsPerPage && 
                <Pagination postsPerPage={postsPerPage} totalPosts={dataSheet.length} paginate={setCurrentPage}></Pagination>}
             </div>
         </div>
    );
}

export default ManagerAllData;