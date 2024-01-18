import vg from "../../util/vg";

const setParams = function (element, params, arg) {
	let mParams = vg.merge(params, arg),
		data = [].filter.call(element.attributes, function(at) { return /^data-/.test(at.name); });

	for (let val of data) {
		if (val.name === 'data-search') mParams.search = val.value !== 'false';
	}

	return mParams;
}

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
		}

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

		vg.listener('keyup', '[name=vg-select-search]', function (el, e) {
			e.preventDefault();

			let selectList = el.closest('.' + _this.classes.dropdown).querySelector('.' + _this.classes.list);
			if (selectList) {
				let options = selectList.querySelectorAll('.' + _this.classes.option),
					value  = el.value;

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

export default VGSelect;
