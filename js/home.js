var username = "";

$( document ).ready(function() {

    checkstatus();

    $('.owl-carousel').owlCarousel({
        loop:true,
        margin:5,
        stagePadding: 50,
        autoplay:true,
        autoplayTimeout:4000,
        autoplayHoverPause:true,
        nav:true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:3
            },
            1000:{
                items:5
            }
        }
    });
    $('.owl-carousel').on('mousewheel', '.owl-stage', function (e) {
        e.preventDefault();
        if (e.deltaY>0) {
            $('.owl-carousel').trigger('next.owl');
        } else {
            $('.owl-carousel').trigger('prev.owl');
        }
    });

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

    // Fetch latest items
    $.ajax({
        url: "server.php",
        type: "POST",
        data: {
            type: "fetchlatest"				
        },
        cache: false,
        success: function(dataResult){
            var dataReslt = JSON.parse(dataResult);
            $('.dyimg').each(function(i, obj) {
                $(this).attr('src','images/items/' + dataReslt[i].pic);
            });
            $('.dylink').each(function(i, obj) {
                $(this).attr('href','item.php?p=' + dataReslt[i].id);
            });
            $('.dytxt').each(function(i, obj) {
                $(`<a href="item.php?p=${dataReslt[i].id}" class="cardlink">${dataReslt[i].itemName}</a>`).appendTo($(this));
            });
            $('.dyprice').each(function(i, obj) {
                $(`<a href="item.php?p=${dataReslt[i].id}" class="cardlink">${dataReslt[i].price}Rs</a>`).appendTo($(this));
            });
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