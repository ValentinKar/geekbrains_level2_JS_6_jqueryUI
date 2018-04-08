/**
 * 2) В форму обратной связи добавить возможность выбора города обращения. 
 * Сам список должен загружаться после загрузки страницы через AJAX.
 */
// запрашиваем AJAX адрес сервера(файл JSON)
const questionUrl = './cities.json';
// массив для названий городов
var cities = [];

//AJAX
$.ajax({
    type: 'GET',
    url: questionUrl,
    async: false, //Запрос синхронный
    dataType: 'json', //Для авто преобразования
    success: function (data) {
        // массив с названиями городов
        cities = data.cities;
    },
    error: function (data) {
        console.log('Error', data);
    }
});

// после того, как загрузился документ
$(document).ready(function () {
// html тег select с классом city
let select = $('.city ');
    // для каждого элемента из массива с городами
    cities.forEach(function(sity) {
        // список внутри тега select (<option></option>)
        let option = document.createElement('option');
        // название города внутри option
        $(option).text(sity);
        // размещение <option>sity</option> внутри select
        $(option).appendTo(select);
    })
});

/**
 * 3. Создать форму обратной связи с полями: Имя, Телефон, 
 * e-mail, текст, кнопка «Отправить».
 * 
 * ** - При нажатии на кнопку «Отправить» произвести валидацию полей 
 * следующим образом:
 * 
 * - Имя содержит только буквы;
 * 
 * ** - Телефон подчиняется шаблону +7(000)000-0000;**
 * 
 * ** - E-mail выглядит как mymail@mail.ru, или my.mail@mail.ru, 
 * или my-mail@mail.ru**
 * 
 * ** - Текст произвольный;**
 * ** - В случае не прохождения валидации одним из полей необходимо 
 * выделять это поле красной рамкой и сообщать пользователю об ошибке.**
 * --------------------------------------------------------------------
 * Функция возвращает элемент из html по его id.
 * @param {string} id - идентификатор тега.
 * @returns {object} Возвращается html-элемент.
 */
function getElementFromHtml(id) {
    return document.getElementById(id);
}

/**
 * Функция проверяет значение тега на соотв. регулярному выражению.
 * @param {string} idElement - Тэг, значение которого проверяем на соответствие рег.выраж.
 * @param {regExp} regularExpression - Регулярное выражение.
 * @returns {boolean} Результат проверки на соответствие регулярному выражению.
 */
function regularExpressionsCheckInput(idElement, regularExpression) {
    const element = getElementFromHtml(idElement).value;
    return regularExpression.test(element);
};

/**
 * Функция изменяет цвет рамки тега, содержание которого не соотв. рег.выр.
 * @param {string} idElement - Id тега, рамку которого изменяем.
 * @param {string} error - Текст выводимой ошибки.
 */
function changeBorderColor(idElement, error) {
    const element = getElementFromHtml(idElement);
    element.classList.add('border-red');
    getElementFromHtml('error-message').textContent += error;
};

/**
 * Функция поэлементной валидации.
 * @param {array} array - Массив содержащий булевые элементы false или true.
 * @returns {boolean} valid - Вернет false, если хотя-бы один эл-т массива true.
 */
function validationFields(array) {
    var valid = true;
    array.forEach(function(invalid) {
        if (invalid) { 
            valid = false; 
        };
    })
    return valid;
};

/**
 * Функция выводит alert и перезагружает страницу.
 * @param {boolean} condition - Условие, при котором выполнится ф-ция.
 */
function reload(condition) {
    if (condition) { 
        alert('Congrat! Data upload successeful...');
        document.location.reload(true);
    }
};

/**
 * Класс для валидации полей формы.
 * @property {array} fields Массив, содержащий массивы с данными
 * полей формы.
 */
function validationFieldsOfForm(fields) {
    this.arrayFields = fields;
};

/**
 * Метод валидации полей формы.
 */
validationFieldsOfForm.prototype.checkArray = function () {
    // массив валидации, определяет, выполнится метод успешно или нет
    var arrayOfInvalidation = [];
    // счетчик массива валидации
    var i = 0;

    // проверка на валидность каждого поля формы
    this.arrayFields.forEach(function(fieldOfForm) {
        if (regularExpressionsCheckInput(fieldOfForm[0], fieldOfForm[1])) { 
            arrayOfInvalidation[i] = false;
        } else {
            changeBorderColor(fieldOfForm[0], fieldOfForm[2]);
            arrayOfInvalidation[i] = true;
        }
        ++i;
    })

    // булевая переменная которая определяет успешность метода
    var validation = validationFields(arrayOfInvalidation);
    reload(validation);
};

var button = document.getElementById('btn-snt');
button.addEventListener('click', function() {
    // исходный массив с данными полей формы [id, регулярн.выраж., сообщ.об ошибке]
    const arrayFields = [
        [
            'name', 
            /^[a-z]{1,100}$/i, 
            'Correct please: the field with a name must contain only letters!'
        ],
        [
            'phone', 
            /^\+7\(\d{3}\)\d{3}-\d{4}$/, 
            'Incorrect phone number. Fix it please!'
        ],
        [
            'e-mail', 
            /^[\w-.]+@[\w-]+\.[a-z]{1,25}$/i, 
            'Incorrect e-mail. Fix it please!'
        ],
        [
            'text', 
            /\d*\s*\w*/ig, 
            'Incorrect message!'
        ]
    ];
    var validationForm = new validationFieldsOfForm(arrayFields);
    validationForm.checkArray();
});