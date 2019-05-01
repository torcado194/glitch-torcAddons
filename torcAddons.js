/*
 * torcAddons | v1.0.1
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
            treeUpdateDebounce();
        }
    });
});

let codeUpdateDebounce = t.debounce(()=>t.dispatchEvent(new CustomEvent('codeUpdate')), 5, true);

let codeObserver = new MutationObserver(function(mutations) {
    if(!t.loaded){
        return;
    }
    codeUpdateDebounce();
});


window.addEventListener('load', (event) => {
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
            setTimeout(function(){
                t.loaded = true;
				t.dispatchEvent(new CustomEvent('load'))
            }, 5);
        });
        //application.selectedFile.observe(changeFile)
    }, 5);
});
