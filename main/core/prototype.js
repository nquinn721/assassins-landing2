String.prototype.toUpper = function () {
	return this.substr(0,1).toUpperCase() + this.substr(1);
}