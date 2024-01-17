const vg = {
	hide: function (el) {
		el.style.display = 'none';
	},

	show: function (el, state = 'block') {
		el.style.display = state;
	},

	listener: function (event, el, callback) {
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
	},

	merge: function (...objects) {
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
	},

	ajax: {
		x: function () {
			if (typeof XMLHttpRequest !== 'undefined') {
				return new XMLHttpRequest();
			}
			let versions = [
				"MSXML2.XmlHttp.6.0",
				"MSXML2.XmlHttp.5.0",
				"MSXML2.XmlHttp.4.0",
				"MSXML2.XmlHttp.3.0",
				"MSXML2.XmlHttp.2.0",
				"Microsoft.XmlHttp"
			];

			let xhr;
			for (let i = 0; i < versions.length; i++) {
				try {
					xhr = new ActiveXObject(versions[i]);
					break;
				} catch (e) {}
			}
			return xhr;
		},

		send: function (url, callback, method, data, async) {
			if (async === undefined) {
				async = true;
			}
			let x = vg.ajax.x();
			x.open(method, url, async);
			x.onreadystatechange = function () {
				if (x.readyState === 4) {
					switch (x.status) {
						case 200:
							callback('success', x.responseText)
							break;
						default:
							callback('error', x.responseText)
							break;
					}
				}
			};
			if (method === 'POST') {
				//x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			}
			x.send(data)
		},

		get: function (url, data, callback, async) {
			let query = [];
			for (let key of data) {
				query.push(encodeURIComponent(key[0]) + '=' + encodeURIComponent(key[1]));
			}
			vg.ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
		},

		post: function (url, data, callback, async) {
			vg.ajax.send(url, callback, 'POST', data, async)
		}
	}
}

export default vg;
