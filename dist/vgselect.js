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

	var vg$1 = new vg;

	class VGSelect {
		constructor(element, arg = {}) {
			this.classes = {
				'container': 'vg-select',
				'list': 'vg-select-list',
				'option': 'vg-select-list--option',
				'current': 'vg-select-current'
			};

			if (!element) {
				console.error('Первый параметр не должен быть пустым');
				return false;
			} else {
				if (element.tagName !== 'SELECT') {
					console.error('Тэг должен быть "select"');
					return false;
				} else {
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

			let div = document.createElement('div');
			div.classList.add(this.classes.current);
			div.innerText = option_selected;
			select.append(div);

			let list = document.createElement('ul');
			list.classList.add(this.classes.list);

			let i = 0;
			for (const option of options) {
				let li = document.createElement('li');
				li.dataset.value = option.getAttribute('value');
				li.innerText = option.innerText;
				li.classList.add(this.classes.option);

				if (i === element.selectedIndex) li.classList.add('selected');
				if (option.hasAttribute('disabled')) li.classList.add('disabled');

				list.append(li);

				i++;
			}

			select.append(list);

			element.insertAdjacentElement('afterend', select);

			this.toggle(select);
		}

		toggle(select) {
			const _this = this;

			vg$1.listener('click', '.' + this.classes.container, function (el, e) {
				let selects = document.querySelectorAll('.vg-select');
				if (selects.length) {
					for (const els of selects) {
						els.classList.remove('show');
					}
				}

				if (el.classList.contains('show')) {
					el.classList.remove('show');
				} else {
					el.classList.add('show');
				}

				e.preventDefault();
			});

			vg$1.listener('click', '.' + _this.classes.option, function (el, e) {
				e.preventDefault();


			});

			vg$1.listener('mouseup', '', function (e) {
				e.preventDefault();

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
	}

	exports.VGSelect = VGSelect;

})(this.window = this.window || {});
