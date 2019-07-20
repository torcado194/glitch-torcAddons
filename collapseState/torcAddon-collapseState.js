// ==UserScript==
// @name         torcAddons-collapseState
// @namespace    http://torcado.com
// @description  saves the state of collapsible code blocks across loads
// @version      1.0.2
// @author       torcado
// @license      MIT
// @icon         http://torcado.com/torcAddons/icon.png
// @run-at       document-start
// @grant        none
// @include      http*://glitch.com/edit/*
// @updateURL    https://openuserjs.org/meta/torcado/torcAddons-collapseState.meta.js
// @downloadURL  https://openuserjs.org/src/scripts/torcado/torcAddons-collapseState.user.js
// ==/UserScript==

(()=>{
    let t = torcAddons;

    let ignore = true,
        ignoreUpdate = false;

    let loadedFiles = [];

    t.addEventListener('load', ()=>{
        ignore = true;
        load();
        //update();
    });

    t.addEventListener('fileSelect', ()=>{
        if(loadedFiles.includes(application.currentDocument())){
            ignoreUpdate = true;
        } else {
            //loadedFiles.push(application.currentDocument());
        }
    });

    let saveDebounce = t.debounce(()=>save(), 20);
    t.addEventListener('codeUpdate', ()=>{
        //save();
        if(!ignore){
            saveDebounce()
        }
    });

    t.fileId = '';
    t.addEventListener('fileLoaded', (e)=>{
        loadedFiles.push(application.currentDocument());
        if(ignoreUpdate){
            ignoreUpdate = false;
            return;
        }
        ignore = true;
        update();
    });

    t.collapseState = {};
    t.curProjectState = {};
    t.curFileState = [];
    t.projectName = '';


    function load(){
        t.collapseState = JSON.parse(localStorage.getItem('collapseState')) || {};
        t.projectName = application.projectName();
        if(t.collapseState[t.projectName]){
            t.curProjectState = t.collapseState[t.projectName];
        } else {
            t.collapseState[t.projectName] = {};
            t.curProjectState = t.collapseState[t.projectName];
        }
    }

    function update(){
        t.fileId = application.currentDocument();
        if(t.curProjectState && t.curProjectState[t.fileId]){
            t.curFileState = t.curProjectState[t.fileId];
            if(t.curFileState && Array.isArray(t.curFileState)){
                let cm = application.getCurrentSession().cm;
                t.curFileState.forEach(line => {
                    //TODO check if unfolded?
                    cm.foldCode(parseInt(line)-1);
                });
            }
        }
        setTimeout(()=>{
            ignore = false;
        }, 100);
    }

    function save(){
        if(ignore){
            return;
        }
        if($('.CodeMirror-foldgutter-open').length === 0 && $('.CodeMirror-foldgutter-folded').length === 0){
            return;
        }
        t.curFileState = [];
        $('.CodeMirror-gutter-wrapper').each(function(){
            if($(this).find('.CodeMirror-foldgutter-folded').length > 0){
                t.curFileState.push($(this).find('.CodeMirror-linenumber').text());
            }
        });

        t.curProjectState[application.currentDocument()] = t.curFileState;
        t.collapseState[t.projectName] = t.curProjectState;

        localStorage.setItem('collapseState', JSON.stringify(t.collapseState));
    }

    /* ======== css ======== */

})()
