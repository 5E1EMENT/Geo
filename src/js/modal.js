//Модалка
let modalCommentsWrapper = document.querySelector('.modal-comments__wrapper');
let modalName = document.querySelector('.modal-comment__name');
let modalPlace = document.querySelector('.modal-comment__place');
let modalDesc = document.querySelector('.modal-comment__desc');
let modal = document.querySelector('.modal');
let btnClose = document.querySelector('.modal-header__close');


btnClose.addEventListener('click', () => {
    modal.classList.remove('modal-active');

    clearFields();

    modalCommentsWrapper.innerHTML = '<span class="modal-comments__comment-empty">Отзывов пока нет...</span>';
});

//Объект с координатами позиции курсора
var MouseCoords = {

    // X-координата
    getX: function(e)
    {
        if (e.pageX)
        {
            return e.pageX;
        }
        else if (e.clientX)
        {
            return e.clientX+(document.documentElement.scrollLeft || document.body.scrollLeft) - document.documentElement.clientLeft;
        }

        return 0;
    },

    // Y-координата
    getY: function(e)
    {
        if (e.pageY)
        {
            return e.pageY;
        }
        else if (e.clientY)
        {
            return e.clientY+(document.documentElement.scrollTop || document.body.scrollTop) - document.documentElement.clientTop;
        }

        return 0;
    }
}

//Позиционирование модального окна
window.onclick = function (e) {

    //Будем открывать новую модалку только если таргет это яндекс карты

        if(e.target.tagName == 'YMAPS'  ) {
            let positionX = MouseCoords.getX(e);
            let positionY = MouseCoords.getY(e);

            modal.style.left = positionX + "px";
            modal.style.top = positionY + "px";
        }


}

//Функция прослушки drag
window.onload = addListeners();

//Начальные координаты
var x_pos = 0,
    y_pos = 0;


function addListeners(){
    modal.addEventListener('mousedown', function() {
        modal.classList.add('draggable');
    });
    modal.addEventListener('mousedown', mouseDown, false);

    modal.addEventListener('mouseup', function() {

        modal.classList.remove('draggable');
    });
    window.addEventListener('mouseup', mouseUp, false);

}
function mouseUp() {
    window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e) {

    //Разница между координатами мыши и координатами модаки
    x_pos = e.clientX - modal.offsetLeft;
    y_pos = e.clientY - modal.offsetTop;
    window.addEventListener('mousemove', divMove, true);
}

function divMove(e) {

    //Будем двигать только если курсор находится в хедере модалки
if(e.target.classList.contains('modal-header')
  || e.target.classList.contains('modal-header__location')) {

    modal.style.top = (e.clientY - y_pos) + 'px';
    modal.style.left = (e.clientX - x_pos) + 'px';
}

}

//Валидация
function validate() {

   let name =  modalName.value.trim();
   let place = modalPlace.value.trim();
   let desc = modalDesc.value.trim();

   //Если есть пустные значения и цифры в тех полях, где их не должно быть
    if(name == '' || place == '' || desc == '' || name.match(/\d+/g) || place.match(/\d+/g)) {

        //Если имя пустое или содержит цифры
        if(name == '' ) {
            console.log(1);
            modalName.style.borderColor = 'red';
        } else if(name.match(/\d+/g)) {
            modalName.value = '';
            modalName.style.borderColor = 'red';
            modalName.placeholder = 'Введите правильное значение имени';
        } else {
            modalName.style.borderColor = '#f0f0f0';
        }


        //Если место пустое или содержит цифры
        if(place == '') {
            modalPlace.style.borderColor = 'red';

        } else if(place.match(/\d+/g)) {
            modalPlace.value = '';
            modalPlace.style.borderColor = 'red';
            modalPlace.placeholder = 'Введите правильное значение места';
        } else {
            modalPlace.style.borderColor = '#f0f0f0';
        };

        //Если описание пустое
        if(desc == '') {
            modalDesc.style.borderColor = 'red';
        } else {
            modalDesc.style.borderColor = '#f0f0f0';
        }

        return false;
    } else {

        return true;
    }
}

//Функция очищения полей
function clearFields() {
    modalName.value = '';
    modalPlace.value = '';
    modalDesc.value = '';

    modalName.placeholder = 'Ваше имя';
    modalPlace.placeholder = 'Укажите место';
    modalDesc.placeholder = 'Поделитесь впечатлениями';

    modalName.style.borderColor = '#f0f0f0';
    modalPlace.style.borderColor = '#f0f0f0';
    modalDesc.style.borderColor = '#f0f0f0';
}


document.addEventListener('click', function (e) {
    // let target = e.target;
    //
    // if (target.tagName === 'A') {
    //     let coords = target.dataset.coords;
    //     console.log(coords);
    //
    // }
})

export {modal,modalName,modalPlace,modalDesc ,modalCommentsWrapper, validate, clearFields};