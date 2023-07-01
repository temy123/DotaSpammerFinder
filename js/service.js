const URL_HERO_IMG = `https://api.opendota.com`
const ARRAY_ROLE_INFO = [{
        name: '전체',
        img: '',
        val: 0
    }, {
        name: '캐리',
        img: 'img/icon_carry.jpg',
        val: 1
    },
    {
        name: '미드',
        img: 'img/icon_nuker.jpg',
        val: 2
    },
    {
        name: '오프레이너',
        img: 'img/icon_duration.jpg',
        val: 3
    },
    {
        name: '서포터',
        img: 'img/icon_support.jpg',
        val: 4
    },
    {
        name: '하드 서포터',
        img: 'img/icon_jungler.jpg',
        val: 5
    },
];

const ARRAY_RANK_INFO = [{
    name: "Immortal+",
    val: 80
}, {
    name: "Divine+",
    val: 70
}, {
    name: "Ancient+",
    val: 60
}, {
    name: "Legend+",
    val: 50
}, {
    name: "Arcorn+",
    val: 40
}, {
    name: "Crusader+",
    val: 30
}, {
    name: "Guardian+",
    val: 20
}, {
    name: "Herald+",
    val: 10
}, ];

ARRAY_PATCH_INFO = [{
    name: "7.33",
    val: 52
}, {
    name: "7.32",
    val: 51
}, {
    name: "7.31",
    val: 50
}, ]

var currentTierValue = ARRAY_RANK_INFO[0].val;
var currentPatchValue = ARRAY_PATCH_INFO[0].val;
var currentRoleValue = ARRAY_ROLE_INFO[0].val;

// 영웅 데이터가 담긴 배열 선언
var heroDataArray = [];

// 매치 기록이 담긴 배열 선언
var matchDataArray = [];

// SQL 정보
var sql = null;
var sql_model = null;

