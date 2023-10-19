/* global kakao */
import React, { useEffect, useState, useRef } from 'react';
import MapNaver from './MainMap_naver'
import geojson from '../../constants/korea_geo'

const MainMap = () => {
    // 네이버 지도 변수 생성
    const mapElement = useRef(null);
    const { naver } = window;
//    const [dataSheet, setdataSheet] = useState([]);
    const jToken = localStorage.getItem('jToken');
    const [xy,setXY]=useState({x:0,y:0});
    const handleMouseMove=(e)=>{
        setXY({x:e.clientX,y:e.clientY});
    }
    const [doNm, setDoNm] = useState('');
    const [displays, setDisplays] = useState('');

    //네이버 지도 그리기
    useEffect(() => {
            if (!mapElement.current || !naver) return;
    
        // 지도에 표시할 위치의 위도와 경도 좌표를 파라미터로 넣어줍니다.
        const location = new naver.maps.LatLng(36, 128);
        const mapOptions = {
          center: location,
          zoom: 7,
          minZoom: 7,
          maxZoom: 7,
          mapTypeId: naver.maps.MapTypeId.SATELLITE,   //(위성)SATELLITE, (위성+지역)HYBRID, (지형도)TERRAIN, (일반)NORMAL 
          scaleControl: false,
          logoControl: false,
          mapDataControl: false,
          zoomControl: false,
          mapTypeControl: false,
        };
    
        const map = new naver.maps.Map(mapElement.current, mapOptions);

        var clicked = false;

        map.data.setStyle(function(feature) {
            var styleOptions = {
                fillColor: '#ff0000',
                fillOpacity: 0.0,
                strokeColor: '#ff0000',
                strokeWeight: 0,
                strokeOpacity: 0.4
            };
            if (!feature.getProperty('focus') && clicked) {
                styleOptions.fillOpacity = 0.5;
                styleOptions.fillColor = '#000';
                styleOptions.strokeColor = '#000';
                styleOptions.strokeWeight = 0;
                styleOptions.strokeOpacity = 1;
            }
            return styleOptions;
        });

        map.data.addGeoJson(geojson);

        map.data.addListener('click', function(e) {
            var feature = e.feature;
            if (feature.getProperty('focus') !== true) {
                if(clicked === false){
                    clicked = true;
                    feature.setProperty('focus', true);
                    map.setOptions("maxZoom", 10)
                    map.setOptions("zoom", 8);
                    map.setOptions("center", e.coord);
                } else {
                    alert(doNm+"을 선택중입니다.");
                }
            } else {
                feature.setProperty('focus', false);
                map.setOptions("maxZoom", 7)
                map.setOptions("zoom", 7);
                map.setOptions("center", location);
                clicked = false;
            }
        });

        map.data.addListener('mouseover', function(e) {
            var feature = e.feature;
            map.data.overrideStyle(feature, {
                fillOpacity: 0.5,
                strokeWeight: 0,
                strokeOpacity: 1
            });
            setDoNm(feature.property_CTP_KOR_NM);
            setDisplays('block');
        });

        map.data.addListener('mouseout', function(e) {
            map.data.revertStyle();
            setDisplays('none');
        });
//        console.log(map.data._features);
        
    }, []);
    return (
        <div onMouseMove={(e)=>handleMouseMove(e)}
            style={{ width: '95%', display: 'block', marginLeft: '20px', marginRight: '20px'}}>
            <MapNaver></MapNaver>
            {/* 네이버 지도*/}
            <div ref={mapElement} style={{ width: '47%', height: '700px', minHeight: '400px', float: 'left' , marginLeft : '30px'}} />
            <div style={{position:'absolute', zIndex:'1000', padding:'5px 10px', backgroundColor:'#fff',
                            border:'solid 1px #000', fontSize: '14px', pointerEvents: 'none', display:displays, left:xy.x, top:xy.y}}>{doNm}</div>
        </div>
    );
};

export default MainMap;