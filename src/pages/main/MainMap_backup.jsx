import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';

//import * as EgovNet from 'api/egovFetch';
import CreateTable from 'pages/common/Main_table';

function MainMap() {
    console.group("MainMap");
    console.log("[Start] MainMap ------------------------------");

    const location = useLocation();
    console.log("MainMap [location] : ", location);

    const [areaInfo, setAreaInfo] = useState(["인천", "인천 위치정보, 주소", "assets/images/img_ic.jpg"]);
    const [data, setData] = useState([{id:0, obsdh:"2023-01-01 00:00",value: 0}]);
    const [tableTag, setTableTag] = useState();


/*   const retrieveList = useCallback(() => {
       console.groupCollapsed("MainMap.retrieveList()");

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
       console.groupEnd("MainMap.retrieveList()");
   },[]);*/
   console.log("최종", data);
//   setTableTag(<CreateTable props={data[1]}></CreateTable>);
    function area_info(areaString){
        let dataNo;
        if(areaString == "인천"){
            setAreaInfo([areaString, areaString + " 위치정보, 주소"]);
            dataNo = 1;
        } else if(areaString == "대산"){
            setAreaInfo([areaString, areaString + " 위치정보, 주소"]);
            dataNo = 2;
        } else if(areaString == "평택"){
            setAreaInfo([areaString, areaString + " 위치정보, 주소"]);
            dataNo = 3;
        } else if(areaString == "광양"){
            setAreaInfo([areaString, areaString + " 위치정보, 주소"]);
            dataNo = 5;
        } else if(areaString == "여수"){
            setAreaInfo([areaString, areaString + " 위치정보, 주소"]);
            dataNo = 4;
        } else if(areaString == "울산"){
            setAreaInfo([areaString, areaString + " 위치정보, 주소"]);
            dataNo = 7;
        } else{
            setAreaInfo([areaString, areaString + " 위치정보, 주소"]);
            dataNo = 6;
        } 
        setTableTag(<CreateTable props={data[dataNo]}></CreateTable>);
    }
    
//    useEffect(() => { retrieveList(); }, [retrieveList]);

    console.log("------------------------------MainMap [End]");
    console.groupEnd("MainMap");


    
    
    return (
        <div className="container S_Main">
            <div className="c_wrap">
                {/* <!-- Location --> */}
                <div className="location">
                    <ul>
                        <li><Link to="" className="home">Home</Link></li>
                        <li><Link to="">사이트 소개</Link></li>
                        <li>소개</li>
                    </ul>
                </div>
                {/* <!--// Location --> */}

                <div className="layout">
                    {/* <!--// Navigation --> */}
                    <div className="colbox">
                        <div className="main_map">
                            <li className={areaInfo[0] === "인천" ? "spot01 on":"spot01"} onClick={()=>{area_info("인천")}}><img /><a>인천</a></li>
                            <li className={areaInfo[0] === "대산" ? "spot02 on":"spot02"} onClick={()=>{area_info("대산")}}><img /><a>대산</a></li>
                            <li className={areaInfo[0] === "평택" ? "spot03 on":"spot03"} onClick={()=>{area_info("평택")}}><img /><a>평택</a></li>
                            <li className={areaInfo[0] === "여수" ? "spot04 on":"spot04"} onClick={()=>{area_info("여수")}}><img /><a>여수</a></li>
                            <li className={areaInfo[0] === "광양" ? "spot05 on":"spot05"} onClick={()=>{area_info("광양")}}><img /><a>광양</a></li>
                            <li className={areaInfo[0] === "부산" ? "spot06 on":"spot06"} onClick={()=>{area_info("부산")}}><img /><a>부산</a></li>
                            <li className={areaInfo[0] === "울산" ? "spot07 on":"spot07"} onClick={()=>{area_info("울산")}}><img /><a>울산</a></li>
                        </div>
                        <div className="main_data">
                            <div className="mini_board">
                                <div className="list">
                                    <img src="/assets/images/ico_water_drop.png" />
                                    <h1>{areaInfo[0]}</h1>
                                    <h2>{areaInfo[1]}</h2>
                                    <div className="notice">
                                        <h2 className="blind">HNS 해양배출 데이터</h2>
                                        <ul>
                                            {tableTag}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default MainMap;