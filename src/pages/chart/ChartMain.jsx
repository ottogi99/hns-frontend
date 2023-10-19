import React, {useState, useEffect}from 'react';

import Chartjs from 'pages/common/Main_chart';
import ReactDatePicker from 'pages/common/DataPickers';

function ChartMain() {
    const [Selected, setSelected] = useState("");
    const [radioValue, setradioValue] = useState("hour");
    const [dataSheet, setdataSheet] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [datepickerTag, setDatepickerTag] = useState([<ReactDatePicker contents = {radioValue} stDt= {setStartDate} edDt = {setEndDate}/>]);
    const [cdMaster, setCdMaster] = useState([]);
    const [obstation, setobstation] = useState([]);
    const [chartTag, setChartTag] = useState([]);
    const [selectTag, setSelectTag] = useState([]);
    const [chartType, setChartType] = useState("line");
    let cdList = [];
    const jToken = localStorage.getItem('jToken');
    

    const handleSelect = (e) => { setSelected(e.target.value);};
    
    const handleRadio = (e) => {
        setradioValue(e.target.value);
        let content = e.target.value;
        setDatepickerTag(<ReactDatePicker contents = {content} stDt= {setStartDate} edDt = {setEndDate}/>);
    };

    const dataList = () => {
        console.groupCollapsed("dataList()");
        let stDt = dateFormat(startDate, 'picker');
        let edDt = dateFormat(endDate, 'picker');
        if(radioValue === "day"){stDt = stDt+ '0000'; edDt = edDt+ '2359';}
        let url = process.env.REACT_APP_API_URL+'/d-data/search?keyword=' + Selected + '&startDt=' + stDt + '&endDt=' + edDt ;
//        let url = process.env.REACT_APP_API_URL+'/d-data/search?keyword='+Selected+'&startDt=202304111400&endDt=202304111800';
        if(Selected === "") alert("항목을 선택하세요");
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

    function dateFormat(date, form){
        let dtForm = '';
        if (form === 'picker'){
            if(radioValue === "day"){
                dtForm = date.getFullYear() 
                        + ((date.getMonth()+1) < 9 ? '0'+(date.getMonth()+1) : (date.getMonth()+1)) 
                        + ((date.getDate()) < 9 ? '0'+(date.getDate()) : (date.getDate()));
            } else {
                dtForm = date.getFullYear() 
                        + ((date.getMonth()+1) < 9 ? '0'+(date.getMonth()+1) : (date.getMonth()+1)) 
                        + ((date.getDate()) < 9 ? '0'+(date.getDate()) : (date.getDate()))
                        + ((date.getHours()) < 9 ? '0'+(date.getHours()) : (date.getHours()))
                        + ((date.getMinutes()) < 9 ? '0'+(date.getMinutes()) : (date.getMinutes()));
            }
            return dtForm;
        }
        else {
            if (date === null || date ==="") return '-'; 
            else return date.slice(0,4)+'-'+date.slice(4,6)+'-'+date.slice(6,8)+' '+date.slice(8,10)+':'+date.slice(10,12);
        }
    }
    
    useEffect(codeList,[]);
    useEffect(()=>{
        setChartTag(<Chartjs className="chartData" dataList={dataSheet} dateType={radioValue} obsList={obstation} type={chartType}></Chartjs>);
    },[dataSheet]);
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

        cdList.map((data, index) => (tagList.push(<option key={index} value={data[0]} >{data[1]}</option>)))
        setSelectTag(tagList);
    },[cdMaster]);
    return (
        <div className="container">
            <div className="c_wrap">
                <div className="layout">
                    <div className="contents BUSINESS_INTRO" id="contents">
                        {/* <!-- 본문 --> */}
                        <h1 className="tit_3" >데이터 차트 현황
                            <select className= "select-post" onChange={(e)=>setChartType(e.target.value)} style={{float:"right", width : "200px"}}>
                                <option value={"line"}>꺽은선그래프</option>
                                <option value={"bar"}>막대그래프</option>
                            </select>
                        </h1>
                        
                        <h2 className="tit_4">{""}</h2>
                        <table className="search_header">
                            <tbody>
                                <tr>
                                    <td className='td_nm'>관측기간</td>
                                    <td className='td_serch'>
                                        <div className='radio'>
                                            <label><input value="day" name="datetype" type="radio" onChange={handleRadio} checked={radioValue === "day"}/> 일</label>
                                            <label><input value="hour" name="datetype" type="radio" onChange={handleRadio} checked={radioValue === "hour"} /> 시</label>
                                        </div>
                                        {datepickerTag}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='td_nm'>항목</td>
                                    <td className='td_serch'>
                                        <select onChange={handleSelect} value={Selected}>  
                                        <option value="" hidden>== 선택하세요 ==</option>                           
                                            {selectTag}
                                        </select>
                                        <button onClick={dataList}><img src="/assets/images/ico_search.png" alt ="" />검색</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {chartTag}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChartMain;