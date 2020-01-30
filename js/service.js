window.onload = function () {
    var heroStats = null;

    var json = '[  {    "id": 1,    "name": "npc_dota_hero_antimage",    "localized_name": "Anti-Mage",    "primary_attr": "agi",    "attack_type": "Melee",    "roles": [      "Carry",      "Escape",      "Nuker"    ],    "img": "/apps/dota2/images/heroes/antimage_full.png?",    "icon": "/apps/dota2/images/heroes/antimage_icon.png",    "base_health": 200,    "base_health_regen": 0.25,    "base_mana": 75,    "base_mana_regen": 0,    "base_armor": -1,    "base_mr": 25,    "base_attack_min": 29,    "base_attack_max": 33,    "base_str": 23,    "base_agi": 24,    "base_int": 12,    "str_gain": 1.3,    "agi_gain": 3,    "int_gain": 1.8,    "attack_range": 150,    "projectile_speed": 0,    "attack_rate": 1.4,    "move_speed": 310,    "turn_rate": 0.5,    "cm_enabled": true,    "legs": 2,    "pro_ban": 63,    "hero_id": 1,    "pro_win": 26,    "pro_pick": 42,    "1_pick": 11170,    "1_win": 5803,    "2_pick": 35726,    "2_win": 18752,    "3_pick": 57953,    "3_win": 30479,    "4_pick": 66685,    "4_win": 35136,    "5_pick": 46904,    "5_win": 24696,    "6_pick": 19383,    "6_win": 10014,    "7_pick": 5799,    "7_win": 2809,    "8_pick": 706,    "8_win": 341,    "null_pick": 1840190,    "null_win": 0  },  {    "id": 2,    "name": "npc_dota_hero_axe",    "localized_name": "Axe",    "primary_attr": "str",    "attack_type": "Melee",    "roles": [      "Initiator",      "Durable",      "Disabler",      "Jungler"    ],    "img": "/apps/dota2/images/heroes/axe_full.png?",    "icon": "/apps/dota2/images/heroes/axe_icon.png",    "base_health": 200,    "base_health_regen": 2.75,    "base_mana": 75,    "base_mana_regen": 0,    "base_armor": -1,    "base_mr": 25,    "base_attack_min": 27,    "base_attack_max": 31,    "base_str": 25,    "base_agi": 20,    "base_int": 18,    "str_gain": 3.4,    "agi_gain": 2.2,    "int_gain": 1.6,    "attack_range": 150,    "projectile_speed": 900,    "attack_rate": 1.7,    "move_speed": 305,    "turn_rate": 0.6,    "cm_enabled": true,    "legs": 2,    "pro_ban": 28,    "hero_id": 2,    "pro_win": 31,    "pro_pick": 57,    "1_pick": 9234,    "1_win": 4457,    "2_pick": 24219,    "2_win": 11678,    "3_pick": 36171,    "3_win": 17300,    "4_pick": 39749,    "4_win": 18686,    "5_pick": 26594,    "5_win": 12451,    "6_pick": 9830,    "6_win": 4594,    "7_pick": 2848,    "7_win": 1267,    "8_pick": 315,    "8_win": 144,    "null_pick": 1903013,    "null_win": 0  }]';

    // 해당 정보를 표시할 지 여부 확인
    function canAppend(key) {
        // 표시 안할 리스트
        // !(key == 'name' || key.includes('pick') || key.includes('win'))
        // 표시 할 리스트

        // return true;

        var keywords = [
            'id',
            'localized_name',
            'roles',
            'img',
            'icon',
        ];
        return keywords.includes(key);
    }

    function ajaxHero() {
        $.ajax({
            type: "get",
            url: "https://api.opendota.com/api/heroStats?",
            success: function (response) {
                appendToTable(response);
            }
        });
    }

    function engKeyToKorKey(key) {
        switch (key) {
            case 'id':
                return 'ID';
            case 'localized_name':
                return '이름';
            case 'roles':
                return '역할';
            case 'img':
                return '이미지';
            case 'icon':
                return '';
            default:
                return key;
        }
    }

    // Table 에 영웅 헤더 추가
    function appendToHeader(keySet) {
        for (let index = 0; index < keySet.length; index++) {
            const key = keySet[index];
            if (canAppend(key)) {

                $('[id=hero_table_header_tr').append('<th>' + engKeyToKorKey(key) + '</th>');
            }
        }
    }

    function getPatchVersion() {
        return $('select[id=patch]').val();
    }

    function getRank() {
        return $('select[id=rank]').val();
    }

    function getWinRate() {
        return $('input[id=winrate]').val();
    }

    function getMinPlayedCount() {
        return $('input[id=min_played_count]').val();
    }

    function getUnranked() {
        return $('[id=btn_unranked]').hasClass('active');
    }

    // Table 에 영웅 정보 추가
    function appendToRow(content) {
        var row = "";
        var localized_name = content['localized_name'].replace(/ /gi, '_').replace(/'/gi, '');

        // tr 먼저
        // 안에 td 추가
        row = "<tr>";

        var keys = Object.keys(content);
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];

            if (!canAppend(key)) {
                continue;
            }

            // 이미지
            if (key == "img" || key == 'icon') {
                row += '<td><img src=\"https://api.opendota.com' + content[key] + '\"></td>';
            }
            // 이름에 태그
            else if (key == ("localized_name")) {
                var tag = '<button type="button" name="' + localized_name + '" id="' + localized_name + '" class="btn btn-link" role="button">' + content[key] + '</button>';
                row += '<td>' + tag + '</td>';
            }

            // 일반 텍스트
            else {
                row += '<td>' + content[key] + '</td>';
            }
        }

        // Last tr
        row += "</tr>";
        $('[id=hero_table_body]').append(row);

        $('[id=' + localized_name + ']').click(function () {
            var url = 'search.html?id=' + content['id'] + '&patchVersion=' + getPatchVersion() + '&rank=' + getRank() + '&winrate=' + getWinRate() + '&minPlayedCount=' + getMinPlayedCount() + '&unranked=' + getUnranked();
            document.location.href = url;
        });
    }

    // 테이블 초기화
    function appendToTable(response) {
        for (let index = 0; index < response.length; index++) {
            const element = response[index];

            keys = Object.keys(element);
            if (index == 0) {
                appendToHeader(keys);
            }

            appendToRow(element);
        }
    }

    // appendToTable(JSON.parse(json));
    ajaxHero();

}