class vg {
	constructor() {}

	hide(el) {
		el.style.display = 'none';
	}

	show(el, state = 'block') {
		el.style.display = state;
	}

	listener(event, el, callback) {
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

					e.preventDefault();
				}).call(element, e);
			}
		});
	}
}

export default new vg;
