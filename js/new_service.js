window.onload = () => {
    var sql = null;
    var sql_model = null;
    const URL_HERO_IMG = `https://api.opendota.com`

    const ARRAY_RANK_INFO = [{
            'name': '불멸자 [Immortal]',
            'val': 80
        },
        {
            'name': '신 [Divine]',
            'val': 70
        },
        {
            'name': '거장 [Ancient]',
            'val': 60
        },
        {
            'name': '전설 [Legend]',
            'val': 50
        },
        {
            'name': '집정관 [Arcorn]',
            'val': 40
        },
        {
            'name': '성전사 [Crusader]',
            'val': 30
        },
        {
            'name': '수호자 [Guardian]',
            'val': 20
        },
        {
            'name': '선구자 [Herald]',
            'val': 10
        },

    ]

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

    function appendNavHero(a, img_src, name) {
        html = `<li><a href="${a}" class="css-mtyeel e1y3xkpj0"><img src="${img_src}" width="46" alt="garen" height="46"><span>${name}</span></a></li>`
        document.getElementById('navHeroContainer').innerHTML += html;
    }

    function appendMainHero(i, img_src, name, a, tier, pick_rate, win_rate, ban_rate, against_heroes) {
        index = `<td class="table_default rank"><span>${i}</span></td>`;
        name_ = `<td class="table_default hero"><a href="${a}"><img src="${img_src}" width="32" alt="${name}" height="32"><strong>${name}</strong></a></td>`;
        tier_ = `<td class="table_default tier"><span class=""></span>${tier}</td>`;
        win_rate_ = `<td class="table_default number">${win_rate}%</td>`;
        pick_rate_ = `<td class="table_default number">${pick_rate}%</td>`;
        ban_rate_ = `<td class="table_default number">${ban_rate}%</td>`;
        against_heroes_ = `<td class="table_default"></td>`;

        html = `<tr>${index}${name_}${tier_}${win_rate_}${pick_rate_}${ban_rate_}${against_heroes_}</tr>`;
        document.getElementById('mainHeroContainer').innerHTML += html;
    }

    function getSearchPageURL(id, patchVersion, rank, winrate, minPlayedCount, unranked) {
        return `search.html?id=${id}&patchVersion=${patchVersion}&rank=${rank}&winrate=${winrate}&minPlayedCount=${minPlayedCount}&unranked=${unranked}`
    }

    function bindNavContainer() {
        heroes = sql_model.prepare('select * from Hero');
        while (heroes.step()) {
            var heroData = heroes.get();
            var searchURL = getSearchPageURL(heroData[0], 50, 80, 55, 10, false);

            appendNavHero('#', `${URL_HERO_IMG}${heroData[8]}`, heroData[3]);
            appendMainHero(heroData[0], `${URL_HERO_IMG}${heroData[8]}`, heroData[3], searchURL, 1, 0, 0, 0, '준비중');
        }
        heroes.free();
    }

    function selectTier(value) {
        var tierContainer = document.getElementById('btn_rank');

        var index = ARRAY_RANK_INFO.length - (value / 10);
        var tierInfo = ARRAY_RANK_INFO[index];

        tierContainer.firstElementChild.setAttribute('src', getTierIconSrc(tierInfo['val']));
        tierContainer.lastElementChild.textContent = tierInfo['name'];
        tierContainer.setAttribute('value', value);
    }

    function getTierIconSrc(value) {
        return `img/rank_icon_${value/10}.png`;
    }

    function bindDropdown() {
        const btnRank = document.getElementById('btn_rank');
        const divTier = document.getElementById('div_tier');

        const handleSelect = (element) => {
            selectTier(element.getAttribute('value'));
            var container = document.getElementsByClassName('tier_container')[0];
            container.parentElement.removeChild(container);
        };

        btnRank.addEventListener('click', (ev) => {
            if (divTier.childElementCount != 1) return;

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

    function init() {
        initSql().then((model) => {
            bindNavContainer();
            bindDropdown();

            selectTier(ARRAY_RANK_INFO[0].val);
        });
    }

    init();
}