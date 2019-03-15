import {modal} from "./modal";


// //Функция создания метки

function createPlacemark(coords,place,address,desc,finalDate) {


    // var CustomLayoutClass = ymaps.templateLayoutFactory.createClass(
    //     '<div class="balloon_modal">'+
    //     `<div class="balloon_head">`+
    //     `<h3 class="balloon_place">${place}</h3>`+
    //     `</div>`+
    //     `<span class="balloon_address">${address}</span>`+
    //     `<span class="balloon_desc">${desc}</span>`+
    //     `<span class="balloon_finalDate">${finalDate}</span>`+
    // '</div>'
    // );

    var html  = '<div class="balloon_modal">';
    html+=      `<div class="balloon_head">`;
    html +=     `<h3 class="balloon_place">${place}</h3>`;
    html +=     `</div>`;
    html +=     `<a href="" class="balloon_address">${address}</a>`;
    html +=     `<p class="balloon_desc">${desc}</p>`;
    html +=     `<span class="balloon_finalDate">${finalDate}</span>`;
    html += '</div>';

    return new ymaps.Placemark(coords, {
        balloonContentBody : html
        //balloonContentLayout: CustomLayoutClass
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
export {createPlacemark}