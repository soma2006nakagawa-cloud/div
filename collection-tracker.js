(function(){
  const STORAGE_KEY="unlockedCollection";
  const spots=window.COLLECTION_SPOTS||[];

  function distanceMeters(lat1,lng1,lat2,lng2){
    const R=6371000;
    const rad=value=>value*Math.PI/180;
    const dLat=rad(lat2-lat1);
    const dLng=rad(lng2-lng1);
    const a=Math.sin(dLat/2)**2+Math.cos(rad(lat1))*Math.cos(rad(lat2))*Math.sin(dLng/2)**2;
    return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  }

  function getUnlocked(){
    try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||[]}
    catch(error){return []}
  }

  function unlockAt(latitude,longitude){
    const unlocked=new Set(getUnlocked());
    const newlyUnlocked=[];
    spots.forEach(spot=>{
      if(!unlocked.has(spot.id)&&distanceMeters(latitude,longitude,spot.lat,spot.lng)<=spot.radius){
        unlocked.add(spot.id);
        newlyUnlocked.push(spot);
      }
    });
    if(newlyUnlocked.length){
      localStorage.setItem(STORAGE_KEY,JSON.stringify([...unlocked]));
      window.dispatchEvent(new CustomEvent("collection-unlocked",{detail:{spots:newlyUnlocked}}));
    }
    window.dispatchEvent(new CustomEvent("collection-location",{detail:{latitude,longitude}}));
    return newlyUnlocked;
  }

  window.CollectionTracker={getUnlocked,unlockAt,distanceMeters};

  if(navigator.geolocation&&spots.length){
    navigator.geolocation.watchPosition(
      position=>unlockAt(position.coords.latitude,position.coords.longitude),
      ()=>window.dispatchEvent(new Event("collection-location-error")),
      {enableHighAccuracy:true,maximumAge:5000,timeout:15000}
    );
  }
})();
