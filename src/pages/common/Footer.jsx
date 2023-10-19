import React from 'react';
import 'css/nav.css'

const Footer = ({loginUser}) => {
    const sesseionUserId =  loginUser.loginVO.id;
    const setNavPosition = () => {
        const labels = document.querySelector('#labels');
        const label = labels.children;
        labels.style.transform = '';

        const len = label.length;
        const rotate = Math.floor(360 / len);
        const parentXPos = document.querySelector('#labels').getBoundingClientRect().left;
        const parentYPos = document.querySelector('#labels').getBoundingClientRect().top;
       
        for (let i = 0; i < len; i++) {
            const pos = {};

            label[i].style.transform = `rotate(+${rotate * i}deg) translate(0, -50%)`
            label[i].children[0].style.transform = `rotate(${-(rotate * i)}deg)`
        
            pos.x = label[i].children[0].getBoundingClientRect().left - parentXPos;
            pos.y = label[i].children[0].getBoundingClientRect().top - parentYPos + 25;

            label[i].style.width = '110px';
            label[i].style.height = '100px';
            label[i].style.top = pos.y + 'px';
            label[i].style.left = pos.x + 'px';
        }
    }
    const navClose = () => {
        document.querySelector('#navClose').style.display= 'none';
        document.querySelector('#navToggle').style.display= 'block';
        document.querySelector('.ring-wrapper').style.display= 'none';
        document.querySelector("#root").classList.remove('nonTouch');
    };
    const navToggle = () => {
        document.querySelector('#navClose').style.display= 'block';
        document.querySelector('#navToggle').style.display= 'none';
        document.querySelector('.ring-wrapper').style.display= 'block';
        document.querySelector("#root").classList.add('nonTouch');
        setNavPosition();
        rotationEvent('layer-1');
    }
    const isMobile = () => {
        const UserAgent = navigator.userAgent;
        if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
            return true;
        } else {
            return false;
        }
    }

    function rotationEvent(id) {
        const isMobileBool = isMobile();
        const el = document.getElementById(id);
        const target = el.children[0].children;
        const elDisplay = el.children[0];
    
    
        let offsetRad = null;
        let targetRad = 0;
        let previousRad;
    
        if (isMobileBool) {
            elDisplay.addEventListener('touchstart', down);
        } else {
            elDisplay.addEventListener('mousedown', down);
        }
    
        function down(event) {
            offsetRad = getRotation(event);
            previousRad = offsetRad;
            if (isMobileBool) {
                window.addEventListener('touchmove', move, { passive: false });
                window.addEventListener('touchend', up);
            } else {
    
                window.addEventListener('mousemove', move, { passive: false });
                window.addEventListener('mouseup', up);
            }
        }
        function move(event) {
            var newRad = getRotation(event);
            targetRad += (newRad - previousRad);
            previousRad = newRad;
            const rotate = targetRad / Math.PI * 180;
            elDisplay.style.transform = 'rotate(' + rotate + 'deg)';
            for (let i = 0, limit = target.length; i < limit; i++) {
                target[i].children[0].style.transform = 'rotate(' + (-rotate - 360 / limit * i) + 'deg)';
            }
        }
        function up() {
            if (isMobileBool) {
                window.removeEventListener('touchmove', move);
                window.removeEventListener('touchend', up);
            } else {
                window.removeEventListener('mousemove', move);
                window.removeEventListener('mouseup', up);
            }
        }
    
        function getRotation(event) {
            var pos = mousePos(event, elDisplay);
            var x = pos.x - elDisplay.clientWidth * 0.5;
            var y = pos.y - elDisplay.clientHeight * 0.5;
            return Math.atan2(y, x);
        }
    
        function mousePos(event, currentElement) {
            var totalOffsetX = 0;
            var totalOffsetY = 0;
            var canvasX = 0;
            var canvasY = 0;
            do {
                totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
                totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
            } while (currentElement = currentElement.offsetParent)
            if (isMobileBool) {
                canvasX = event.changedTouches[0].pageX - totalOffsetX;
                canvasY = event.changedTouches[0].pageY - totalOffsetY;
            } else {
                canvasX = event.pageX - totalOffsetX;
                canvasY = event.pageY - totalOffsetY;
            };
            return {
                x: canvasX,
                y: canvasY
            };
        }
    }
    return (
        <>
    <div className="ring-wrapper" style={{display:"none"}}>
        <div id="layer-1" className="ring layer-1">
            <div id="labels" className="ring-display fixedMenu">
                <div className="navLabel">
                    <a draggable="false" className="homeNav m1" href="/">
                        <span>홈</span>
                    </a>
                </div>
                <div className="navLabel">
                    <a draggable="false" className="mapNav m2" href="/map">
                        <span>메인화면</span>
                    </a>
                </div>
                <div className="navLabel">
                    <a draggable="false" className="chartNav m3" href="/chart">
                        <span>차트</span>
                    </a>
                </div>
                <div className="navLabel">
                    <a draggable="false" className="reportNav m4" href="/report">
                        <span>보고서</span>
                    </a>
                </div>
            </div>
            <div className="innerCircle"  onClick={navClose}>
                <div className="innerCircle1"></div>
                <div className="innerCircle2"></div>
            </div>
        </div>
    </div>
    <div id="navClose" onClick={navClose}></div>
    <div id="navToggle" onClick={navToggle}>
        <div className="circle1"></div>
        <div className="circle2"></div>
    </div>
    </>
    )
  }
  export default Footer;