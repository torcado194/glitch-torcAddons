// ==UserScript==
// @name         torcAddons-filetree
// @namespace    http://torcado.com
// @description  turns the glitch file navigator into a (real) file tree, also adding a searchbar
// @version      1.1.3
// @author       torcado
// @license      MIT
// @icon         http://torcado.com/torcAddons/icon.png
// @run-at       document-start
// @grant        none
// @include      http*://glitch.com/edit/*
// @updateURL    https://openuserjs.org/meta/torcado/torcAddons-filetree.meta.js
// @downloadURL  https://openuserjs.org/src/scripts/torcado/torcAddons-filetree.user.js
// ==/UserScript==


/*
 * torcAddons-filetree | v1.1.3
 * turns the glitch file navigator into a (real) file tree, also adding a searchbar
 * by torcado
 */

(()=>{
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
        $('.filetree').eq(0).children('.file').each(function(el){
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

        let treeEl = $('<div class="filetree torc-tree"></div>').appendTo($('.files').eq(0));

        function add(dir, el){
            let cursor = dir,
                cursorEl = el;
            if(!(cursor instanceof jQuery)){
                let name = Object.keys(cursor)[0],
                    sub = Object.values(cursor)[0];
                cursorEl = $(`<div class="dir" name="${name}"><div class="collapse">/${name}</div></div>`).appendTo(cursorEl);

                cursorEl.find('.collapse').click(function(e){
                    if(e.target !== this){
                        return;
                    }
                    let collapseEl = $(this).closest('.dir').toggleClass('hide');
                    if(collapseEl.hasClass('hide')){
                        collapseEl.stop().animate({
                            height: 0
                        }, {
                            duration: 250,
                            easing: "easeOutQuint",
                            queue: false
                        });
                    } else {
                        collapseEl.stop().animate({
                            height: collapseEl[0].scrollHeight
                        }, {
                            duration: 250,
                            easing: "easeOutQuint",
                            queue: false,
                            complete: function(){
                                $(this).css("height", "");
                            }
                        });
                    }

                    e.stopPropagation();
                });
                sub.forEach(v => add(v, cursorEl));
            } else {
                cursorEl.append(cursor);
            }
        }

        t.fileTree.forEach(dir => {
            add(dir, treeEl);
        });
    }

    function addSearch(){
        $('.torc-search').remove();
        let searchBar = $('<input class="torc-search">').insertAfter($('.filetree:not(.torc-tree)'));

        searchBar.on('input', function() {
            if(searchBar[0].value.length > 0){
                let search = searchBar[0].value,
                    show = t.fileList.filter(v => v.name.includes(search));
                hide = t.fileList.filter(v => !v.name.includes(search));

                show.forEach(v => {
                    v.el.removeAttr('torc-searchHide', '');

                    let el = v.el.find('.filename'),
                        text = el.text();

                    let s = text.split(new RegExp(`(${search})`));

                    el.html(`${s[0]}<span class="torc-searchHighlight">${s[1]}</span>${s.slice(2).join('')}`);
                });
                hide.forEach(v => {
                    v.el.attr('torc-searchHide', '');

                    let el = v.el.find('.filename');
                    el.html(v.name);
                });

            } else {
                t.fileList.forEach(v => {
                    v.el.removeAttr('torc-searchHide', '');

                    let el = v.el.find('.filename');
                    el.html(v.name);
                });
            }
        });
    }

    /* ======== css ======== */

    t.addCSS(`
.filetree.torc-tree {
    padding-left: 4px;
    padding-bottom: 80px !important;
}

.torc-tree .dir {
    border-left: 1px dashed rgba(255,255,255,0.25);
    margin-left: 12px;
    padding-left: 4px;
    padding-top: 0px;
    overflow: hidden;
    margin-top: 22px;
    /* transition-duration: 0.25s; */
}
.sugar .torc-tree .dir {
    border-left: 1px dashed rgba(0, 0, 0, 0.3);
}

.torc-tree .dir.hide {
    /*height: 0 !important;*/
}

.torc-tree .folder-path{
    display: none;
}

.torc-tree .collapse {
    margin-left: -8px;
    /* background-color: #160f19; */
    margin-top: -24px;
    margin-bottom: -3px;
    padding-bottom: 3px;
    color: rgba(255,255,255,0.45);
    cursor: pointer;
    position: absolute;
    padding-top: 5px;
    opacity: 1;
    transition-property: opacity;
    transition-duration: 0.25s;
}
.sugar .torc-tree .collapse {
    color: rgba(0, 0, 0, 0.7);
}

.hide .dir .collapse {
    opacity: 0;
}


.dir.hide>.collapse:after {
    content: "...";
    position: absolute;
    right: -16px;
    top: 1px;
    font-size: 16px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
}

/* search */

.torc-search {
    height: 20px;
    width: calc(100% - 20px);
    border: 1px solid #666666;
    margin: 0px 10px 2px;
    border-radius: 10px;
    background-color: initial;
    padding: 8px;
    position: relative;
}

.filetree.torc-tree .filetree-child.file {
    transition: 0.25s ease-out;
    transition-property: opacity, height;
    height: 19px;
    opacity: 1;
}

.file[torc-searchHide] {
    height: 0 !important;
    opacity: 0 !important;
}

.torc-searchHighlight {
    color: #ff5288;
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

})()
