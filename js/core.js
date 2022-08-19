var timers = [];

function includeHeader() {
    var header = document.getElementById('dota-header');

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status < 400) {
            header.innerHTML = xhttp.responseText;
        }
    }

    xhttp.open('get', 'template_top.html', true);
    xhttp.send();
}

function activeHeader(index) {
    var header = document.getElementById('dota-header');

    if (header.getElementsByClassName(`header`).length == 0) {
        setTimeout(() => activeHeader(index), 10);
        return;
    }

    header = header.getElementsByClassName(`header`)[0];
    li_list = header.getElementsByTagName(`li`);
    li_list[index].getElementsByTagName('a')[0].classList.add('selected');
}

function requestSearch(keyword, callback) {
    var xmlHttpRequest = new XMLHttpRequest();

    let url = `https://api.opendota.com/api/search?q=${keyword}`;

    xmlHttpRequest.onreadystatechange = (ev) => {
        if (xmlHttpRequest.readyState == 4) {
            callback(xmlHttpRequest.responseText);
        }
    }
    xmlHttpRequest.open('get', url);
    xmlHttpRequest.send();
}

function appendPlayer(data) {

    var date = new Date(data['last_match_time']);
    var currentDate = new Date();

    var millis = currentDate.getTime() - date.getTime();

    var link = `https://www.opendota.com/players/${data['account_id']}`;

    millis = Math.ceil(millis / 1000 / 60 / 60 / 24);

    var html = `
    <div class="player">
        <a href="${link}" target="_blank">
            <img src="${data['avatarfull']}" onerror="this.src='img/img_null.png'">

            <div class="info">
                <span class="nickname">${data['personaname']}</span>
                <span class="date">Last Match: ${millis}일 전</span>
            </div>
        </a>
    </div>
`;
    var container = document.getElementsByClassName('players_container')[0]
    container.insertAdjacentHTML('beforeend', html);
}

function clearPlayer() {
    let elements = document.getElementsByClassName('player');

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        element.remove();
    }
}

function hideSearchResult() {
    var container = document.getElementsByClassName('players_container')[0];
    container.style.display = 'none';
}

function showSearchResult() {
    var container = document.getElementsByClassName('players_container')[0];
    container.style.display = 'flex';
}

window.addEventListener('load', (window, ev) => {
    var keyword = document.getElementById('keyword');
    keyword.addEventListener('input', (el, ev) => {
        var value = keyword.value;
        if (value == '') {
            // 숨기기
            hideSearchResult();
            return;
        }

        timers.forEach(timer => {
            clearTimeout(timer);
        });

        timers.push(setTimeout(() => {
            requestSearch(value, (text) => {
                clearPlayer();
                showSearchResult();

                var data = JSON.parse(text);

                data.sort((a, b) => {
                    let x = new Date(a['last_match_time']);
                    let y = new Date(b['last_match_time']);

                    if (isNaN(x.getTime())) x = new Date(1990, 1, 1);
                    if (isNaN(y.getTime())) y = new Date(1990, 1, 1);

                    return y - x;
                })


                if (data.length >= 4) {
                    data = data.splice(0, 4);
                }

                data.forEach(d => {
                    appendPlayer(d);
                });
            });
        }, 500));

    });
});
