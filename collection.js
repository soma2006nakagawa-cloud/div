const grid=document.getElementById("collectionGrid");
const progressCount=document.getElementById("progressCount");
const progressBar=document.getElementById("progressBar");
const locationStatus=document.getElementById("locationStatus");
const spots=window.COLLECTION_SPOTS||[];

function escapeHtml(value){
  return String(value).replace(/[&<>"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[char]);
}

function renderCollection(){
  const unlocked=new Set(window.CollectionTracker.getUnlocked());
  progressCount.textContent=`${unlocked.size} / ${spots.length}`;
  progressBar.style.width=`${spots.length?unlocked.size/spots.length*100:0}%`;

  grid.innerHTML=spots.map((spot,index)=>{
    if(!unlocked.has(spot.id)){
      return `<article class="collection-card locked">
        <div class="number">No.${String(index+1).padStart(2,"0")}</div>
        <div class="lock-icon">🔒</div>
        <h2>？？？？？</h2>
        <p>このスポットの100m以内で解放</p>
      </article>`;
    }

    const photo=spot.photo
      ?`<img class="spot-photo" src="${escapeHtml(spot.photo)}" alt="${escapeHtml(spot.name)}の写真">`
      :`<div class="photo-placeholder">写真準備中</div>`;

    return `<article class="collection-card unlocked">
      <div class="card-heading">
        <div><span class="number">No.${String(index+1).padStart(2,"0")}</span><span class="category">${escapeHtml(spot.category)}</span></div>
        <span class="unlocked-label">解放済み</span>
      </div>
      <h2>${escapeHtml(spot.name)}</h2>
      <model-viewer src="${escapeHtml(spot.model)}" alt="${escapeHtml(spot.name)}の3Dモデル" camera-controls auto-rotate shadow-intensity="1" loading="lazy"></model-viewer>
      ${photo}
      <p class="description">${escapeHtml(spot.description)}</p>
    </article>`;
  }).join("");
}

window.addEventListener("collection-unlocked",event=>{
  const names=event.detail.spots.map(spot=>spot.name).join("、");
  locationStatus.textContent=`「${names}」を図鑑に登録しました！`;
  locationStatus.className="success";
  renderCollection();
});

window.addEventListener("collection-location",()=>{
  if(!locationStatus.classList.contains("success"))locationStatus.textContent="現在地を確認中。スポットの100m以内で解放されます。";
});

window.addEventListener("collection-location-error",()=>{
  locationStatus.textContent="位置情報を許可すると、近くのスポットを解放できます。";
});

renderCollection();
