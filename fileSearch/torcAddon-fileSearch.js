// ==UserScript==
// @name         torcAddons-fileSearch
// @namespace    http://torcado.com
// @description  adds a searchbar to the file tree
// @version      1.0.1
// @author       torcado
// @license      MIT
// @icon         http://torcado.com/torcAddons/icon.png
// @run-at       document-start
// @grant        none
// @include      http*://glitch.com/edit/*
// @updateURL    https://raw.githubusercontent.com/torcado194/glitch-torcAddons/master/fileSearch/torcAddon-fileSearch.js
// @downloadURL  https://raw.githubusercontent.com/torcado194/glitch-torcAddons/master/fileSearch/torcAddon-fileSearch.js
// ==/UserScript==


/*
 * torcAddons-fileSearch | v1.0.1
 * adds a searchbar to the file tree
 * by torcado
 */

(function() {
    'use strict';
    let t = torcAddons;

    t.addEventListener('load', ()=>{
        compileTree();
        addSearch();
    })

    t.addEventListener('treeUpdate', ()=>{
        compileTree();
    })

    t.fileTree = [];
    t.fileList = [];

    function compileTree(){
        $('.torc-tree').remove();
        t.fileTree = [];
        t.fileList = [];
        $('ul.filetree').eq(0).find('.file').each(function(el){
            let pathName = $(this).attr('title'),
                path = pathName.split('/');
            let dir,
                pointer = t.fileTree;
            t.fileList.push({file: path.slice(-1)[0], name: path.slice(-1)[0].split('.')[0], el: $(this)});
            for(let i = 0; i < path.length; i++){
                let sub = path[i];
                if(pointer.some(v => v[sub])){
                    pointer = Object.values(pointer.filter(v => v[sub])[0])[0];
                } else {
                    if(i === path.length - 1){
                        pointer.push($(this));
                    } else {
                        let a = [];
                        pointer.push({[sub]: a});
                        pointer = a;
                    }
                }
            }
        });
    }

    function addSearch(){
        $('.torc-search').remove();
        let searchBar = $('<div class="torc-search"><span class="torc-regexToggle">(.*)</span><input class="torc-searchInput"></div>').insertBefore($('ul.filetree:not(.torc-tree)')).find('.torc-searchInput');

        let regexInput = false;

        $('.torc-regexToggle').on('click', function(){
            $(this).toggleClass('torc-active');
            regexInput = $(this).hasClass('torc-active');
        })

        searchBar.on('input', function() {
            if(searchBar[0].value.length > 0){
                let search = searchBar[0].value,
                    regex,
                    show = [],
                    hide = [];
                try {
                    regex = new RegExp(`(${search.replaceAll('(', '(?:')})`);
                } catch(e) {
                    if(regexInput){
                        $('.torc-search').addClass('torc-invalid');
                        return;
                    }
                }

                if(regexInput){
                    show = t.fileList.filter(v => v.file.match(regex));
                    hide = t.fileList.filter(v => !v.file.match(regex));
                } else {
                    show = t.fileList.filter(v => v.file.includes(search)),
                    hide = t.fileList.filter(v => !v.file.includes(search));
                }
                $('.torc-search').removeClass('torc-invalid');

                show.forEach(v => {
                    v.el.removeClass('torc-searchHide');

                    let el = v.el.find('.filename'),
                        text = el.text();

                    if(!v.el.find('.torc-filename')[0]){
                        el.after(`<div class="torc-filename"></div>`)
                    }

                    let s = text.split(regex);
                    el.addClass('torc-hide');
                    el.parent().find('.torc-filename').html(`${s[0]}<span class="torc-searchHighlight">${s[1]}</span>${s.slice(2).join('')}`);
                });
                hide.forEach(v => {
                    v.el.addClass('torc-searchHide');

                    let el = v.el.find('.filename');
                    el.removeClass('torc-hide');
                    //el.html(v.name);
                });

            } else {
                t.fileList.forEach(v => {
                    v.el.removeClass('torc-searchHide');

                    v.el.find('.display-file-name .torc-filename').remove();
                    v.el.find('.torc-hide').removeClass('torc-hide');
                    //el.html(v.name);
                });
            }

            $('ul.filetree .folder').each(function(){
                let $this = $(this)
                if($this.find('.file:not(.torc-searchHide)').length === 0){
                    $this.addClass('torc-searchHide');
                } else {
                    $this.removeClass('torc-searchHide');
                }
            });
        });
    }

    t.addCSS(`

/* search */

.torc-search {
    height: 24px;
    width: calc(100% - 20px);
    position: relative;
    margin-bottom: 2px;
}

.torc-searchInput {
    height: 24px;
    width: 100%;
    border: 1px solid #666666;
    margin: 0px 10px 2px;
    border-radius: 16px;
    background-color: initial;
    padding: 8px;
    position: relative;
}

.filetree .file {
    /*transition: 0.1s ease-out;
    transition-property: opacity, height;*/
    height: 19px;
    opacity: 1;
}

.filetree .folder-path {
    /*transition: 0.1s ease-out;
    transition-property: opacity, height;*/
    height: 20px;
    opacity: 1;
}

.torc-hide {
    display: none !important;
}

.file.torc-searchHide {
    height: 0 !important;
    opacity: 0 !important;
    overflow: hidden;
    min-height: 0;
}

.folder.torc-searchHide, .folder.torc-searchHide .folder-path {
    height: 0 !important;
    opacity: 0 !important;
    overflow: hidden;
    min-height: 0;
}

.file.torc-searchHide:last-child, .folder.torc-searchHide:last-child {
    margin-bottom: -6px;
}

.torc-searchHighlight {
    color: #ff5288;
}

.torc-regexToggle {
    position: absolute;
    right: -9px;
    top: 0px;
    font-size: 11px;
    height: 24px;
    width: 30px;
    background-color: #3f4046bf;
    border-radius: 12px;
    line-height: 22px;
    text-align: center;
    /* border: 2px solid #000000; */
    color: #aaa;
    font-weight: 800;
    cursor: pointer;
    z-index: 100;
}

.torc-regexToggle.torc-active {
    color: #35abff;
}

.torc-regexToggle.torc-active + .torc-searchInput {
    color: #35abff;
}

.torc-search.torc-invalid .torc-searchInput {
    color: #ff2929;
}

/* overrides */

.filetree.filetree {
    padding-bottom: 0;
}

.filetree .filetree-child .current-users {
    position: absolute !important;
    left: -4px !important;
    height: 20px !important;
}

.filetree .filetree-child {
    /*position: initial !important;*/
}
    `);
})();