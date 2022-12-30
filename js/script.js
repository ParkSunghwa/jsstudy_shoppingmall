$(document).ready(function () {


    // JSON 데이터의 파일들 불러오기
    function productCall(data, sectionName, serialNumber, purpose) {
        var template = `<div class="product_${purpose} col-2 p-1 bg-body-tertiary" draggable="true">
    <div class="box_image">
        <img class="img-fluid" src="/image/${data.photo}" alt="" draggable='false'>
    </div>
    <span class="text_title fs-5">${data.title}</span>
    <p class="text_brand text-secondary">${data.brand}</p>
    <p class="text_price">가격 : ${data.price}원</p>
    <button id="temp" class="button_${purpose} btn btn-secondary" data-id="${serialNumber}">${purpose}</button>
</div>`
        $(`.${sectionName}`).append(template);
    }

    $.get("./json/store.json").done(function (data) {
        // console.log(data);
        data.products.forEach(function (a, i) {
            productCall(a, 'section_product', i, 'get');
        });
    }).fail(function () {
        console.log('No Reply form JSON file');
    });

    // 검색기능
    $('.form_search').on('submit', function (e) {
        $('.section_product').html('');
        var searchWord = $('.input_search').val();
        $.get('./json/store.json').done(function (data) {
            data.products.forEach(function (a, t) {
                if (a.title.includes(searchWord)) {
                    productCall(a, 'section_product', a.id, 'get');
                } else if (a.brand.includes(searchWord)) {
                    productCall(a, 'section_product', a.id, 'get');
                }

            });
        });

        e.preventDefault();
    });





    // 장바구니 및 최종 가격 선정
    // ajax로 얻어와서html에 추가한 태그들의 경우, document ready 직후 감지할 수가 없으므로 이벤트가 작동하지 않는다. 따라서, document에서 태그를 찾아가야 한다.
    // $('.button_get').click(function (e) {

    // });
    var productGetCount = 0;
    var totalPrice = 0;
    $(document).on("click", ".button_get", function (e) {

        var productId = e.target.dataset.id;
        // console.log(productId);
        $.get("./json/store.json").done(function (data) {
            $('.text_draginfo').css('display', 'none');
            $('.section_drag').css('height', 'auto');
            $('.section_drag').removeClass('align-items-center');
            productCall(data.products[productId], "section_drag", data.products[productId].id, 'delete');

            totalPrice = totalPrice + data.products[productId].price;
            $('.text_totalprice').html(`${totalPrice}원`);

            productGetCount++;

            if (productGetCount == 1) {
                $('.button_deleteall').removeClass('d-none');
            }

        }).fail(function () {
            console.log('No Reply form JSON file');
            alert('Error occurred. Try again');
        });


    });
    $(document).on('click', '.button_delete', function (e) {

        $(this).parent().detach();
        $.get("./json/store.json").done(function (data) {
            totalPrice = totalPrice - data.products[e.target.dataset.id].price;
            $('.text_totalprice').html(`${totalPrice}원`);
        });

        productGetCount--;

        if (productGetCount == 0) {
            $('.text_draginfo').css('display', 'inline');
            $('.section_drag').css('height', '300px');
            $('.section_drag').addClass('align-items-center');
            $('.button_deleteall').addClass('d-none');
        }

    });

    $(document).on('click', '.button_deleteall', function (e) {

        $('.section_drag > .product_delete').detach();
        $('.text_draginfo').css('display', 'inline');
        $('.section_drag').css('height', '300px');
        $('.section_drag').addClass('align-items-center');
        $('.button_deleteall').addClass('d-none');

        productGetCount = 0;
        totalPrice = 0;
        $('.text_totalprice').html(`${totalPrice}원`);


    });

    var productIdDrag;
    $(document).on('dragstart', '.product_get', function (e) {
        productIdDrag = $(e.target).children('button').data('id');
        // console.log(productIdTemp);
    });

    $('.section_drag').on({
        'dragover': function (e) {
            e.preventDefault();
            
        },
        'drop': function (e) {
            e.preventDefault();
            $.get("./json/store.json").done(function (data) {
                $('.text_draginfo').css('display', 'none');
                $('.section_drag').css('height', 'auto');
                $('.section_drag').removeClass('align-items-center');
                productCall(data.products[productIdDrag], "section_drag", data.products[productIdDrag].id, 'delete');
    
                totalPrice = totalPrice + data.products[productIdDrag].price;
                $('.text_totalprice').html(`${totalPrice}원`);
    
                productGetCount++;
    
                if (productGetCount == 1) {
                    $('.button_deleteall').removeClass('d-none');
                }
    
            }).fail(function () {
                console.log('No Reply form JSON file');
                alert('Error occurred. Try again');
            });
        }
    });

    $(document).on('dragend', '.product_delete', function (e) {
        $(this).detach();
        $.get("./json/store.json").done(function (data) {
            totalPrice = totalPrice - data.products[$(e.target).children('button').data('id')].price;
            $('.text_totalprice').html(`${totalPrice}원`);
        });

        productGetCount--;

        if (productGetCount == 0) {
            $('.text_draginfo').css('display', 'inline');
            $('.section_drag').css('height', '300px');
            $('.section_drag').addClass('align-items-center');
            $('.button_deleteall').addClass('d-none');
        }
    });
    // $(document).on('drop', '.section_drag', function(e){
    //     console.log(productIdTemp);
    // });













});