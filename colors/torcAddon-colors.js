// ==UserScript==
// @name         torcAddons-colors
// @namespace    http://torcado.com
// @description  adds a visual color component next to css-colors
// @version      1.1.1
// @author       torcado
// @license      MIT
// @icon         http://torcado.com/torcAddons/icon.png
// @run-at       document-start
// @grant        none
// @include      http*://glitch.com/edit/*
// ==/UserScript==


/*
 * torcAddons-colors | v1.1.1
 * adds a visual color component next to css-colors
 * by torcado
 */
(()=>{
    let t = torcAddons;

    t.addEventListener('codeUpdate', addColors);

    let matchList = [
        /#([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3}|)/ig, // hex
        /(rgba|rgb)\([^)]+\)/ig,
        /(hsla|hsl)\([^)]+\)/ig,
        /(hsva|hsv)\([^)]+\)/ig
    ];

    function addColors(){
        // NOTE: this could instead be pulled from application.getCurrentSession().cm.display.view
        $('.torc-color').remove();
        $('span[role="presentation"]').each(function(){
            let text = $(this).text();
            for(let i = 0; i < matchList.length; i++){
                if(matchList[i].test(text)){
                    $(this).append(`<div class="torc-color" style="background-color: ${text.match(matchList[i])}"></div>`);
                    break;
                }
            }
        })
    }

    /* ======== css ======== */

    t.addCSS(`
.torc-color {
    width: 11px;
    height: 11px;
    margin-top: 3px;
    margin-left: 3px;
    border-radius: 50%;
    position: absolute;
    display: inline-block;
}
    `);

})()