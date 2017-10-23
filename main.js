/* MAIN 
 * 23.10.2017 Per Olav Mariussen
 *
 *******************************/

/* Sett opp MVC for bildesøk - Versjon 2 */
var bildeModel = new bildeModel(),
	bildeView = new bildeView( $("#image-container") ),
	bildeController = new bildeController(bildeView, bildeModel);
	
 /* Oppstart av siden */
$(document).ready(function()
{
	
	// Sett opp årstidsbildet
	visAarstid();
	
	// Sett opp klokka
	$("#date").powerTimer({
		intervalAfter: 1000,
		func: function() {
			visDatoTid();
		}
	});
	
	// Hent posisjon og sett opp kart
	visKart();

	// Init av bildecontroller og input for bildesøk
	bildeController.initialize();
	$("#query-form").submit( function(ev) { 
		bildeController.bildeSok( $("#query").val() );
		ev.preventDefault();
	});
	$("#query").focus();
});

/* Håndtering av årstid, dato og klokkeslett */
function visAarstid()
{
	var dt = new Date();
	switch ( dt.getMonth() ) {
		case 11:
		case 0:
		case 1:
			$("#today").addClass("winter");
			break;
		case 2:
		case 3:
		case 4:
			$("#today").addClass("spring");
			break;
		case 5:
		case 6:
		case 7:
			$("#today").addClass("summer");
			break;
		case 8:
		case 9:
		case 10:
			$("#today").addClass("autumn");
			break;
	}
}
function visDatoTid()
{
	var dt = new Date();
	$("#day").text( ("0"+dt.getDate()).slice(-2) );
	$("#month").text( ("0"+(dt.getMonth()+1)).slice(-2) );
	$("#year").text( dt.getFullYear() );
	$("#hour").text( ("0"+dt.getHours()).slice(-2) );
	$("#min").text( ("0"+dt.getMinutes()).slice(-2) );
	$("#sek").text( ("0"+dt.getSeconds()).slice(-2) );
}

/* Vis kart med brukers posisjon */
function visKart()
{
	// Bruker Google Maps JavaSCript API for å vise kart og posisjon (Google konto: kraftwerk68@gmail.com)
	if ( navigator.geolocation ) {
		navigator.geolocation.getCurrentPosition(
			function(pos) {
				lat = pos.coords.latitude;
				lon = pos.coords.longitude;
				latlon = new google.maps.LatLng(lat,lon)
				var myOptions = {
				center:latlon,zoom:14,
				mapTypeId:google.maps.MapTypeId.ROADMAP,
				mapTypeControl:false,
				navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
				}
				var map = new google.maps.Map(document.getElementById("map"), myOptions);
				var marker = new google.maps.Marker({position:latlon,map:map,title:"Du er her!"});
		});
	}	
	else {
		$("#map").text("Geolokasjon ikke tilgjengelig...");
	}
}
