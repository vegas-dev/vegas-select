import vg from "../../util/vg";

const setParams = function (element, params, arg) {
	return vg.merge(params, arg)
}

class VGSelect {
	constructor(element, arg = {}) {
		this.classes = {
			'container': 'vg-select',
			'dropdown': 'vg-select-dropdown',
			'list': 'vg-select-list',
			'option': 'vg-select-list--option',
			'current': 'vg-select-current'
		}

		const defaultParams = {
			'search': false
		}

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
		let option_selected = element.options[element.selectedIndex].innerText,
			options = element.options;

		// Создаем основной элемент с классами селекта
		let classes = element.getAttribute('class'),
			select = document.createElement('div');

		classes = classes.split(' ');

		for (const _class of classes) {
			select.classList.add(_class)
		}

		// Создаем элемент с отображением выбранного варианта
		let current = document.createElement('div');
		current.classList.add(this.classes.current);
		current.innerText = option_selected;
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
			li.dataset.value = option.getAttribute('value');
			li.innerText = option.innerText;
			li.classList.add(this.classes.option);

			if (i === element.selectedIndex) li.classList.add('selected');
			if (option.hasAttribute('disabled')) li.classList.add('disabled')

			list.append(li);

			i++;
		}

		dropdown.append(list);

		// Добавляем все созданный контейнер после селекта
		element.insertAdjacentElement('afterend', select);

		if (this.settings.search) {
			this.search();
		}

		this.toggle();
	}

	toggle() {
		const _this = this;

		vg.listener('click', '.' + _this.classes.current, function (el, e) {
			let element = el.closest('.vg-select');

			let selects = document.querySelectorAll('.vg-select');
			if (selects.length) {
				for (const els of selects) {
					if (els !== element) {
						els.classList.remove('show');
					}
				}
			}

			if (element.classList.contains('show')) {
				element.classList.remove('show');
			} else {
				element.classList.add('show');
			}

			e.preventDefault();
		});

		vg.listener('click', '.' + _this.classes.option, function (el, e) {
			e.preventDefault();

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
				select.dispatchEvent(new Event('change'));
			}
		});

		vg.listener('mouseup', '', function (e) {
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

	search() {
		const _this = this;
	}
}

export default VGSelect;
