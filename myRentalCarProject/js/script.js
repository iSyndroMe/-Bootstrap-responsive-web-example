//'use strict'; 
//var ERROR = 'ERROR';

/********************************
       Modernizer Test.....
*********************************/
/*
if (!Modernizr.canvas) {
    $('#myCanvas').html('sorry no local storage suport on your browser :(');
}

if (!Modernizr.geolocation) {
    alert("sorry no geolocation suport on your browser :(");
}

if (!Modernizr.localStorage) {
    alert("sorry no local storage suport on your browser :(");
}
*/
/********************************
   Geolocation Google maps API
*********************************/

var directionDisplay, map, marker;
var directionsService = new google.maps.DirectionsService();
var geocoder = new google.maps.Geocoder();

function initialize() {
    // set the default center of the map to our main office center at malibu LA
    var latlng = new google.maps.LatLng(34.025922, -118.779757);
    var rendererOptions = { draggable: true };

    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

    var myOptions = {
        zoom: 14,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false
    };

    // add the map to the map placeholder
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    marker = new google.maps.Marker({ position: latlng, map: map, title: "Our Main Office" });
    //add info window with content to the marker that will fired on click
    var infoWindowOpts = {
        content: '27860 Winding Way, California , Malibu 90265, USA'
    };
    var infoWindow = new google.maps.InfoWindow(infoWindowOpts);
    //click event to show our content that we load inside 'infoWindow'
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open(map, marker);
    });
    // bind the map to the directions
    directionsDisplay.setMap(map);

    directionsDisplay.setPanel(document.getElementById("directionsPanel"));

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(foundYou, notFound);
    } else {
        alert('Geolocation not supported or not enabled.');
    }
}
function notFound(msg) {
    alert('Could not find your location :(')
}
function foundYou(position) {

    var clientPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var myOptions = {
        zoom: 14,
        center: clientPosition,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false
    };

    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    directionsDisplay.setMap(map);

    geocoder.geocode({ 'latLng': clientPosition }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                marker = new google.maps.Marker({
                    position: clientPosition,
                    map: map,
                    title: "You are here!"
                });
                // compose a string with the address parts
                var address = results[0].address_components[1].long_name + ' ' + results[0].address_components[0].long_name + ', ' + results[0].address_components[3].long_name
                // set the located address to the link, show the link and add a click event handler
                $('.autoLink span').html(address).parent().show(50).click(function () {
                    $('#routeStart').val(address)
                    $(this).hide(50);
                    $('#routeEnd').foucs(); //wtf nothing is working here!!!?!!?!?!?!??! cant fix the slide bug on click :(
                });
            }
        } else {
            alert("Geocoder failed to: " + status);
        }
    });
}

function calcRoute() {
    // get the travelmode, startpoint and via point from the form   
    var start = $("#routeStart").val();
    var end = $("#routeEnd").val();
    // compose a array with options for the directions/route request
    var request = {
        origin: start,
        destination: end,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    // call the directions API
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            //calculte the route distance
            var routeDistance = response.routes[0].legs[0].distance.value;
            routeDistance /= 1000;

            var audioElement = document.createElement('audio');
            audioElement.setAttribute('src', 'audio/22 - L-O-V-E.mp3');
            audioElement.play();

            setTimeout(function () {
                //display price & route distance
                $('#showPrice').show(50);
                $('#calcPriceResult').html('Drive=' + routeDistance + 'km  ' + 'Price=' + calcPrice(routeDistance) + '$');
                // directions returned by the API, clear the directions panel before adding new directions and shows thw new one
                $('.showDirectionsPanel').click(function () {
                    $('#directionsPanel').empty().show(50);
                    // display the direction details in the container
                    directionsDisplay.setDirections(response);
                })
                //on new calculation we enable the order and reject button
                $('#btnOrder , #btnRejectOrder').prop('disabled', false);
                audioElement.pause();
            }, 25000);

        } else {

            // alert an error message when the route could not be calculated.
            if (status == 'ZERO_RESULTS') {
                alert('No route could be found between the origin and destination.');
            } else if (status == 'UNKNOWN_ERROR') {
                alert('A directions request could not be processed due to a server error. The request may succeed if you try again.');
            } else if (status == 'REQUEST_DENIED') {
                alert('This webpage is not allowed to use the directions service.');
            } else if (status == 'OVER_QUERY_LIMIT') {
                alert('The webpage has gone over the requests limit in too short a period of time.');
            } else if (status == 'NOT_FOUND') {
                alert('At least one of the origin, destination, or waypoints could not be geocoded.');
            } else if (status == 'INVALID_REQUEST') {
                alert('The DirectionsRequest provided was invalid.');
            } else {
                alert("There was an unknown error in your request, this means you are going to die" + status);
            }
        }
    });
}

//calc price function
function calcPrice(km) {
    var price;
    var underNinetyKM = 1.2;
    var overNinetyKM = 0.9;

    return km <= 90 ? price = ~~(km * underNinetyKM) : price = ~~((90 * underNinetyKM) + ((km - 90) * overNinetyKM));
}

