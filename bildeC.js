/* Håndtering av bilder (Controller)
 * 16.10.2017 Per Olav Mariussen
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

/* Sett query som skal brukes til å hente bilder */
bildeController.prototype.setQuery = function setQuery(query) {
	this.query = query;
};

/* Sett opp klikkhåndtering for bilder (forrige/neste) */
bildeController.prototype.onClick = function onClick(e) {
	let target = e.currentTarget,
		index = parseInt(target.dataset.bildeIndex, 10);

	this.bildeView.loading(); //Vis indikator på at noe skjer
	this.bildeModel.hentBilde(this.query, index, this.visBilde.bind(this));
};

/* Visning av bilde */
bildeController.prototype.visBilde = function visBilde(bildeModelData) {
  let bildeViewModel = {
    navn: bildeModelData.navn,
    url: bildeModelData.url,
    info: bildeModelData.info
  };

  /* Håndtering av index */
  bildeViewModel.previousIndex = bildeModelData.index - 1;
  bildeViewModel.nextIndex = bildeModelData.index + 1;
  if (bildeModelData.index === 0) {
    bildeViewModel.previousIndex = bildeModelData.count - 1;
  }
  if (bildeModelData.index === bildeModelData.count - 1) {
    bildeViewModel.nextIndex = 0;
  }
  
  /* Vis bildet */
  this.bildeView.render(bildeViewModel);
};