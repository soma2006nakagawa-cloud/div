(function(){
  const file=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  const items=[
    {href:"index.html",icon:"🏠",label:"ホーム",files:["index.html",""]},
    {href:"collection.html",icon:"📖",label:"ずかん",files:["collection.html","spot-detail.html"]},
    {href:"map.html",icon:"🗺️",label:"ちず",files:["map.html"]},
    {href:"evacuation.html",icon:"🛡️",label:"ひなん",files:["evacuation.html"]}
  ];
  const nav=document.createElement("nav");
  nav.className="sk-bottom-nav";
  nav.setAttribute("aria-label","メインナビゲーション");
  nav.innerHTML=items.map(item=>{
    const active=item.files.includes(file);
    return `<a href="${item.href}"${active?' class="active" aria-current="page"':""}><span>${item.icon}</span><p>${item.label}</p></a>`;
  }).join("");
  document.body.appendChild(nav);
})();