window.onload = () => {

    function appendNavHero(a, img_src, name) {
        html = `<li><a href="${a}" target="_blank" class="css-mtyeel e1y3xkpj0"><img src="${img_src}" width="46" alt="garen" height="46"><span>${name}</span></a></li>`
        document.getElementById('navHeroContainer').innerHTML += html;
    }

    function appendMainHero(i, img_src, name, tier, pick_rate, win_rate, ban_rate, against_heroes) {
        index = `<td class="table_default rank"><span>${i}</span></td>`;
        name_ = `<td class="table_default hero"><a id="hero_${i}" href="#"><img src="${img_src}" width="32" alt="${name}" height="32"><strong>${name}</strong></a></td>`;
        tier_ = `<td class="table_default tier"><img src="img/icon-tier-${tier}.svg" style="background:none; width:24px; height:24px; text-align:center;vertical-align:middle;"><span class=""></span>${tier}</td>`;
        // tier_ = `<td class="table_default tier"><span class="tier" style="background-image: url(img/icon-tier-${tier}.svg)"></span>${tier}</td>`;
        win_rate_ = `<td class="table_default number">${win_rate}%</td>`;
        pick_rate_ = `<td class="table_default number">${pick_rate}%</td>`;
        ban_rate_ = `<td class="table_default number">${ban_rate}%</td>`;
        against_heroes_ = `<td class="table_default"></td>`;

        html = `<tr>${index}${name_}${tier_}${win_rate_}${pick_rate_}${ban_rate_}${against_heroes_}</tr>`;

        // onclick 이벤트가 사라지지 않게 innerHTML 에 직접 넣지 않고 함수를 사용
        document.getElementById('mainHeroContainer').insertAdjacentHTML('beforeend', html);

        document.getElementById(`hero_${i}`).addEventListener('click', (ev) => {
            location.href = getHeroSpammerIdURL(i);
        });
    }

    function bindToNavHeroes() {
        document.getElementById('navHeroContainer').innerHTML = '';

        // 영웅 데이터만큼 반복
        for (var i = 0; i < heroDataArray.length; i++) {
            var heroData = heroDataArray[i];
            var heroDetailUrl = `https://www.dota2.com/hero/${heroData['localized_name'].replace(' ', '')}?l=koreana`;

            appendNavHero(heroDetailUrl, `img/heroes/${heroData['real_name']}.png`, heroData['localized_name_kor']);
        }
    }

    function selectTier(value) {
        var tierContainer = document.getElementById('btn_rank');

        var index = ARRAY_RANK_INFO.length - (value / 10);
        var tierInfo = ARRAY_RANK_INFO[index];

        tierContainer.firstElementChild.setAttribute('src', getTierIconSrc(tierInfo['val']));
        tierContainer.lastElementChild.textContent = tierInfo['name'];
        tierContainer.setAttribute('value', value);

        sessionStorage.setItem('tier', value);
        currentTierValue = value;
    }

    function selectPatch(value) {
        var patchContainer = document.getElementById('btn_patch');

        var index = ARRAY_PATCH_INFO.length - (value - 50) - 1;
        // var index = ARRAY_PATCH_INFO.length - (value - 39) - 1;
        var patchInfo = ARRAY_PATCH_INFO[index];

        patchContainer.lastElementChild.textContent = patchInfo['name'];
        patchContainer.setAttribute('value', value);

        sessionStorage.setItem('patch', value);
        currentPatchValue = value;
    }

    // 롤 선택
    function selectRole(value) {
        // role_list 클래스를 가진 태그 가져오기
        var roleList = document.getElementsByClassName('role_list')[0];

        roleList.setAttribute('value', value);

        sessionStorage.setItem('role', value);
        currentRoleValue = value;
    }


    function getTierIconSrc(value) {
        return `img/rank_icon_${value/10}.png`;
    }

    function bindDropDownTier() {
        const btnRank = document.getElementById('btn_rank');
        const divTier = document.getElementById('div_tier');

        const handleSelect = (element) => {
            selectTier(element.getAttribute('value'));
            var container = document.getElementsByClassName('tier_container')[0];
            container.parentElement.removeChild(container);

            bindToMainHeroes();
        };

        btnRank.addEventListener('click', (ev) => {
            if (divTier.childElementCount != 1) {
                handleSelect(btnRank);
                return;
            }

            var tierContainer = document.createElement('div');
            tierContainer.classList.add('tier_container');

            ARRAY_RANK_INFO.forEach(item => {
                var button = document.createElement('button');
                var icon = document.createElement('img');
                var span = document.createElement('span');
                button.setAttribute('type', 'button');
                button.setAttribute('value', item['val']);
                button.classList.add('option_button');
                icon.setAttribute('src', getTierIconSrc(item['val']));
                icon.setAttribute('width', 24);
                icon.setAttribute('height', 24);
                span.textContent = item['name'];
                tierContainer.appendChild(button);
                button.appendChild(icon);
                button.appendChild(span);

                button.addEventListener('click', (ev) => handleSelect(button));
            });
            divTier.appendChild(tierContainer);
        });
    }

    function bindDropDownPatch() {
        const btnPatch = document.getElementById('btn_patch');
        const divPatch = document.getElementById('div_patch');

        const handleSelect = (element) => {
            selectPatch(element.getAttribute('value'));
            var container = document.getElementsByClassName('patch_container')[0];
            container.parentElement.removeChild(container);
        };

        btnPatch.addEventListener('click', (ev) => {
            if (divPatch.childElementCount != 1) {
                handleSelect(btnPatch);
                return;
            }

            var patchContainer = document.createElement('div');
            patchContainer.classList.add('patch_container');

            ARRAY_PATCH_INFO.forEach(item => {
                var button = document.createElement('button');
                var span = document.createElement('span');
                button.setAttribute('type', 'button');
                button.setAttribute('value', item['val']);
                button.classList.add('option_button');
                span.textContent = item['name'];
                patchContainer.appendChild(button);
                button.appendChild(span);

                button.addEventListener('click', (ev) => handleSelect(button));
            });
            divPatch.appendChild(patchContainer);
        });
    }

    function sort_table(i, asc = null) {
        var container = document.getElementById('mainHeroContainer');
        var childrens = container.children;

        var sortState = container.getAttribute('sort');
        var currentState = (sortState == 'desc') ? 'asc' : 'desc'

        if (asc != null && asc == true) {
            currentState = 'asc';
        } else if (asc != null && asc == false) {
            currentState = 'desc';
        }

        container.setAttribute('sort', currentState);

        var direction = (currentState == 'desc') ? 1 : -1;

        // 1차로 전달 받은 값으로 정렬하고 2차로 픽률 순으로 정렬
        var rows = Array.prototype.slice.call(childrens, 0)
        rows.sort(function (row1, row2) {
            var cell1 = row1.getElementsByTagName('td')[i];
            var cell2 = row2.getElementsByTagName('td')[i];

            var aVal = (cell1.textContent || cell1.innerText).replace('%', '');
            var bVal = (cell2.textContent || cell2.innerText).replace('%', '');

            if (Number(aVal)) aVal = Number(aVal);
            if (Number(bVal)) bVal = Number(bVal);

            // 2차 정렬 (픽률 순)
            if (aVal == bVal) {

                cell1 = row1.getElementsByTagName('td')[4];
                cell2 = row2.getElementsByTagName('td')[4];

                var aaVal = (cell1.textContent || cell1.innerText).replace('%', '');
                var bbVal = (cell2.textContent || cell2.innerText).replace('%', '');

                return (aaVal > bbVal) ? direction : (aaVal < bbVal) ? -direction : 0;
            }

            return (aVal > bVal) ? -direction : (aVal < bVal) ? direction : 0;
        });

        rows.forEach(element => {
            container.appendChild(element);
        });
    }

    function on_clicked_headers(ev, i) {
        if (i == 6) return;

        sort_table(i);
    }

    function bindTableClickTags() {
        var thead = document.getElementsByTagName('thead')[0];

        var tags = thead.children[0].children;
        for (let i = 0; i < tags.length; i++) {
            const element = tags[i];
            element.setAttribute('index', i);
            element.addEventListener('click', (ev) => on_clicked_headers(ev, i));
        }
    }

    function bindDropdown() {
        bindDropDownTier();
        bindDropDownPatch();
    }

    function bindToMainHeroes() {
        document.getElementById('mainHeroContainer').innerHTML = '';

        // 영웅 데이터를 가져온다.
        var heroData = heroDataArray;
        // 매치 데이터를 가져온다.
        var match = matchDataArray[0];
        // 티어 데이터를 가져온다.
        var tierVal = getCurrentTier() / 10;

        // 실제 보여줄 영웅의 데이터를 담을 배열
        var currentHeroData = null;

        // currentRoleValue이 0이면 모든 영웅을 보여준다.
        if (currentRoleValue == 0) {
            currentHeroData = heroData;
        } else {
            currentHeroData = heroData.filter(item =>
                item['lane_role_1'] == currentRoleValue ||
                item['lane_role_2'] == currentRoleValue ||
                item['lane_role_3'] == currentRoleValue);
        }

        console.log(currentHeroData);

        // 영웅 데이터만큼 반복
        for (let i = 0; i < currentHeroData.length; i++) {
            const hero = currentHeroData[i];

            var totalCount = match[`${tierVal}_pick`];
            var winCount = hero[`${tierVal}_win`];
            var pickedCount = hero[`${tierVal}_pick`];

            // 승률을 계산해서 1자리수까지 표시하도록 한다.
            var winRate = (winCount / pickedCount * 100).toFixed(1);

            // 픽률을 계산해서 1자리수까지 표시하도록 한다.
            var pickRate = (pickedCount / totalCount * 1000).toFixed(1);

            appendMainHero(hero['hero_id'], `img/heroes/${hero['real_name']}.png`, hero['localized_name_kor'], hero[`${tierVal}_tier`], pickRate, winRate, '-', '준비중');
        }

        // 티어 순으로 정렬
        sort_table(2, true);
    }

    function initRoleButtons() {
        // 'role_list' 라는 클래스를 가진 태그 안에 button 태그들을 찾는다.
        var roleList = document.getElementsByClassName('role_list')[0];
        var roleButtons = roleList.getElementsByTagName('button');

        // 클릭 된 버튼에 active 클래스를 추가하고 id 를 설정한다
        for (let i = 0; i < roleButtons.length; i++) {
            const element = roleButtons[i];
            element.setAttribute('id', `btn_role_${i}`);
            element.addEventListener('click', (ev) => {
                var activeButton = roleList.getElementsByClassName('role_active')[0];
                if (activeButton) activeButton.classList.remove('role_active');
                element.classList.add('role_active');

                selectRole(i)
                bindToMainHeroes()
            });
        }

        // currentRoleValue 값에 따라 roleButtons[i]의 클래스를 설정한다.
        roleButtons[currentRoleValue].classList.add('role_active');
    }

    function init() {
        initSql().then((model) => {
            getSessionData();

            // 영웅데이터와 매치데이터를 불러오고 끝나면 테이블을 그린다.
            Promise.all([getHeroData(model), getMatchData(model)]).then((values) => {
                initRoleButtons();

                bindToNavHeroes();
                bindToMainHeroes();
                bindDropdown();
                bindTableClickTags();

                selectTier(currentTierValue);
                selectPatch(currentPatchValue);
            });
        });
    }

    init();
}



