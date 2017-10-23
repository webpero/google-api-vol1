/* Håndtering av bilder (Controller)
 *
 * v2: 	Henter bare resultater én gang og lager en tabell med resultater som inneholder et gyldig bilde	
 *		Visnig av et bilde forholder seg bare til allerede hentet resultattabell 
 *
 * 23.10.2017 Per Olav Mariussen
 *
 *******************************/

/* Definer bildeController */
var bildeController = function bildeController( bildeView, bildeModel ) {
	this.bildeView = bildeView;
	this.bildeModel = bildeModel;
};

/* Init av bildeController */
bildeController.prototype.initialize = function initialize() {
	this.bildeView.onClick = this.onClick.bind(this);
};

/* Utfør query som skal brukes til å vise bilder */
bildeController.prototype.bildeSok = function bildeSok(query) {
	this.bildeView.loading(); //Vis indikator på at noe skjer
	this.bildeModel.hentBilder( query, 10, this.visBilde.bind(this) );		// Utfør query og kall visning av første bilde
};

/* Sett opp klikkhåndtering for bilder (forrige/neste) */
bildeController.prototype.onClick = function onClick(e) {
	let bilder = bildeController.bildeModel.bilder;
	bilder.index = parseInt(e.currentTarget.dataset.bildeIndex, 10);	// Index til bilde som skal vises
	this.visBilde(bilder);												// Vis bildet
};

/* Visning av bilde (index til aktuelt bilde ligger i dataobjektet) */
bildeController.prototype.visBilde = function visBilde(bildeModelData) {
	let count = bildeModelData.count,
		index = bildeModelData.index,
		bildeViewModel = bildeModelData.content[index];

	/* Håndtering av index for forrige/neste */
	bildeViewModel.previousIndex = index - 1;
	bildeViewModel.nextIndex = index + 1;
	if (index === 0) {
		bildeViewModel.previousIndex = count - 1;
	}
	if (index === count - 1) {
		bildeViewModel.nextIndex = 0;
	}
	  
	/* Vis aktuelt bilde */
 	this.bildeView.render(bildeViewModel);
};