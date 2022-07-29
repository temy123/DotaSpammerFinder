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
    }, {
        name: "7.30",
        val: 49
    }, {
        name: "7.29",
        val: 48
    }, {
        name: "7.28",
        val: 47
    }, {
        name: "7.27",
        val: 46
    }, {
        name: "7.26",
        val: 45
    }, {
        name: "7.25",
        val: 44
    }, {
        name: "7.24",
        val: 43
    }, {
        name: "7.23",
        val: 42
    }, {
        name: "7.22",
        val: 41
    }, {
        name: "7.21",
        val: 40
    }, {
        name: "7.20",
        val: 39
    }, ]

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
        tier_ = `<td class="table_default tier"><span class=""></span>${tier}</td>`;
        win_rate_ = `<td class="table_default number">${win_rate}%</td>`;
        pick_rate_ = `<td class="table_default number">${pick_rate}%</td>`;
        ban_rate_ = `<td class="table_default number">${ban_rate}%</td>`;
        against_heroes_ = `<td class="table_default"></td>`;

        html = `<tr>${index}${name_}${tier_}${win_rate_}${pick_rate_}${ban_rate_}${against_heroes_}</tr>`;

        // onclick 이벤트가 사라지지 않게 innerHTML 에 직접 넣지 않고 함수를 사용
        document.getElementById('mainHeroContainer').insertAdjacentHTML('beforebegin', html);

        document.getElementById(`hero_${i}`).addEventListener('click', (ev) => {
            location.href = getHeroSpammerIdURL(i);
        });
    }

    function getSearchPageURL(id, patchVersion, rank, winrate, minPlayedCount, unranked) {
        return `new_search.html?id=${id}&patchVersion=${patchVersion}&rank=${rank}&winrate=${winrate}&minPlayedCount=${minPlayedCount}&unranked=${unranked}`
    }

    function bindHeroContainer() {
        heroes = sql_model.prepare('select * from Hero');
        while (heroes.step()) {
            var heroData = heroes.get();

            heroDetailUrl = `https://www.dota2.com/hero/${heroData[2]}?l=koreana`;

            appendNavHero(heroDetailUrl, `${URL_HERO_IMG}${heroData[8]}`, heroData[3]);
            appendMainHero(heroData[0], `${URL_HERO_IMG}${heroData[8]}`, heroData[3], 1, 0, 0, 0, '준비중');
        }
        heroes.free();
    }

    function getCurrentTier() {
        return document.getElementById('btn_rank').getAttribute('value');
    }

    function getCurrentPatch() {
        return document.getElementById('btn_patch').getAttribute('value');
    }

    function selectTier(value) {
        var tierContainer = document.getElementById('btn_rank');

        var index = ARRAY_RANK_INFO.length - (value / 10);
        var tierInfo = ARRAY_RANK_INFO[index];

        tierContainer.firstElementChild.setAttribute('src', getTierIconSrc(tierInfo['val']));
        tierContainer.lastElementChild.textContent = tierInfo['name'];
        tierContainer.setAttribute('value', value);

        sessionStorage.setItem('tier', value);
    }

    function selectPatch(value) {
        var patchContainer = document.getElementById('btn_patch');

        var index = ARRAY_PATCH_INFO.length - (value - 39) - 1;
        var patchInfo = ARRAY_PATCH_INFO[index];

        patchContainer.lastElementChild.textContent = patchInfo['name'];
        patchContainer.setAttribute('value', value);

        sessionStorage.setItem('patch', value);
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

    function bindDropdown() {
        bindDropDownTier();
        bindDropDownPatch();
    }

    function init() {
        initSql().then((model) => {
            bindHeroContainer();
            bindDropdown();

            if (sessionStorage.getItem('tier')) {
                selectTier(sessionStorage.getItem('tier'));
            } else {
                selectTier(ARRAY_RANK_INFO[0].val);
            }

            if (sessionStorage.getItem('patch')) {
                selectPatch(sessionStorage.getItem('patch'));
            } else {
                selectPatch(ARRAY_PATCH_INFO[0].val);
            }

        });
    }

    init();
}