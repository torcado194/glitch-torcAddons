// ==UserScript==
// @name         torcAddons
// @namespace    http://torcado.com
// @description  a base driver for glitch.com addons
// @version      1.3.5
// @author       torcado
// @license      MIT
// @icon         http://torcado.com/torcAddons/icon.png
// @run-at       document-start
// @grant        none
// @include      http*://glitch.com/edit/*
// @updateURL    https://raw.githubusercontent.com/torcado194/glitch-torcAddons/master/torcAddons.js
// @downloadURL  https://raw.githubusercontent.com/torcado194/glitch-torcAddons/master/torcAddons.js
// ==/UserScript==


/*
 * torcAddons | v1.3.5
 * a base driver for glitch.com addons
 * by torcado
 */

var torcAddons = torcAddons || new EventTarget();
window.torcAddons = torcAddons;

(function() {
    let t = torcAddons;
    t.version = '1.3.5';

    t.loaded = false;
    t.loadingFile = true;

    t.debounce = (func, wait, immediate) => {
        let timeout;
        return function() {
            let context = this, args = arguments;
            let later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        }
    }

    let treeUpdateDebounce = t.debounce(()=>t.dispatchEvent(new CustomEvent('treeUpdate')), 5, true);

    let treeObserver = new MutationObserver(function(mutations) {
        if(!t.loaded){
            return;
        }
        mutations.forEach(function(mutation) {
            if(mutation.addedNodes && mutation.addedNodes.length > 0) {
                let newFile = false;
                mutation.addedNodes.forEach(n => {
                    if($(n).attr('torc-file') === undefined){
                        newFile = true;
                    }
                });
                if(!newFile){
                    return;
                }
                treeUpdateDebounce();
            }
        });
    });

    //let codeUpdateDebounce = t.debounce(()=>, 5, true);

    let codeObserver = new MutationObserver(function(mutations) {
        if(!t.loaded){
            return;
        }
        //codeUpdateDebounce();
        t.dispatchEvent(new CustomEvent('codeUpdate'))
    });

    let codeLoadObserver = new MutationObserver(function(mutations) {
        if(!t.loaded){
            return;
        }
        mutations.forEach(function(mutation) {
            if(mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(n => {
                    if(n.classList && n.classList.contains('CodeMirror-gutter-wrapper')){
                        if(t.loadingFile){
                            t.loadingFile = false;
                            //setTimeout(()=>{
                            t.dispatchEvent(new CustomEvent('fileLoaded'))
                            //},5);
                        }
                    }
                });
            }
        });
    });

    t.addCSS = (css) => {
        let head = document.getElementsByTagName('head')[0] || document.getElementsByTagName('html')[0];
        if (!head) {
            return;
        }
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }


    window.addEventListener('load', (event) => {
        $.extend($.easing, {
            easeInQuint: function (x, t, b, c, d) {
                return c*(t/=d)*t*t*t*t + b;
            },
            easeOutQuint: function (x, t, b, c, d) {
                return c*((t=t/d-1)*t*t*t*t + 1) + b;
            },
        });

        let aoInterval = setInterval(obs, 500);
        function obs(){
            if(!$('.filetree')[0] || !$('.CodeMirror-sizer')[0]){
                return;
            }
            clearInterval(aoInterval);
            let treeConfig = {
                attributes: true,
                childList: true,
                characterData: true
            };
            treeObserver.observe($('.filetree').eq(0)[0], treeConfig);
            let codeConfig = {
                attributes: true,
                childList: false,
            };
            codeObserver.observe($('.CodeMirror-sizer').eq(0)[0], codeConfig);
            let codeLoadConfig = {
                attributes: true,
                childList: true,
                subtree: true
            };
            codeLoadObserver.observe($('.CodeMirror-sizer').eq(0)[0], codeLoadConfig);

            if(application.projectIsLoaded()){
                loaded();
            } else {
                application.projectIsLoaded.observe(loaded);
            }

            function loaded(){
                if(!t.loaded){

                    console.log(`%ctorcAddons %cv${t.version} %cloaded!`, 'color: #1abce2', 'color: #f5b908', 'color: #1abce2');

                    $('body').addClass(application.currentTheme());

                    setTimeout(function(){
                        application.selectedFileId.observe(handleFileSelect);
                        watchChanges();
                        t.loaded = true;
                        t.dispatchEvent(new CustomEvent('load'))
                    }, 5);

                }
            }

            //application.selectedFile.observe(changeFile)
        }
    });

    function handleFileSelect(docId){
        t.loadingFile = true;
        application.selectedFile().session.then(io => {
            t.dispatchEvent(new CustomEvent('fileSelect', {detail: {docId, io}}))
        });
    }

    function watchChanges(doc){
        application.getCurrentSession().cm.on('change', (cm, change) => t.dispatchEvent(new CustomEvent('fileEdit', {detail: {cm, change}})));
    }
})();