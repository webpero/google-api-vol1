/* Håndtering av søk på bilder (Model)
 *
 * v2: 	Henter bare resultater som faktisk inneholder et gyldig bilde
 *		Legger dataene i et objekt som sendes med til angitt callback-funksjon		
 *
 * 23.10.2017 Per Olav Mariussen
 *
 *******************************/
var bildeModel = function bildeModel() {
	this.bilder = {				
		count: 0,
		index: 0,
		content: []
	};
};

/* Utfør søk på Google CSE med *query*, hent ut intil *antall* teff, og kjør callback *fn* for behandling av dataene */
bildeModel.prototype.hentBilder = function hentBilder( query, antall, fn ) {
	bilder = this.bilder;
	$.ajax({
		url: 'https://www.googleapis.com/customsearch/v1',
		dataType: "jsonp",
		data: {	
			q: query,											// Søkestrengen
			cx: '018034702328520342012:y80oci2ue2i',			// CSE: webpero-peroma 
			key: 'AIzaSyAL58Of35Vjc2CeUAbSPXc1zd1ugUmYL4Q',		// Google API-key for github&heroku
			num: antall
		},
		success: function(response) {
			if ( response.error !== undefined ) {
				// HTTP-response er 200, men det har oppstått feil
				console.log("Error: "+(response.error !== undefined ? response.error.errors[0].reason : "Ukjent feil!") );
			}
			else {
				/* Temp-variable for aktuelt resultat og bilde (for mer effektiv gjennomløping) */
				let	res = {}, bilde = {};	
				/* Nullstill bilder-objektet */
				bilder.count = 0;
				bilder.index = 0;
				bilder.content.length = 0;
				
				if( response.searchInformation !== undefined && response.searchInformation.totalResults > 0 ) {
					/* Minst ett treff, gå igjennom resultatene og sjekk om nødvendige bildedata finnes før de legges inn i data-tabellen */
					for ( var i = 0; i < antall; i++ ) {
						if ( response.items[i] !== undefined ) {
							res = response.items[i];
							if ( res.pagemap !== undefined && res.pagemap.cse_image !== undefined  ) {
								/* Nødvendige data finnes i resultat-elementet (res), legg dette inn i et bilde-objekt (bilde) i bildetabellen (bilder)*/
								bilde = {};
								bilde.navn = res.title;
								bilde.info = res.snippet;
								bilde.url = res.pagemap.cse_image[0].src;
								bilder.content.push(bilde);
								bilder.count++;
							}
						}
					}
				}
				/* Kjør Callback function med bilde-objektet som data (tomt objekt hvis ingen resultater) */
				fn(bilder);  
			}
		},
		error: function(resonse) {
			// HTTP-response er 4XX
			console.log("Error: "+(response.error !== undefined ? response.error.errors[0].reason : "Ukjent feil!") );
		}
	});
};