/*
 * torcAddons-manualUpdate | v1.0.1
 * provides an 'update' button to allow manual updates
 * by torcado
 */
(()=>{
    let t = torcAddons;
    
    t.addEventListener('load', ()=>{
        let updateButton = $('<div class="torc-update">update</div>').insertAfter($('.show-app-wrapper'));
        updateButton.on('click', function(){
            updateFile = application.fileByPath('.torc-update')
            if(!updateFile){
                updateFile = application.newFile('.torc-update');
            }
            application.writeToFile(updateFile, ':D ' + Date.now());
        });
    });
    
})()