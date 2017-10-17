/* Håndtering av visning av bilder (View)
 * 16.10.2017 Per Olav Mariussen
 *
 *******************************/
 
var bildeView = function bildeView(element) {
	this.element = element;
	this.onClick = null;
};

/* Vis bilde med overskrift og info + hådtering av knapper for forrige/neste */
bildeView.prototype.render = function render(viewModel) {
	let prevBilde, nextBilde;
	if ( viewModel.navn !== undefined && viewModel.info !== undefined && viewModel.url !== undefined ) {
		$(this.element).html( 
			'<p>' +
			'<button id="prevBilde" href="javascript:void(0);" data-bilde-index="' + viewModel.previousIndex + '">Forrige</button> ' +
			'<button id="nextBilde" href="javascript:void(0);" data-bilde-index="' + viewModel.nextIndex + '">Neste</button>' +
			'</p>' +
			'<h3>' + viewModel.navn + '</h3>' +
			'<p>' + viewModel.info + '</p>' +
			'<p><img id="image" src="' + viewModel.url + '" alt="' + viewModel.navn + '" /></p>'
		);
		this.previousIndex = viewModel.previousIndex;
		this.nextIndex = viewModel.nextIndex;

		$('#prevBilde').click(this.onClick);
		$('#nextBilde').click(this.onClick);
		$('#nextBilde').focus();
	} else {
		$(this.element).html( '<img id="image" src="no-results.gif" />' );
	}
};

/* Vis indikator på at søk utføres/data hentes (vent) */
bildeView.prototype.loading = function loading() {
	$(this.element).html( '<img id="image" src="loading.gif" />' );
};