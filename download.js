(function($) {
	$(document).ready(function() {
		chrome.runtime.onMessage.addListener(function(message) {

			// Source: http://pixelscommander.com/en/javascript/javascript-file-download-ignore-content-type/
			window.downloadFile = function (sUrl) {

				//iOS devices do not support downloading. We have to inform user about this.
				if (/(iP)/g.test(navigator.userAgent)) {
					//alert('Your device does not support files downloading. Please try again in desktop browser.');
					window.open(sUrl, '_blank');
					return false;
				}

				//If in Chrome or Safari - download via virtual link click
				if (window.downloadFile.isChrome || window.downloadFile.isSafari) {
					//Creating new link node.
					var link = document.createElement('a');
					link.href = sUrl;
					link.setAttribute('target','_blank');

					if (link.download !== undefined) {
						//Set HTML5 download attribute. This will prevent file from opening if supported.
						var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
						link.download = fileName;
					}

					//Dispatching click event.
					if (document.createEvent) {
						var e = document.createEvent('MouseEvents');
						e.initEvent('click', true, true);
						link.dispatchEvent(e);
						return true;
					}
				}

				// Force file download (whether supported by server).
				if (sUrl.indexOf('?') === -1) {
					sUrl += '?download';
				}

				window.open(sUrl, '_blank');
				return true;
			};

			window.downloadFile.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
			window.downloadFile.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;

			if( message.downloadFrom9Gag ){
				if( $('#container .post-container video').length ){
					var sourceMP4 = $('#container .post-container video source:eq(1)');
					// window.open( sourceMP4.attr('src'), '_blank' );
					downloadFile( sourceMP4.attr('src') );
				} else if( $('#container .post-container picture').length ){
					var sourceJPG = $('#container .post-container picture img');
					// window.open( sourceJPG.attr('src'), '_blank' );
					downloadFile( sourceJPG.attr('src') );
				}

				$('body').addClass('p3');
			}
		})

	});
})(jQuery);