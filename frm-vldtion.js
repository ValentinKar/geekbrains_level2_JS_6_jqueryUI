/**
 * 2) В форму обратной связи добавить возможность выбора города обращения. 
 * Сам список должен загружаться после загрузки страницы через AJAX.
 */
// запрашиваем AJAX адрес сервера(файл JSON)
const questionUrl = './cities.json';
// массив для названий городов
var cities = [];
// диалоговое окно с ошибками
var $dialog = $( "#dialog" );
// календарь
var $datepicker = $('#birthday');
// форма для комментариев
var $form = $('#form');


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
// $(document).ready(function () {
$(document).on('ready', function() {
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
        // календарь
        $datepicker.datepicker({
            dateFormat: "dd.mm.yy",
            dayNamesMin: [ "ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ" ],
            firstDay: 1
        });

    // диалоговое окно с ошибками
    $dialog.hide();

        // карусель
        $(".center").slick({
            dots: true,
            infinite: true,
            centerMode: true,
            slidesToShow: 3,
            slidesToScroll: 2
        });
});


/**
 * Класс для валидации полей формы.
 * 
 * @property {array} fields Массив, содержащий массивы с данными
 * полей формы.
 */
function validationFieldsOfForm(fields) {
    // массив содержащий имена тегов, регулярные выражения и тексты ошибок
    this.arrayFields = fields;
    // массив заполняемый id тегами, которые не прошли проверку 
    // на соответствие регулянрому выражению
    this.arrayOfFailFields = [];
    // массив, содержащий ошибоки, выводимые на экран после проверки
    this.arrayOfErrors = [];
};

/**
 * Метод возвращает элемент из html по его id.
 * 
 * @param {string} id - идентификатор тега.
 * @returns {object} Возвращается html-элемент.
 */
validationFieldsOfForm.prototype.getElementFromHtml = function (id) {
    return document.getElementById(id);
}

/**
 * Метод проверяет значение тега на соотв. регулярному выражению.
 * 
 * @param {string} idElement - Тэг, значение которого проверяем на соответствие рег.выраж.
 * @param {regExp} regularExpression - Регулярное выражение.
 * @returns {boolean} Результат проверки на соответствие регулярному выражению.
 */
validationFieldsOfForm.prototype.regularExpressionsCheckInput = function (
    idElement, regularExpression) {
        const element = this.getElementFromHtml(idElement).value;
        return regularExpression.test(element);
};

/**
 * Метод показывает ошибки, выделяет тега с ошибками с помощью эффекта 
 * bounce и изменяет цвет их рамки тега
 * 
 * @param {string} idElement - Id тега, рамку которого изменяем.
 * @param {string} error - Текст выводимой ошибки.
 */
validationFieldsOfForm.prototype.showErrors = function () {

        // удаляем класс border-red из тегов
        $('.border-red').removeClass('border-red');

    for(let idElement of this.arrayOfFailFields) {
        // выделение неправильных полей красной рамкой и эффектом тряски
        $( `#${idElement}` ).addClass( 'border-red' );
        $( `#${idElement}` ).effect( "bounce", "slow" );
    }
        // очистка диалогового окна
        $dialog.empty();
            // заполнение диалога текстом ошибок
            $dialog.append(this.arrayOfErrors.join('<br>') + '</p>');
            // показать диалог
            $dialog.show();
        // эффекты диалога
        $dialog.dialog({
          show: { effect: "fade", duration: 500 }
        });
};

/**
 * Метод выводит alert и перезагружает страницу.
 * 
 * @param {boolean} condition - Условие, при котором выполнится ф-ция.
 */
validationFieldsOfForm.prototype.reload = function (condition) {
    if (condition) { 
        alert('Congrat! Data upload successeful...');
        document.location.reload(true);
    } else {
        this.showErrors(); 
    }
};

/**
 * Метод поэлементной валидации.
 * 
 * @param {array} array - Массив содержащий булевые элементы false или true.
 * @returns {boolean} valid - Вернет false, если хотя-бы один эл-т массива true.
 */
validationFieldsOfForm.prototype.validationFields = function (array) {
    var valid = true;
    array.forEach(function(invalid) {
        if (invalid) { 
            valid = false;
        };
    })
    return valid;
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
    for(let fieldOfForm of this.arrayFields) { 
        if (this.regularExpressionsCheckInput(fieldOfForm[0], fieldOfForm[1])) { 
            // заполнение массива валидации
            arrayOfInvalidation[i] = false;
        } else {
            // заполнение массива id тегами, не прошедшими проверку
            this.arrayOfFailFields.push(fieldOfForm[0]);
            // заполнение массива текстами ошибок для отображения в диалоге
            this.arrayOfErrors.push(fieldOfForm[2]);
            // заполнение массива валидации
            arrayOfInvalidation[i] = true;
        }
        ++i;
    }

    // булевая переменная которая определяет успешность метода
    var validation = this.validationFields(arrayOfInvalidation);
    this.reload(validation);
};

$('#btn-snt').on('click', function() {
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
        ],
        [
            'birthday', 
            /^[\d.]+$/, 
            'Please, enter your birthday!'
        ]
    ];
    var validationForm = new validationFieldsOfForm(arrayFields);
    validationForm.checkArray();
});