import { getTransformedCropRect } from "./imageUtils"
import QRCode from "qrcode"

// Compose the artwork on a square stage, then crop it into a tall festival pass.
export const CARD_SIZE = 1200
export const CARD_WIDTH = 900
export const CARD_HEIGHT = 1200
const type = (ctx, text, x, y, font, color, align = "left") => { ctx.save(); ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.fillText(text, x, y); ctx.restore() }
const rr = (ctx, x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r) }
const cap = (text, max) => (text || "").toUpperCase().slice(0, max)

function texture(ctx, color) { ctx.save(); ctx.globalAlpha = .08; ctx.fillStyle = color; for (let i = 0; i < 850; i++) ctx.fillRect((i * 97) % CARD_SIZE, (i * 211) % CARD_SIZE, 2, 2); ctx.restore() }
function backdrop(ctx, theme) {
  const { colors, style } = theme; const g = ctx.createLinearGradient(0, 0, CARD_SIZE, CARD_SIZE); g.addColorStop(0, colors.bg); g.addColorStop(1, colors.bg2); ctx.fillStyle = g; ctx.fillRect(0, 0, CARD_SIZE, CARD_SIZE)
  if (style === "classic") { ctx.fillStyle = colors.accent; ctx.globalAlpha = .75; ctx.beginPath(); ctx.arc(970, 210, 150, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; type(ctx, "GOA", 62, 1055, "900 250px Georgia", colors.accent) }
  if (style === "editorial") { ctx.fillStyle = colors.text; ctx.globalAlpha = .1; type(ctx, "HH", 80, 1030, "900 700px Arial Black", colors.text); ctx.globalAlpha = 1 }
  if (style === "poster") { ctx.fillStyle = colors.accent; ctx.globalAlpha = .2; for (let x = 35; x < CARD_SIZE; x += 44) for (let y = 35; y < CARD_SIZE; y += 44) ctx.fillRect(x, y, 3, 3); ctx.globalAlpha = 1 }
  if (style === "sunset") { ctx.fillStyle = colors.accent; ctx.globalAlpha = .6; for (let y = 80; y < 1200; y += 48) ctx.fillRect(0, y, CARD_SIZE, 8); ctx.globalAlpha = 1 }
  if (style === "nightlife") { ctx.strokeStyle = colors.accent2; ctx.globalAlpha = .38; ctx.lineWidth = 3; for (let x = -700; x < 1200; x += 100) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 500, 1200); ctx.stroke() } ctx.globalAlpha = 1 }
  texture(ctx, colors.text)
}
function passBase(ctx, theme) {
  const { colors, style } = theme; const x = 245, y = 225, w = 710, h = 880; ctx.save(); ctx.translate(600, 665); ctx.rotate(style === "poster" ? -.035 : style === "nightlife" ? .024 : 0); ctx.translate(-600, -665)
  ctx.fillStyle = colors.accent2; rr(ctx, x + 18, y + 22, w, h, 32); ctx.fill(); ctx.fillStyle = colors.text; rr(ctx, x, y, w, h, 32); ctx.fill()
  ctx.save(); rr(ctx, x, y, w, h, 32); ctx.clip(); ctx.fillStyle = colors.bg; ctx.fillRect(x, y, w, 215)
  if (style === "editorial") { ctx.fillStyle = colors.bg2; ctx.fillRect(x + 35, y + 248, w - 70, h - 295) }
  if (style === "poster") { ctx.fillStyle = colors.accent; ctx.globalAlpha = .25; for (let q = 0; q < 18; q++) { ctx.beginPath(); ctx.arc(x+30+q*40, y+610+(q%3)*14, 10, 0, Math.PI*2); ctx.fill() } ctx.globalAlpha=1 }
  if (style === "classic") { ctx.fillStyle = colors.accent; ctx.globalAlpha=.15; type(ctx,"GOA",x+42,y+788,"900 170px Georgia",colors.accent);ctx.globalAlpha=1 }
  if (style === "sunset") { ctx.fillStyle = colors.accent2; ctx.globalAlpha=.13; for(let q=y+250;q<y+h;q+=28)ctx.fillRect(x,q,w,4);ctx.globalAlpha=1 }
  if (style === "nightlife") { ctx.fillStyle = colors.accent2;ctx.globalAlpha=.1;type(ctx,"NIGHT",x+40,y+825,"900 140px Arial",colors.accent2);ctx.globalAlpha=1 }
  ctx.restore(); ctx.strokeStyle = colors.frame; ctx.lineWidth = 8; rr(ctx, x, y, w, h, 32); ctx.stroke()
  // A physical print-ready slot: it belongs to the exported badge, not the lanyard presentation.
  ctx.fillStyle = colors.bg; rr(ctx, x + w / 2 - 58, y - 12, 116, 32, 12); ctx.fill(); ctx.strokeStyle = colors.frame; ctx.lineWidth = 6; rr(ctx, x + w / 2 - 58, y - 12, 116, 32, 12); ctx.stroke(); ctx.restore(); return { x, y, w, h }
}
function drawPhoto(ctx, img, transform, theme, x, y, s) {
  const { colors, style } = theme; ctx.save(); ctx.fillStyle = colors.accent; ctx.fillRect(x + 13, y + 16, s, s)
  ctx.save(); ctx.beginPath(); if (style === "classic" || style === "nightlife") ctx.arc(x+s/2,y+s/2,s/2,0,Math.PI*2); else rr(ctx,x,y,s,s,style === "poster" ? 28 : 4); ctx.clip()
  if (img) { const c = getTransformedCropRect(img, CARD_SIZE, CARD_SIZE, transform); ctx.drawImage(img,c.sx,c.sy,c.sWidth,c.sHeight,x,y,s,s) } else { const g=ctx.createLinearGradient(x,y,x+s,y+s);g.addColorStop(0,colors.accent);g.addColorStop(1,colors.accent2);ctx.fillStyle=g;ctx.fillRect(x,y,s,s);ctx.fillStyle=colors.bg;ctx.globalAlpha=.3;ctx.beginPath();ctx.arc(x+s/2,y+s*.37,s*.15,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(x+s/2,y+s*1.05,s*.38,Math.PI,0);ctx.fill() }
  ctx.restore();ctx.strokeStyle=colors.accent2;ctx.lineWidth=8;ctx.beginPath();if(style==="classic"||style==="nightlife")ctx.arc(x+s/2,y+s/2,s/2,0,Math.PI*2);else rr(ctx,x,y,s,s,style==="poster"?28:4);ctx.stroke();ctx.restore()
}
function drawQr(ctx, x, y, size, color) {
  const url = typeof window === "undefined" ? "https://hh-goa-builder.vercel.app" : new URL("./", window.location.href).href
  const qr = QRCode.create(url, { errorCorrectionLevel: "M" }); const n = qr.modules.size; const quiet = 4; const cell = size / (n + quiet * 2)
  ctx.save(); ctx.fillStyle = "#fff"; ctx.fillRect(x, y, size, size); ctx.fillStyle = color
  for (let row = 0; row < n; row++) for (let col = 0; col < n; col++) if (qr.modules.get(row, col)) ctx.fillRect(x + (col + quiet) * cell, y + (row + quiet) * cell, Math.ceil(cell), Math.ceil(cell))
  ctx.restore()
}
function passContent(ctx, data, theme, pass, img, transform) {
  const { colors, style } = theme; const { x,y,w,h }=pass; type(ctx,"HACKER HOUSE",x+40,y+62,"900 28px Arial",colors.text);type(ctx,"GOA, INDIA · 28—31 OCT 2026",x+40,y+92,"800 13px monospace",colors.accent);type(ctx,style === "sunset" ? "BOARDING PASS / HH-26" : style === "nightlife" ? "AFTER HOURS PASS" : "BUILDER FESTIVAL PASS",x+w-40,y+62,"900 13px Arial",colors.text,"right")
  ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=colors.accent;ctx.globalAlpha=.55;ctx.beginPath();ctx.moveTo(x+28,y+215);ctx.lineTo(x+w-28,y+215);ctx.stroke();ctx.restore()
  drawPhoto(ctx,img,transform,theme,x+48,y+260,250)
  type(ctx,"PASSENGER",x+335,y+291,"900 12px Arial",colors.accent2);type(ctx,cap(data.name,22),x+335,y+337,"900 35px Arial Black",colors.bg)
  type(ctx,"WHAT I BUILD",x+335,y+374,"900 12px Arial",colors.accent2);type(ctx,cap(data.role,30),x+335,y+405,"800 20px Arial",colors.bg)
  type(ctx,"TOOLBOX",x+335,y+445,"900 12px Arial",colors.accent2);type(ctx,cap(data.stack.join(" · "),42),x+335,y+472,"700 16px Arial",colors.bg)
  ctx.fillStyle=colors.accent2;rr(ctx,x+45,y+555,w-90,126,style === "poster" ? 28 : 5);ctx.fill();type(ctx,"BUILDER ENERGY",x+66,y+582,"900 12px Arial",colors.text);const words=data.tag.text.replace(/^THE\s/,"").split(" ");const split=Math.ceil(words.length/2);type(ctx,`THE ${words.slice(0,split).join(" ")}`,x+66,y+624,"900 29px Arial Black",colors.text);if(words.length>split)type(ctx,words.slice(split).join(" "),x+66,y+656,"900 29px Arial Black",colors.text)
  type(ctx,"FLIGHT HH-2026",x+48,y+738,"900 14px monospace",colors.bg);type(ctx,"GATE BUILDER",x+295,y+738,"900 14px monospace",colors.bg);type(ctx,"SEAT GOA",x+510,y+738,"900 14px monospace",colors.bg)
  drawQr(ctx,x+48,y+750,125,colors.bg);type(ctx,"SCAN TO BUILD YOUR OWN",x+48,y+892,"800 10px monospace",colors.bg);type(ctx,data.handle || "@FRAMEINGOA",x+w-45,y+805,"900 18px Arial",colors.accent2,"right");type(ctx,"#FRAMEINGOA",x+w-45,y+837,"900 13px Arial",colors.bg,"right");type(ctx,"ADMIT ONE BUILDER · THEKIWICREW",x+48,y+850,"800 11px monospace",colors.bg)
}
export function drawBuilderCard(ctx,img,data,theme,transform){
  // Background scenery is never exported; only the physical pass is.
  const stage=document.createElement("canvas");stage.width=CARD_SIZE;stage.height=CARD_SIZE
  const stageCtx=stage.getContext("2d");backdrop(stageCtx,theme);const pass=passBase(stageCtx,theme);passContent(stageCtx,data,theme,pass,img,transform)
  const crop={x:230,y:195,w:750,h:930};ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.drawImage(stage,crop.x,crop.y,crop.w,crop.h,0,0,ctx.canvas.width,ctx.canvas.height)
}
export function exportBuilderCard(img,data,theme,transform){return new Promise((resolve,reject)=>{const c=document.createElement("canvas");c.width=CARD_WIDTH;c.height=CARD_HEIGHT;drawBuilderCard(c.getContext("2d"),img,data,theme,transform);c.toBlob(b=>b?resolve(b):reject(new Error("Could not generate the image.")),"image/png")})}
export function downloadBuilderCard(blob){const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="HH-Goa-2026-Builder-Pass.png";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url)}