// sql에서 데이터를 가져와서 heroDataArray에 넣는다.
function getHeroData() {
    return new Promise((resolve, reject) => {
        var stmt = sql_model.prepare("select * from Hero");
        while (stmt.step()) {
            var row = stmt.getAsObject();
            heroDataArray.push(row);
        }

        stmt.free();
        resolve();
    })
}

// sql에서 매치 데이터를 가져와서 matchDataArray에 넣는다.
function getMatchData() {
    return new Promise((resolve, reject) => {
        var stmt = sql_model.prepare("select * from Matches");
        while (stmt.step()) {
            var row = stmt.getAsObject();
            matchDataArray.push(row);
        }

        stmt.free();
        resolve();
    })
}


function getSessionData() {
    if (sessionStorage.getItem('tier')) {
        currentTierValue = sessionStorage.getItem('tier');
    }

    if (sessionStorage.getItem('patch')) {
        currentPatchValue = sessionStorage.getItem('patch');
    }
}

// Local 에 있는 DB 데이터 가져오기
function getLocalDbData() {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('get', '/db/od.db', true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = (e) => {
            var array = new Uint8Array(xhr.response);
            resolve({
                'data': xhr.response,
                'array': array
            });
        }
        xhr.send();
    })
}

function initSql() {
    var config = {
        locateFile: filename => `/dist/${filename}`
    };

    return initSqlJs(config)
        .then(function (SQL) {
            sql = SQL;
            return getLocalDbData()
        })
        .then(data => {
            sql_model = new sql.Database(data['array']);
            return sql_model;
        });
}

function getHeroSpammerIdURL(hero_id) {
    return getSearchPageURL(hero_id, getCurrentPatch(), getCurrentTier(), 55, 20, true);
}

function getCurrentTier() {
    return currentTierValue;
}

function getSearchPageURL(id, patchVersion, rank, winrate, minPlayedCount, unranked) {
    return `search.html?id=${id}&patchVersion=${patchVersion}&rank=${rank}&winrate=${winrate}&minPlayedCount=${minPlayedCount}&unranked=${unranked}`
}

function getCurrentPatch() {
    return currentPatchValue;
}