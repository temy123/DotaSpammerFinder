window.onload = function () {
    function getHeroId() {
        var link = location.href;
        var id = link.split("id=")[1];
        if (id.includes('&')) {
            id = id.split('&')[0];
        }

        return id;
    }

    function ajaxPlayers() {
        $.ajax({
            type: "get",
            url: "https://api.opendota.com/api/rankings?hero_id=" + getHeroId(),
            success: function (response) {
                console.log(response)
            }
        });
    }

    ajaxPlayers();
}