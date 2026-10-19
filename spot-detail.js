const detailRoot=document.getElementById("spotDetail");
const params=new URLSearchParams(location.search);
const spotId=params.get("id");
const spot=(window.COLLECTION_SPOTS||[]).find(item=>item.id===spotId);

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
}

function render(){
  if(!spot){
    detailRoot.innerHTML=`<section class="detail-error"><h2>スポットが見つかりません</h2><p>図鑑からもう一度スポットを選んでください。</p><div class="detail-actions"><a class="book-action" href="collection.html">図鑑へ戻る <span>›</span></a></div></section>`;
    return;
  }

  document.title=`${spot.name} | しばコレ`;
  const unlocked=new Set(window.CollectionTracker.getUnlocked()).has(spot.id);
  const category=escapeHtml(spot.category);
  const name=escapeHtml(spot.name);

  if(!unlocked){
    detailRoot.innerHTML=`
      <section class="locked-detail">
        <div class="lock">🔒</div>
        <h2>${name}</h2>
        <p>${spot.radius}m以内まで近づくと、写真・3Dモデル・説明が解放されます。</p>
        <div class="locked-preview"><span>未解放のコレクション</span></div>
      </section>
      <nav class="detail-actions" aria-label="スポットの操作">
        <a class="map-action" href="map.html">🗺️ マップで探す <span>›</span></a>
        <a class="book-action" href="collection.html">📖 図鑑へ戻る <span>›</span></a>
      </nav>`;
    return;
  }

  const photo=spot.photo
    ?`<img src="${escapeHtml(spot.photo)}" alt="${name}の写真">`
    :`<div class="photo-placeholder">写真準備中</div>`;
  const destination=`https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}&travelmode=walking`;

  detailRoot.innerHTML=`
    <section class="spot-hero">
      ${photo}
      <span class="unlock-badge">✓ 解放済み</span>
      <div class="spot-title"><span class="category">${category}</span><h2>${name}</h2></div>
    </section>
    <section class="spot-detail-card">
      <h3>スポットについて</h3>
      <p>${escapeHtml(spot.description)}</p>
      <div class="spot-meta">
        <div><small>解放範囲</small><strong>${spot.radius}m以内</strong></div>
        <div><small>カテゴリー</small><strong>${category}</strong></div>
      </div>
    </section>
    <section class="spot-detail-card">
      <h3>3Dモデル</h3>
      <model-viewer src="${escapeHtml(spot.model)}" alt="${name}の3Dモデル" camera-controls auto-rotate shadow-intensity="1"></model-viewer>
    </section>
    <nav class="detail-actions" aria-label="スポットの操作">
      <a class="map-action" href="${destination}" target="_blank" rel="noopener">🗺️ ここまで歩く <span>›</span></a>
      <a class="ar-action" href="ar-tourism.html">📷 観光ARを開く <span>›</span></a>
      <a class="book-action" href="collection.html">📖 図鑑へ戻る <span>›</span></a>
    </nav>`;
}

window.addEventListener("collection-unlocked",event=>{
  if(event.detail.spots.some(item=>item.id===spotId))render();
});

render();
