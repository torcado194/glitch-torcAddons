// ==UserScript==
// @name         torcAddons-manualUpdate
// @namespace    http://torcado.com
// @description  provides an 'update' button to allow manual updates
// @version      1.1.2
// @author       torcado
// @license      MIT
// @icon         http://torcado.com/torcAddons/icon.png
// @run-at       document-start
// @grant        none
// @include      http*://glitch.com/edit/*
// @updateURL    https://openuserjs.org/meta/torcado/torcAddons-manualUpdate.meta.js
// @downloadURL  https://openuserjs.org/src/scripts/torcado/torcAddons-manualUpdate.user.js
// ==/UserScript==


/*
 * torcAddons-manualUpdate | v1.1.2
 * provides an 'update' button to allow manual updates
 * by torcado
 */
(()=>{
    let t = torcAddons;

    t.addEventListener('load', ()=>{
        $('.torc-update').remove();
        let updateButton = $('<div class="torc-update">update</div>').insertAfter($('.show-app-wrapper'));
        updateButton.on('click', function(){
            let updateFile = application.fileByPath('.torc-update')
            if(!updateFile){
                updateFile = application.newFile('.torc-update');
            }
            application.writeToFile(updateFile, ':D ' + Date.now());
        });
    });

    /* ======== css ======== */

    t.addCSS(`
.torc-update {
    line-height: 28px;
    border: 1px dashed #666666;
    border-radius: 7px;
    padding: 0 10px;
    margin-left: 16px;
    font-size: 12px;
    cursor: pointer;
}

.torc-update:hover {
    background-color: rgba(255,255,255,0.1);
}
.torc-update:active {
    background-color: rgba(255,255,255,0);
}
    `);

})()