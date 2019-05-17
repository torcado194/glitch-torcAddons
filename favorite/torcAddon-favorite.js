// ==UserScript==
// @name         torcAddons-favorite
// @namespace    http://torcado.com
// @description  adds the ability to favorite files to pin them to the top of the file list
// @version      1.1.1
// @author       torcado
// @license      MIT
// @icon         http://torcado.com/torcAddons/icon.png
// @run-at       document-start
// @grant        none
// @include      http*://glitch.com/edit/*
// @updateURL    https://openuserjs.org/meta/torcado/torcAddons.meta.js
// @downloadURL  https://openuserjs.org/src/scripts/torcado/torcAddons.user.js
// ==/UserScript==


/*
 * torcAddons-favorite | v1.1.1
 * adds the ability to favorite files to pin them to the top of the file list
 * by torcado
 */
(()=>{
    let t = torcAddons;

    let project = '';

    t.addEventListener('load', ()=>{
        project = window.location.href.match(/#!\/((?:[^?]|.)+)/)[1];
        setFavorites();
        addStars();
    });

    t.addEventListener('treeUpdate', ()=>{
        setFavorites();
        addStars();
    });

    function setFavorites(){
        $('.torc-favoritesList').remove();
        let favsList = {},
            html = '<div class="torc-favoritesList filetree"><div class="torc-favoritesTitle">favorites</div></div>'
        if($('.torc-search')[0]){
            favsList = $(html).insertBefore($('.torc-search'));
        } else {
            favsList = $(html).insertBefore($('.filetree'));
        }
        let favs = JSON.parse(localStorage.getItem('favorites'));
        favs && favs[project] && favs[project].forEach(v => {
            let el = $(`.file[title="${v}"]`).clone().attr('torc-file', '').removeClass('active');
            el.find('.torc-favstar').on('click', handleStarClick);
            favsList.append(el);
            el.click(function(){application.selectFileByPathOrDefaultFile(v)});
        });
    }

    function addFavorite(el){
        el = el.clone().attr('torc-file', '').removeClass('active');
        el.click(function(){application.selectFileByPathOrDefaultFile($(this).attr('title'))});
        el.css({
            height: 0,
            opacity: 0,
        });
        $('.torc-favoritesList').append(el);
        el.animate({
            height: '19px',
            opacity: 1,
        }, 350, 'easeOutQuint');
    }

    function removeFavorite(el){
        let file = $('.torc-favoritesList').find(`.file[title="${el.attr('title')}"]`);
        file.animate({
            height: 0,
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            opacity: 0,
        }, 350, 'easeOutQuint', function(){
            $(this).remove();
        });
    }

    function addStars(){
        $('.torc-favstar').remove();
        $('.filetree .file').append('<div class="torc-favstar"></div>');

        let favs = JSON.parse(localStorage.getItem('favorites'));
        $('.file').each(function(){
            if(favs && favs[project] && favs[project].includes($(this).attr('title'))){
                $(this).attr('torc-favorited', '');
            } else {
                $(this).removeAttr('torc-favorited');
            }
        });

        $('.torc-favstar').on('click', handleStarClick);
    }

    function handleStarClick(e){
        e.stopPropagation();
        let el = $(this).closest('.file')
        let favs = JSON.parse(localStorage.getItem('favorites'));
        if(!favs){
            favs = {};
        }
        if(!favs[project]){
            favs[project] = [];
        }
        if(el.attr('torc-favorited') === undefined){ //add
            el.attr('torc-favorited', '');
            favs[project].push(el.attr('title'));
            addFavorite(el);
        } else { //remove
            el.removeAttr('torc-favorited');
            favs[project].splice(favs[project].indexOf(el.attr('title')), 1);
            removeFavorite(el);
        }
        localStorage.setItem('favorites', JSON.stringify(favs));
        addStars();
        //setFavorites();
    }

    /* ======== css ======== */

    t.addCSS(`
.torc-favoritesList.torc-favoritesList {
    margin-top: 10px;
    border: 1px dotted rgba(255,255,255,0.4);
    margin: 8px 13px;
    width: calc(100% - 26px);
    padding-top: 10px;
    padding-bottom: 4px !important;
    border-radius: 1px;
    overflow: hidden;
}
.sugar .torc-favoritesList.torc-favoritesList {
    border: 1px dotted rgba(0, 0, 0, 0.5);
}

.torc-favoritesTitle {
    margin-left: -10px;
    font-style: italic;
    margin-top: -20px;
    background-color: #160f19;
    display: inline-block;
    position: absolute;
    padding: 2px 7px 0px 4px;
}
.sugar .torc-favoritesTitle {
    background-color: #ffffff;
}

.torc-favstar {
    display: inline-block;
    position: absolute;
    z-index: 9;
    width: 14px;
    height: 14px;
    margin-left: 5px;
    margin-top: 2px;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAANSSURBVHgB3ZqNcdswDIWhXgdwJygzQdwJqmzQDaIRskHYCZoN0kyQbiBnAjsTUJ0g2eCVMOmrzrUMUKJkqd8dI9/x94kUAJIpaCIAGP8ofXr3aVcURUP/AyzMpxr/UkfRyyWKe0M3nLempeIH7yDjaIn4gVfQY2lJxKXpEgTyUl3RUvCDfUQ6lpZAnL2+GJo7PWfvQE1zxg+wxHBKmitIMyxdzHMWoXMLDqejmmMqmhN+QCvoZm8N3TKel9vwg7lXDPqxVb5WlLd0aRBm7ht0mFY9KUZFzOfZnmYmW2LufHpGmkF5ONGeTajvYp82VXTRJcY/1jFdU9jHGepH49PN8f4v9sGBdt8Z2sW2X+Jv3mO+d5ZGWDY/kMfUt6nO9HmHvGwRAg1z3NEt5G+iD+JWCPlf6IHb9syNRaUQmCP66aLUmuw+WFKCNIOTQk3IDy/1O0oE4Xt0yEzBf2gYjU8bn15JY81koSUF6/01Pg0NIFVgQ0HES/y9GSJGA/66rJKCy0oTDb31TF52YwFdaMi4VF90SxcGwaVpqQ6VfiorXPQcE2E3ol1xD8eVa2VF7sDQxEAXoB94PtUAB9NbZQNuSpFIO4ZkDauuhrQb18lEJoqTx9SjwdH2a6O98ESRWxoJjPnJIM1iWcoM9Hcb/Y1egsjsN0TQz94wt6V9k5QZ6KgoB1BEO5QZWVvG0BHypviNMgP50/isaecD6TBCfkP5aYT8K1KgFSj5ujG2TI2Qb0iBVqBkqV4pP7+FfFWA8ZF0DJ5BhIjHxLY0u/5GyL8mBdoZlBrbdWUgnJrxlRgbIo569r8Rzi9L6kZ6AZ8oF5Cdbnmizl4YZLhMdaL+WqiXL0SE0mQjBMccGGijkDauLRRTuaY4aAkuc488p+MO4SVJAvf9SuMvFALZgp5bDodvJfe2qSHZFRhvrM5aW42RWSnyx9gTGkWZL1IBjUBD80V8sUsXaKQCWj+Yg41PNxSW1RNNhEbgkDiT63736cobA77l5aN+jmIqCsHyUKENDSW6gFTzz+WtxoxHd2DR72bJUA6gP953sWwvq4rg/5yyL0s5wflLyhoZ/8cMcjRktW2Jjv6oY+Mf1icOzfa7Ap+e+NuiEYgvrWr1x9d2v8bqb5H8AW9vAn+6T1ZUAAAAAElFTkSuQmCC');
    background-size: 14px;
    opacity: 0;
}
.sugar .torc-favstar {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMKSURBVHgB3VrRcdswDH1pO4A7gdEJ4k5QdYNuEI3gDawN2g2cTpBuIGcCJxNIncD97F8qVORF59jGo0QqUt4dTjoTBPgEEiAlv8d4kEa+uevfRv7gjUAaKRt5OpLStc0a0sgBL8l50bYVZowK58l5qTBT5LDJeSkwMwi46HWn6gIzwhY8udlFURBOzotgBugTvW7pmDQy9CfnJcOEUWE4wclGMQdX80pCL8fEoCmeiZ7uWjJCb3JlYwN70NuOPhPFAhOAPmU9ITBrSzr99P4AO4oZRoykJ7Nu5A5hCeXHCXtFQP/K+dQ+GQJIX+E8mZWTa2dU0A91I1/d9dhHhf4RenA27929ysUzpjTyHXFSPZsR15F97dGudTl2dAN7TfSRCjaqBH6fHKf/kEQOrOh5ZAn9q20qZfeRAjyKRGNQbtGN6lRfIxzap4o9nit3MwR1I7tGHkFmMwMZ2uz9xV0FAxBKsEZL4B7PxFK//vMlK0NbsoJJs9mzz7RLhQ24MeuUD6pFN3h96BjY8ea+0y3Z4bXfY67Az7gX28MSPEnB+BDw5O5OGdDFvCcNVBiXpIAvIcrh7P6WPbiOSVIQeUyhBlOe15I9cEHYlEiFpEsmJGMViI+c9D0o6bEkK8QHG73BZSsnHcUG4zNHJDC7ndiw/EXdOgrsdRAb1tJYMkbegYMY7TXiozbaP4EAS9CqdSmOTLXRLiDAErQy1SPi47fRTm0wPoBDjAiqDXFX5tRfG+3XIMBG0DL2cKEtQ3tS0aSx79xvcflboPUAPiIirKKbneijv5Ww073q5Cf6rzDiFpFN2Qs3WHYXcrwbyjs+BSOVpgUxONXZIM7bcU9USL+DYU2VA9K99rd0ltbgmSSzINpTnAmF0PlsKTAEBdOF+WDnTlAsBbYOxsAO7YdQnVY/MSEM+UipyafA6Setv90OsK2SIwIWCM+SnhiTfMTpVggnKIgENoqV0+2bVXPwRAtERnHBWYm4/zHLcXk3VLCGrhAGccaXeD4VaMLYIQ0ytGS9P/1s9yuhv/nhH5mP1SThMrGbAAAAAElFTkSuQmCC');
}
.sugar .active .torc-favstar {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAANSSURBVHgB3ZqNcdswDIWhXgdwJygzQdwJqmzQDaIRskHYCZoN0kyQbiBnAjsTUJ0g2eCVMOmrzrUMUKJkqd8dI9/x94kUAJIpaCIAGP8ofXr3aVcURUP/AyzMpxr/UkfRyyWKe0M3nLempeIH7yDjaIn4gVfQY2lJxKXpEgTyUl3RUvCDfUQ6lpZAnL2+GJo7PWfvQE1zxg+wxHBKmitIMyxdzHMWoXMLDqejmmMqmhN+QCvoZm8N3TKel9vwg7lXDPqxVb5WlLd0aRBm7ht0mFY9KUZFzOfZnmYmW2LufHpGmkF5ONGeTajvYp82VXTRJcY/1jFdU9jHGepH49PN8f4v9sGBdt8Z2sW2X+Jv3mO+d5ZGWDY/kMfUt6nO9HmHvGwRAg1z3NEt5G+iD+JWCPlf6IHb9syNRaUQmCP66aLUmuw+WFKCNIOTQk3IDy/1O0oE4Xt0yEzBf2gYjU8bn15JY81koSUF6/01Pg0NIFVgQ0HES/y9GSJGA/66rJKCy0oTDb31TF52YwFdaMi4VF90SxcGwaVpqQ6VfiorXPQcE2E3ol1xD8eVa2VF7sDQxEAXoB94PtUAB9NbZQNuSpFIO4ZkDauuhrQb18lEJoqTx9SjwdH2a6O98ESRWxoJjPnJIM1iWcoM9Hcb/Y1egsjsN0TQz94wt6V9k5QZ6KgoB1BEO5QZWVvG0BHypviNMgP50/isaecD6TBCfkP5aYT8K1KgFSj5ujG2TI2Qb0iBVqBkqV4pP7+FfFWA8ZF0DJ5BhIjHxLY0u/5GyL8mBdoZlBrbdWUgnJrxlRgbIo569r8Rzi9L6kZ6AZ8oF5Cdbnmizl4YZLhMdaL+WqiXL0SE0mQjBMccGGijkDauLRRTuaY4aAkuc488p+MO4SVJAvf9SuMvFALZgp5bDodvJfe2qSHZFRhvrM5aW42RWSnyx9gTGkWZL1IBjUBD80V8sUsXaKQCWj+Yg41PNxSW1RNNhEbgkDiT63736cobA77l5aN+jmIqCsHyUKENDSW6gFTzz+WtxoxHd2DR72bJUA6gP953sWwvq4rg/5yyL0s5wflLyhoZ/8cMcjRktW2Jjv6oY+Mf1icOzfa7Ap+e+NuiEYgvrWr1x9d2v8bqb5H8AW9vAn+6T1ZUAAAAAElFTkSuQmCC');
}

.file[torc-favorited] .torc-favstar {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOqSURBVHgB5ZpfTttAEMa/dQJSVWjNCTAnKLxX4NygnAB6AsoJSE5QOEHDCcoNEtpKfSQ9QXODWgoSUvPH/SZ1UEBxPEl20036e4kRk9ifZ3d2ZnYNlsTD9zDqdhHzMun30dqpJG0sAQPH/GqE0UYJn3gZP/tXs9vHe9dCnQrMxN3xMswxSdBHZauStOCIAA7ZLKGBfHFCaEr4DIc4E3j/JTxNgajITmw6t2EVjnAyRGVoivc0AjMSzsc9zscElnHiQc67ixnECWE5wAc4wLoHs8DyE3OQebENi1j3oHgPc5ItJ1ax6sHO1zA26TByzk3KZWO7kjRhCaseDNLFPWAWGAGTsCZQuywoiOW3YAkrQ5SBJeSycGdJoGBt2bDiwc0yziyKE6wtGwt5UDxXKiHmW3KRbiWpwXGvN6w85vakWuCYmIhfOkpT7PPbEZYA79fmR2uQ4gfHXHMW0RMFiphyGfsM+fs0eEMx8bLEqEnRMgZtTo1berqVJ/pRYJaBnPGL77wTo4Wi+ewtBqjaKCMaCnz4Fp70B7jE9NJmpSgFOH3xNrk2i+SOviNZUeAi//MFyYoMs4YUa4zTloUP/BcCrbcJvCFFWwTWsK4Y1IKtw+SSKdA11gxmX1fUVn/MZBhNpRKPsQZwWbjZPkyO5foxyDC9OR6mOqsONfS4JTD680myLUn2RsBW++rmou3uAJXxztyTZUKycTEQQ6waE8QJeeVSRE82VsaTOeKE3IL3vhHuo3jz5J/DaJn0BjjIaxjnZjLDLS1m4/A8EejleG7E1FRNRA76OIe/yAbq1MhfmIu+qiR1fvgo8lwW8iIjVbLNNfIGnvFSuXGqEsgGVATPuP+NPY2dSiAjlXeRlNV6pLFTCZT2IfxD9dK1Ba9/HmS/VmOn86DR/dgyYYm3o7HTedB46cFdjZ1OYOphTmosBRkpoeBnPhpmzzYVjQcjeEq4iddFNoUCuch7W010+jgosikUmPo4/zICxdQpFGg8Fqh5+cvsbDdlt4c15sEy25TlIgMu8nMXvFJt8+OKRWn9WVF6yghY5R5eNTA4wZzIDm+hTZHBsNP2d/9QHWzGhF0W7aVL/6fMzUo+yMmsPSDN2TbVIQQ2heVIx8dCQ+nGGVzxxvV5TkYMDwCluNAI5UusbR8l1SI79SkLObTKIZF3zErmV83WGbNM6BmfbmIVoxUnzHRORoZTNm92+QAhBUvP5trm4blxOo0wTjl8R/eTExUYsC3v6H4ryR9pnWBwHNDVdQAAAABJRU5ErkJggg==');
    opacity: 1 !important;
}

.filetree .file:hover .torc-favstar, .filetree .file.active .torc-favstar {
    opacity: 0.5;
}
.torc-favstar:hover {
    opacity: 1 !important;
}
.torc-favstar:active.torc-favstar:active {
    opacity: 0.6 !important;
}
    `);

})()