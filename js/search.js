window.onload = function () {

    var players = null;
    var initProgress = 0;

    function setProgress(max, val) {
        console.log('val : ' + val + ' max : ' + max);
        var progress = Math.round((val / max) * 100);
        $('#progress').css('width', progress + '%');
        $('#progress').attr('aria-valuenow', progress);
        $('#progress').text(progress + '%');
    }

    function getHeroId() {
        var link = location.href;
        var id = link.split("id=")[1];
        if (id.includes('&')) {
            id = id.split('&')[0];
        }

        return id;
    }

    function getPatchVersion() {
        var link = location.href;
        var result = link.split("patchVersion=")[1];
        if (result.includes('&')) {
            result = result.split('&')[0];
        }

        return result;
    }

    function getRank() {
        var link = location.href;
        var result = link.split("rank=")[1];
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

    function getUnranked() {
        var link = location.href;
        var result = link.split("unranked=")[1];
        if (result.includes('&')) {
            result = result.split('&')[0];
        }

        return result;
    }

    function getMinPlayedCount() {
        var link = location.href;
        var result = link.split("minPlayedCount=")[1];
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

    function ajaxPlayers() {
        $.ajax({
            type: "get",
            url: "https://api.opendota.com/api/rankings?hero_id=" + getHeroId(),
            success: function (response) {
                var playerRankings = response['rankings'];

                // 플레이어 1차 검별
                for (let index = 0; index < playerRankings.length; index++) {
                    const element = playerRankings[index];
                    const rank_tier = element['rank_tier'];
                    // rank_tier < getRank() || 
                    if (((rank_tier == '0' || rank_tier == null) && getUnranked() == 'false') || Number(rank_tier) < Number(getRank())) {
                        playerRankings.splice(index, 1);
                    }
                }

                players = Array.from(playerRankings);
                // 첫 검별 된 사이즈를 기록
                initProgress = players.length;

                const playerId = players[0]['account_id'];
                stalkPlayer(playerId, getHeroId());
            }
        });
    }

    function rankToText(val) {
        switch (val) {
            case 0:
                return 'Unranked';
            case 10:
                return 'Herald';
            case 20:
                return 'Guardian';
            case 30:
                return 'Crusader';
            case 40:
                return 'Archon';
            case 50:
                return 'Legend';
            case 60:
                return 'Ancient';
            case 70:
                return 'Divine';
            case 80:
                return 'Immortal';
            default:
                break;
        }
    }

    function stalkPlayer(playerId, heroId) {
        var promise = new Promise(function (resolve, reject) {
            var patchVersion = getPatchVersion();
            var url = 'https://api.opendota.com/api/players/' + playerId + '/wl?hero_id=' + heroId + '&patch=' + patchVersion + '&party_size=1'

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
        });

        promise.then(function (response) {
                var win = response['win'];
                var lose = response['lose'];

                // 추가
                win_rate = getHeroWlPercent(win, lose);

                total_match_count = win + lose;

                console.log('minCount : ' + getMinPlayedCount() + ' win : ' + win + ' lose : ' + lose + ' winrate : ' + win_rate);

                // 전체 배열이 줄어드는 형식이기 때문에 다음과 같이 작성
                setProgress(initProgress, initProgress - players.length);

                if (total_match_count >= getMinPlayedCount() && win_rate > getWinrate()) {
                    var cell = '<tr id="' + playerId + '" class="btn-link">';
                    cell += '<td>' + playerId + '</td>'
                    cell += '<td>' + players[0]['personaname'] + '</td>'
                    cell += '<td>' + rankToText(players[0]['rank_tier']) + '</td>'
                    cell += '<td>' + total_match_count + '</td>'
                    cell += '<td>' + win + '</td>'
                    cell += '<td>' + lose + '</td>'
                    cell += '<td>' + win_rate + '</td>'
                    cell += '<tr/>';

                    $('[id=player_table_body]').append(cell);
                    $('#' + playerId).on('click', function () {
                        window.open('https://www.opendota.com/players/' + playerId + '/matches?hero_id=' + heroId, '_blank');
                    });
                }

                players.shift();
                if (players.length > 0) {
                    const playerId = players[0]['account_id'];
                    stalkPlayer(playerId, getHeroId());
                }

            })
            // 에러 난 경우 해당 플레이어 다시 요청
            .catch(function (error) {
                console.log('에러났음 : ' + error);
                stalkPlayer(playerId, heroId);
            });
    }


    function ajaxWlHistory(playerId, heroId) {
        var patchVersion = getPatchVersion();
        var url = 'https://api.opendota.com/api/players/' + playerId + '/wl?hero_id=' + heroId + '&patch=' + patchVersion + '&party_size=1'

        $.ajax({
            type: "get",
            url: url,
            success: function (response) {
                console.log(response);
            }
        });
    }

    ajaxPlayers();
}