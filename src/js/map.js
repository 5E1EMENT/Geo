// Дождёмся загрузки API и готовности DOM.
ymaps.ready(init);

let location = document.querySelector('.modal-header__location');
let addCommentBtn = document.querySelector('.modal-comment__btn');

//Данные о коментариях
let dataComments = {};

let dataMarks = {};
//Импортируем переменную modal,modalName,modalPlace,modalDesc
import {modal,modalName,modalPlace,modalDesc,modalCommentsWrapper,btnClose} from "./modal";

import {createPlacemark} from "./functions";

function init () {
    // Создание экземпляра карты и его привязка к контейнеру с
    // заданным id ("map").
    let myPlacemark;
    var myMap = new ymaps.Map('map', {
            // При инициализации карты обязательно нужно указать
            // её центр и коэффициент масштабирования.
            center: [52.9714,63.0880], // Рудный
            zoom: 14,
            controls: []
        }, {
            geoObjectOpenBalloonOnClick: false,
            searchControlProvider: 'yandex#search'
        });




    // Обработка события, возникающего при щелчке
    // левой кнопкой мыши в любой точке карты.
    myMap.events.add('click', function (e) {
        //Координаты клика на карте
        let coords = e.get('coords');
        let [coordX, coordY] = coords;

        const dataKeys = Object.keys(dataComments);

        console.log("Координаты клика",coords);
        //Установим дата атрибуты координат
        modal.dataset.coordX = coordX;
        modal.dataset.coordY = coordY;

//По клику на кластер не даем открыть модалку

        // По клику на карте открываем модалку
        if (!modal.classList.contains('modal-active')) {
            modal.classList.add('modal-active');
            //console.log(positionX,positionY);
        }

        //Перебираем все координаты
        for (let coord of dataKeys)  {

            //Если координаты клика по карте не совпадают, то обновляем тело модалки
            if(coord !== coords) {
                console.log("НЕТУ");
                modalCommentsWrapper.innerHTML = '<span class="modal-comments__comment-empty">Отзывов пока нет...</span>';
            }
        }

        //В шапку модалки запихиваем координаты
        ymaps.geocode(coords).then(function (res) {

            var markAdress = res.geoObjects.get(1).properties.get('text');
            location.innerHTML = markAdress;


        });


        //};
    });

    //Обработчик нажатия кнопки добавить
    addCommentBtn.addEventListener('click',(e) => {

        e.preventDefault();

        //Данные отзыва
        let x = modal.dataset.coordX ;
        let y = modal.dataset.coordY ;
        let coords = [x,y];
        console.log("Кооординаты", coords);
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

        //Если есть координаты, то пушим
        if(dataComments[coords]) {
            dataComments[coords].push(comment);
        } else { //Если нет, то создаем пустой массив и пушим
            dataComments[coords] = [];
            dataComments[coords].push(comment);
        }


        //Добавляем комментарий в массив данных

        // console.log("Координаты всех комментов",dataComments);

        //Через Handlebars выводим все данные из data
        const template = document.querySelector('#comments').textContent;
        const render = Handlebars.compile(template);
        const dataValues = Object.values(dataComments);
        const dataKeys = Object.keys(dataComments);

        console.log(dataKeys, dataValues);

        //Перебираем массив со значениями комментов по данным координатам
        for (let value of dataValues) {

            //Если значение равно значению по координатам в бд, то рендерим их
            if(value == dataComments[coords]) {
                const htmlComments = render(value);//Берем данные из массива
                modalCommentsWrapper.innerHTML = htmlComments;//Запихиваем в html
            }

        }

            //Значение координаты берем из объекта с данными
            let coordValue = dataComments[coords];
            console.log('Значение координаты', coordValue);
            console.log('Длина массива координаты', coordValue.length);

            //Если по этим координатам только одно значение, то создаем метку
          if(coordValue.length <=1) {
              myPlacemark = createPlacemark(coords,place,address,desc,finalDate);
              myMap.geoObjects.add(myPlacemark);
              clusterer.add(myPlacemark);
              myPlacemark.events
                  .add('mouseenter', function (e) {
                      // Ссылку на объект, вызвавший событие,
                      // можно получить из поля 'target'.
                      e.get('target').options.set('iconImageHref', '/assets/img/ActiveMark.png');
                  })
                  .add('mouseleave', function (e) {
                      e.get('target').options.set('iconImageHref', '/assets/img/Mark.png');
                  });

          }





        //очищаем поля
        modalName.value = '';
        modalPlace.value = '';
        modalDesc.value = '';

    });

    myMap.geoObjects.events.add("click", e => {

        //Через Handlebars выводим все данные из data
        const template = document.querySelector('#comments').textContent;
        const render = Handlebars.compile(template);

        //Координаты комментариев
        const dataKeys = Object.keys(dataComments);

        //Тело комментариев

        //Место клика
        let placeMarkCoords = e.get("target").geometry.getCoordinates();
       // placeMarkCoords;
        let [coordX, coordY] = placeMarkCoords;

         modal.dataset.coordX = coordX ;
         modal.dataset.coordY =  coordY;
        console.log(placeMarkCoords, coordX, coordY);
        //Перебираем все координаты комментов
        for (let comment of dataKeys) {


            //Открываем модалку
                if (!modal.classList.contains('modal-active')) {
                    modal.classList.add('modal-active');
                    modalName.value = '';
                    modalPlace.value = '';
                    modalDesc.value = '';
                    //console.log(positionX,positionY);
                }

             // Если в базе данных есть комменты по таким координатам
            if(comment == placeMarkCoords) {

                    const htmlComments = render(dataComments[comment]);//Берем данные из массива
                    modalCommentsWrapper.innerHTML = htmlComments;//Запихиваем в html

            }

        }



    });

// Создаем собственный макет с информацией о выбранном геообъекте.
    var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
        '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
        '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
        '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
    );


    var clusterer = new ymaps.Clusterer({
        preset: "islands#invertedBlackClusterIcons",
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        // Устанавливаем стандартный макет балуна кластера "Карусель".
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        // Устанавливаем собственный макет.
        clusterBalloonItemContentLayout: customItemContentLayout,
        // Устанавливаем режим открытия балуна.
        // В данном примере балун никогда не будет открываться в режиме панели.
        clusterBalloonPanelMaxMapArea: 0,
        // Устанавливаем размеры макета контента балуна (в пикселях).
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 150,
        // Устанавливаем максимальное количество элементов в нижней панели на одной странице
        clusterBalloonPagerSize: 5
        // Настройка внешнего вида нижней панели.
        // Режим marker рекомендуется использовать с небольшим количеством элементов.
        //clusterBalloonPagerType: 'marker'

    });



    myMap.geoObjects.add(clusterer);




}