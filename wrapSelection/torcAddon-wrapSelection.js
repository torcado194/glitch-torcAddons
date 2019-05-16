// ==UserScript==
// @name         torcAddons-wrapSelection
// @namespace    http://torcado.com
// @description  allows certain characters to wrap selections rather than replace the selection, such as (parentheses)
// @version      1.1.0
// @author       torcado
// @license      MIT
// @icon         http://torcado.com/torcAddons/icon.png
// @run-at       document-start
// @grant        none
// @match        http*://glitch.com/edit/*
// ==/UserScript==


/*
 * torcAddons-wrapSelection | v1.1.0
 * allows certain characters to wrap selections rather than replace the selection, such as (parentheses)
 * by torcado
 */
(()=>{
    let t = torcAddons;
    
    let wrapList = [
        '(',
        '[',
        '{',
        '<',
        "'",
        '"',
        '`',
        '/'
    ];
    let wrapEndList = [
        ')',
        ']',
        '}',
        '>',
        "'",
        '"',
        '`',
        '/'
    ];
    
    t.addEventListener('fileEdit', e => {
        handleChange(e.detail.cm, e.detail.change)
    });
    
    function handleChange(cm, change){
        
        if(!change.origin || !change.origin.includes('input') || change.removed.length === 0 || change.removed[0] === ''){
            return;
        }
        if(!wrapList.includes(change.text[0])){
            return;
        }
        
        let startChar = change.text[0],
            endChar = wrapEndList[wrapList.indexOf(startChar)];
        
        let from = change.from.line,
            to = change.from.line + change.text.length,
            separator = cm.lineSeparator();
        
        cm.operation(function () {
            let i = 0;
            let text = change.removed[i++],
                start = change.from.ch,
                endText =  cm.getLine(from).slice(start+1);
            if(change.removed.length > 1){
                cm.replaceRange(text, {line: from, ch: start+1}, {line: from, ch: start+1+endText.length});
                
                for(; i < change.removed.length; i++){
                    let ch = cm.getLine(from + (i-1)).length+1;
                    cm.replaceRange(separator + change.removed[i], {line: from + (i-1), ch});
                }
                
                let ch = change.removed[i-1].length;
                cm.replaceRange(endChar + endText, {line: from + (i-1), ch});
                
                cm.setSelection({line: from, ch: start+1}, {line: from + (i-1), ch: change.removed[i-1].length});
            } else {
                cm.replaceRange(text + endChar, {line: from, ch: start+1});
                cm.setSelection({line: from, ch: start+1}, {line: from, ch: start+1+change.removed[0].length});
            }
        });
    }
    
})()