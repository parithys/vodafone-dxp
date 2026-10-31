// Rendered-DOM design-token audit. Paste into the browser console (or run through any eval tool) on each route.
// Resolves every CSS custom property in the loaded stylesheets, then reports computed colours, font sizes,
// radii and shadows of VISIBLE elements that do not match any token value. Returns the top offenders per kind.
// Light/dark follows whatever theme is active when it runs.
(async()=>{
const root=document.documentElement;
const NS=x=>x.replace(/rgba\(0, 0, 0, 0\)(?: 0px){4}(?: inset)?(?:, )?/g,'').replace(/,\s*$/,'').trim();
const names=new Set();
for(const ss of [...document.styleSheets]){let rules;try{rules=ss.cssRules}catch{continue}
 const walk=rs=>{for(const r of rs){if(r.style){for(const n of r.style){if(n.startsWith('--')&&!n.startsWith('--tw-'))names.add(n)}}if(r.cssRules)walk(r.cssRules)}};walk(rules)}
const probe=document.createElement('div');probe.style.cssText='position:fixed;left:-9999px;top:0;';document.body.appendChild(probe);
const toRgb=v=>{probe.style.color='';probe.style.color=v;const c=getComputedStyle(probe).color;return c};
const colTok=new Map(),lenTok=new Map(),radTok=new Map(),shTok=new Set();
for(const n of names){const v=getComputedStyle(root).getPropertyValue(n).trim();if(!v)continue;
 if(/^(#|rgb|hsl|color-mix|oklch|var\()/.test(v)||/color/.test(n)&&!/length|radius/.test(n)){const c=toRgb('var('+n+')');if(c&&c!=='rgb(0, 0, 0)'||/^#000|black/.test(v)){const k=c.replace(/\s/g,'');if(!colTok.has(k))colTok.set(k,[]);colTok.get(k).push(n)}}
 if(/^--fs-|^--text-/.test(n)){probe.style.fontSize='';probe.style.fontSize='var('+n+')';lenTok.set(getComputedStyle(probe).fontSize,n)}
 if(/radius/.test(n)){probe.style.borderRadius='';probe.style.borderRadius='var('+n+')';radTok.set(getComputedStyle(probe).borderTopLeftRadius,n)}
 if(/^--(elev|shadow)/.test(n)){probe.style.boxShadow='';probe.style.boxShadow='var('+n+')';shTok.add(NS(getComputedStyle(probe).boxShadow))}}
probe.remove();
const vis=e=>{const r=e.getBoundingClientRect();if(r.width<2||r.height<2)return false;const s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden'&&s.opacity!=='0'};
const els=[...document.querySelectorAll('body *')].filter(e=>vis(e)&&!e.closest('svg')||e.tagName==='svg');
const out={n:els.length,fontSize:{},fontWeight:{},family:{},offColour:{},offBg:{},offBorder:{},offRadius:{},offShadow:{},offSize:{}};
const bump=(o,k,sel)=>{(o[k]=o[k]||{n:0,ex:[]}).n++;if(o[k].ex.length<2)o[k].ex.push(sel)};
const sel=e=>{let s=e.tagName.toLowerCase();if(e.id)s+='#'+e.id;const c=(e.getAttribute('class')||'').split(/\s+/).filter(Boolean).slice(0,2).join('.');if(c)s+='.'+c;return s+(e.textContent&&e.children.length===0?'['+e.textContent.trim().slice(0,18)+']':'')};
const norm=c=>c.replace(/\s/g,'');
const isTrans=c=>/rgba\(0,\s*0,\s*0,\s*0\)|transparent/.test(c);
for(const e of els){const s=getComputedStyle(e);
 const hasText=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());
 if(hasText){out.fontSize[s.fontSize]=(out.fontSize[s.fontSize]||0)+1;out.fontWeight[s.fontWeight]=(out.fontWeight[s.fontWeight]||0)+1;out.family[s.fontFamily.split(',')[0]]=(out.family[s.fontFamily.split(',')[0]]||0)+1;
  if(!lenTok.has(s.fontSize))bump(out.offSize,s.fontSize,sel(e));
  const c=norm(s.color);if(!colTok.has(c))bump(out.offColour,s.color,sel(e))}
 const bg=norm(s.backgroundColor);if(!isTrans(s.backgroundColor)&&!colTok.has(bg))bump(out.offBg,s.backgroundColor,sel(e));
 if(parseFloat(s.borderTopWidth)>0&&s.borderTopStyle!=='none'){const b=norm(s.borderTopColor);if(!colTok.has(b)&&!isTrans(s.borderTopColor))bump(out.offBorder,s.borderTopColor,sel(e))}
 const r=s.borderTopLeftRadius;const rect=e.getBoundingClientRect();const half=Math.min(rect.width,rect.height)/2;if(r!=='0px'&&!radTok.has(r)&&!(parseFloat(r)>=999||r.endsWith('%')||parseFloat(r)>=half-0.5))bump(out.offRadius,r,sel(e)); // a pill/circle on a small element computes to half its size
 const nsh=NS(s.boxShadow); // Tailwind prepends fully transparent ring/inset layers to every shadow utility; they paint nothing
 if(nsh!==''&&nsh!=='none'&&!shTok.has(nsh))bump(out.offShadow,nsh.slice(0,80),sel(e))}
const top=o=>Object.entries(o).sort((a,b)=>(b[1].n||b[1])-(a[1].n||a[1])).slice(0,8);
return {url:location.pathname,elements:out.n,tokens:{colour:colTok.size,fs:lenTok.size,radius:radTok.size,shadow:shTok.size},fontSize:top(out.fontSize),fontWeight:top(out.fontWeight),family:top(out.family),offSize:top(out.offSize),offColour:top(out.offColour),offBg:top(out.offBg),offBorder:top(out.offBorder),offRadius:top(out.offRadius),offShadow:top(out.offShadow)}})()
