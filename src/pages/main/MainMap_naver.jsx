/* global kakao */
import React, { useEffect, useState, useRef } from 'react';

const MainMap = () => {
    // 네이버 지도 변수 생성
    const mapElement = useRef(null);
    const { naver } = window;
//    const [dataSheet, setdataSheet] = useState([]);
    const jToken = localStorage.getItem('jToken');

    const [dataSheet, setdataSheet] = useState([]);
    const area = [[37.35, 126.5],[36.81, 126.05],[36.03, 126.45], [34.52, 127.65], [34.82, 128.85], [35.21, 129.39], [36.11, 129.69]];
    const datas = [130, 842, -325, 64, -752, 338, 708];
    const colors = ['#B71C1C', '#F44336', '#EF5350', '#EF9A9A', '#FFCDD2'];
//    const colors = ['#B71C1C', '#C62828', '#D32F2F', '#F44336', '#EF5350', '#EF9A9A', '#FFCDD2'];
//    const colors = ['#B22222', '#FF8C00', '#FFD700', '#228B22', '#00BFFF', '#4B0082', '#FAEBD7'];

    //네이버 지도 그리기
    useEffect(() => {
        if (!mapElement.current || !naver) return;
    
        // 지도에 표시할 위치의 위도와 경도 좌표를 파라미터로 넣어줍니다.
        const location = new naver.maps.LatLng(36, 128);
        const mapOptions = {
          center: location,
          zoom: 7,
          mapTypeId: naver.maps.MapTypeId.HYBRID,   //(위성)SATELLITE, (위성+지역)HYBRID, (지형도)TERRAIN, (일반)NORMAL 
          scaleControl: false,
          logoControl: false,
          mapDataControl: false,
          zoomControl: false,
          mapTypeControl: false,
        };
    
        const map = new naver.maps.Map(mapElement.current, mapOptions);
/*        
        if(dataSheet.length> 0){
            for(var i = 0; i < dataSheet.length; i++){
            }
        }
*/
        let url = process.env;
        console.log(process.env.REACT_APP_API_URL);
        for(var i = 0; i < area.length; i++){
            let color = '';
            let fontcolor = '#ffffff';
            let data = 0;
            if(datas[i] > -1000 && datas[i] <= -600){
                color = colors[4];
                data = parseInt((datas[i]+600)/4 +100);
                fontcolor = '#000000';
            }
            else if(datas[i] > -600 && datas[i] <= -200){
                color = colors[3];
                data = parseInt((datas[i]+200)/4 +100);
                fontcolor = '#000000';
            }
            else if(datas[i] > -200 && datas[i] <=  200){
                color = colors[2];
                data = parseInt((datas[i]+200)/4);
            }
            else if(datas[i] >  200 && datas[i] <=  600){
                color = colors[1];
                data = parseInt((datas[i]-200)/4);
            }
            else if(datas[i] >  600 && datas[i] <= 1000){
                color = colors[0];
                data = parseInt((datas[i]-600)/4);
            }
            
            if(data === 0) data = 3;

            let marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(area[i][0],area[i][1]),
                map: map,
                title: 'marker',
                icon: {
                    content: `<div style="width:`+data+`px; height:`+data+`px; float:left; background-color:`+ color +`; border-radius:`+data/2+`px;">`
                            +`<div style="text-align: center; line-height:`+data+`px; font-size: 12px; font-weight: 700; color: `+fontcolor+`;">`+datas[i]+`</div></div>`,
                    size: new naver.maps.Size(0, 0),
                    anchor: new naver.maps.Point(data/2, data/2)
                },
                draggable: true
            })
        }
/*
    }, [dataSheet]);

    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL+'/d-data/search?startDt=202307131645&endDt=202307131647', 
            { headers: {
               'Authorization': jToken
            }})
                .then(response => response.json())
                .then(data => {
                    if(data.length > 0) setdataSheet(data);
                    else setdataSheet([]);}) 
                .catch(err => console.error(err));
                */
    }, []);
    return (
        <div
            style={{ width: '95%', display: 'block', marginRight: '20px'}}>
            {/* 네이버 지도*/}
            <div ref={mapElement} style={{ width: '47%', height: '700px', minHeight: '400px', float: 'left' }} />
            <img src="assets/images/map_info.png" style={{ width: '100px', position: 'fixed', top : '105px', left:'25px' }}/>            
        </div>
    );
};

export default MainMap;