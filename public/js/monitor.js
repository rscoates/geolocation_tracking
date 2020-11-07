function init () {

  var map = null
  var marker = null
  var setlat = null

  var bbt = new BBT('MNolpo28Q3I1PbVpAozZxY8E', {
    auth_endpoint: '/auth'
  })

  bbt.subscribe({
    channel: 'AlexTracker',
    resource: 'alextracker',
    read: true,
    write: false
  }, function(msg) {
    console.log('received position: ', msg.data.latitude, msg.data.longitude)
    displayCarLocation(msg.data.latitude, msg.data.longitude)
  })

  function initializeMap (position) {
    var options = {
      zoom: 17,
      center: position,
      mapTypeId: google.maps.MapTypeId.PLAN
    }

    map = new google.maps.Map(document.getElementById('map'), options)
  }

  function httpGetAsync(theUrl, callback)
  {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
  }

  httpGetAsync('/lastlocation', (text) => {
    try {
      var [lat, long] = JSON.parse(text) || ['51.5070659', '-0.0986613']
    }
    catch(e){
      console.error(e)
      var [lat, long] = ['51.5070659', '-0.0986613']
    }
    initializeMap(new google.maps.LatLng(lat, long))
  })

  function displayCarLocation(lat, lng) {

    if (!map || !setlat) {
      setlat = true
      initializeMap(new google.maps.LatLng(lat, lng))
    }

    // if marker exists remove it
    if (marker) {
      marker.setMap(null)
    }
    // set the marker to the new position
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      icon: 'https://alex-christmas-tracker.herokuapp.com/byte.png',
      draggable: false,
      map: map
    })
  }
}
