const STAMP_STORAGE_KEY="collectedStamps";
const STAMP_REWARD_KEY="stampRewardsAwarded";
const STAMP_POINT=50;
const COMPLETE_BONUS=200;
const spots=window.COLLECTION_SPOTS||[];

function readJson(key,fallback){
  try{return JSON.parse(localStorage.getItem(key))??fallback}catch(error){return fallback}
}

function distanceMeters(lat1,lng1,lat2,lng2){
  const R=6371000;
  const rad=value=>value*Math.PI/180;
  const dLat=rad(lat2-lat1),dLng=rad(lng2-lng1);
  const a=Math.sin(dLat/2)**2+Math.cos(rad(lat1))*Math.cos(rad(lat2))*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function getStamps(){
  const value=readJson(STAMP_STORAGE_KEY,{});
  if(Array.isArray(value))return Object.fromEntries(value.map(id=>[id,{date:null}]));
  return value&&typeof value==="object"?value:{};
}

function addPoints(amount){
  const current=Number(localStorage.getItem("totalScore"))||0;
  localStorage.setItem("totalScore",String(current+amount));
}

function awardStamp(spot){
  const stamps=getStamps();
  if(stamps[spot.id])return false;
  stamps[spot.id]={date:new Date().toISOString()};
  localStorage.setItem(STAMP_STORAGE_KEY,JSON.stringify(stamps));
  addPoints(STAMP_POINT);

  if(Object.keys(stamps).length>=spots.length&&!localStorage.getItem(STAMP_REWARD_KEY)){
    localStorage.setItem(STAMP_REWARD_KEY,new Date().toISOString());
    addPoints(COMPLETE_BONUS);
  }
  return true;
}

function formatDate(value){
  if(!value)return "獲得済み";
  const date=new Date(value);
  return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} 獲得`;
}

function render(){
  const stamps=getStamps();
  const count=spots.filter(spot=>stamps[spot.id]).length;
  document.getElementById("totalScore").textContent=`${(Number(localStorage.getItem("totalScore"))||0).toLocaleString()} pt`;
  document.getElementById("stampCount").textContent=`${count} / ${spots.length}`;
  document.getElementById("progressBar").style.width=`${spots.length?count/spots.length*100:0}%`;
  document.getElementById("progressText").textContent=count===spots.length?"コンプリート！":`あと${spots.length-count}個`;
  document.getElementById("completeMessage").hidden=count!==spots.length;
  document.getElementById("stampGrid").innerHTML=spots.map((spot,index)=>{
    const stamp=stamps[spot.id];
    return `<article class="stamp-card${stamp?" collected":""}">
      <div class="stamp-mark">${stamp?"済":"?"}</div>
      <h2>${stamp?spot.name:`スタンプ ${index+1}`}</h2>
      <p>${stamp?spot.category:"現地へ行くと名前が分かります"}</p>
      ${stamp?`<span class="date">${formatDate(stamp.date)}</span>`:""}
    </article>`;
  }).join("");
}

function updateLocation(position){
  const lat=position.coords.latitude,lng=position.coords.longitude;
  let nearest=null,nearestDistance=Infinity,newSpot=null;
  spots.forEach(spot=>{
    const distance=distanceMeters(lat,lng,spot.lat,spot.lng);
    if(distance<nearestDistance){nearest=spot;nearestDistance=distance}
    if(distance<=spot.radius&&awardStamp(spot))newSpot=spot;
  });
  render();
  const status=document.getElementById("status");
  status.classList.remove("error");
  status.textContent=newSpot
    ?`🎉 ${newSpot.name}のスタンプを獲得！ +${STAMP_POINT}ポイント`
    :nearest?`最寄り：${nearest.name}（約${Math.round(nearestDistance)}m）`:`現在地を確認しました。`;
}

function locationError(error){
  const status=document.getElementById("status");
  status.classList.add("error");
  status.textContent=`位置情報を取得できません：${error.message}`;
}

render();
if(navigator.geolocation){
  navigator.geolocation.watchPosition(updateLocation,locationError,{enableHighAccuracy:true,maximumAge:5000,timeout:15000});
}else{
  locationError({message:"この端末は位置情報に対応していません"});
}
