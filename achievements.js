const titleLevels=[
  {name:"新発田ビギナー",points:0},
  {name:"街歩き見習い",points:500},
  {name:"新発田探検家",points:1500},
  {name:"しばコレマスター",points:3000},
  {name:"新発田観光名人",points:4250}
];

const normalQuizSpots=["新発田城跡","清水園","蔵春閣","東公園のSL","諏訪神社","新発田市役所","王紋酒造","五十公野公園","カルチャーセンター","新発田駅","あやめの湯","イクネスしばた","市民文化会館","新発田歴史図書館","旧新発田市役所","新潟職能短大","菊水"];
const rareQuizSpots=["藤倉メンチカツや","ボン・タケダ","いっぷく","文化洋食ino","やすけカレー","堀部安兵衛 生誕の碑","大倉喜八郎 生誕の地碑","レストラン蒲城"];

function readArray(key){
  try{const value=JSON.parse(localStorage.getItem(key));return Array.isArray(value)?value:[]}
  catch(error){return []}
}

function readStampIds(){
  try{
    const value=JSON.parse(localStorage.getItem("collectedStamps"));
    if(Array.isArray(value))return value;
    return value&&typeof value==="object"?Object.keys(value):[];
  }catch(error){return []}
}

const totalScore=Number(localStorage.getItem("totalScore"))||0;
const answeredSpots=readArray("answeredSpots");
const visitedSpots=readArray("unlockedCollection");
const collectedStamps=readStampIds();
const normalAnswered=normalQuizSpots.filter(name=>answeredSpots.includes(name)).length;
const rareAnswered=rareQuizSpots.filter(name=>answeredSpots.includes(name)).length;

const achievements=[
  {id:"first_visit",icon:"📍",name:"はじめの一歩",description:"初めて観光スポットを訪れる",done:visitedSpots.length>=1},
  {id:"visit_three",icon:"🗺️",name:"街歩き入門",description:"図鑑を3件解放する",done:visitedSpots.length>=3},
  {id:"visit_all",icon:"📖",name:"図鑑コンプリート",description:"現在の図鑑7件をすべて解放する",done:visitedSpots.length>=7},
  {id:"first_stamp",icon:"🔖",name:"最初のスタンプ",description:"初めてスタンプを獲得する",done:collectedStamps.length>=1},
  {id:"stamp_all",icon:"🎉",name:"スタンプラリー制覇",description:"現在のスタンプ7個をすべて集める",done:collectedStamps.length>=7},
  {id:"first_quiz",icon:"💡",name:"初クイズ",description:"初めてランドマーククイズを完了する",done:answeredSpots.length>=1},
  {id:"quiz_five",icon:"⭕",name:"クイズ好き",description:"5地点のクイズを完了する",done:answeredSpots.length>=5},
  {id:"normal_quiz_all",icon:"🎓",name:"新発田クイズ王",description:"通常17地点のクイズをすべて完了する",done:normalAnswered>=normalQuizSpots.length},
  {id:"first_rare",icon:"⭐",name:"激レア発見",description:"激レアスポットのクイズを1件完了する",done:rareAnswered>=1},
  {id:"score_500",icon:"🥉",name:"500ポイント達成",description:"合計500ポイントを獲得する",done:totalScore>=500},
  {id:"score_1500",icon:"🥈",name:"1500ポイント達成",description:"合計1500ポイントを獲得する",done:totalScore>=1500},
  {id:"score_3000",icon:"🥇",name:"3000ポイント達成",description:"合計3000ポイントを獲得する",done:totalScore>=3000},
  {id:"score_4250",icon:"🏆",name:"しばコレ制覇",description:"合計4250ポイントを獲得する",done:totalScore>=4250}
];

let saved={};
try{saved=JSON.parse(localStorage.getItem("unlockedAchievements"))||{}}
catch(error){saved={}}
achievements.forEach(item=>{
  if(item.done&&!saved[item.id])saved[item.id]=new Date().toISOString();
  item.unlocked=item.done||Boolean(saved[item.id]);
});
localStorage.setItem("unlockedAchievements",JSON.stringify(saved));

let currentTitle=titleLevels[0];
let nextTitle=null;
titleLevels.forEach(level=>{
  if(totalScore>=level.points)currentTitle=level;
  else if(!nextTitle)nextTitle=level;
});

document.getElementById("currentTitle").textContent=currentTitle.name;
document.getElementById("totalScore").textContent=`${totalScore.toLocaleString()} pt`;
document.getElementById("achievementCount").textContent=`${achievements.filter(item=>item.unlocked).length} / ${achievements.length}`;
document.getElementById("visitedCount").textContent=`${Math.min(visitedSpots.length,7)} / 7`;
document.getElementById("quizCount").textContent=answeredSpots.length;

if(nextTitle){
  document.getElementById("nextTitleLabel").textContent=`次の称号「${nextTitle.name}」まで`;
  document.getElementById("nextTitlePoints").textContent=`あと ${(nextTitle.points-totalScore).toLocaleString()} pt`;
  const range=nextTitle.points-currentTitle.points;
  document.getElementById("titleProgress").style.width=`${Math.max(0,Math.min(100,(totalScore-currentTitle.points)/range*100))}%`;
}else{
  document.getElementById("nextTitleLabel").textContent="最高称号を獲得済み";
  document.getElementById("nextTitlePoints").textContent="MAX";
  document.getElementById("titleProgress").style.width="100%";
}

document.getElementById("titleList").innerHTML=titleLevels.map(level=>{
  const unlocked=totalScore>=level.points;
  const current=level.name===currentTitle.name;
  return `<div class="title-item${unlocked?" unlocked":""}${current?" current":""}"><strong>${unlocked?"👑":"🔒"} ${level.name}</strong><span>${level.points.toLocaleString()}ポイント</span></div>`;
}).join("");

document.getElementById("achievementGrid").innerHTML=achievements.map(item=>`
  <article class="achievement${item.unlocked?" unlocked":""}">
    <div class="badge-icon">${item.unlocked?item.icon:"🔒"}</div>
    <div><h3>${item.unlocked?item.name:"？？？？？"}</h3><p>${item.description}</p>${item.unlocked?"<small>達成済み</small>":""}</div>
  </article>
`).join("");
