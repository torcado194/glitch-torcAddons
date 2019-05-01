/*
 * torcAddons-pasteAndIndent | v1.0.0
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
                    editor.document.replaceRange(';', {line: lineNo, ch: 0}, {line: lineNo, ch: length});
                    cm.indentLine(lineNo, "smart");
                    editor.document.replaceRange('', {line: lineNo, ch: length - 1}, {line: lineNo, ch: length});
                } else {
                    cm.indentLine(line.lineNo(), "smart");
                }
            });
        });
	}
	
})()