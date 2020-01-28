window.onload = function () {

    var players = null;

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

        win_rate = (win / total) * 100;

        return win_rate;
    }

    function ajaxPlayers() {
        $.ajax({
            type: "get",
            url: "https://api.opendota.com/api/rankings?hero_id=" + getHeroId(),
            success: function (response) {
                // console.log(response['rankings'][0]['account_id']);
                var playerRankings = response['rankings'];

                console.log(playerRankings);

                for (let index = 0; index < playerRankings.length; index++) {
                    const element = playerRankings[index];
                    const rank_tier = element['rank_tier'];
                    // rank_tier < getRank() || 
                    if ((rank_tier == '0' || rank_tier == null) && getUnranked() == 'false') {
                        playerRankings.splice(index, 1);
                    }
                }

                players = Array.from(playerRankings);

                const playerId = players[0]['account_id'];
                stalkPlayer(playerId, getHeroId());
            }
        });
    }

    function stalkPlayer(playerId, heroId) {
        var promise = new Promise(function (resolve, reject) {
            var patchVersion = getPatchVersion();
            var url = 'https://api.opendota.com/api/players/' + playerId + '/wl?hero_id=' + heroId + '&patch=' + patchVersion + '&party_size=1'

            var customHeaders = {};
            customHeaders['test'] = 'testtesttest';
            customHeaders['asdasdadasdasd'] = 'testtesttest';

            $.ajax({
                type: "get",
                url: url,
                headers: customHeaders,
                // beforeSend: function(xhr){
                //     xhr.setRequestHeader("asdgadfasdf", "*"); 
                //     // xhr.setRequestHeader("Access-Control-Allow-Origin", "*"); 
                //     // xhr.setRequestHeader("Access-Control-Allow-Methods", 'GET, POST, PUT, DELETE, OPTIONS');
                //     // xhr.setRequestHeader('Access-Control-Max-Age', '3600');
                //     // xhr.setRequestHeader('Access-Control-Allow-Headers', 'Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization');
                // },
                success: function (response) {
                    resolve(response);
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

            if (total_match_count >= getMinPlayedCount() && win_rate > getWinrate()) {
                var cell = '<tr>';
                cell += '<td>' + playerId + '</td>'
                cell += '<td>' + players['personaname'] + '</td>'
                cell += '<td>' + total_match_count + '</td>'
                cell += '<td>' + win + '</td>'
                cell += '<td>' + lose + '</td>'
                cell += '<tr/>';

                $('[id=player_table_body]').append(cell);
            }

            players.shift();
            if (players.length > 0) {
                const playerId = players[0]['account_id'];
                stalkPlayer(playerId, getHeroId());
            }

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