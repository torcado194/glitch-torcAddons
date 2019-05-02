/*
 * torcAddons-indentGuides | v1.0.1
 * adds indent guides to glitch code
 * by torcado
 */
(()=>{
    let t = torcAddons;
    
    t.addEventListener('codeUpdate', ()=>{
        addGuides();
    })
    
    function addGuides(){
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
})()