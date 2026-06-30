let map,markers=[],line,my;const info=document.getElementById('info'),list=document.getElementById('list');
function d(a,b,c,e){const R=6371,x=(c-a)*Math.PI/180,y=(e-b)*Math.PI/180,h=Math.sin(x/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(y/2)**2;return R*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));}
fetch('data.json').then(r=>r.json()).then(j=>{window.s=j.shelters;locate();});
document.getElementById('reload').onclick=locate;
document.getElementById('search').oninput=e=>{if(!map)return;markers.forEach(m=>map.removeLayer(m));markers=[];s.filter(v=>v.name.includes(e.target.value)).forEach(v=>markers.push(L.marker([v.lat,v.lng]).addTo(map).bindPopup(v.name)));};
function locate(){navigator.geolocation.getCurrentPosition(p=>{let A=p.coords.latitude,B=p.coords.longitude;
let arr=s.map(v=>({...v,dist:d(A,B,v.lat,v.lng)})).sort((x,y)=>x.dist-y.dist),n=arr[0];
info.innerHTML=`<h2>${n.name}</h2><p>${n.address}</p><p>収容:${n.capacity}人</p><p>${n.dist.toFixed(2)}km</p><button onclick="window.open('https://www.google.com/maps?q=${n.lat},${n.lng}')">Googleマップ</button>`;
list.innerHTML=arr.slice(0,5).map(v=>`<li>${v.name} ${v.dist.toFixed(2)}km</li>`).join('');
if(!map){map=L.map('map');L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'OpenStreetMap'}).addTo(map);}
markers.forEach(m=>map.removeLayer(m));markers=[];s.forEach(v=>markers.push(L.marker([v.lat,v.lng]).addTo(map).bindPopup(v.name)));
if(my)map.removeLayer(my);if(line)map.removeLayer(line);
my=L.circleMarker([A,B],{radius:8,color:'blue'}).addTo(map).bindPopup('現在地');
let nm=L.circleMarker([n.lat,n.lng],{radius:8,color:'red'}).addTo(map).bindPopup(n.name);markers.push(nm);
line=L.polyline([[A,B],[n.lat,n.lng]],{color:'red'}).addTo(map);map.fitBounds(line.getBounds(),{padding:[20,20]});
});}