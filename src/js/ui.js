
export default function initPage() {

    // 현재 페이지에는 아직 존재하지 않은 요소에 대한 이벤트 처리
    document.addEventListener('click', (e) => {
        const el = e.target;

        // 메인화면 미니보드
        if (el.matches('.mini_board .tab li a')) {
            e.preventDefault();
            const el = e.target;
            const tabs = el.closest('.tab');

            // 탭 선택 상태 변경
            tabs.querySelectorAll('a').forEach(a => a.classList.remove('on'));
            el.classList.add('on');

            // 미니보드 표시 상태 변경
            const divs = document.querySelectorAll('.mini_board .list > div');
            divs.forEach(div => div.style.display = 'none');

            var idx = Array.prototype.indexOf.call(tabs.querySelectorAll('a'), el);
            divs[idx].style.display = 'block';
        }

        /* Form */
        // Checkbox
        else if (el.matches('.f_chk input')) {
         el.parentElement.classList[el.checked ? 'add' : 'remove']('on');
        }
    });


}