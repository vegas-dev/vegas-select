(function (exports) {
	'use strict';

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

	var vg$1 = new vg;

	class VGSelect {
		constructor(element, arg = {}) {
			this.classes = {
				'main': 'vg-select'
			};

			if (!element) {
				console.error('Первый параметр не должен быть пустым');
				return false;
			} else {
				if (element.tagName !== 'SELECT') {
					console.error('Тэг должен быть "select"');
					return false;
				} else {
					vg$1.hide(element);
					this.create(element);
				}
			}
		}

		create(element) {
			let option_selected = element.options[element.selectedIndex].innerText,
				options = element.options;

			let classes = element.getAttribute('class'),
				select = document.createElement('div');

			classes = classes.split(' ');

			for (const _class of classes) {
				select.classList.add(_class);
			}

			let span = document.createElement('span');
			span.classList.add('current');
			span.innerText = option_selected;
			select.append(span);

			let list = document.createElement('ul');
			list.classList.add('list');

			for (const option of options) {
				let li = document.createElement('li');
				li.innerText = option.innerText;
				list.append(li);
			}

			select.append(list);

			element.insertAdjacentElement('afterend', select);

			this.toggle(select);
		}

		toggle() {
			vg$1.listener('click', '.' + this.classes.main, function (el, event) {
				if (el.classList.contains('show')) {
					el.classList.remove('show');
				} else {
					el.classList.add('show');
				}

				event.preventDefault();
			});
		}
	}

	exports.VGSelect = VGSelect;

})(this.window = this.window || {});
