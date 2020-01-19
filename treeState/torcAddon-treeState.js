// ==UserScript==
// @name         torcAddons-treeState
// @namespace    http://torcado.com
// @description  saves the state of the filetree across loads
// @version      1.0.3
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
        load();
        update();
        listen();
    });

    t.addEventListener('reload', ()=>{
        load();
        update();
    });

    t.treeState = {};
    t.curTreeState = [];
    t.projectName = '';

    let ignore = true;

    function load(){
        t.treeState = JSON.parse(localStorage.getItem('treeState')) || {};
        t.projectName = application.projectName();
        if(t.treeState[t.projectName]){
            t.curTreeState = t.treeState[t.projectName];
        } else {
            t.treeState[t.projectName] = [];
            t.curTreeState = t.treeState[t.projectName];
        }
    }

    function update(){
        if(t.curTreeState && Array.isArray(t.curTreeState)){
            t.curTreeState.forEach(tree => {
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
                        if(!t.curTreeState.some(f => (f.length === path.length && f.every((v, i) => path[i] === v)))){
                            t.curTreeState.push(path);
                        }
                    } else {
                        t.curTreeState = t.curTreeState.filter(f => !(f.length === path.length && f.every((v, i) => path[i] === v)));
                    }
                    t.treeState[t.projectName] = t.curTreeState;
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
