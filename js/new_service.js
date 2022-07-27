window.onload = () => {
    var sql = null;
    var sql_model = null;
    const URL_HERO_IMG = `https://api.opendota.com`

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

    function bindNavContainer() {
        heroes = sql_model.prepare('select * from Hero');
        while (heroes.step()) {
            var heroData = heroes.get();
            console.log(heroData);
            appendNavHero('#', `${URL_HERO_IMG}${heroData[8]}`, heroData[3]);
            appendMainHero('#', `${URL_HERO_IMG}${heroData[8]}`, heroData[3], '#', 1, 0, 0, 0, '준비중');
        }
        heroes.free();
    }

    function init() {
        initSql().then((model) => {
            bindNavContainer();
        });
    }

    init();
}