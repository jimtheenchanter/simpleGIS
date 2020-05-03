'use strict';

var mymap = L.map('mapid').setView([52.345944, -7.321977], 16);
// create a base layer of map tiles
 L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', 
{
  attribution: '',
      maxZoom: 18,
  id: 'mapbox/streets-v11',
  accessToken: 'pk.eyJ1IjoiamltdGhlZW5jaGFudGVyIiwiYSI6ImNrNXhveWRhdTB5M3QzcW4zM2pmMHMxNnkifQ.ho-Px1mJyDlzc5JD9vgcFQ'
 }).addTo(mymap);