const TRANSLATIONTABEL = {
	1: "No Results",
}

function $T(id) {
	return TRANSLATIONTABEL[id];
}

function $TInject(id, injections) {
	var text = TRANSLATIONTABEL[id];

	injections.forEach(function(injection, index) {
		var replace = "\\$" + index;
		var regexObj = new RegExp(replace, "g");
		
		text = text.replace(regexObj, injection);
	})

	return text;
}

export {$T, $TInject}
export default $T
