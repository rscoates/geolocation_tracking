function init () {

  var map = null
  var marker = null
  var setlat = null

  var bbt = new BBT('MNolpo28Q3I1PbVpAozZxY8E', {
    auth_endpoint: '/auth'
  })

  bbt.read({
    channel: 'AlexTracker',
    resource: 'alextracker',
  }, function(msg) {
    console.log('received historic position: ', msg.data.latitude, msg.data.longitude)
    displayCarLocation(msg.data.latitude, msg.data.longitude)
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
