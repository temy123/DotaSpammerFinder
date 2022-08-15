const URL_HERO_IMG = `https://api.opendota.com`
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
    }, ],
    ARRAY_PATCH_INFO = [{
            name: "7.31",
            val: 50
        },
        // {
        //     name: "7.30",
        //     val: 49
        // }, {
        //     name: "7.29",
        //     val: 48
        // }, {
        //     name: "7.28",
        //     val: 47
        // }, {
        //     name: "7.27",
        //     val: 46
        // }, {
        //     name: "7.26",
        //     val: 45
        // }, {
        //     name: "7.25",
        //     val: 44
        // }, {
        //     name: "7.24",
        //     val: 43
        // }, {
        //     name: "7.23",
        //     val: 42
        // }, {
        //     name: "7.22",
        //     val: 41
        // }, {
        //     name: "7.21",
        //     val: 40
        // }, {
        //     name: "7.20",
        //     val: 39
        // }, 
    ]

var currentTierValue = ARRAY_RANK_INFO[0].val;
var currentPatchValue = ARRAY_PATCH_INFO[0].val;

window.onload = () => {
    var sql = null;
    var sql_model = null;
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

    function calculateTier(pick_rate, win_rate) {

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

    function appendNavHero(a, img_src, name) {
        html = `<li><a href="${a}" class="css-mtyeel e1y3xkpj0"><img src="${img_src}" width="46" alt="garen" height="46"><span>${name}</span></a></li>`
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

    function getSearchPageURL(id, patchVersion, rank, winrate, minPlayedCount, unranked) {
        return `new_search.html?id=${id}&patchVersion=${patchVersion}&rank=${rank}&winrate=${winrate}&minPlayedCount=${minPlayedCount}&unranked=${unranked}`
    }

    function bindHeroContainer() {
        document.getElementById('navHeroContainer').innerHTML = '';
        document.getElementById('mainHeroContainer').innerHTML = '';

        var heroes = sql_model.prepare('select * from Hero');
        var matches = sql_model.prepare('select * from Matches');
        matches.step()

        var matchData = matches.getAsObject();

        var tierVal = getCurrentTier() / 10;

        while (heroes.step()) {
            var heroData = heroes.getAsObject();

            var heroDetailUrl = `https://www.dota2.com/hero/${heroData['localized_name'].replace(' ', '')}?l=koreana`;
            var winRate = ((heroData[`${tierVal}_win`] / heroData[`${tierVal}_pick`]) * 100).toFixed(1);
            var pickRate = ((heroData[`${tierVal}_pick`] / matchData[`${tierVal}_pick`]) * 1000).toFixed(1);

            appendNavHero(heroDetailUrl, `img/heroes/${heroData['real_name']}.png`, heroData['localized_name_kor']);
            appendMainHero(heroData['hero_id'], `img/heroes/${heroData['real_name']}.png`, heroData['localized_name_kor'], heroData[`${tierVal}_tier`], pickRate, winRate, '-', '준비중');
        }

        heroes.free();
        matches.free();

        // 티어 순으로 정렬
        sort_table(2, true);
    }

    function getCurrentTier() {
        return currentTierValue;
    }

    function getCurrentPatch() {
        return currentPatchValue;
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

            bindHeroContainer();
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

        var rows = Array.prototype.slice.call(childrens, 0);
        rows.sort((row1, row2) => {
            var cell1 = row1.getElementsByTagName('td')[i];
            var cell2 = row2.getElementsByTagName('td')[i];
            var val1 = cell1.textContent || cell1.innerText;
            var val2 = cell2.textContent || cell2.innerText;
            val1 = val1.replace('%', '');
            val2 = val2.replace('%', '');
            if (Number(val1)) val1 = Number(val1);
            if (Number(val2)) val2 = Number(val2);
            if (val1 < val2) return direction;
            if (val1 > val2) return direction * -1;
            return 0;
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

    function getSessionData() {
        if (sessionStorage.getItem('tier')) {
            currentTierValue = sessionStorage.getItem('tier');
        }

        if (sessionStorage.getItem('patch')) {
            currentPatchValue = sessionStorage.getItem('patch');
        }
    }

    function init() {
        initSql().then((model) => {
            getSessionData();

            bindHeroContainer();
            bindDropdown();
            bindTableClickTags();

            selectTier(currentTierValue);
            selectPatch(currentPatchValue);
        });
    }

    init();
}