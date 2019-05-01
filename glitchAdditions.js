let loaded = false;

let compileDebounce = debounce(compileTree, 5, true);

let treeObserver = new MutationObserver(function(mutations) {
    if(!loaded){
        return;
    }
    mutations.forEach(function(mutation) {
        if(mutation.addedNodes && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(v => {
                if($(v).hasClass('file')){
                    
                }
            });
            console.log(mutation.addedNodes);
            compileDebounce();
        }
    });
});

let guidesDebounce = debounce(addGuides, 5, true);

let guideSimpleDebounce = 0;

let codeObserver = new MutationObserver(function(mutations) {
    if(!loaded){
        return;
    }
    addGuides();
});



function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    }
}

window.addEventListener('load', (event) => {
    setTimeout(function(){
        
        console.log($('.filetree').eq(0));
        
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
        
        
        application.projectIsLoaded.observe((a, b) => {
            compileTree();
            addSearch();
            setTimeout(function(){
                loaded = true;
            }, 100)
        });
        
        //application.selectedFile.observe(changeFile)
    }, 10);
});

let tree = [],
    list = []

function compileTree(){
    console.log("sdfsdgfdg");
    $('.torctree').remove();
    tree = [];
    list = [];
    $('.filetree').eq(0).children('.file').each(function(el){
        let pathName = $(this).attr('title'),
            path = pathName.split('/');
        let dir,
            pointer = tree;
        list.push({file: path.slice(-1)[0], name: path.slice(-1)[0].split('.')[0], el: $(this)});
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
    //console.log(tree);
    let treeEl = $('<div class="filetree torctree"></div>').appendTo($('.files').eq(0));
    
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
    
    tree.forEach(dir => {
        add(dir, treeEl);
    });
    
    /*$('.torctree .dir').each(function(){
        $(this).height($(this)[0].clientHeight - 20);
    });*/
}

function addSearch(){
    let searchBar = $('<input class="torcsearch">').insertAfter($('.filetree:not(.torctree)'));
    //console.log(list);
    searchBar.on('input', function() { 
        if(searchBar[0].value.length > 0){
            let search = searchBar[0].value,
                show = list.filter(v => v.name.includes(search));
                hide = list.filter(v => !v.name.includes(search));
                
            //console.log(show);
            show.forEach(v => {
                 v.el.removeAttr('searchHide', '');
                
                let el = v.el.find('.filename'),
                    text = el.text();
                
                let s = text.split(new RegExp(`(${search})`));
                
                el.html(`${s[0]}<span class="torc-searchHighlight">${s[1]}</span>${s.slice(2).join('')}`);
            });
            hide.forEach(v => {
                v.el.attr('searchHide', '');
                
                let el = v.el.find('.filename');
                el.html(v.name);
            });
            
        } else {
            list.forEach(v => {
                v.el.removeAttr('searchHide', '');
                
                let el = v.el.find('.filename');
                el.html(v.name);
            });
        }
    });
}

function changeFile(file){
    console.log(file);
    file.content.observe(editCode);
}

function editCode(code){
    console.log(code);
    setTimeout(function(){
        addGuides();
    }, 5);
}

function addGuides(){
    console.log('d');
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