(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}})();var d=[];function p(r,a){var n=new XMLHttpRequest;let s=`https://api.opendota.com/api/search?q=${r}`;n.onreadystatechange=e=>{n.readyState==4&&a(n.responseText)},n.open("get",s),n.send()}function f(r){var a=new Date(r.last_match_time),n=new Date,s=n.getTime()-a.getTime(),e=`https://www.opendota.com/players/${r.account_id}`;s=Math.ceil(s/1e3/60/60/24);var t=`
    <div class="player">
        <a href="${e}" target="_blank">
            <img src="${r.avatarfull}" onerror="this.src='img/img_null.png'">

            <div class="info">
                <span class="nickname">${r.personaname}</span>
                <span class="date">Last Match: ${s}일 전</span>
            </div>
        </a>
    </div>
`,i=document.getElementsByClassName("players_container")[0];i.insertAdjacentHTML("beforeend",t)}function y(){let r=document.getElementsByClassName("player");for(let a=0;a<r.length;a++)r[a].remove()}function h(){var r=document.getElementsByClassName("players_container")[0];r.style.display="none"}function v(){var r=document.getElementsByClassName("players_container")[0];r.style.display="flex"}window.addEventListener("load",(r,a)=>{var n=document.getElementById("keyword");n.addEventListener("input",(s,e)=>{var t=n.value;if(t==""){h();return}d.forEach(i=>{clearTimeout(i)}),d.push(setTimeout(()=>{p(t,i=>{y(),v();var o=JSON.parse(i);o.sort((l,m)=>{let c=new Date(l.last_match_time),u=new Date(m.last_match_time);return isNaN(c.getTime())&&(c=new Date(1990,1,1)),isNaN(u.getTime())&&(u=new Date(1990,1,1)),u-c}),o.length>=4&&(o=o.splice(0,4)),o.forEach(l=>{f(l)})})},500))})});
