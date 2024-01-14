import vg from "../../util/vg";

class VGSelect {
	constructor(element, arg = {}) {
		this.classes = {
			'container': 'vg-select',
			'list': 'vg-select-list',
			'option': 'vg-select-list--option',
			'current': 'vg-select-current'
		}

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
			select.classList.add(_class)
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
			if (option.hasAttribute('disabled')) li.classList.add('disabled')

			list.append(li);

			i++;
		}

		select.append(list);

		element.insertAdjacentElement('afterend', select);

		this.toggle(select);
	}

	toggle(select) {
		const _this = this;

		vg.listener('click', '.' + this.classes.container, function (el, e) {
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

		vg.listener('click', '.' + _this.classes.option, function (el, e) {
			e.preventDefault();


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
}

export default VGSelect;
