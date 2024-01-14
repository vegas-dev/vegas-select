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

	merge(...objects) {
		const _this = this;

		const isObject = obj => obj && typeof obj === 'object';

		return objects.reduce((prev, obj) => {
			Object.keys(obj).forEach(key => {
				const pVal = prev[key];
				const oVal = obj[key];

				if (Array.isArray(pVal) && Array.isArray(oVal)) {
					prev[key] = pVal.concat(...oVal);
				}
				else if (isObject(pVal) && isObject(oVal)) {
					prev[key] = _this.merge(pVal, oVal);
				}
				else {
					prev[key] = oVal;
				}
			});

			return prev;
		}, {});
	}
}

export default new vg;
