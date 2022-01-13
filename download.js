(function ($) {
    $(document).ready(function () {
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

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
                    link.setAttribute('target', '_blank');

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

            if (request.getDataFrom9Gag) {
                var $videoContainerSources = $('#container .post-container video source'),
                    videoContainerSourcesArray = [];

                for (var i = 0; i < $videoContainerSources.length; i++) {
                    videoContainerSourcesArray.push($videoContainerSources.eq(i).attr('src'))
                }

                sendResponse({
                    postPitle: $('section#individual-post header h1').text(),
                    postVideos: videoContainerSourcesArray,
                });
            }

            if (request.downloadFrom9Gag) {
                // console.log('downloadFrom9Gag', request);
                var $videoContainer = $('#container .post-container video'),
                    $pictureContainer = $('#container .post-container picture');

                if ($videoContainer.length) {
                    downloadFile(request.selectedSource);
                } else if ($pictureContainer.length) {
                    var sourceJPG = $pictureContainer.find('img');
                    downloadFile(sourceJPG.attr('src'));
                }

                $('body').addClass('9gag-downloader');
                return true;
            }

        })

    });
})(jQuery);
