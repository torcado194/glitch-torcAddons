/*
 * torcAddons | v1.2.0
 * a base driver for glitch.com aaddons
 * by torcado
 */
var torcAddons = torcAddons || new EventTarget();
let	t = torcAddons;

t.loaded = false;

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


window.addEventListener('load', (event) => {
    $.extend($.easing, {
        easeInQuint: function (x, t, b, c, d) {
            return c*(t/=d)*t*t*t*t + b;
        },
        easeOutQuint: function (x, t, b, c, d) {
            return c*((t=t/d-1)*t*t*t*t + 1) + b;
        },
    });
    setTimeout(function(){
        
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
        
        application.projectIsLoaded.observe(() => {
            
            $('body').addClass(application.currentTheme());
            
            setTimeout(function(){
                application.selectedFile.observe(handleFileSelect);
                watchChanges();
                t.loaded = true;
                t.dispatchEvent(new CustomEvent('load'))
            }, 5);
            
        });
        //application.selectedFile.observe(changeFile)
    }, 5);
});

function handleFileSelect(doc){
    doc.session.then(io => {
        t.dispatchEvent(new CustomEvent('fileSelect', {detail: {doc, io}}))
    });
}

function watchChanges(doc){
    application.getCurrentSession().cm.on('change', (cm, change) => t.dispatchEvent(new CustomEvent('fileEdit', {detail: {cm, change}})));
}

