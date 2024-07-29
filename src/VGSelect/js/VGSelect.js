import vg from "../../util/vg";

const setParams = function (element, params, arg) {
	let mParams = vg.merge(params, arg),
		data = [].filter.call(element.attributes, function (at) {
			return /^data-/.test(at.name);
		});

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
			'optgroupTitle': 'vg-select-list--optgroup-title',
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
				this.refresh(element);
			}
		}
	}

	create(element, reInit = false) {
		const _this = this;

		if (element.dataset?.inited === 'true' && !reInit) {
			return;
		} else {
			_this.destroy(element);
		}

		element.parentElement.style.position = 'relative';

		let option_selected = element.options[element.selectedIndex].innerText,
			options = element.options;

		// Создаем основной элемент с классами селекта
		let classes = element.getAttribute('class'),
			select = document.createElement('div');

		classes = classes.split(' ');

		for (const _class of classes) {
			select.classList.add(_class)
		}

		if (element.hasAttribute('disabled')) select.classList.add('disabled')

		let elData = vg.getDataAttributes(element);
		if (!vg.isEmptyObj(elData)) {
			for (const key of Object.keys(elData)) {
				select.setAttribute('data-' + key, elData[key]);
			}
		}

		// Создаем элемент с отображением выбранного варианта
		let current = document.createElement('div');
		current.classList.add(_this.classes.current);
		current.innerText = option_selected.trim();
		select.append(current);

		// Создаем элемент выпадающего списка
		let dropdown = document.createElement('div');
		dropdown.classList.add(_this.classes.dropdown);
		select.append(dropdown);

		// Создаем список и варианты селекта
		let list = document.createElement('ul');
		list.classList.add(_this.classes.list);

		let optGroup = element.querySelectorAll('optgroup');

		if (optGroup.length) {
			let isSelected = false;
			[...optGroup].forEach(function (el) {
				let olOptGroup = document.createElement('ol');
				olOptGroup.classList.add(_this.classes.optgroup);

				let liLabel = document.createElement('li');
				liLabel.innerHTML = el.label.trim();
				liLabel.classList.add(_this.classes.optgroupTitle)

				olOptGroup.prepend(liLabel)

				let optGroupOptions = el.querySelectorAll('option');

				createLi(optGroupOptions, olOptGroup, isSelected);

				list.append(olOptGroup);
				isSelected = true;
			});
		} else {
			let isSelected = false;
			createLi(options, list, isSelected);
		}

		function createLi(options, list, isSelected) {
			let i = 0;
			for (const option of options) {
				let li = document.createElement('li');

				li.innerHTML = option.innerHTML.trim().replace(/<\/[^>]+(>|$)/g, "")
				li.dataset.value = option.getAttribute('value');
				li.classList.add(_this.classes.option);

				let liData = vg.getDataAttributes(option);
				if (!vg.isEmptyObj(liData)) {
					for (const key of Object.keys(liData)) {
						li.setAttribute('data-' + key, liData[key]);
					}
				}

				if (i === element.selectedIndex && !isSelected) {
					li.classList.add('selected');
				}

				if (option.hasAttribute('disabled')) li.classList.add('disabled');
				if (option.hasAttribute('hidden')) li.classList.add('hidden');

				list.append(li);

				i++;
			}
		}

		dropdown.append(list);

		// Добавляем все созданный контейнер после селекта
		element.insertAdjacentElement('afterend', select);

		// помечаем элемент инициализированным
		element.dataset.inited = true;

		if (_this.settings.search) {
			this.search(select);
		}

		_this.toggle(select);
	}

	destroy(select) {
		let element = select.nextElementSibling;

		if (element) {
			if (element.classList.contains('vg-select')) {
				element.remove();

				select.selectedIndex = 0;
				[...select.querySelectorAll('option')].forEach(function (el, index) {
					if (el.hasAttribute('selected')) {
						select.selectedIndex = index;
					}
				});
			}
		}
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
					vg.eventHandler.on(select, 'change')
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

	refresh(select) {
		const _this = this;

		let observer = new MutationObserver(mutationRecords => {
			mutationRecords.forEach(() => {
				_this.create(select, true);
			})
		});

		observer.observe(select, {
			childList: true,
			subtree: true,
			characterDataOldValue: true
		});
	}

	static getCreate(select) {
		return new this(select, {}).create(select, true);
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
				let options = [...selectList.querySelectorAll('.' + _this.classes.option)],
					optionsGroup = [...selectList.querySelectorAll('.' + _this.classes.optgroup)],
					value = el.value;

				options = options.concat(optionsGroup);

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

[...document.querySelectorAll('form')].forEach(function (form) {
	form.addEventListener("reset", function () {
		form.querySelectorAll('select.vg-select').forEach(function (select) {
			VGSelect.getCreate(select)
		})
	});
});

export default VGSelect;
