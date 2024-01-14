class vg {
	constructor() {}

	hide(el) {
		el.style.display = 'none';
	}

	show(el, state = 'block') {
		el.style.display = state;
	}

	listener(event, el, callback) {
		if (el) {
			document.addEventListener(event, function (e) {
				let selectors = document.body.querySelectorAll(el),
					element = e.target,
					index = -1;

				while (element && ((index = Array.prototype.indexOf.call(selectors, element)) === -1)) {
					element = element.parentElement;
				}

				if (index > -1) {
					(function () {
						if (typeof callback === "function") {
							callback(element, e);
						}
					}).call(element, e);
				}
			});
		} else {
			window.addEventListener(event, function (e) {
				if (typeof callback === "function") {
					callback(e);
				}
			});
		}
	}

/*	find(el, found) {
		let found_elements = [];

		// Find all the outer matched elements
		var outers = document.querySelectorAll('.post');

		for(var i=0; i<outers.length; i++) {
			var elements_in_outer = outers[i].querySelectorAll(".thumb");

			// document.querySelectorAll() returns an "array-like" collection of elements
			// convert this "array-like" collection to an array
			elements_in_outer = Array.prototype.slice.call(elements_in_outer);

			found_elements = found_elements.concat(elements_in_outer);
		}

// The final 4 elements
		console.log(found_elements);
	}*/
}

export default new vg;
