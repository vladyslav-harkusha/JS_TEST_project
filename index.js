const appForm = document.querySelector('.app__form');
const formInput = document.getElementById('form__input');
const outputList = document.querySelector('.app__list');
const errorMessage = document.querySelector('.form__input-message');
const btnSortByName = document.querySelector('.button--sort-by-name');
const btnSortByValue = document.querySelector('.button--sort-by-value');
const btnDeleteSelected = document.querySelector('.button--delete-selected');

// Змінні для перемикання кнопок стану сортування
let isSortedByName = false;
let isSortedByValue = false;


// Робимо контрольований інпут у формі, щоб користувач не зміг ввести недопустимі символи, або дані у невірному форматі
let controlledInputValue = '';

formInput.addEventListener('input', (event) => {
	errorMessage.style.display = 'none';

	let targVal = event.target.value;
	const currentSymbol = targVal[targVal.length - 1];
	const regularExp = new RegExp(/[0-9a-zA-Zа-яА-ЯїЇіІєЄ=]/g);

	// якщо користувач видаляє символи - записуємо нове значення в controlledInputValue
	if (targVal.length < controlledInputValue.length) {
		controlledInputValue = targVal;
		return;
	}

	// контролюємо інпут, якщо користувач вводить недопустимі символи, або недопустиму кількість чи послідовнысть знаків '='
	if (!regularExp.test(currentSymbol) || targVal.split('=').length > 2 || !targVal.split('=')[0]) {
		event.target.value = controlledInputValue;
		return;
	}

	controlledInputValue += currentSymbol;
});


// Функція для виводу елементів масиву
let pairsArray = [];
let selectedPairsIds = [];

const createPairItems = (arr) => arr.forEach(elem => {
	const pairItem = document.createElement('li');
	outputList.appendChild(pairItem);
	pairItem.classList.add('app__list-item');

	const pairText = document.createElement('p');
	pairText.innerText = elem.pairString;
	pairText.classList.add('app__list-item_text');

	// додаємо чекбокс і лейбл до нього, вішаємо слухач події
	const checkBoxLabel = document.createElement('label');
	checkBoxLabel.setAttribute('for', `${elem.id}`);
	checkBoxLabel.classList.add('pair__checkBox');

	const checkBox = document.createElement('input');
	checkBox.type = 'checkbox';
	checkBox.id = `${elem.id}`;

	// ховаємо чекбокс, щоб було видно лише його лейбл
	checkBox.style.display = 'none';

	checkBox.addEventListener('change', () => {
		if (checkBox.checked) {
			selectedPairsIds.push(elem.id);

			checkBoxLabel.classList.add('pair__checkBox--checked');
			pairItem.classList.add('app__list-item--checked');
		} else {
			selectedPairsIds = selectedPairsIds.filter(id => id !== elem.id);

			checkBoxLabel.classList.remove('pair__checkBox--checked');
			pairItem.classList.remove('app__list-item--checked');

		}
	})

	pairItem.append(pairText, checkBoxLabel, checkBox);
});


// Івент сабміту форми і додавання значень інпуту в масив
appForm.addEventListener('submit', (event) => {
	event.preventDefault();

	// перевіряємо чи користувач ввів value
	if (formInput.value.split('=')[1]) {
		outputList.innerText = '';

		// створюэмо новий об'єкт та додаємо його в масив
		const newPairObject = {
			id: (new Date()).getTime(),
			pairString: formInput.value
		}
		pairsArray.push(newPairObject);
		createPairItems(pairsArray);

		// якщо кнопки сортування активні - виводимо новий відсортований масив
		if (isSortedByName) {
			sortPairs(pairsArray,'name');
		}
		if (isSortedByValue) {
			sortPairs(pairsArray,'value');
		}

		formInput.value = '';
		controlledInputValue = '';
	} else {
		errorMessage.style.display = 'block';
	}
});


// Функція для сортування по Name або Value
function sortPairs(pairsArr, sortBy) {
	let sortedPairs;
	const getName = (pair) => pair.pairString.split('=')[0];
	const getValue = (pair) => pair.pairString.split('=')[1];

	// копіюємо поточний масив, щоб його не змінювати. сортуємо сплітнуті елементи масиву залежно від умови
	if (sortBy === 'name') {
		sortedPairs = [...pairsArr].sort((pair1, pair2) => getName(pair1).localeCompare(getName(pair2)));
	}
	if (sortBy === 'value') {
		sortedPairs = [...pairsArr].sort((pair1, pair2) => getValue(pair1).localeCompare(getValue(pair2)));
	}

	outputList.innerText = '';
	// передаємо відсортований масив у функцію виводу елементів
	createPairItems(sortedPairs);
}


// Функція для перемикання стилів кнопок сортування
function changeSortButton(sortButton) {
	if (sortButton === btnSortByName) {
		if (isSortedByName) {
			btnSortByName.innerText = 'Sort by Name';
			btnSortByName.classList.remove('sorted');
		} else {
			btnSortByName.innerText = 'Sorted by Name';
			btnSortByName.classList.add('sorted');
		}
		isSortedByName = !isSortedByName;
	}

	if (sortButton === btnSortByValue) {
		if (isSortedByValue) {
			btnSortByValue.innerText = 'Sort by Value';
			btnSortByValue.classList.remove('sorted');
		} else {
			btnSortByValue.innerText = 'Sorted by Value';
			btnSortByValue.classList.add('sorted');
		}
		isSortedByValue = !isSortedByValue;
	}
}


// Вішаємо події на кнопки сортування так, щоб вони при другому кліку повертали невідсортований масив
btnSortByName.addEventListener('click', () => {
	// сортуємо лише якщо є мінімум 2 елементи списку
	if (pairsArray.length > 1) {
		if (isSortedByValue) {
			changeSortButton(btnSortByValue);
		}

		if (!isSortedByName) {
			sortPairs(pairsArray, 'name');
			changeSortButton(btnSortByName);
		} else {
			outputList.innerText = '';
			createPairItems(pairsArray);
			changeSortButton(btnSortByName);
		}
	}
});

btnSortByValue.addEventListener('click', () => {
	if (pairsArray.length > 1) {
		if (isSortedByName) {
			changeSortButton(btnSortByName);
		}

		if (!isSortedByValue) {
			sortPairs(pairsArray, 'value');
			changeSortButton(btnSortByValue);
		} else {
			outputList.innerText = '';
			createPairItems(pairsArray);
			changeSortButton(btnSortByValue);
		}
	}
});


// Подія для фільтрування і видалення вибраних елементів
btnDeleteSelected.addEventListener('click', () => {
	// функція спрацьовує лише якщо масив обраних id не порожній
	if (selectedPairsIds.length) {
		outputList.innerText = '';

		pairsArray = pairsArray.filter(pair => !selectedPairsIds.includes(pair.id));
		createPairItems(pairsArray);
		selectedPairsIds = [];

		// повертаємо кнопки сортування в початкове значення, якщо вони були активні
		if (isSortedByName) {
			changeSortButton(btnSortByName);
		}
		if (isSortedByValue) {
			changeSortButton(btnSortByValue);
		}
	}
});
