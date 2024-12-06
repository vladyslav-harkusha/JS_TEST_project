const appForm = document.querySelector('.app__form');
const formInput = document.getElementById('form__input');
const outputList = document.querySelector('.app__list');
const errorMessage = document.querySelector('.form__input-message');
const btnSortByName = document.querySelector('.button--sort-by-name');
const btnSortByValue = document.querySelector('.button--sort-by-value');
const btnDeleteAll = document.querySelector('.button--delete-all');

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
		// знаходимо індекс видаляємого елемента
		const foundIndex = pairsArray.findIndex(pair => pair === elem);
		// видаляємо елемент з масиву по знайденому індексу
		pairsArray.splice(foundIndex, 1);
		outputList.innerText = '';

		// якщо після видалення елемента масив не порожній - виводимо список
		if (pairsArray.length) {
			createPairItems(pairsArray);
		}
		// повертаємо кнопки сортування в початкове значення, якщо вони були активні
		if (isSortedByName) {
			changeSortButton(btnSortByName);
		}
		if (isSortedByValue) {
			changeSortButton(btnSortByValue);
		}
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


// Подія для видалення усіх елементів
btnDeleteAll.addEventListener('click', () => {
	// функція спрацьовує лише якщо список не порожній
	if (pairsArray.length) {
		outputList.innerText = '';
		pairsArray = [];

		// повертаємо кнопки сортування в початкове значення, якщо вони були активні
		if (isSortedByName) {
			changeSortButton(btnSortByName);
		}
		if (isSortedByValue) {
			changeSortButton(btnSortByValue);
		}
	}
});
