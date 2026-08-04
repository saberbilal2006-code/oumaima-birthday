const screens = [...document.querySelectorAll(".screen")];
const openGift = document.getElementById("openGift");

function showScreen(id){
  screens.forEach(s => s.classList.toggle("active", s.id === id));
  window.scrollTo({top:0,behavior:"smooth"});
}

openGift.addEventListener("click", () => {
  openGift.classList.add("open");
  playChime();
  setTimeout(() => showScreen("screen2"), 1150);
});

document.querySelectorAll("[data-next]").forEach(btn => {
  btn.addEventListener("click", () => showScreen(btn.dataset.next));
});

document.getElementById("restart").addEventListener("click", () => {
  openGift.classList.remove("open");
  showScreen("screen1");
});

document.getElementById("celebrate").addEventListener("click", () => {
  const toast = document.getElementById("toast");
  toast.classList.add("show");
  burst();
  playChime(true);
  setTimeout(()=>toast.classList.remove("show"), 3500);
});

function playChime(long=false){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = long ? [523.25,659.25,783.99,1046.5] : [523.25,659.25,783.99];
    notes.forEach((f,i)=>{
      const o=ctx.createOscillator(), g=ctx.createGain();
      o.type="sine"; o.frequency.value=f;
      g.gain.setValueAtTime(0,ctx.currentTime+i*.12);
      g.gain.linearRampToValueAtTime(.12,ctx.currentTime+i*.12+.03);
      g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+i*.12+.7);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime+i*.12); o.stop(ctx.currentTime+i*.12+.75);
    });
  }catch(e){}
}

/* Floating hearts */
const canvas = document.getElementById("hearts");
const c = canvas.getContext("2d");
let w,h,hearts=[];
function resize(){w=canvas.width=innerWidth;h=canvas.height=innerHeight}
addEventListener("resize",resize);resize();

function makeHeart(x=Math.random()*w,y=h+20,boost=false){
  return {
    x,y,
    size:boost?10+Math.random()*18:5+Math.random()*9,
    speed:boost?1.5+Math.random()*2.8:.25+Math.random()*.65,
    drift:(Math.random()-.5)*.8,
    alpha:.18+Math.random()*.55,
    life:boost?180:999
  };
}
for(let i=0;i<22;i++) hearts.push(makeHeart(Math.random()*w,Math.random()*h));
function drawHeart(x,y,s,a){
  c.save();c.translate(x,y);c.scale(s/20,s/20);c.globalAlpha=a;
  c.fillStyle="#ffd4e3";c.beginPath();
  c.moveTo(0,6);c.bezierCurveTo(-18,-8,-18,-22,0,-14);
  c.bezierCurveTo(18,-22,18,-8,0,6);c.fill();c.restore();
}
function animate(){
  c.clearRect(0,0,w,h);
  hearts.forEach((p,i)=>{
    p.y-=p.speed;p.x+=Math.sin(p.y*.02)*p.drift;p.life--;
    drawHeart(p.x,p.y,p.size,p.alpha);
    if(p.y<-30||p.life<0) hearts[i]=makeHeart();
  });
  requestAnimationFrame(animate);
}
animate();
function burst(){
  for(let i=0;i<55;i++) hearts.push(makeHeart(w/2+(Math.random()-.5)*260,h*.78,true));
}
