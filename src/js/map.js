
// Дождёмся загрузки API и готовности DOM.
ymaps.ready(init);

let location = document.querySelector('.modal-header__location');
let addCommentBtn = document.querySelector('.modal-comment__btn');

//Данные о коментариях
let dataComments = {};

let dataMarks = [];
//Импортируем переменную modal,modalName,modalPlace,modalDesc
import {modal,modalName,modalPlace,modalDesc,modalCommentsWrapper,validate} from "./modal";


function init () {
    // Создание экземпляра карты и его привязка к контейнеру с
    // заданным id ("map").
    let myPlacemark;
    var myMap = new ymaps.Map('map', {
        // При инициализации карты обязательно нужно указать
        // её центр и коэффициент масштабирования.
        center: [52.9714,63.0880], // Рудный
        zoom: 14
    }, {
        searchControlProvider: 'yandex#search'
    }), //КАК СДЕЛАТЬ КЛАСТЕРИЗАЦИЮ??!!!!!!!!!!!!!!!!!!!!!!
        objectManager = new ymaps.ObjectManager({
            // Чтобы метки начали кластеризоваться, выставляем опцию.
            clusterize: true,
            // ObjectManager принимает те же опции, что и кластеризатор.
            gridSize: 32,
            clusterDisableClickZoom: true
    });
    objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    myMap.geoObjects.add(objectManager);
    objectManager.add(dataMarks);




    // Обработка события, возникающего при щелчке
    // левой кнопкой мыши в любой точке карты.
    myMap.events.add('click', function (e) {
        //Координаты клика на карте
        let coords = e.get('coords');
        let [coordX, coordY] = coords;



        console.log(coords);
        //Установим дата атрибуты координат
        modal.dataset.coordX = coordX;
        modal.dataset.coordY = coordY;

        // По клику на карте открываем модалку
        if (!modal.classList.contains('modal-active')) {
            modal.classList.add('modal-active');
            //console.log(positionX,positionY);
        }

        //В шапку модалки запихиваем координаты
        ymaps.geocode(coords).then(function (res) {

            var markAdress = res.geoObjects.get(1).properties.get('text');
            location.innerHTML = markAdress;


        });

        //Обработчик нажатия кнопки добавить
    addCommentBtn.addEventListener('click',(e) => {
//Множественные клики??
            e.preventDefault();



            //Данные отзыва
            let x = modal.dataset.coordX ;
            let y = modal.dataset.coordY ;
            let name = modalName.value;
            let place = modalPlace.value;
            let desc = modalDesc.value;
            let address = location.textContent;
            var date = new Date();
            var dateOptions = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            };
            let finalDate = date.toLocaleString("ru", dateOptions);

            // Объект отзыва
            var comment = {
                    "address": address,
                    "name": name,
                    "place": place,
                    "text": desc,
                    "date": finalDate
            };

            if(dataComments[coords]) {
                dataComments[coords].push(comment);
            } else {
                dataComments[coords] = [];
                dataComments[coords].push(comment);
            }

            //Валидация
            //if(validate(modalName,modalPlace,modalDesc)) {
                //Добавляем комментарий в массив данных
                // dataComments.push(comment);
                console.log(1);
                console.log(dataComments);

                //Через Handlebars выводим все данные из data
                const template = document.querySelector('#comments').textContent;
                const render = Handlebars.compile(template);
                const htmlComments = render(Object.keys(dataComments));//Берем данные из массива

                modalCommentsWrapper.innerHTML = htmlComments;//Запихиваем в html

                //Добавляем координаты метки в массив
                var mark = {
                    "coords":[x,y]
                }
                dataMarks.push(mark);
                //console.log(dataMarks);


                //Создаем метку
                myPlacemark = createPlacemark(coords);
                myMap.geoObjects.add(myPlacemark);
                myPlacemark.events
                    .add('mouseenter', function (e) {
                        // Ссылку на объект, вызвавший событие,
                        // можно получить из поля 'target'.
                        e.get('target').options.set('iconImageHref', '/assets/img/ActiveMark.png');
                    })
                    .add('mouseleave', function (e) {
                        e.get('target').options.set('iconImageHref', '/assets/img/Mark.png');
                    });


            //};

        modalName.value = '';
        modalPlace.value = '';
        modalDesc.value = '';
        });

    //Как сделать клик по метке!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //Функция клика по метке
        // myPlacemark.events.add('click', function (e) {
        //     // По клику на карте открываем модалку
        //     if (!modal.classList.contains('modal-active')) {
        //         modal.classList.add('modal-active');
        //         //console.log(positionX,positionY);
        //     }
        // })


        //Функция создания метки
        function createPlacemark(coords) {
            return new ymaps.Placemark(coords, {
                iconCaption: 'поиск...',

            }, {
                preset: 'islands#violetDotIconWithCaption',
                draggable: false,
                iconLayout: 'default#image',
                // Своё изображение иконки метки.
                iconImageHref: '/assets/img/Mark.png',
                // Размеры метки.
                iconImageSize: [44, 66],
                // Смещение левого верхнего угла иконки относительно
                // её "ножки" (точки привязки).
                iconImageOffset: [-25, -70]
            });
        }




    });


}

