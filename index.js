const appForm = document.querySelector('.app__form');
const formInput = document.getElementById('form__input');
const outputList = document.querySelector('.app__list');
const errorMessage = document.querySelector('.form__input-message');
const btnSortByName = document.querySelector('.button--sort-by-name');
const btnSortByValue = document.querySelector('.button--sort-by-value');
const btnDeleteAll = document.querySelector('.button--delete-all');


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

const createPairItems = (arr) => arr.forEach(elem => {
	const pairItem = document.createElement('li');
	outputList.appendChild(pairItem);
	pairItem.classList.add('app__list-item');

	const pairText = document.createElement('p');
	pairText.innerText = elem;
	pairText.classList.add('app__list-item_text');

	// Кнопка та функція для видалення одного елемента зі списку
	const deleteItemBtn = document.createElement('button');
	deleteItemBtn.innerText = 'Delete';
	deleteItemBtn.classList.add('button--delete-item');

	deleteItemBtn.addEventListener('click', () => {
		const foundIndex = pairsArray.findIndex(pair => pair === elem);
		pairsArray.splice(foundIndex, 1);
		outputList.innerText = '';
		createPairItems(pairsArray);
	});

	pairItem.append(pairText, deleteItemBtn);
});


// Івент сабміту форми і додавання значень інпуту в масив
appForm.addEventListener('submit', (event) => {
	event.preventDefault();

	// перевіряємо чи користувач ввів value
	if (formInput.value.split('=')[1]) {
		outputList.innerText = '';
		pairsArray.push(formInput.value);
		createPairItems(pairsArray);

		formInput.value = '';
		controlledInputValue = '';
	} else {
		errorMessage.style.display = 'block';
	}
});


// Функція для сортування по Name або Value
const sortPairs = (pairsArr, sortBy) => {
	let sortedPairs;

	// копіюємо поточний масив, щоб його не змінювати. сортуємо сплітнуті елементи масиву залежно від умови
	if (sortBy === 'name') {
		sortedPairs = [...pairsArr].sort((pair1, pair2) => pair1.split('=')[0].localeCompare(pair2.split('=')[0]));
	}
	if (sortBy === 'value') {
		sortedPairs = [...pairsArr].sort((pair1, pair2) => pair1.split('=')[1].localeCompare(pair2.split('=')[1]));
	}

	outputList.innerText = '';
	// передаємо відсортований масив у функцію виводу елементів
	createPairItems(sortedPairs);
}


// Вішаємо події на кнопки сортування так, щоб вони при другому кліку повертали невідсортований масив
let isSortedByName = false;
let isSortedByValue = false;

btnSortByName.addEventListener('click', () => {
	// сортуємо лише якщо є мінімум 2 елементи списку
	if (pairsArray.length > 1) {
		if (isSortedByValue) {
			isSortedByValue = !isSortedByValue;
			btnSortByValue.innerText = 'Sort by Value';
			btnSortByValue.classList.remove('sorted');
		}

		if (!isSortedByName) {
			sortPairs(pairsArray, 'name');
			btnSortByName.innerText = 'Sorted by Name';
			btnSortByName.classList.add('sorted');
			isSortedByName = !isSortedByName;
		} else {
			outputList.innerText = '';
			createPairItems(pairsArray);
			btnSortByName.innerText = 'Sort by Name';
			btnSortByName.classList.remove('sorted');
			isSortedByName = !isSortedByName;
		}
	}
});

btnSortByValue.addEventListener('click', () => {
	if (pairsArray.length > 1) {
		if (isSortedByName) {
			isSortedByName = !isSortedByName;
			btnSortByName.innerText = 'Sort by Name';
			btnSortByName.classList.remove('sorted');
		}

		if (!isSortedByValue) {
			sortPairs(pairsArray, 'value');
			btnSortByValue.innerText = 'Sorted by Value';
			btnSortByValue.classList.add('sorted');
			isSortedByValue = !isSortedByValue;
		} else {
			outputList.innerText = '';
			createPairItems(pairsArray);
			btnSortByValue.innerText = 'Sort by Value';
			btnSortByValue.classList.remove('sorted');
			isSortedByValue = !isSortedByValue;
		}
	}
});


// Подія для видалення усіх елементів
btnDeleteAll.addEventListener('click', () => {
	// функція спрацьовує лише якщо елементи є у списку
	if (pairsArray.length) {
		outputList.innerText = '';
		pairsArray = [];

		// повертаємо кнопки сортування в початкове значення, якщо вони були активні
		if (isSortedByName) {
			btnSortByName.innerText = 'Sort by Name';
			btnSortByName.classList.remove('sorted');
			isSortedByName = false;
		}
		if (isSortedByValue) {
			btnSortByValue.innerText = 'Sort by Value';
			btnSortByValue.classList.remove('sorted');
			isSortedByValue = false;
		}
	}
});
