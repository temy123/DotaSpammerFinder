function includeHeader() {
    var header = document.getElementById('dota-header');

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status < 400) {
            header.innerHTML = xhttp.responseText;
        }
    }

    xhttp.open('get', 'template_top.html', true);
    xhttp.send();
}

function activeHeader(index) {
    var header = document.getElementById('dota-header');

    if (header.getElementsByClassName(`header`).length == 0) {
        setTimeout(() => activeHeader(index), 10);
        return;
    }

    header = header.getElementsByClassName(`header`)[0];
    li_list = header.getElementsByTagName(`li`);
    li_list[index].getElementsByTagName('a')[0].classList.add('selected');
}