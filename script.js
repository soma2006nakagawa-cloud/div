let map;
let currentMarker;
let nearestMarker;
let routeLine;
let shelterMarkers = [];

let shelters = [];
let currentLat;
let currentLng;

// 地球の半径(km)
const R = 6371;

// 2点間距離を計算
function distance(lat1, lng1, lat2, lng2){

    const dLat = (lat2-lat1) * Math.PI / 180;
    const dLng = (lng2-lng1) * Math.PI / 180;

    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1*Math.PI/180) *
        Math.cos(lat2*Math.PI/180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

}


// JSON読込
fetch("data.json")
.then(res => res.json())
.then(data=>{

    shelters = data.shelters;

    getLocation();

})
.catch(()=>{

    alert("data.jsonが読み込めません");

});
//AR
const arBtn = document.getElementById("arBtn");
const arContainer = document.getElementById("arContainer");

arBtn.onclick = () => {

    if(arContainer.style.display === "none"){

        arContainer.style.display = "block";

    }else{

        arContainer.style.display = "none";

    }

};
fetch("data.json")
.then(res => res.json())
.then(data => {

    const scene = document.querySelector("a-scene");

    data.spots.forEach(spot => {

        const box = document.createElement("a-box");

        box.setAttribute(
            "gps-entity-place",
            `latitude:${spot.lat}; longitude:${spot.lng};`
        );

        box.setAttribute("color","red");
        box.setAttribute("width","2");
        box.setAttribute("height","2");
        box.setAttribute("depth","2");

        scene.appendChild(box);

    });

});

// 現在地取得
function getLocation(){

    navigator.geolocation.getCurrentPosition(

        position=>{

            currentLat = position.coords.latitude;
            currentLng = position.coords.longitude;

            findNearest();

        },

        ()=>{

            alert("位置情報が取得できません");

        }

    );

}


// 最寄り避難所検索
function findNearest(){

    let nearest = null;
    let min = 999999;

    shelters.forEach(s=>{

        let d = distance(
            currentLat,
            currentLng,
            s.lat,
            s.lng
        );

        s.distance = d;

        if(d < min){

            min = d;
            nearest = s;

        }

    });

    shelters.sort((a,b)=>a.distance-b.distance);

    showNearest(nearest);

    showTop5();

    drawMap(nearest);

}
// 最寄り避難所表示
function showNearest(s){

    document.getElementById("nearestInfo").innerHTML = `

    <h3>${s.name}</h3>

    <p><b>住所</b><br>${s.address}</p>

    <p><b>収容人数</b><br>${s.capacity} 人</p>

    <p><b>距離</b><br>${s.distance.toFixed(2)} km</p>

    <button onclick="
    window.open(
    'https://www.google.com/maps?q=${s.lat},${s.lng}',
    '_blank'
    )">

    Googleマップで開く

    </button>

    `;

}


// TOP5表示
function showTop5(){

    let html="";

    shelters.slice(0,5).forEach((s,i)=>{

        html += `

        <li>

        <b>${i+1}位</b><br>

        ${s.name}<br>

        ${s.distance.toFixed(2)} km

        </li>

        `;

    });

    document.getElementById("top5").innerHTML=html;

}


// 地図描画
function drawMap(nearest){

    if(map){

        map.remove();

    }

    map=L.map("map").setView(
        [currentLat,currentLng],
        15
    );


    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:"© OpenStreetMap"
        }
    ).addTo(map);


    // 現在地
    currentMarker=L.circleMarker(

        [currentLat,currentLng],

        {

            radius:8,

            color:"blue",

            fillColor:"blue",

            fillOpacity:1

        }

    )
    .addTo(map)
    .bindPopup("現在地");


    // 全避難所
    shelterMarkers=[];

    shelters.forEach(s=>{

        let marker=L.marker(
            [s.lat,s.lng]
        )
        .addTo(map)
        .bindPopup(s.name);

        shelterMarkers.push(marker);

    });


    // 最寄り避難所
    nearestMarker=L.circleMarker(

        [nearest.lat,nearest.lng],

        {

            radius:10,

            color:"red",

            fillColor:"red",

            fillOpacity:1

        }

    )
    .addTo(map)
    .bindPopup(nearest.name);


    // 線を引く
    routeLine=L.polyline(

        [

            [currentLat,currentLng],

            [nearest.lat,nearest.lng]

        ],

        {

            color:"red",

            weight:4

        }

    )
    .addTo(map);


    map.fitBounds(
        routeLine.getBounds(),
        {
            padding:[50,50]
        }
    );

}

//========================
// マーカークリックで情報表示
//========================
function showInfo(s){

document.getElementById("nearestInfo").innerHTML=`

<h3>${s.name}</h3>

<p><b>住所</b><br>${s.address}</p>

<p><b>収容人数</b><br>${s.capacity} 人</p>

<p><b>距離</b><br>${s.distance.toFixed(2)} km</p>

<button onclick="window.open('https://www.google.com/maps?q=${s.lat},${s.lng}','_blank')">

Googleマップで開く

</button>

`;

}



//========================
// 地図クリック
//========================
function addMarkerEvents(){

    shelterMarkers.forEach((marker,index)=>{

        marker.on("click",()=>{

            showInfo(shelters[index]);

        });

    });

}



//========================
// 初期化
//========================
window.onload=()=>{

    console.log("避難所検索システム起動");

};
