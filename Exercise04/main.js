// get a first map into the HTML-document
var map = L.map('map').setView([51.975, 7.61], 13);

var osmLayer = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'});