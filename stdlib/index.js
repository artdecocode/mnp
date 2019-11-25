#!/usr/bin/env node
             
const util = require('util');
const fs = require('fs');
const stream = require('stream');
const os = require('os');
const path = require('path');
const https = require('https');
const http = require('http');
const url = require('url');
const zlib = require('zlib');
const child_process = require('child_process');
const readline = require('readline');             function aa(a,b,c){return setTimeout(()=>{const d=Error(`${a?a:"Promise"} has timed out after ${b}ms`);d.stack=`Error: ${d.message}`;c(d)},b)}function ba(a,b){let c;const d=new Promise((e,f)=>{c=aa(a,b,f)});return{timeout:c,promise:d}};const {debuglog:w}=util;const {createReadStream:ca,createWriteStream:ha,lstat:x,readdir:ia,rmdir:ja,stat:ka,unlink:la}=fs;var ma=stream;const {Transform:na,Writable:oa}=stream;const y=(a,b=0,c=!1)=>{if(0===b&&!c)return a;a=a.split("\n",c?b+1:void 0);return c?a[a.length-1]:a.slice(b).join("\n")},pa=(a,b=!1)=>y(a,2+(b?1:0)),z=a=>{({callee:{caller:a}}=a);return a};const {homedir:A}=os;const B=/\s+at.*(?:\(|\s)(.*)\)?/,qa=/^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/,ra=A(),C=a=>{const {pretty:b=!1,ignoredModules:c=["pirates"]}={},d=c.join("|"),e=new RegExp(qa.source.replace("IGNORED_MODULES",d));return a.replace(/\\/g,"/").split("\n").filter(f=>{f=f.match(B);if(null===f||!f[1])return!0;f=f[1];return f.includes(".app/Contents/Resources/electron.asar")||f.includes(".app/Contents/Resources/default_app.asar")?!1:!e.test(f)}).filter(f=>
f.trim()).map(f=>b?f.replace(B,(g,k)=>g.replace(k,k.replace(ra,"~"))):f).join("\n")};function sa(a,b,c=!1){return function(d){var e=z(arguments),{stack:f}=Error();const g=y(f,2,!0),k=(f=d instanceof Error)?d.message:d;e=[`Error: ${k}`,...null!==e&&a===e||c?[b]:[g,b]].join("\n");e=C(e);return Object.assign(f?d:Error(),{message:k,stack:e})}};function D(a){var {stack:b}=Error();const c=z(arguments);b=pa(b,a);return sa(c,b,a)};const ta=(a,b)=>{b.once("error",c=>{a.emit("error",c)});return b};class ua extends oa{constructor(a){const {binary:b=!1,rs:c=null,...d}=a||{},{g:e=D(!0),proxyError:f}=a||{},g=(k,l)=>e(l);super(d);this.a=[];this.j=new Promise((k,l)=>{this.on("finish",()=>{let h;b?h=Buffer.concat(this.a):h=this.a.join("");k(h);this.a=[]});this.once("error",h=>{if(-1==h.stack.indexOf("\n"))g`${h}`;else{const m=C(h.stack);h.stack=m;f&&g`${h}`}l(h)});c&&ta(this,c).pipe(this)})}_write(a,b,c){this.a.push(a);c()}get promise(){return this.j}}
const E=async(a,b={})=>{({promise:a}=new ua({rs:a,...b,g:D(!0)}));return await a};async function G(a){a=ca(a);return await E(a)};async function H(a,b){if(!a)throw Error("No path is given.");const c=D(!0),d=ha(a);await new Promise((e,f)=>{d.on("error",g=>{g=c(g);f(g)}).on("close",e).end(b)})};const va=w("bosom"),wa=async(a,b,c)=>{const {replacer:d=null,space:e=null}=c;b=JSON.stringify(b,d,e);await H(a,b)},I=async(a,b,c={})=>{if(b)return await wa(a,b,c);va("Reading %s",a);a=await G(a);return JSON.parse(a)};function J(a,b){if(b>a-2)throw Error("Function does not accept that many arguments.");}async function K(a,b,c){const d=D(!0);if("function"!==typeof a)throw Error("Function must be passed.");const {length:e}=a;if(!e)throw Error("Function does not accept any arguments.");return await new Promise((f,g)=>{const k=(h,m)=>h?(h=d(h),g(h)):f(c||m);let l=[k];Array.isArray(b)?(b.forEach((h,m)=>{J(e,m)}),l=[...b,k]):1<Array.from(arguments).length&&(J(e,0),l=[b,k]);a(...l)})};const {join:L,relative:xa,resolve:M}=path;async function ya(a,b){b=b.map(async c=>{const d=L(a,c);return{lstat:await K(x,d),path:d,relativePath:c}});return await Promise.all(b)}const za=a=>a.lstat.isDirectory(),Aa=a=>!a.lstat.isDirectory();
async function N(a,b={}){if(!a)throw Error("Please specify a path to the directory");const {ignore:c=[]}=b;if(!(await K(x,a)).isDirectory())throw b=Error("Path is not a directory"),b.code="ENOTDIR",b;b=await K(ia,a);var d=await ya(a,b);b=d.filter(za);d=d.filter(Aa).reduce((e,f)=>{var g=f.lstat.isDirectory()?"Directory":f.lstat.isFile()?"File":f.lstat.isSymbolicLink()?"SymbolicLink":void 0;return{...e,[f.relativePath]:{type:g}}},{});b=await b.reduce(async(e,{path:f,relativePath:g})=>{const k=xa(a,
f);if(c.includes(k))return e;e=await e;f=await N(f);return{...e,[g]:f}},{});return{content:{...d,...b},type:"Directory"}}const O=(a,b)=>{let c=[],d=[];Object.keys(a).forEach(f=>{const {type:g}=a[f];"File"==g?c.push(L(b,f)):"Directory"==g&&d.push(f)});const e=d.reduce((f,g)=>{const {content:k}=a[g];g=O(k,L(b,g));return[...f,...g]},[]);return[...c,...e]};const P=async a=>{await K(la,a)},Q=async a=>{const {content:b}=await N(a);var c=Object.keys(b).filter(e=>{({type:e}=b[e]);if("File"==e||"SymbolicLink"==e)return!0}),d=Object.keys(b).filter(e=>{({type:e}=b[e]);if("Directory"==e)return!0});c=c.map(e=>L(a,e));await Promise.all(c.map(P));d=d.map(e=>L(a,e));await Promise.all(d.map(Q));await K(ja,a)};const R=(a,b,c,d=!1,e=!1)=>{const f=c?new RegExp(`^-(${c}|-${b})`):new RegExp(`^--${b}`);b=a.findIndex(g=>f.test(g));if(-1==b)return{argv:a};if(d)return{value:!0,argv:[...a.slice(0,b),...a.slice(b+1)]};d=b+1;c=a[d];if(!c||"string"==typeof c&&c.startsWith("--"))return{argv:a};e&&(c=parseInt(c,10));return{value:c,argv:[...a.slice(0,b),...a.slice(d+1)]}},Ba=a=>{const b=[];for(let c=0;c<a.length;c++){const d=a[c];if(d.startsWith("-"))break;b.push(d)}return b};/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
const Ca={black:30,red:31,green:32,yellow:33,blue:34,magenta:35,cyan:36,white:37,grey:90},Da={black:40,red:41,green:42,yellow:43,blue:44,magenta:45,cyan:46,white:47};const {createInterface:Ea}=readline;function Fa(a,b,c){return setTimeout(()=>{const d=Error(`${a?a:"Promise"} has timed out after ${b}ms`);d.stack=`Error: ${d.message}`;c(d)},b)}function Ga(a,b){let c;const d=new Promise((e,f)=>{c=Fa(a,b,f)});return{timeout:c,promise:d}}
async function Ha(a,b,c){if(!(a instanceof Promise))throw Error("Promise expected");if(!b)throw Error("Timeout must be a number");if(0>b)throw Error("Timeout cannot be negative");const {promise:d,timeout:e}=Ga(c,b);try{return await Promise.race([a,d])}finally{clearTimeout(e)}};function Ia(a,b={}){const {timeout:c,password:d=!1,output:e=process.stdout,input:f=process.stdin,...g}=b;b=Ea({input:f,output:e,...g});if(d){const l=b.output;b._writeToOutput=h=>{if(["\r\n","\n","\r"].includes(h))return l.write(h);h=h.split(a);"2"==h.length?(l.write(a),l.write("*".repeat(h[1].length))):l.write("*")}}var k=new Promise(b.question.bind(b,a));k=c?Ha(k,c,`reloquent: ${a}`):k;b.promise=Ja(k,b);return b}const Ja=async(a,b)=>{try{return await a}finally{b.close()}};async function S(a,b){if("object"!=typeof a)throw Error("Please give an object with questions");return await Object.keys(a).reduce(async(c,d)=>{c=await c;var e=a[d];switch(typeof e){case "object":e={...e};break;case "string":e={text:e};break;default:throw Error("A question must be a string or an object.");}e.text=`${e.text}${e.text.endsWith("?")?"":":"} `;var f;if(e.defaultValue)var g=e.defaultValue;e.getDefault&&(f=await e.getDefault());let k=g||"";g&&f&&g!=f?k=`\x1b[90m${g}\x1b[0m`:g&&g==f&&(k=
"");g=f||"";({promise:g}=Ia(`${e.text}${k?`[${k}] `:""}${g?`[${g}] `:""}`,{timeout:b,password:e.password}));f=await g||f||e.defaultValue;"function"==typeof e.validation&&e.validation(f);"function"==typeof e.postProcess&&(f=await e.postProcess(f));return{...c,[d]:f}},{})};async function T(a,b){return await S(a,b)};function Ka(a){if("object"!=typeof a)return!1;const {re:b,replacement:c}=a;a=b instanceof RegExp;const d=-1!=["string","function"].indexOf(typeof c);return a&&d}const U=(a,b)=>{if(!(b instanceof Error))throw b;[,,a]=a.stack.split("\n",3);a=b.stack.indexOf(a);if(-1==a)throw b;a=b.stack.substr(0,a-1);const c=a.lastIndexOf("\n");b.stack=a.substr(0,c);throw b;};async function La(a,b){return V(a,b)}
class W extends na{constructor(a,b){super(b);this.h=(Array.isArray(a)?a:[a]).filter(Ka);this.a=!1;this.l=b}async replace(a,b){const c=new W(this.h,this.l);b&&Object.assign(c,b);a=await La(c,a);c.a&&this.brake();b&&Object.keys(b).forEach(d=>{b[d]=c[d]});return a}brake(){this.a=!0}async reduce(a){return await this.h.reduce(async(b,{re:c,replacement:d})=>{b=await b;if(this.a)return b;if("string"==typeof d)b=b.replace(c,d);else{const e=[];let f;const g=b.replace(c,(k,...l)=>{f=Error();try{if(this.a)return e.length?
e.push(Promise.resolve(k)):k;const h=d.call(this,k,...l);h instanceof Promise&&e.push(h);return h}catch(h){U(f,h)}});if(e.length)try{const k=await Promise.all(e);b=b.replace(c,()=>k.shift())}catch(k){U(f,k)}else b=g}return b},`${a}`)}async _transform(a,b,c){try{const d=await this.reduce(a);this.push(d);c()}catch(d){a=C(d.stack),d.stack=a,c(d)}}}async function V(a,b){b instanceof ma?b.pipe(a):a.end(b);return await E(a)};const {request:Ma}=https;const {request:Na}=http;const {parse:Oa}=url;const {createGunzip:Pa}=zlib;const Qa=a=>{({"content-encoding":a}=a.headers);return"gzip"==a},Ra=(a,b,c={})=>{const {justHeaders:d,binary:e,g:f=D(!0)}=c;let g,k,l,h,m=0,p=0;c=(new Promise((t,u)=>{g=a(b,async n=>{({headers:k}=n);const {statusMessage:q,statusCode:v}=n;l={statusMessage:q,statusCode:v};if(d)n.destroy();else{var r=Qa(n);n.on("data",F=>m+=F.byteLength);n=r?n.pipe(Pa()):n;h=await E(n,{binary:e});p=h.length}t()}).on("error",n=>{n=f(n);u(n)}).on("timeout",()=>{g.abort()})})).then(()=>({body:h,headers:k,...l,m,byteLength:p,
i:null}));return{o:g,promise:c}};const Sa=(a={})=>Object.keys(a).reduce((b,c)=>{const d=a[c];c=`${encodeURIComponent(c)}=${encodeURIComponent(d)}`;return[...b,c]},[]).join("&").replace(/%20/g,"+"),Ta=async(a,b,{data:c,justHeaders:d,binary:e,g:f=D(!0)})=>{const {o:g,promise:k}=Ra(a,b,{justHeaders:d,binary:e,g:f});g.end(c);a=await k;({"content-type":b=""}=a.headers);if((b=b.startsWith("application/json"))&&a.body)try{a.i=JSON.parse(a.body)}catch(l){throw f=f(l),f.response=a.body,f;}return a};let X;try{const {version:a,name:b}=require("../package.json");X="@rqt/aqt"==b?`@rqt/aqt/${a}`:`@rqt/aqt via ${b}/${a}`}catch(a){X="@aqt/rqt"}const Ua=w("aqt");const {fork:Va,spawn:Wa}=child_process;const Y=async a=>{const [b,c,d]=await Promise.all([new Promise((e,f)=>{a.on("error",f).on("exit",g=>{e(g)})}),a.stdout?E(a.stdout):void 0,a.stderr?E(a.stderr):void 0]);return{code:b,stdout:c,stderr:d}};const Z=async a=>await new Promise((b,c)=>{ka(a,d=>{d&&"ENOENT"==d.code?b(!1):d?c(d):b(!0)})});async function Xa(a,b,c){a=await T(a,c);await I(b,a,{space:2});return a};const Za=async(a,b,c,d,e)=>a?await Ya(b,c,e,d):await Xa(c,b,d),Ya=async(a,b,c,d)=>{const e=await I(a);return c?await $a(b,a,e,d):e},ab=async(a,b,c,d,e,f,g)=>b?await Ya(d,e,g,f):(a=a?await I(c):{},await $a(e,d,a,f)),$a=async(a,b,c,d)=>{a=bb(a,c);return await Xa(a,b,d)},bb=(a,b)=>Object.keys(a).reduce((c,d)=>{const e=b[d];return{...c,[d]:{...a[d],...e?{defaultValue:e}:{}}}},{});module.exports={promto:async function(a,b,c){if(!(a instanceof Promise))throw Error("Promise expected");if(!b)throw Error("Timeout must be a number");if(0>b)throw Error("Timeout cannot be negative");const {promise:d,timeout:e}=ba(c,b);try{return await Promise.race([a,d])}finally{clearTimeout(e)}},usually:function(a={usage:{}}){const {usage:b={},description:c,line:d,example:e}=a;a=Object.keys(b);const f=Object.values(b),[g]=a.reduce(([h=0,m=0],p)=>{const t=b[p].split("\n").reduce((u,n)=>n.length>u?
n.length:u,0);t>m&&(m=t);p.length>h&&(h=p.length);return[h,m]},[]),k=(h,m)=>{m=" ".repeat(m-h.length);return`${h}${m}`};a=a.reduce((h,m,p)=>{p=f[p].split("\n");m=k(m,g);const [t,...u]=p;m=`${m}\t${t}`;const n=k("",g);p=u.map(q=>`${n}\t${q}`);return[...h,m,...p]},[]).map(h=>`\t${h}`);const l=[c,`  ${d||""}`].filter(h=>h?h.trim():h).join("\n\n");a=`${l?`${l}\n`:""}
${a.join("\n")}
`;return e?`${a}
  Example:

    ${e}
`:a},bosom:I,readDirStructure:N,getFiles:O,read:G,write:H,rm:async a=>{(await K(x,a)).isDirectory()?await Q(a):await P(a)},argufy:function(a={},b=process.argv){[,,...b]=b;const c=Ba(b);b=b.slice(c.length);let d=!c.length;return Object.keys(a).reduce(({f:e,...f},g)=>{if(0==e.length&&d)return{f:e,...f};const k=a[g];let l;if("string"==typeof k)({value:l,argv:e}=R(e,g,k));else try{const {short:h,boolean:m,number:p,command:t,multiple:u}=k;t&&u&&c.length?(l=c,d=!0):t&&c.length?(l=c[0],d=!0):{value:l,argv:e}=
R(e,g,h,m,p)}catch(h){return{f:e,...f}}return void 0===l?{f:e,...f}:{f:e,...f,[g]:l}},{f:b})},reduceUsage:a=>Object.keys(a).reduce((b,c)=>{const d=a[c];if("string"==typeof d)return b[`-${d}`]="",b;c=d.command?c:`--${c}`;d.short&&(c=`${c}, -${d.short}`);let e=d.description;d.default&&(e=`${e}\nDefault: ${d.default}.`);b[c]=e;return b},{}),c:function(a,b){return(b=Ca[b])?`\x1b[${b}m${a}\x1b[0m`:a},b:function(a,b){return(b=Da[b])?`\x1b[${b}m${a}\x1b[0m`:a},mismatch:function(a,b,c,d=!1){const e=[];b.replace(a,
(f,...g)=>{f=g[g.length-2];f=d?{position:f}:{};g=g.slice(0,g.length-2).reduce((k,l,h)=>{h=c[h];if(!h||void 0===l)return k;k[h]=l;return k},f);e.push(g)});return e},askQuestions:T,askSingle:async function(a,b){({question:a}=await S({question:a},b));return a},confirm:async function(a,b={}){const {defaultYes:c=!0,timeout:d}=b;b=a.endsWith("?");({question:a}=await S({question:{text:`${b?a.replace(/\?$/,""):a} (y/n)${b?"?":""}`,defaultValue:c?"y":"n"}},d));return"y"==a},Replaceable:W,replace:V,aqt:async(a,
b={})=>{const {data:c,type:d="json",headers:e={"User-Agent":`Mozilla/5.0 (Node.JS) ${X}`},compress:f=!0,binary:g=!1,justHeaders:k=!1,method:l,timeout:h}=b;b=D(!0);const {hostname:m,protocol:p,port:t,path:u}=Oa(a),n="https:"===p?Ma:Na,q={hostname:m,port:t,path:u,headers:{...e},timeout:h,method:l};if(c){var v=d;var r=c;switch(v){case "json":r=JSON.stringify(r);v="application/json";break;case "form":r=Sa(r),v="application/x-www-form-urlencoded"}r={data:r,contentType:v};({data:v}=r);({contentType:r}=
r);q.method=l||"POST";"Content-Type"in q.headers||(q.headers["Content-Type"]=r);"Content-Length"in q.headers||(q.headers["Content-Length"]=Buffer.byteLength(v))}!f||"Accept-Encoding"in q.headers||(q.headers["Accept-Encoding"]="gzip, deflate");const {body:F,headers:cb,byteLength:da,statusCode:db,statusMessage:eb,m:ea,i:fa}=await Ta(n,q,{data:v,justHeaders:k,binary:g,g:b});Ua("%s %s B%s",a,da,`${da!=ea?` (raw ${ea} B)`:""}`);return{body:fa?fa:F,headers:cb,statusCode:db,statusMessage:eb}},spawn:function(a,
b,c){if(!a)throw Error("Please specify a command to spawn.");a=Wa(a,b,c);b=Y(a);a.promise=b;a.spawnCommand=a.spawnargs.join(" ");return a},fork:function(a,b,c){if(!a)throw Error("Please specify a module to fork");a=Va(a,b,c);b=Y(a);a.promise=b;a.spawnCommand=a.spawnargs.join(" ");return a},africa:async function(a,b={},c={}){if("string"!=typeof a)throw Error("Package name is required.");const {homedir:d=A(),rcNameFunction:e=h=>`.${h}rc`,force:f=!1,local:g=!1,questionsTimeout:k}=c;var l=e(a);a=M(d,
l);c=await Z(a);if(g){l=M(l);const h=await Z(l);return await ab(c,h,a,l,b,k,f)}return await Za(c,a,b,k,f)}};

//# sourceMappingURL=index.js.map