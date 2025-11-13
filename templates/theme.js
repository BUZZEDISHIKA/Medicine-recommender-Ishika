document.getElementById('light-mode').addEventListener('click', function () {
    document.body.classList.remove('dark-mode', 'contrast-mode');
    document.body.classList.add('light-mode');
});

document.getElementById('dark-mode').addEventListener('click', function () {
    document.body.classList.remove('light-mode', 'contrast-mode');
    document.body.classList.add('dark-mode');
});

document.getElementById('contrast-mode').addEventListener('click', function () {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add('contrast-mode');
});
//  additional points for map
document.addEventListener('DOMContentLoaded', () => {
  let map;
  let userLocation = null;
  let markers = [];

  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: { lat: 20.5937, lng: 78.9629 } // Default: India
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        map.setCenter(userLocation);
        new google.maps.Marker({
          position: userLocation,
          map: map,
          title: "You are here",
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          }
        });
      });
    }
  }

  function searchDoctors() {
    if (!userLocation) {
      alert("Please allow location access.");
      return;
    }

    const specialty = document.getElementById("specialty").value;
    const radius = document.getElementById("radius").value * 1000;
    document.getElementById("radiusValue").textContent = `${radius / 1000} km`;

    const service = new google.maps.places.PlacesService(map);
    const request = {
      location: userLocation,
      radius: radius,
      type: ["doctor"],
      keyword: specialty
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        displayDoctors(results);
        addMarkers(results);
      } else {
        alert("No doctors found nearby.");
      }
    });
  }

  function addMarkers(doctors) {
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    doctors.forEach(doctor => {
      const marker = new google.maps.Marker({
        position: doctor.geometry.location,
        map: map,
        title: doctor.name
      });

      const infowindow = new google.maps.InfoWindow({
        content: `<strong>${doctor.name}</strong><br>${doctor.vicinity || "Address not available"}`
      });

      marker.addListener("click", () => infowindow.open(map, marker));
      markers.push(marker);
    });
  }

  function displayDoctors(doctors) {
    const list = document.getElementById("doctorsList");
    list.innerHTML = "";
    doctors.forEach(doctor => {
      list.innerHTML += `
        <div class="card p-3 mb-2">
          <h5>${doctor.name}</h5>
          <p>${doctor.vicinity || "No address info"}</p>
          <p>Rating: ${doctor.rating || "N/A"}</p>
        </div>
      `;
    });
  }

  document.getElementById("findDoctorsBtn").addEventListener("click", () => {
    if (!map) initMap();
    searchDoctors();
  });

  initMap();
});
