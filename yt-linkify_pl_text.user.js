// ==UserScript==
// @name          YouTube Channel Playlist Linkifier
// @namespace     http://github.com/uky/greasemonkey
// @description   Changes plain text playlist names to link to their classic playlist pages.
// @version       0.2.3
// @author        Uky
// @include       http://www.youtube.com/*
// @exclude       http://www.youtube.com/watch?*
// @exclude       http://www.youtube.com/results?*
// ==/UserScript==

// A nice wrapper for XPath queries. Defaults to document root node.
function xpath(query, node) {
	return document.evaluate(query,
			typeof(node) !== 'undefined' ? node : document,
			null,
			XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
			null);
}

function linkify(event) {
	if (!event.target.id) {
		return;
	}

	// Only check relevant DOM updates otherwise the script can
	// become very slow.
	if (!event.target.id.match('-playlist-')) {
		return;
	}
	
	var title_nodes = xpath("//div[@class='playnav-playlist-header']/div[@class='title']");
	for (var i = 0; i < title_nodes.snapshotLength; i++) {
		var node = title_nodes.snapshotItem(i);
		var playlist_id = node.getAttribute('id').match('playnav-playlist-([0-9A-F]+)-title')[1];
		var playlist_name = xpath(".//text()", node).snapshotItem(0).nodeValue;
		node.innerHTML = "<a href='http://www.youtube.com/view_play_list?p=" + playlist_id + "'>" + playlist_name + "</a>";
	}
}

// Check if we're on a new-style user channel.
//var channel_check = xpath("//style[@id='channel-theme-css']"); // There's a script on USo (59894) that removes this node...
var channel_check = xpath("//div[@id='channel-body']"); // This node should (hopefully) never be removed.
if (channel_check.snapshotLength > 0) {
	document.addEventListener('DOMNodeInserted', linkify, true );
	document.addEventListener('DOMAttrModified', linkify, true );
}