//prototypical format function to make format available
String.prototype.format = String.prototype.f = function () {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};


function storeIntoLCS() {
    //loop on eace elemet that have class 'save'
    $('.save').each(function () {
        //if the element has some value save it in localsoage
        if (localStorage[$(this).attr('id')]) {
            $(this).val(localStorage[$(this).attr('id')]);
        }
    });
    //save user input every time its change
    $('.save').keyup(function () {
        localStorage[$(this).attr('id')] = $(this).val();
    });
}

//form validation yeah well i test only name and email with regex but you get the point
function validateForm() {
    //regx no spcaiel cahrs min-3 max-20
    var reg_name = /^[A-Za-z0-9_]{3,20}$/;
    //regx to normal email address
    var reg_email = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

    var name = $('#inputName').val();
    var email = $('#inputEmail').val();
    var phone = $('#inputPhone').val();
    var mobile = $('#inputMobile').val();
    var errors = [];

    //if both the phone and the mobile are empty alert msg to user and prevent form submit
    if (phone == "" && mobile == "") {
        errors[errors.length] = "Enter at least one of the Phone numbers";
    }
    //test the name input with regx we made before
    if (!reg_name.test(name)) {
        errors[errors.length] = "No special characters min 3 and max 20 characters. ";

    }
    //test the email input with regx we made before
    if (!reg_email.test(email)) {
        errors[errors.length] = "You must enter a valid email address.";

    }
    if (errors.length > 0) {

        reportErrors(errors);
        return false;
    }
    return true;

}

//alert to the usr if failed in one of our checks
function reportErrors(errors) {
    var msg = "Please Enter Valide Data...\n";
    for (var i = 0; i < errors.length; i++) {
        var numError = i + 1;
        msg += "\n" + numError + ". " + errors[i];
    }
    alert(msg);
}

//clear localstorage func
function lcStorageClear() {
    localStorage.clear();
}


function carSlider() {
    //selcet the first img index 0 its the gt() selctor and hide it
    $('.fadein img:gt(0)').hide();
    //run setinterval that will work like a loop through all of our imgs hide and show the next one with fadein() fadeout() effect
    setInterval(function () {
        $('.fadein :first-child').fadeOut()
           .next('img').fadeIn()
           .end().appendTo('.fadein');
    }, 3000);
}

/*
$(function () {
    $("#regForm").on("input", function (e) {
        var keyValue = e.target.value;
        var key = e.target.id;
        localStorage[key] = keyValue;
    });

    var elm = $("#regForm")[0].elements;

    for (var i = 0; i < elm.length; i++) {
        var elm_id = elm[i].id;

        if (localStorage[elm_id]) {
            $("#" + elm_id).val(localStorage[elm_id]);
        }

    }
    
});
*/



function getAvailableCars() {
    $("#ddAvailableCars").empty();
    $.ajax({
        url: "Services.asmx/GetAvailableCars",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.d) {
                var option = '<option value="{0}" > {1} </option>';

                $.each(result.d, function (index, car) {
                    // console.dir(index + ": " + car);
                    $("#ddAvailableCars").append(option.format(car.LicensePlateNumber, "{0} {1} {2} {3}".format(car.Model, car.Color, car.Year, car.Gear)));
                });
            }
        },
        error: function (xhr, status) {
            alert("An error occurred: " + status);
        }
    });
}

function drawSmiley() {
    var canvas = document.getElementById('myCanvas');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        var circle = 2 * Math.PI;
        //draw the face
        ctx.beginPath();
        ctx.arc(100, 50, 20, 0.0, circle, true);
        var grd = ctx.createLinearGradient(40, 40, 50, 75);
        grd.addColorStop(0, '#F9FF00');
        grd.addColorStop(1, '#E0C000');
        ctx.fillStyle = grd;
        ctx.fill();
        //draw the left eye
        ctx.beginPath();
        ctx.arc(94, 45, 4, 0.0, circle, true);
        ctx.fillStyle = "#000000";
        ctx.fill();
        //draw the right eye
        ctx.beginPath();
        ctx.arc(106, 45, 4, 0.0, circle, true);
        ctx.fillStyle = "#000000";
        ctx.fill();
        //draw the mouth
        ctx.beginPath();
        ctx.arc(100, 62, 10, 0.0, Math.PI, true);
        ctx.stroke();
    }
}


//get and display cuurent year in the main footer
function showYear() {
    var currentYear = new Date().getFullYear();
    $('#showYear').html('Ariel Evso &copy;' + currentYear);
}

