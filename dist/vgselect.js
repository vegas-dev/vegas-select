(function (exports) {
	'use strict';

	const vg = {
		hide: function (el) {
			el.style.display = 'none';
		},

		show: function (el, state = 'block') {
			el.style.display = state;
		},

		listener: function (event, el, callback) {
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
								callback('success', x.responseText);
								break;
							default:
								callback('error', x.responseText);
								break;
						}
					}
				};
				x.send(data);
			},

			get: function (url, data, callback, async) {
				let query = [];
				for (let key of data) {
					query.push(encodeURIComponent(key[0]) + '=' + encodeURIComponent(key[1]));
				}
				vg.ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async);
			},

			post: function (url, data, callback, async) {
				vg.ajax.send(url, callback, 'POST', data, async);
			}
		},

		getDataAttributes: function (el) {
			let data = {};
			[].forEach.call(el.attributes, function(attr) {
				if (/^data-/.test(attr.name)) {
					let camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
						return $1.toUpperCase();
					});
					data[camelCaseName] = attr.value;
				}
			});
			return data;
		},

		isEmptyObj: function (obj) {
			for (let prop in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, prop)) {
					return false;
				}
			}

			return true
		}
	};

	const setParams = function (element, params, arg) {
		let mParams = vg.merge(params, arg),
			data = [].filter.call(element.attributes, function (at) {
				return /^data-/.test(at.name);
			});

		for (let val of data) {
			if (val.name === 'data-search') mParams.search = val.value !== 'false';
		}

		return mParams;
	};

	class VGSelect {
		constructor(element, arg = {}) {
			this.classes = {
				'container': 'vg-select',
				'dropdown': 'vg-select-dropdown',
				'list': 'vg-select-list',
				'option': 'vg-select-list--option',
				'optgroup': 'vg-select-list--optgroup',
				'current': 'vg-select-current',
				'search': 'vg-select-search'
			};

			const defaultParams = {
				'search': false
			};

			if (!element) {
				console.error('Первый параметр не должен быть пустым');
				return false;
			} else {
				if (element.tagName !== 'SELECT') {
					console.error('Тэг должен быть "select"');
					return false;
				} else {
					this.settings = setParams(element, defaultParams, arg);
					this.create(element);
				}
			}
		}

		create(element) {
			if (element.dataset?.inited === 'true') {
				return;
			}

			let option_selected = element.options[element.selectedIndex].innerText,
				options = element.options;

			// Создаем основной элемент с классами селекта
			let classes = element.getAttribute('class'),
				select = document.createElement('div');

			classes = classes.split(' ');

			for (const _class of classes) {
				select.classList.add(_class);
			}

			let elData = vg.getDataAttributes(element);
			if (!vg.isEmptyObj(elData)) {
				for (const key of Object.keys(elData)) {
					select.setAttribute('data-' + key, elData[key]);
				}
			}

			// Создаем элемент с отображением выбранного варианта
			let current = document.createElement('div');
			current.classList.add(this.classes.current);
			current.innerText = option_selected.trim();
			select.append(current);

			// Создаем элемент выпадающего списка
			let dropdown = document.createElement('div');
			dropdown.classList.add(this.classes.dropdown);
			select.append(dropdown);

			// Создаем список и варианты селекта
			let list = document.createElement('ul');
			list.classList.add(this.classes.list);

			let i = 0;
			for (const option of options) {
				let li = document.createElement('li');

				li.innerText = option.innerText.trim();
				li.classList.add(this.classes.option);
				li.dataset.value = option.getAttribute('value');

				let liData = vg.getDataAttributes(option);
				if (!vg.isEmptyObj(liData)) {
					for (const key of Object.keys(liData)) {
						li.setAttribute('data-' + key, liData[key]);
					}
				}

				if (i === element.selectedIndex) li.classList.add('selected');
				if (option.hasAttribute('disabled')) li.classList.add('disabled');

				// TODO
				/*let optGroup = option.closest('optgroup');
				if (!optGroup) {
					li.dataset.value = option.getAttribute('value');
					li.innerText = option.innerText;
					li.classList.add(this.classes.option);

					if (i === element.selectedIndex) li.classList.add('selected');
					if (option.hasAttribute('disabled')) li.classList.add('disabled');
				} else {
					li.classList.add('optgroup');
					li.innerText = optGroup.getAttribute('label');
				}*/

				list.append(li);

				i++;
			}

			dropdown.append(list);

			// Добавляем все созданный контейнер после селекта
			element.insertAdjacentElement('afterend', select);

			// помечаем элемент инициализированным
			element.dataset.inited = true;

			if (this.settings.search) {
				this.search(select);
			}

			this.toggle(select);
		}

		toggle(select) {
			const _this = this;

			select.querySelector('.' + _this.classes.current).onclick = function (e) {
				let el = e.target,
					container = el.closest('.vg-select');

				let selects = document.querySelectorAll('.vg-select');
				if (selects.length) {
					for (const els of selects) {
						if (els !== container) {
							els.classList.remove('show');
						}
					}
				}

				if (container.classList.contains('show')) {
					container.classList.remove('show');
				} else {
					container.classList.add('show');

					if (_this.settings.search) {
						let input = container.querySelector('input');
						if (input) input.focus();
					}
				}

				return false;
			};

			select.querySelectorAll('.' + _this.classes.option).forEach((option) => {
				option.addEventListener('click', (e) => {
					e.preventDefault();

					let el = e.target;

					if (!el.classList.contains('disabled')) {
						let container = el.closest('.' + _this.classes.container),
							options = container.querySelectorAll('.' + _this.classes.option);

						if (options.length) {
							for (const option of options) {
								option.classList.remove('selected');
							}
						}

						el.classList.add('selected');

						container.querySelector('.' + _this.classes.current).innerText = el.innerText;
						container.classList.remove('show');

						let select = container.previousSibling;
						select.value = el.dataset.value;
						select.dispatchEvent(new Event('change', { bubbles: true }));
					}
				});
			});

			window.addEventListener('click', function (e) {
				if (!e.target.closest('.vg-select')) {
					let selects = document.querySelectorAll('.vg-select');
					if (selects.length) {
						for (const el of selects) {
							el.classList.remove('show');
						}
					}
				}
			});
		}

		search(select) {
			const _this = this;

			let dropdown = select.querySelector('.' + _this.classes.dropdown);

			let search_container = document.createElement('div');
			search_container.classList.add(_this.classes.search);

			let input = document.createElement('input');
			input.setAttribute('name', 'vg-select-search');
			input.setAttribute('type', 'text');
			input.setAttribute('placeholder', 'Поиск...');

			search_container.append(input);
			dropdown.prepend(search_container);

			search_container.querySelector('[name=vg-select-search]').addEventListener('keyup', (e) => {
				e.preventDefault();

				let el = e.target;

				let selectList = el.closest('.' + _this.classes.dropdown).querySelector('.' + _this.classes.list);
				if (selectList) {
					let options = selectList.querySelectorAll('.' + _this.classes.option),
						value = el.value;

					for (const option of options) {
						vg.show(option);
					}

					if (value.length) {
						value = value.trim();
						value = value.toLowerCase();
						value = Transliterate(value, true);

						for (const option of options) {
							let text = option.innerText.toLowerCase();

							if (text.indexOf(value) === -1) vg.hide(option);
						}
					}
				}
			});

			const Transliterate = function (text, enToRu) {
				let ru = "й ц у к е н г ш щ з х ъ ф ы в а п р о л д ж э я ч с м и т ь б ю".split(/ +/g);
				let en = "q w e r t y u i o p [ ] a s d f g h j k l ; ' z x c v b n m , .".split(/ +/g);
				let x;

				for (x = 0; x < ru.length; x++) {
					text = text.split(enToRu ? en[x] : ru[x]).join(enToRu ? ru[x] : en[x]);
					text = text.split(enToRu ? en[x].toUpperCase() : ru[x].toUpperCase()).join(enToRu ? ru[x].toUpperCase() : en[x].toUpperCase());
				}

				return text;
			};
		}
	}

	exports.VGSelect = VGSelect;

})(this.window = this.window || {});
