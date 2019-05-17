// ==UserScript==
// @name         torcAddons-indentGuides
// @namespace    http://torcado.com
// @description  adds indent guides to glitch code
// @version      1.1.1
// @author       torcado
// @license      MIT
// @icon         http://torcado.com/torcAddons/icon.png
// @run-at       document-start
// @grant        none
// @include      http*://glitch.com/edit/*
// ==/UserScript==


/*
 * torcAddons-indentGuides | v1.1.1
 * adds indent guides to glitch code
 * by torcado
 */
(()=>{
    let t = torcAddons;

    t.addEventListener('codeUpdate', ()=>{
        addGuides();
    })

    function addGuides(){
        $('.torc-indentGuide').remove();
        $('span[role="presentation"]').each(function(){
            let s = $(this).text().split(/^( *)/)
            if(s[0] === ''){
                if($(this).contents()[0].nodeType === 3){
                    $(this).closest('.CodeMirror-line').before(`<span class="torc-indentGuideGroup">${s[1].replace(/  /g, '<span class="cm-overlay torc-indentGuide">  </span>')}</span>`)
                }
            }
        });
    }

    /* ======== css ======== */

    t.addCSS(`
.torc-indentGuideGroup {
    position: absolute;
    width: 100%;
    display: block;
    white-space: pre;
    padding-left: 10px;
}

.torc-indentGuide {
    border-left: 1px dotted rgba(255,255,255,0.2);
    margin-left: -1px;
    position: relative;
}
    `);

})()