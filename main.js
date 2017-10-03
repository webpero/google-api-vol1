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
	
	// Sett fokus til input for bildesøk
		$("#tema").focus();
		
	// Hent posisjon og sett opp kart
	visKart();
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

/* Håndtering av søk og visning av bilder */
var bilder = [];
var bildeAktivt;
var bildeAntall;
function hentBilder( query )
{
	bilder.length = 0;
	bildeAktivt = 0;
	bildeAntall = 0;
	
	// Bruker Google Search API for å søke etter bilder på flickr (Google konto: kraftwerk68@gmail.com)
	$("#dispimg").attr( "src", "ajax_loader.gif" );
	$.ajax({
		url: 'https://www.googleapis.com/customsearch/v1',
		dataType: "jsonp",
		data: {	
			q: query,											// Søkestrengen
			cx: '018034702328520342012:y80oci2ue2i',			// CSE: webpero-peroma 
			key: 'AIzaSyAL58Of35Vjc2CeUAbSPXc1zd1ugUmYL4Q'		// Google API-key for github&heroku
		},
		success: function(response) {
			if ( response.error !== undefined ) {
				// HTTP-response er 200, men det har oppstått feil
				$("#dispimg").attr( "src", "something-went-wrong.jpg" );
				$("#title").text( "Error: "+response.error.errors[0].reason );	// Vis feilmelding
			}
			else if( response.searchInformation !== undefined && response.searchInformation.totalResults > 0 ) {
				// Minst ett treff, sjekk om bilder faktisk finnes før de legges inn i tabellen
				for ( var i = 0; i < 10; i++ ) {
					if ( response.items[i].pagemap.cse_image !== undefined ) {
						bilder[bildeAntall++] = response.items[i].pagemap;
					}
				}
				if ( bildeAntall > 0 ) {
					// Det finnes minst ett bilde, vis første bilde
					visBilde(0);
					// Aktiver klikk for kikkert (både checkbox og ledeteksten)
					$("#kikkert").on("click", function(){ 
						kikkertAktiv = !kikkertAktiv;
						$("#kikkertStatus").attr("checked", (kikkertAktiv ? "checked" : false) );
						initAnimasjon();
					});
					$("#kikkertStatus").on("click", function(){ 
						kikkertAktiv = !kikkertAktiv;
						initAnimasjon();
					});
					$("#kikkert, #kikkertStatus").show();
				} else {
					$("#dispimg").attr( "src", "no-results.gif" );
				}
			} 
			else {
				$("#dispimg").attr( "src", "no-results.gif" );
			}
		},
		error: function(resonse) {
			// HTTP-response er 4XX
			$("#dispimg").attr( "src", "something-went-wrong.jpg" );
			$("#title").text( "Error: "+(response.error !== undefined ? response.error.errors[0].reason : "Ukjent feil!") );
		}
	});
}
function visBilde( i )
{
	// Vis bilde nummer (i) av bilder som er hentet ned fra flickr
	if ( bilder[i] !== undefined )
	{
		// Vis bilde og utvalgte metadata: titel, beskrivelse, forfatter (med lenke) og tidspunkt for opplasting 
		$("#dispimg").attr( "src", bilder[i].cse_image[0].src );
		$("#title").text( bilder[i].metatags[0]["og:title"] );
		$("#descr").text( bilder[i].metatags[0]["og:description"] );
		$("#author").attr( "src", bilder[i].metatags[0]["flickr_photos:by"] );
		$("#author").text( bilder[i].metatags[0]["flickr_photos:by"] );
		$("#updated").text( bilder[i].metatags[0]["og:updated_time"] );	
		bildeAktivt = i;
		
		// Sett status på knapper for forrige/neste
		if ( bildeAktivt < bildeAntall-1 ) {
			$("#next").on( "click", function() {
				visBilde(i+1); 
				initAnimasjon();
			});
			$("#next").show();		
		} else {
			$("#next").hide();
		}
		if ( bildeAktivt > 0 ) {
			$("#prev").on( "click", function() {
				visBilde(i-1)
				initAnimasjon();
			});
			$("#prev").show();	
		} else {
			$("#prev").hide();
		}	
	}
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

/* Animasjon på canvas */
var kikkertAktiv = false;
var canvas = document.getElementById("animate");
var ctx = canvas.getContext("2d");
var maskCanvas = document.createElement('canvas');  //Maske til å invertere kikkerten
var maskCtx = maskCanvas.getContext('2d');

function clearCanvas(canvas)
{
	let ctx = canvas.getContext("2d");
	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.restore();	
}
function tegnKikkert(x,y)
{
	// Lag en maske og tegn kikkerten på denne med XOR-operator
	clearCanvas(maskCanvas);
	maskCanvas.width = canvas.width;
	maskCanvas.height = canvas.height;
	maskCtx.fillStyle = "rgba(200,200,200,0.9)"
	maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
	maskCtx.globalCompositeOperation = 'xor';
	maskCtx.beginPath();
	maskCtx.arc(x,y,200,0.7,Math.PI*2-0.7);
	maskCtx.arc(x+255,y,200,Math.PI+0.7,Math.PI-0.7);
	maskCtx.fill();

	// Fjern gammelt innhold og tegn på nytt fra masken
	clearCanvas(canvas);
	ctx.drawImage(maskCanvas, 0, 0);
}
function initAnimasjon()
{
	if ( kikkertAktiv ) {
		// Sett canvas til å overlappe aktivt bilde
		canvas.width = parseInt( $("#dispimg").css("width") );
		canvas.height = parseInt( $("#dispimg").css("height") );
		$("#animate").css("width", canvas.width );		// Må sette css-bredde lik canvas-bredde, eller blir proposjonene på canvas feil.
		$("#animate").css("height", canvas.height );	// Må sette css-høyde lik canvas-høyde, eller blir proposjonene på canvas feil.
		
		// Tegn opp kikkert og grå ut alt utenfor
		tegnKikkert(200,200);

		// Sett opp bevegelse
		$("#animate").on( "mousemove", function(e) {
			tegnKikkert( e.pageX - this.offsetLeft, e.pageY - this.offsetTop );
		});
		// Sett opp klikk på bildet
		$("#animate").on( "click", function(e) {
			$("#kikkert").trigger("click");
		});
	} else {
		// Fjern kikkert
		clearCanvas(canvas);
		// Skru av bevegelse
		$("#animate").off( "mousemove" );
		$("#animate").off( "click" );
	}
}
