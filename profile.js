const titleLevels=[
  {name:"新発田ビギナー",points:0},
  {name:"街歩き見習い",points:500},
  {name:"新発田探検家",points:1500},
  {name:"しばコレマスター",points:3000},
  {name:"新発田観光名人",points:4250}
];

function readArray(key){
  try{const value=JSON.parse(localStorage.getItem(key));return Array.isArray(value)?value:[]}
  catch(error){return []}
}

function readObject(key){
  try{const value=JSON.parse(localStorage.getItem(key));return value&&typeof value==="object"?value:{}}
  catch(error){return {}}
}

function stampCount(){
  const value=readObject("collectedStamps");
  return Array.isArray(value)?value.length:Object.keys(value).length;
}

function percent(value,total){return total?Math.min(100,Math.round(value/total*100)):0}

const totalScore=Number(localStorage.getItem("totalScore"))||0;
const collectionTotal=(window.COLLECTION_SPOTS||[]).length||21;
const unlockedCollection=readArray("unlockedCollection").length;
const stamps=stampCount();
const answeredSpots=readArray("answeredSpots");
const quizzes=answeredSpots.length;
const achievementTotal=13;

const normalQuizSpots=["新発田城跡","清水園","蔵春閣","東公園のSL","諏訪神社","新発田市役所","王紋酒造","五十公野公園","カルチャーセンター","新発田駅","あやめの湯","イクネスしばた","市民文化会館","新発田歴史図書館","旧新発田市役所","新潟職能短大","菊水"];
const rareQuizSpots=["藤倉メンチカツや","ボン・タケダ","いっぷく","文化洋食ino","やすけカレー","堀部安兵衛 生誕の碑","大倉喜八郎 生誕の地碑","レストラン蒲城"];
const normalAnswered=normalQuizSpots.filter(name=>answeredSpots.includes(name)).length;
const rareAnswered=rareQuizSpots.filter(name=>answeredSpots.includes(name)).length;
const unlockedAchievements=[
  unlockedCollection>=1,
  unlockedCollection>=3,
  unlockedCollection>=collectionTotal,
  stamps>=1,
  stamps>=collectionTotal,
  quizzes>=1,
  quizzes>=5,
  normalAnswered>=normalQuizSpots.length,
  rareAnswered>=1,
  totalScore>=500,
  totalScore>=1500,
  totalScore>=3000,
  totalScore>=4250
].filter(Boolean).length;

let currentTitle=titleLevels[0],nextTitle=null;
titleLevels.forEach(level=>{
  if(totalScore>=level.points)currentTitle=level;
  else if(!nextTitle)nextTitle=level;
});

document.getElementById("currentTitle").textContent=currentTitle.name;
document.getElementById("totalScore").textContent=`${totalScore.toLocaleString()} pt`;
document.getElementById("collectionCount").textContent=`${Math.min(unlockedCollection,collectionTotal)} / ${collectionTotal}`;
document.getElementById("stampCount").textContent=`${Math.min(stamps,collectionTotal)} / ${collectionTotal}`;
document.getElementById("quizCount").textContent=quizzes;
document.getElementById("achievementCount").textContent=`${Math.min(unlockedAchievements,achievementTotal)} / ${achievementTotal}`;

if(nextTitle){
  const range=nextTitle.points-currentTitle.points;
  const progress=Math.max(0,Math.min(100,(totalScore-currentTitle.points)/range*100));
  document.getElementById("nextTitleLabel").textContent=`次の称号「${nextTitle.name}」まで`;
  document.getElementById("nextTitlePoints").textContent=`あと${(nextTitle.points-totalScore).toLocaleString()} pt`;
  document.getElementById("titleProgress").style.width=`${progress}%`;
}else{
  document.getElementById("nextTitleLabel").textContent="最高称号を獲得済み";
  document.getElementById("nextTitlePoints").textContent="MAX";
  document.getElementById("titleProgress").style.width="100%";
}

const progressItems=[
  ["collection",Math.min(unlockedCollection,collectionTotal),collectionTotal],
  ["stamp",Math.min(stamps,collectionTotal),collectionTotal],
  ["achievement",Math.min(unlockedAchievements,achievementTotal),achievementTotal]
];
progressItems.forEach(([id,value,total])=>{
  const rate=percent(value,total);
  document.getElementById(`${id}Percent`).textContent=`${rate}%`;
  document.getElementById(`${id}Progress`).style.width=`${rate}%`;
});
