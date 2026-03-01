const express = require("express");
const mongoose = require("mongoose");
 
const app = express();
app.use(express.json());
app.use(express.static("public"));
 
/* ===========================
   MONGODB BAĞLANTI
=========================== */
 
mongoose.connect(
  "mongodb+srv://denizcan:7654321@cluster0.xxxxx.mongodb.net/game?retryWrites=true&w=majority"
)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("Mongo Error:", err));
 
/* ===========================
   PLAYER MODEL
=========================== */
 
const playerSchema = new mongoose.Schema({
  money: { type: Number, default: 100000 },
  bank: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  employees: { type: Number, default: 0 },
  morale: { type: Number, default: 100 }
});
 
const Player = mongoose.model("Player", playerSchema);
 
/* ===========================
   LEVEL KONTROL
=========================== */
 
function checkLevel(player) {
  let neededXP = player.level * 1000;
  if (player.xp >= neededXP) {
    player.level++;
    player.xp = 0;
  }
}
 
/* ===========================
   STATE
=========================== */
 
app.get("/state", async (req, res) => {
  let player = await Player.findOne();
  if (!player) {
    player = await Player.create({});
  }
  res.json(player);
});
 
/* ===========================
   İŞLETME AÇ
=========================== */
 
app.post("/open", async (req, res) => {
  const { type } = req.body;
  let player = await Player.findOne();
 
  let employeesToAdd = 0;
 
  if (type === "shop") employeesToAdd = 2;
  if (type === "farm") employeesToAdd = 3;
  if (type === "factory") employeesToAdd = 5;
 
  player.employees += employeesToAdd;
  player.xp += 200;
 
  checkLevel(player);
  await player.save();
 
  res.json(player);
});
 
/* ===========================
   ÜRET
=========================== */
 
app.post("/produce", async (req, res) => {
  let player = await Player.findOne();
 
  player.money += 500;
  player.xp += 100;
 
  checkLevel(player);
  await player.save();
 
  res.json(player);
});
 
/* ===========================
   SAT
=========================== */
 
app.post("/sell", async (req, res) => {
  const { price } = req.body;
  let player = await Player.findOne();
 
  if (price > 5000) {
    return res.json({ error: "Fiyat çok yüksek!" });
  }
 
  player.money += price;
  player.xp += 150;
 
  checkLevel(player);
  await player.save();
 
  res.json(player);
});
 
/* ===========================
   BANKAYA PARA YATIR
=========================== */
 
app.post("/deposit", async (req, res) => {
  const { amount } = req.body;
  let player = await Player.findOne();
 
  if (player.money >= amount) {
    player.money -= amount;
    player.bank += amount;
    await player.save();
  }
 
  res.json(player);
});
 
/* ===========================
   HAFTALIK FAİZ (%3)
=========================== */
 
setInterval(async () => {
  let player = await Player.findOne();
  if (!player) return;
 
  player.bank = Math.round(player.bank * 1.03);
  await player.save();
}, 604800000);
 
/* ===========================
   HAFTALIK MAAŞ
=========================== */
 
setInterval(async () => {
  let player = await Player.findOne();
  if (!player) return;
 
  let salary = player.employees * 1000;
 
  if (player.money >= salary) {
    player.money -= salary;
    player.morale = Math.min(100, player.morale + 5);
  } else {
    player.morale -= 15;
  }
 
  await player.save();
}, 604800000);
 
app.listen(3000, () => console.log("Server running on port 3000"));
