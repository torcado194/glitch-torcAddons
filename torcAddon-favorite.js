/*
 * torcAddons-favorite | v1.0.1
 * adds the ability to favorite files to pin them to the top of the file list
 * by torcado
 */
(()=>{
	let t = torcAddons;
	
	let project = '';
	
	t.addEventListener('load', ()=>{
	    project = window.location.href.match(/#!\/((?:[^?]|.)+)/)[1];
	    setFavorites();
		addStars();
	});
	
	t.addEventListener('treeUpdate', ()=>{
	    setFavorites();
		addStars();
	});
	
	function setFavorites(){
	    $('.torc-favoritesList').remove();
	    let favsList = {},
	        html = '<div class="torc-favoritesList filetree"><div class="torc-favoritesTitle">favorites</div></div>'
	    if($('.torc-search')[0]){
	        favsList = $(html).insertBefore($('.torc-search'));
	    } else {
	        favsList = $(html).insertBefore($('.filetree'));
	    }
	    let favs = JSON.parse(localStorage.getItem('favorites'));
	    favs && favs[project] && favs[project].forEach(v => {
	        let el = $(`.file[title="${v}"]`).clone().attr('torc-file', '').removeClass('active');
	        el.find('.torc-favstar').on('click', handleStarClick);
	        favsList.append(el);
	        el.click(function(){application.selectFileByPathOrDefaultFile(v)});
	    });
	}
	
	function addFavorite(el){
	    el = el.clone().attr('torc-file', '').removeClass('active');
	    el.click(function(){application.selectFileByPathOrDefaultFile($(this).attr('title'))});
	    el.css({
	        height: 0,
	        opacity: 0,
	    });
	    $('.torc-favoritesList').append(el);
	    el.animate({
	        height: '19px',
	        opacity: 1,
	    }, 350, 'easeOutQuint');
	}
	
	function removeFavorite(el){
	    let file = $('.torc-favoritesList').find(`.file[title="${el.attr('title')}"]`);
	    file.animate({
	        height: 0,
	        margin: 0,
	        padding: 0,
	        overflow: 'hidden',
	        opacity: 0,
	    }, 350, 'easeOutQuint', function(){
	        $(this).remove();
	    });
	}
	
	function addStars(){
        $('.torc-favstar').remove();
        $('.filetree .file').append('<div class="torc-favstar"></div>');
        
        let favs = JSON.parse(localStorage.getItem('favorites'));
        $('.file').each(function(){
            if(favs && favs[project] && favs[project].includes($(this).attr('title'))){
                $(this).attr('torc-favorited', '');
            } else {
                $(this).removeAttr('torc-favorited');
            }
        });
        
        $('.torc-favstar').on('click', handleStarClick);
	}
	
	function handleStarClick(e){
	    e.stopPropagation();
        let el = $(this).closest('.file')
        let favs = JSON.parse(localStorage.getItem('favorites'));
        if(!favs){
            favs = {};
        }
        if(!favs[project]){
            favs[project] = [];
        }
        if(el.attr('torc-favorited') === undefined){ //add
            el.attr('torc-favorited', '');
            favs[project].push(el.attr('title'));
            addFavorite(el);
        } else { //remove
            el.removeAttr('torc-favorited');
            favs[project].splice(favs[project].indexOf(el.attr('title')), 1);
            removeFavorite(el);
        }
        localStorage.setItem('favorites', JSON.stringify(favs));
        addStars();
        //setFavorites();
	}
	
})()