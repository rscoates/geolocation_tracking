function init() {
  var map = null
  var marker = null
  var setlat = null

  var lastLat = null
  var lastLng = null

  var bbt = new BBT('MNolpo28Q3I1PbVpAozZxY8E', {
    auth_endpoint: '/auth'
  })

  bbt.read(
    {
      owner: 'rscoates',
      channel: 'AlexTracker',
      resource: 'alextracker'
    },
    function(err, msg) {
      var { latitude, longitude } = JSON.parse(msg[0].data)
      console.log('received position: ', latitude, longitude)
      displayCarLocation(latitude, longitude)
    }
  )

  bbt.subscribe(
    {
      channel: 'AlexTracker',
      resource: 'alextracker',
      read: true,
      write: false
    },
    function(msg) {
      console.log('received position: ', msg.data.latitude, msg.data.longitude)
      displayCarLocation(msg.data.latitude, msg.data.longitude)
    }
  )

  function round(num, dps) {
    const divisor = 10 ** dps

    Math.round((num + Number.EPSILON) * divisor) / divisor
  }

  function initializeMap(position) {
    var options = {
      zoom: 17,
      center: position,
      mapTypeId: google.maps.MapTypeId.PLAN
    }

    map = new google.maps.Map(document.getElementById('map'), options)
  }

  function displayCarLocation(lat, lng) {
    var roundedLat = round(lat)
    var roundedLng = round(lng)

    if (lastLat == roundedLat && lastLng == roundedLng) {
      return
    }

    lastLat = roundedLat
    lastLng = roundedLng

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
      icon: 'https://alex-christmas-tracker.herokuapp.com/goodbyte.svg',
      draggable: false,
      map: map
    })
    map.setCenter({ lat, lng })
  }
}
