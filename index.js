const appForm = document.querySelector('.app__form');
const formInput = document.getElementById('form__input');
const outputList = document.querySelector('.app__list');
const errorMessage = document.querySelector('.form__input-message');
const btnSortByName = document.querySelector('.button--sort-by-name');
const btnSortByValue = document.querySelector('.button--sort-by-value');
const btnDeleteAll = document.querySelector('.button--delete-all');


// Робимо контрольований інпут у формі, щоб користувач не зміг ввести недопустимі символи чи дані у невірному форматі
let controlledInputValue = '';

formInput.addEventListener('input', (event) => {
	errorMessage.style.display = 'none';

	let targVal = event.target.value;
	const currentSymbol = targVal[targVal.length - 1];
	const regularExp = new RegExp(/[a-zA-Z0-9=]/g);

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
const createPairItems = (arr) => arr.forEach(elem => {
	const pairItem = document.createElement('li');
	pairItem.innerText = elem;
	outputList.appendChild(pairItem);
});


//Івент сабміту форми і додавання значень інпуту в масив
let pairsArray = [];

appForm.addEventListener('submit', (event) => {
	event.preventDefault();

	if (formInput.value && formInput.value.split('=')[1]) {
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
	if (sortBy === 'name') {
		sortedPairs = [...pairsArr].sort((pair1, pair2) => pair1.split('=')[0].localeCompare(pair2.split('=')[0]));
	}
	if (sortBy === 'value') {
		sortedPairs = [...pairsArr].sort((pair1, pair2) => pair1.split('=')[1].localeCompare(pair2.split('=')[1]));
	}

	outputList.innerText = '';
	createPairItems(sortedPairs);
}


// Вішаємо події на кнопки сортування так, щоб вони працювали й у зворотному напрямку
let sortByNameToggle = false;
let sortByValueToggle = false;

btnSortByName.addEventListener('click', () => {
	if (pairsArray.length > 1) {
		if (sortByValueToggle) {
			sortByValueToggle = !sortByValueToggle;
			btnSortByValue.innerText = 'Sort by Value';
		}

		if (!sortByNameToggle) {
			sortPairs(pairsArray, 'name');
			btnSortByName.innerText = 'Sorted by Name';
			sortByNameToggle = !sortByNameToggle;
		} else {
			outputList.innerText = '';
			createPairItems(pairsArray);
			btnSortByName.innerText = 'Sort by Name';
			sortByNameToggle = !sortByNameToggle;
		}
	}
});

btnSortByValue.addEventListener('click', () => {
	if (pairsArray.length > 1) {
		if (sortByNameToggle) {
			sortByNameToggle = !sortByNameToggle;
			btnSortByName.innerText = 'Sort by Name';
		}

		if (!sortByValueToggle) {
			sortPairs(pairsArray, 'value');
			btnSortByValue.innerText = 'Sorted by Value';
			sortByValueToggle = !sortByValueToggle;
		} else {
			outputList.innerText = '';
			createPairItems(pairsArray);
			btnSortByValue.innerText = 'Sort by Value';
			sortByValueToggle = !sortByValueToggle;
		}
	}
});


// Подія для видалення усіх елементів
btnDeleteAll.addEventListener('click', () => {
	if (pairsArray.length) {
		outputList.innerText = '';
		pairsArray = [];
		btnSortByName.innerText = 'Sort by Name';
		btnSortByValue.innerText = 'Sort by Value';
	}
});


