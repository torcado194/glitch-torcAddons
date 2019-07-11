// ==UserScript==
// @name         torcAddons-treeState
// @namespace    http://torcado.com
// @description  saves the state of the filetree across loads
// @version      1.0.1
// @author       torcado
// @license      MIT
// @icon         http://torcado.com/torcAddons/icon.png
// @run-at       document-start
// @grant        none
// @include      http*://glitch.com/edit/*
// @updateURL    https://openuserjs.org/meta/torcado/torcAddons-treeState.meta.js
// @downloadURL  https://openuserjs.org/src/scripts/torcado/torcAddons-treeState.user.js
// ==/UserScript==

(()=>{
    let t = torcAddons;

    t.addEventListener('load', ()=>{
        console.log("sdfsdf");
        load();
        update();
        listen();
    });

    t.treeState = [];

    let ignore = true;

    function load(){
        t.treeState = JSON.parse(localStorage.getItem('treeState')) || [];
    }

    function update(){
        if(t.treeState && Array.isArray(t.treeState)){
            t.treeState.forEach(tree => {
                let cur = $('.filetree');
                tree.forEach(folder => {
                    if(cur.length === 0){
                        return;
                    }
                    cur = cur.find(`.folder[title="${folder}"]`);
                    if(!cur.find('details').attr('open')){
                        cur.find('summary').eq(0).click();
                    }
                });
            });
        }
        ignore = false;
    }

    function listen(){
        let treeObserver = new MutationObserver(function(mutations) {
            if(!t.loaded){
                return;
            }
            mutations.forEach(function(mutation) {
                if(mutation.target.tagName.toLowerCase() === 'details' && mutation.type === 'attributes') {
                    if(ignore){
                        return;
                    }
                    console.log('o/c', mutation.target);
                    let folder = $(mutation.target).closest('.folder'),
                        name = folder.attr('title'),
                        id = $(mutation.target).find('summary').attr('data-id');

                    let path = [name],
                        cur = folder;

                    let n = 10;

                    while(cur.length > 0){
                        n--;
                        if(n < 0){
                            break;
                        }
                        cur = cur.parent().closest('.folder');
                        if(cur.length > 0){
                            path.push(cur.attr('title'));
                        }
                    }

                    path = path.reverse();

                    if($(mutation.target).attr('open')){
                        //TODO: if not there already
                        t.treeState.push(path);
                    } else {
                        t.treeState = t.treeState.filter(f => !(f.length === path.length && f.every((v, i) => path[i] === v)));
                    }
                    console.log(t.treeState);
                    localStorage.setItem('treeState', JSON.stringify(t.treeState));
                }
            });
        });
        let treeConfig = {
            attributes: true,
            childList: true,
            subtree: true
        };
        treeObserver.observe($('.filetree').eq(0)[0], treeConfig);
    }

    /* ======== css ======== */

})()
