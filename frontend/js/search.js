var players = null;
// UI에 추가 한 플레이어 아이디
var array_appended_players = [];

window.onload = function () {

    function getHeroId() {
        var link = location.href;
        var id = link.split("id=")[1];
        if (id.includes('&')) {
            id = id.split('&')[0];
        }

        return id;
    }

    function getRank() {
        var link = location.href;
        var result = link.split("rank=")[1];
        if (result.includes('&')) {
            result = result.split('&')[0];
        }

        return result;
    }

    function getPatchVersion() {
        var link = location.href;
        var result = link.split("patchVersion=")[1];
        if (result.includes('&')) {
            result = result.split('&')[0];
        }

        return result;
    }

    function getHeroWlPercent(win, lose) {
        total = win + lose;
        if (total == 0) {
            return 0;
        }

        win_rate = Math.round((win / total) * 100);

        return win_rate;
    }

    function getMinPlayedCount() {
        var link = location.href;
        var result = link.split("minPlayedCount=")[1];
        if (result.includes('&')) {
            result = result.split('&')[0];
        }

        return result;
    }

    function getWinrate() {
        var link = location.href;
        var result = link.split("winrate=")[1];
        if (result.includes('&')) {
            result = result.split('&')[0];
        }

        return result;
    }

    function appendPlayer(playerId, avatarSrc, personName, rankTier, matches, win, lose, win_rate) {
        var cell = `<tr>
                    <td>${playerId}</td>
                    <td align="left"><a id="${playerId}" href="#" style="display: flex; flex-direction: row; align-items: center;">
                    <img src="${avatarSrc}"><span>${personName}</span></a></td>
                    <td><img src="img/rank_icon_${rankTier}.png"></td>
                    <td>${matches}</td>
                    <td>${win}</td>
                    <td>${lose}</td>
                    <td>${win_rate}%</td>`;

        document.getElementById('bodyPlayers').insertAdjacentHTML('beforeend', cell);
        document.getElementById(playerId).addEventListener('click', (ev) => {
            window.open(`https://www.opendota.com/players/${playerId}/matches?hero_id=${getHeroId()}&party_size=1&patch=${getPatchVersion()}&lobby_type=7`);
        });
    }

    function canAppendThisPlayer(matches, win_rate) {
        return matches >= getMinPlayedCount() && win_rate > getWinrate();
    }

    function stalkPlayer(playerId, avatarSrc, heroId) {
        new Promise((resolve, reject) => {
                var patchVersion = getPatchVersion();
                // 랭겜만 검색
                var url = `https://api.opendota.com/api/players/${playerId}/wl?hero_id=${heroId}&patch=${patchVersion}&party_size=1&lobby_type=7`

                $.ajax({
                    type: "GET",
                    url: url,
                    success: function (response) {
                        resolve(response);
                    },
                    error: function (request, status, error) {
                        reject();
                    }
                });
            }).then(function (response) {
                var win = response['win'];
                var lose = response['lose'];

                // 추가
                win_rate = getHeroWlPercent(win, lose);

                total_match_count = win + lose;


                if (canAppendThisPlayer(total_match_count, win_rate)) {
                    appendPlayer(playerId, avatarSrc, players[0]['personaname'], players[0]['rank_tier'] / 10, total_match_count, win, lose, win_rate);
                }

                var info = {
                    'playerId': playerId,
                    'avatarSrc': avatarSrc,
                    'person': players[0]['personaname'],
                    'rankTier': players[0]['rank_tier'] / 10,
                    'matches': total_match_count,
                    'win': win,
                    'lose': lose,
                    'winRate': win_rate,
                }
                array_appended_players.push(playerId);

                sessionStorage.setItem(`${getHeroId()}_${playerId}`, JSON.stringify(info));
                sessionStorage.setItem(`${getHeroId()}_appended`, JSON.stringify(array_appended_players));
            })
            // 에러 난 경우 해당 플레이어 다시 요청
            .catch(function (error) {
                console.log(`에러났음 : ${error}`);
            })
            .finally(() => {
                players.shift();
                if (players.length > 0) {
                    const playerId = players[0]['account_id'];
                    const avatarSrc = players[0]['avatar'];
                    stalkPlayer(playerId, avatarSrc, getHeroId());
                }
            });
    }

    async function ajaxPlayers() {
        try {
            const response = await fetch('/api/players');
            const result = await response.json();
            const playerRankings = result.data;

            // 플레이어 1차 검별
            for (let index = 0; index < playerRankings.length; index++) {
                const element = playerRankings[index];
                const rank_tier = element['rank_tier'];

                if (((rank_tier == '0' || rank_tier == null) == 'false') || Number(rank_tier) < Number(getRank())) {
                    playerRankings.splice(index, 1);
                }
            }

            players = Array.from(playerRankings);
            sessionStorage.setItem(getHeroId(), JSON.stringify(players));

            if (players.length > 0) {
                const playerId = players[0]['account_id'];
                const avatarSrc = players[0]['avatar'];
                stalkPlayer(playerId, avatarSrc, getHeroId());
            }
        } catch (error) {
            console.error('Error fetching players:', error);
        }
    }

    function init() {
        players = sessionStorage.getItem(getHeroId());
        if (players == null) {
            ajaxPlayers();
        } else {
            players = JSON.parse(players);
            array_appended_players = JSON.parse(sessionStorage.getItem(`${getHeroId()}_appended`));

            array_appended_players.forEach(playerId => {
                var info = JSON.parse(sessionStorage.getItem(`${getHeroId()}_${playerId}`));

                if (canAppendThisPlayer(info['matches'], info['winRate'])) {
                    appendPlayer(info['playerId'], info['avatarSrc'], info['person'],
                        info['rankTier'], info['matches'], info['win'], info['lose'], info['winRate']);
                }

                players.shift();

            });

            if (players.length > 0) {
                stalkPlayer(players[0]['account_id'], players[0]['avatar'], getHeroId());
            }
        }

    }

    init();

}