$('#9gag-download-btn').click(function () {
    var selectedSource = $('#video-format-selector').val();

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {downloadFrom9Gag: true, selectedSource: selectedSource});
    });
});

chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {getDataFrom9Gag: true}, function (response) {

        console.log(response);

        var $postTitle = $('#post-title'),
            $formatSelector = $('#video-format-selector');

        function getUrlExtension(url) {
            return url.split(/[#?]/)[0].split('.').pop().trim();
        }

        if (response.postVideos.length) {
            var sources = $.unique(response.postVideos);

            $formatSelector.html('');
            for (var i = 0; i < sources.length; i++) {
                $formatSelector.append($('<option>', {
                    value: sources[i],
                    text: getUrlExtension(sources[i])
                }));
            }
        } else {
            $('#video-format-wrapper').hide();
        }

        $postTitle.text('');

        if (response.postPitle)
            $postTitle.text(response.postPitle);
    });
});
