import vg from "../../util/vg";

class VGSelect {
	constructor(element, arg = {}) {
		this.classes = {
			'main': 'vg-select'
		}

		if (!element) {
			console.error('Первый параметр не должен быть пустым');
			return false;
		} else {
			if (element.tagName !== 'SELECT') {
				console.error('Тэг должен быть "select"');
				return false;
			} else {
				vg.hide(element);
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
		vg.listener('click', '.' + this.classes.main, function (el, event) {
			if (el.classList.contains('show')) {
				el.classList.remove('show');
			} else {
				el.classList.add('show');
			}

			event.preventDefault();
		});
	}
}

export default VGSelect;
