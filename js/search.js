var username = "";

$( document ).ready(function() {
    
    checkstatus();

    $(window).scroll(function(){
        if($(this).scrollTop() > 250){
            $('.myBtn').fadeIn();
        }else{
            $('.myBtn').fadeOut();
        }
    });
    $('.myBtn').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });

    $('#loginBtn').click(function(){
        if($('#loginBtn').text() == "Logout"){
            document.getElementById('loginBtn').disabled = true;
            $('#loginBtn').text(`Logging out...`);
            $.ajax({
                url: "server.php",
                type: "POST",
                data: {
                    type: "logout"
                },
                cache: false,
                success: function(dataResult){
                    console.log(dataResult);
                    var dataResult = JSON.parse(dataResult);
                    if(dataResult.statusCode==200){
                        document.getElementById('loginBtn').disabled = false;
                        $('#loginBtn').text(`Login`);
                        $('#dropdownMenuButton').text("Account")
                        $('#profBtn').hide()
                        $('#cartBtn').text(` Cart (0)`);
                        $(`<i class="fa fa-shopping-cart"></i>`).prependTo($('#cartBtn'));
                        username = "";
                        $.alert({
                            title: 'Success!',
                            content: 'Logged out!',
                            type: 'green',
                            typeAnimated: true,
                            autoClose: 'ok|3000',
                            buttons: {
                                ok: function () {
                                },
                            },
                            animation: 'scale',
                            closeAnimation: 'zoom',
                            backgroundDismiss: true,
                            draggable: false,
                            theme: 'material'
                        });
                    }
                },
                error: function(dataResult){
                    console.log(dataResult);
                    document.getElementById('loginBtn').disabled = false;
                    $('#loginBtn').text(`Logout`);
                    var dataResult = JSON.parse(dataResult);
                    $.alert({
                        title: 'Error!',
                        icon: 'fa fa-warning',
                        content: 'Failed to log out! Please try again!',
                        type: 'red',
                        typeAnimated: true,
                        animation: 'scale',
                        closeAnimation: 'zoom',
                        backgroundDismiss: true,
                        draggable: false,
                        theme: 'material'
                    });
                }
            });
        } else {
            sessionStorage.setItem("redirectTo",window.location.href);
            $(window).attr('location','login.php');
        }
    });

    $('#regBtn').click(function(){
            $(window).attr('location','register.php');
    });
    $('#profBtn').click(function(){
        $(window).attr('location','profile.php');
    });
    $('#cartBtn').click(function(){
        $(window).attr('location','cart.php');
    });

    // get results
    var query = $(document).getUrlParam("q");
    $('#formSpan').val(query);
    query = query.replace("+"," ");
    $.ajax({
        url: "server.php",
        type: "POST",
        data: {
            type: "search",
            query: query
        },
        cache: false,
        success: function(dataResult){
            console.log(dataResult);
            var dataReslt = JSON.parse(dataResult);
            var count = 0;
            for (let index = 0; index < Math.ceil(dataReslt.length/3); index++) {
                var mRow = $(`<div class="row around-xs"></div>`).appendTo($('.mHead'));
                for (let index = 0; index < 3; index++) {
                    if(count == dataReslt.length){
                        break;
                    }
                    var card = $(`<div class="card" id="card${dataReslt[count].id}"></div>`).appendTo($(mRow));
                    var ahref = $('<a href="#" class="dylink"></a>').appendTo(card);
                    var img = $('<img class="card-img-top dyimg lazy" data-src="">').appendTo(ahref);
                    var cardbody = $('<div class="card-body"></div>').appendTo(card);
                    var cardtitle1 = $('<h6 class="card-title dytxt"></h6>').appendTo(cardbody);
                    var cardtitle2 = $('<h5 class="card-title text-left dyprice"></h5>').appendTo(cardbody);
                    img.attr('data-src', 'images/items/' + dataReslt[count].pic);
                    ahref.attr('href', 'item.php?p=' + dataReslt[count].id);
                    $(`<a href="item.php?p=${dataReslt[count].id}" class="cardlink">${dataReslt[count].itemName}</a>`).appendTo(cardtitle1);
                    $(`<a href="item.php?p=${dataReslt[count].id}" class="cardlink">${dataReslt[count].price}Rs</a>`).appendTo(cardtitle2);
                    count+=1;
                }
            }
            $('.lazy').Lazy();
        }
    });
});

function checkstatus(){
    // Check logged in
    $.ajax({
        url: "server.php",
        type: "POST",
        data: {
            type: "statuscheck"				
        },
        cache: false,
        success: function(dataResult){
            console.log(dataResult);
            var dataResult = JSON.parse(dataResult);
            if(dataResult.statusCode==200){
                $('#loginBtn').text("Logout");
                username = dataResult.username;
                $('#dropdownMenuButton').text(username)
                $('#profBtn').show()
                cartnum()
            }
            else if(dataResult.statusCode==201){
                $('#loginBtn').text("Login")
                $('#dropdownMenuButton').text("Account")
                $('#profBtn').hide()
                $('#cartBtn').text(` Cart (0)`);
                $(`<i class="fa fa-shopping-cart"></i>`).prependTo($('#cartBtn'));
            }
        }
    });
}

function cartnum(){
    $.ajax({
        url: "server.php",
        type: "POST",
        data: {
            type: "cartnum",
            username: username
        },
        cache: false,
        success: function(dataResult){
            var dataResult = JSON.parse(dataResult);
            console.log(dataResult);
            cartval = parseInt(dataResult);
            $('#cartBtn').text(` Cart (${dataResult})`);
            $(`<i class="fa fa-shopping-cart"></i>`).prependTo($('#cartBtn'));
        }
    });
}