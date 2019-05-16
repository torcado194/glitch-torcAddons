// ==UserScript==
// @name         torcAddons-pasteAndIndent
// @namespace    http://torcado.com
// @description  automatically correctly indents pasted lines
// @version      1.1.1
// @author       torcado
// @license      MIT
// @icon         http://torcado.com/torcAddons/icon.png
// @run-at       document-start
// @grant        none
// @match        http*://glitch.com/edit/*
// ==/UserScript==


/*
 * torcAddons-pasteAndIndent | v1.1.1
 * automatically correctly indents pasted lines
 * by torcado
 */
(()=>{
    let t = torcAddons;

    let shift = false;

    t.addEventListener('load', ()=>{
        $(document).on('keydown', down);
        $(document).on('keyup', up);
    });

    t.addEventListener('fileEdit', e => {
        handleChange(e.detail.cm, e.detail.change)
    });

    function down(e){
        if(e.shiftKey) shift = true;
    }
    function up(e){
        if(!e.shiftKey) shift = false;
    }


    function handleChange(cm, change){
        if (shift || change.origin !== "paste") {
            return;
        }

        let from = change.from.line,
            to = change.from.line + change.text.length;

        indentLines(cm, from, to);
    }

    function indentLines(cm, from, to){
        cm.operation(function () {
            cm.eachLine(from, to, (line) => {
                if(/^\s*$/.test(line.text)){
                    let lineNo = line.lineNo(),
                        length = line.text.length;
                    //add temp text to indent blank lines
                    cm.replaceRange(';', {line: lineNo, ch: 0}, {line: lineNo, ch: length});
                    cm.indentLine(lineNo, "smart");
                    length = line.text.length
                    cm.replaceRange('', {line: lineNo, ch: length - 1}, {line: lineNo, ch: length});
                } else {
                    cm.indentLine(line.lineNo(), "smart");
                }
            });
        });
    }

    /* ======== css ======== */

    t.addCSS(`
.torc-indentGuideGroup {
    position: absolute;
    width: 100%;
    display: block;
    white-space: pre;
    padding-left: 10px;
}

.torc-indentGuide {
    border-left: 1px dotted rgba(255,255,255,0.2);
    margin-left: -1px;
    position: relative;
}
    `);

})()