function loadingIndi() {
    //loading indicators
    var buttons = document.querySelectorAll('.ladda-button');

    Array.prototype.slice.call(buttons).forEach(function (button) {

        var resetTimeout;

        button.addEventListener('click', function () {

            if (typeof button.getAttribute('data-loading') === 'string') {
                button.removeAttribute('data-loading');

            }
            else {
                button.setAttribute('data-loading', '');
                button.setAttribute('disabled', true);
            }
            clearTimeout(resetTimeout);
            resetTimeout = setTimeout(function () {
                button.removeAttribute('data-loading');
                button.removeAttribute('disabled');
            }, 25000);

        }, false);

    });
}

//check and return bool true if if there is value of [user = ture] in our local storage 
function ifClient() { 
    return localStorage.getItem("user") == 'true' ? true : false;
}

$(document).ready(function () {

    

    storeIntoLCS();

    $('#send').click(function () {
        localStorage.setItem("user", "true");
    });

    if (!(ifClient())) {
        $("#btnCalc , a:contains('Check Price')").hover(function (e) {
            e.stopPropagation();
            alert("Yo buddy you have to register first");
            $(this).prop('disabled', true);
        });
    } else {
        //enable the calc button
        $(this).prop('disabled', false);
        //select ul that contains class 'hide me' and show it(the user account list)
        $('ul[class*="hide-me"]').show();
        //get user name from local storage and show it wtih hello + user name and some icons
        var user = localStorage.getItem("inputName");
        $('#accountShow').html("Hello " + '<span class="glyphicon glyphicon-user">' + user + '</span><strong class="caret"></strong>');
        
    }



    $("#regForm").submit(validateForm);

    //slide our carousel main slider on top of the page
    $(function () {
        $('.carousel').carousel({ interval: 5000 });
    });

    //change nvaigtion bar active class on click 
    $('.nav li a').click(function () {
        $('.nav li').removeClass('active');
        $(this).parent().addClass('active');
    });
    //refresh our car list every 10 sec
    setInterval(getAvailableCars(), 10000);
    //button send ajax request to webService to change value of car available to "flase" and delete it from drop down list
    $("#btnOrder").click(function () {
        //hide show price anchor
        $('#showPrice').hide();
        $.ajax({
            url: "Services.asmx/RentACar ",
            type: "POST",
            data: '{license: "' + $("#ddAvailableCars").val() + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result.d) {

                    //var li = "<li>{1}</li>";

                    //first we show our anchor
                    $('#ordCarData').show();
                    //then we put some text inside our other anchor //note: separate the show and html inner to prevent wrong value show
                    $('#carNumVal').html("You have confirmed order for car number: " + '\n' + $("#ddAvailableCars").val());


                    var lic = $("#ddAvailableCars").val();
                    $("#ddAvailableCars option[value='" + lic + "']").remove();
                } else {
                    alert('Sorry we run out of cars');
                    $('#btnCalc').prop('disabled', true);
                };
            },
            error: function (xhr, status) {
                alert("An error occurred: " + status);
            }
        });
    });

    //button send ajax request to webService to change value of car available to "true" and add it to drop down list
    $("#btnReturnCar").click(function () {
        $.ajax({
            url: "Services.asmx/ReturnACar ",
            type: "POST",
            data: '{license: "' + $("#carNum").val().replace(/-/g, "") + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result.d) {
                    getAvailableCars();
                    $('#btnCalc').prop('disabled', false);
                    alert("Thank you hope see you again: " + '\n' + "You have returnd car number:" + $("#carNum").val());
                } else { alert('Car number invalid Or already available') };
            },
            error: function (xhr, status) {
                alert("An error occurred: " + status);
            }
        });
    });

    $('#btnRejectOrder').click(function () {
        //on new calculation we enable the order button
        $(this).prop('disabled', true);
        //show msg if user reject the offer
        $('#calcPriceResult').html('Man you are cheap!' + '\n' + 'Maybe try other destination?');
        //disable the order button
        $('#btnOrder').prop('disabled', true);
        //call our sad smeily and show it inside canvas object
        $('#myCanvas').show(drawSmiley());

    });

    $('#btnCalc').click(function () {
        //hide some content from user every new calc
        $('#myCanvas , #showPrice , #ordCarData , #directionsPanel').hide();
        //call our route calculation fucntion
        calcRoute();
        return false;
    });

    //simple clear local storage when user sign out and hide the anchor accout
    $('#signOut').click(function () {
        lcStorageClear();
        $('ul[class*="hide-me"]').hide();
    });

    //simple create our owen page show/init event becuuse i cant rally use it here 
    //select all the links that target location section and add to geolocation check box attr of checekd
    $('a[href*=location]').click(function (e) {
        $('#cbGeoLocation').prop('checked', true);
        //didn't really understand why i need to call my map here too, the next change event of checkbox should trigger and activate the map
        initialize(); 
    });
    //we lisen to geolocation check box to call our map if its checked and do nothing if its not
    $("#cbGeoLocation").change(function (e) {
        that = $(this);
        if (that.is(':checked')) {
            initialize();
        }
    });
   

   
    //load some function we make on the scope
    carSlider();
    loadingIndi();
    showYear();

});
