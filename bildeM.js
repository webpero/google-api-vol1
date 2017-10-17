/* Håndtering av søk på bilder (Model)
 * 16.10.2017 Per Olav Mariussen
 *
 *******************************/

var bildeModel = function bildeModel() {
};

/* Utfør søk på Google med *query*, hent ut treff nr *index*, og kjør callback *fn* for behandling av data */
bildeModel.prototype.hentBilde = function hentBilde(query, index, fn) {
	$.ajax({
		url: 'https://www.googleapis.com/customsearch/v1',
		dataType: "jsonp",
		data: {	
			q: query,						// Søkestrengen
			cx: '018034702328520342012:y80oci2ue2i',		// CSE: webpero-peroma 
			key: 'AIzaSyAL58Of35Vjc2CeUAbSPXc1zd1ugUmYL4Q',		// Google API-key for github&heroku 
			/*key: 'AIzaSyCUb7lLbMRJkweAbcXiS3ejObHqnlDkKOQ',		// Google API-key for test	*/			
			num: 10
		},
		success: function(response) {
			if ( response.error !== undefined ) {
				// HTTP-response er 200, men det har oppstått feil
				console.log("Error: "+(response.error !== undefined ? response.error.errors[0].reason : "Ukjent feil!") );
			}
			else {
				let bilde = {};
				if( response.searchInformation !== undefined && response.searchInformation.totalResults > 0 && response.items[index] !== undefined ) {
					/* Tilordne riktige returdata (basert på ønsket indeks) fra søk til et bilde-objekt */
					bilde.navn = response.items[index].title;
					bilde.info = response.items[index].snippet;
					bilde.url = (response.items[index].pagemap !== undefined && response.items[index].pagemap.cse_image !== undefined ? response.items[index].pagemap.cse_image[0].src : "");
					bilde.index = index;
					bilde.count = response.items.length;
					
				}
				/* Kjør Callback function med bilde-objektet som data (tomt objekt hvis ingen resultater) */
				fn(bilde);  
			}
		},
		error: function(resonse) {
			// HTTP-response er 4XX
			console.log("Error: "+(response.error !== undefined ? response.error.errors[0].reason : "Ukjent feil!") );
		}
	});
};
