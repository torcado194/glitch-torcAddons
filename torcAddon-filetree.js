/*
 * torcAddons-filetree | v1.0.0
 * turns the glitch file navigator into a (real) file tree, also adding a searchbar
 * by torcado
 */
(()=>{
	let t = torcAddons;

	window.addEventListener('load', ()=>{
		$.extend($.easing, {
			easeOutQuint: function (x, t, b, c, d) {
				return c*((t=t/d-1)*t*t*t*t + 1) + b;
			},
		});
	});

	t.addEventListener('treeUpdate', ()=>{
		compileTree();
		addSearch();
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
		let searchBar = $('<input class="torc-search">').insertAfter($('.filetree:not(.torc-tree)'));
		
		searchBar.on('input', function() { 
			if(searchBar[0].value.length > 0){
				let search = searchBar[0].value,
					show = list.filter(v => v.name.includes(search));
					hide = list.filter(v => !v.name.includes(search));
					
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
				list.forEach(v => {
					v.el.removeAttr('torc-searchHide', '');
					
					let el = v.el.find('.filename');
					el.html(v.name);
				});
			}
		});
	}
})()
