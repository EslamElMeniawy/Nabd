/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-09-10 14:24:54
* @Last Modified by: eslam
* @Last Modified time: 2015-09-22 14:16:09
*
* Dear maintainer:
* When I wrote this, only God and I understood what I was doing
* Now, God only knows
* So, good luck maintaining the code :D
*/

var id = GetDataValue('id');
var connected;
var page = 0;
var temp = '<a class="tdn" href="details.html?id={{id}}"><div class="mdl-grid mdl-color--grey-300 stroke rtl nop category-item"><div class="mdl-cell grid-20 nom" style="background: url(http://188.40.75.156:8080/nabd/images/news/{{image}});background-size: cover;"></div><div class="mdl-cell grid-80"><h5 class="mdl-color-text--grey-800">{{title}}</h5></div></div></a>';
$('.mdl-mega-footer').width(($(window).width() - 20) + 'px');
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	$('.mdl-layout__drawer-button').html('<img class="material-icons" src="img/menu.png">');
	document.addEventListener("backbutton", onBackKeyDown, false);
	checkConnection();
	if (connected == 1) {
		$('#loading').show();
		loadData();
	} else {
		createSnackbar("لا يوجد اتصال بالانترنت", 'إغلاق');
		loadDataOffline();
	}
	$('#show-more').click(function() {
		checkConnection();
		if (connected == 1) {
			$('#loading').show();
			loadData();
		} else {
			createSnackbar("لا يوجد اتصال بالانترنت", 'إغلاق');
		}
	});
}
function onBackKeyDown() {
	window.location = "index.html";
}
function GetDataValue(VarSearch) {
	var SearchString = window.location.search.substring(1);
	var VariableArray = SearchString.split('&');
	for (var i = 0; i < VariableArray.length; i++) {
		var KeyValuePair = VariableArray[i].split('=');
		if (KeyValuePair[0] == VarSearch) {
			return KeyValuePair[1];
		}
	}
}
function checkConnection() {
	var networkState = navigator.connection.type;
	if (networkState == Connection.NONE || networkState == Connection.UNKNOWN) {
		connected = 0;
	} else {
		connected = 1;
	}
}
function loadData() {
	$.ajax({
		type : 'GET',
		url : 'http://188.40.75.156:8080/nabd/index.php/news?section=' + id + '&page=' + page,
		dataType : 'JSON'
	}).done(function(response) {
		if (page == 0) {
			window.localStorage.setItem('savedCategory' + id, JSON.stringify(response));
		}
		fillData(response);
		page ++;
		$('#loading').hide();
	}).fail(function() {
		$('#loading').hide();
		createSnackbar("حدث خطأ اثناء تحميل لاأخبار برجاء المحاولة مرة آخرى", 'إغلاق');
		if (page == 0) {
			loadDataOffline();
		}
	});
}
function loadDataOffline() {
	var data = window.localStorage.getItem('savedCategory' + id);
	if (!(typeof data === 'undefined' || data === null)) {
	    fillData(JSON.parse(data));
	}
}
function fillData(response) {
	for (var i = 0; i < response.length; i++) {
		$('#main-data').append(temp.replace(/{{id}}/g, response[i].id).replace(/{{title}}/g, response[i].title).replace(/{{image}}/g, response[i].image));
	}
	$('.grid-20').each(function() {
		$(this).width(((($(window).width() - 16) * 0.2) - 16) + 'px');
	});
	$('.grid-80').each(function() {
		$(this).width(((($(window).width() - 16) * 0.8) - 16) + 'px');
	});
}