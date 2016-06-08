$(document).ready(function(){
	var progress = function(){
		var precent = ipc.sendSync('progress precent');
		$('.progress-bar').css('width', precent+'%').text(precent+'%');

	}

	var interval = setInterval(progress, 100);
	ipc.on('download ok', function(){
		clearInterval(interval);
		$('body').append('</div class="row">正在整理文件,请稍等片刻.......</div>');
	})
})