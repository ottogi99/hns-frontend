import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

//import * as EgovNet from 'api/egovFetch';
import LeftChart from 'pages/common/Main_chart';
import RightChart from 'pages/common/Main_chart2';
import CreateTable from 'pages/common/Main_table';


function Main(props) {
    console.group("Main");
    console.log("[Start] Main ------------------------------");
    console.log("Main [props] : ", props);

    const jToken = localStorage.getItem('jToken');
    const location = useLocation();
    console.log("Main [location] : ", location);

    const [areaInfo, setAreaInfo] = useState(["인천", "인천 위치정보, 주소", "assets/images/img_ic.jpg"]);
    const [Selected, setSelected] = useState(["", ""]);
    const [data, setData] = useState([{id:0, obsdh:"2023-01-01 00:00",value: 0}
                                     ,{id:1, obsdh:"2023-01-01 00:00",value: 1}
                                     ,{id:2, obsdh:"2023-01-01 00:00",value: 2}
                                     ,{id:3, obsdh:"2023-01-01 00:00",value: 3}
                                     ,{id:4, obsdh:"2023-01-01 00:00",value: 4}
                                     ,{id:5, obsdh:"2023-01-01 00:00",value: 5}
                                     ,{id:6, obsdh:"2023-01-01 00:00",value: 6}
                                     ,{id:7, obsdh:"2023-01-01 00:00",value: 7}]);
    const [dataSheet, setdataSheet] = useState([]);
    const endDate = new Date();
    const startDate = endDate.setDate(endDate.getDate() -6);
    const [tableTag, setTableTag] = useState();
    const [cdMaster, setCdMaster] = useState([]);
    const [obstation, setobstation] = useState([]);
    const [selectTag, setSelectTag] = useState([]);
    let cdList = [];

    const codeList = () => {
        fetch(process.env.REACT_APP_API_URL+'/cd-master/', 
             { headers: {
                'Authorization': jToken
             }})
        .then(response => response.json())
        .then(data => setCdMaster(data))
        .catch(err => console.error(err));
        fetch(process.env.REACT_APP_API_URL+'/obs-station/',
             { headers: {
                'Authorization': jToken
             }})
        .then(response => response.json())
        .then(data => setobstation(data))
        .catch(err => console.error(err));
    };
    const dataList = () => {
        console.groupCollapsed("dataList()");
        let stDt = dateFormat(startDate)+'0000';
        let edDt = dateFormat(endDate)+'2359';
        let url = process.env.REACT_APP_API_URL+'/d-data/search?keyword=' + Selected[0] + '&startDt=' + stDt + '&endDt=' + edDt ;
        if(Selected[0] === "") alert("항목을 선택하세요");
        else{
            fetch(url,
                { headers: {
                    'Authorization': jToken
                 }})    
            .then(response => response.json())
            .then(data => {
                if(data.length > 0) setdataSheet(data);
                else setdataSheet([]);}) 
            .catch(err => console.error(err));
        }
        console.groupEnd("dataList()");
    };

    function dateFormat(date){
        let dtForm = date.getFullYear() 
                    + ((date.getMonth()+1) < 9 ? '0'+(date.getMonth()+1) : (date.getMonth()+1)) 
                    + ((date.getDate()) < 9 ? '0'+(date.getDate()) : (date.getDate()));
        return dtForm;
    }

/*    const retrieveList = useCallback(() => {
       console.groupCollapsed("Main.retrieveList()");

       const retrieveListURL = '/kriso/selectMainList.do';
       const requestOptions = {
           method: "POST",
           headers: {
               'Content-type': 'application/json'
           }
       }
       EgovNet.requestFetch(retrieveListURL, requestOptions,
           (resp) => {
                let dataList = [];
                // 리스트 항목 구성
                console.log(resp);
                resp.result.dData.forEach(function (item, index) {
                    if(index === 0 ) dataList = [];
                    dataList.push({id : index+1, obsdh : item.obsdh, value : item.value});
                    setData(data.concat(dataList));
                });
                setTableTag(<CreateTable props={dataList[0]}></CreateTable>);
                
            },
           function (resp) {
               console.log("err response : ", resp);
           }
       );
       console.groupEnd("Main.retrieveList()");
   },[]);*/
   console.log("최종", data);
//   setTableTag(<CreateTable props={data[1]}></CreateTable>);
    function area_info(areaString){
        let dataNo;
        if(areaString === "인천"){
            setAreaInfo([areaString, areaString + " 위치정보, 주소", "assets/images/img_ic.jpg"]);
            dataNo = 1;
        } else if(areaString === "대산"){
            setAreaInfo([areaString, areaString + " 위치정보, 주소", "assets/images/img_ds.jpg"]);
            dataNo = 2;
        } else if(areaString === "평택"){
            setAreaInfo([areaString, areaString + " 위치정보, 주소", "assets/images/img_py.jpg"]);
            dataNo = 3;
        } else if(areaString === "광양"){
            setAreaInfo([areaString, areaString + " 위치정보, 주소", "assets/images/img_gy.jpg"]);
            dataNo = 5;
        } else if(areaString === "여수"){
            setAreaInfo([areaString, areaString + " 위치정보, 주소", "assets/images/img_ys.jpg"]);
            dataNo = 4;
        } else if(areaString === "울산"){
            setAreaInfo([areaString, areaString + " 위치정보, 주소", "assets/images/img_us.jpg"]);
            dataNo = 7;
        } else {
            setAreaInfo([areaString, areaString + " 위치정보, 주소", "assets/images/img_bs.jpg"]);
            dataNo = 6;
        }  
        setTableTag(<CreateTable props={data[dataNo]}></CreateTable>);
    }
    
//    useEffect(() => {retrieveList();}, [retrieveList]);
    useEffect(codeList, []);
    
    useEffect(()=>{
        let isCD = false;
        let tagList = [];
        cdMaster.map((data,index) => {
            if(index === 0) cdList = [];
            for(var i = 0; i< cdList.length; i++ ){
                if(data.CD_CODE === cdList[i][0]){
                    isCD = true; 
                }
            }
            if(isCD === false) cdList.push([data.CD_CODE, data.CD_NAME])
        })

        cdList.map((data, index) => {
            if(index === 0) {
                tagList.push(<option key={index} id={data[0]} value={data[1]} selected>{data[1]}</option>);
                setSelected([data[0], data[1]]);
            }
            else tagList.push(<option key={index} id={data[0]} value={data[1]} >{data[1]}</option>)})
        setSelectTag(tagList);
    },[cdMaster]);

    console.log("------------------------------Main [End]");
    console.groupEnd("Main");


    return (
        <div className="container P_MAIN">
            <div className="c_wrap">
                <div className="colbox">
                    <div className="left_col">
                        <div className="mini_board">
                            <ul className="tab">
                            <li className="txt">안전하고 꺠끗한 바다를 위한 </li><li className="txt2">HNS 해양배출 시스템</li>
                                <li><a href="#HNS 해양배출 데이터" className="on">#HNS 해양배출 데이터</a></li>
                                <li><a href="#HNS 해양배출 3D시각화">#HNS 해양배출 3D시각화</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="center_col">
                        <li className={areaInfo[0] === "대산" ? "spot02 on":"spot02"} onClick={()=>{area_info("대산")}}><li></li><a>대산</a></li>
                        <li className={areaInfo[0] === "평택" ? "spot03 on":"spot03"} onClick={()=>{area_info("평택")}}><li></li><a>평택</a></li>
                        <li className={areaInfo[0] === "인천" ? "spot01 on":"spot01"} onClick={()=>{area_info("인천")}}><li></li><a>인천</a></li>
                        <li className={areaInfo[0] === "여수" ? "spot04 on":"spot04"} onClick={()=>{area_info("여수")}}><li></li><a>여수</a></li>
                        <li className={areaInfo[0] === "광양" ? "spot05 on":"spot05"} onClick={()=>{area_info("광양")}}><li></li><a>광양</a></li>
                        <li className={areaInfo[0] === "부산" ? "spot06 on":"spot06"} onClick={()=>{area_info("부산")}}><li></li><a>부산</a></li>
                        <li className={areaInfo[0] === "울산" ? "spot07 on":"spot07"} onClick={()=>{area_info("울산")}}><li></li><a>울산</a></li>
                    </div>
                    <div className="right_col">
                        <div className="mini_board">
                            <div className="list">
                                <img src="assets/images/ico_water_drop.png" />
                                <h2>{areaInfo[0]}</h2>
                                <h3>{areaInfo[1]}</h3>
                                <div className="notice">
                                    <h2 className="blind">HNS 해양배출 데이터</h2>
                                    <ul>
                                        {tableTag}
                                    </ul>
                                </div>
                                <div className="gallary">
                                    <h2 className="blind">HNS 해양배출 3D시각화</h2>
                                    <ul>
                                        <div>
                                            <img src={areaInfo[2]} />
                                            <div><a href=''><img className='ico_3d' src='assets/images/ico_3D.png' /></a></div>
                                        </div>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="banner_name">
                            <h2>HNS 해양배출 주요 통계</h2>
                            <p>관측소 별 주요 데이터들을 한눈에 볼 수 있습니다</p>
                </div>
                <div className="banner_bot">
                    <div className="b1">
                        <div>
                            <h2>관측국 별 {Selected[1]} 현황</h2> 
                            <select onChange={(e) => {setSelected([e.target.id,e.target.value]); dataList();}} value={Selected[1]}>
                              {selectTag}
                            </select>
                                <LeftChart dataList={dataSheet} dateType='day' obsList={obstation} type='line'></LeftChart>
                        </div>
                    </div>
                    <div className="b2">
                        <div>
                            <h2>해양 수질의 화학적 산소요구량</h2>
                            <p>1.7 ~ 2.2 mg/L<br /></p>
                            <RightChart></RightChart>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Main;