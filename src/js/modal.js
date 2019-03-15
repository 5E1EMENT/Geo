//Модалка
let modalCommentsWrapper = document.querySelector('.modal-comments__wrapper');
let modalName = document.querySelector('.modal-comment__name');
let modalPlace = document.querySelector('.modal-comment__place');
let modalDesc = document.querySelector('.modal-comment__desc');
let modal = document.querySelector('.modal');
let btnClose = document.querySelector('.modal-header__close');


btnClose.addEventListener('click', () => {
    modal.classList.remove('modal-active');
    modalName.value = '';
    modalPlace.value = '';
    modalDesc.value = '';
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

//Проверка на отправку данных


export {modal,modalName,modalPlace,modalDesc ,modalCommentsWrapper, btnClose};