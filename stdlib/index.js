#!/usr/bin/env node
             
const util = require('util');
const fs = require('fs');
const stream = require('stream');
const os = require('os');
const path = require('path');
const readline = require('readline');
const https = require('https');
const http = require('http');
const url = require('url');
const zlib = require('zlib');
const child_process = require('child_process');             function aa(a,b,c){return setTimeout(()=>{const d=Error(`${a?a:"Promise"} has timed out after ${b}ms`);d.stack=`Error: ${d.message}`;c(d)},b)}function ba(a,b){let c;const d=new Promise((e,f)=>{c=aa(a,b,f)});return{timeout:c,promise:d}}
async function w(a,b,c){if(!(a instanceof Promise))throw Error("Promise expected");if(!b)throw Error("Timeout must be a number");if(0>b)throw Error("Timeout cannot be negative");const {promise:d,timeout:e}=ba(c,b);try{return await Promise.race([a,d])}finally{clearTimeout(e)}};const {debuglog:x}=util;const {createReadStream:ca,createWriteStream:da,lstat:y,mkdir:ea,readdir:ja,rmdir:ka,stat:la,unlink:ma}=fs;var na=stream;const {Transform:oa,Writable:pa}=stream;const z=(a,b=0,c=!1)=>{if(0===b&&!c)return a;a=a.split("\n",c?b+1:void 0);return c?a[a.length-1]:a.slice(b).join("\n")},qa=(a,b=!1)=>z(a,2+(b?1:0)),A=a=>{({callee:{caller:a}}=a);return a};const {homedir:B}=os;const C=/\s+at.*(?:\(|\s)(.*)\)?/,ra=/^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/,sa=B(),D=(a,b)=>{const {pretty:c=!1,ignoredModules:d=["pirates"]}=b||{};b=d.join("|");const e=new RegExp(ra.source.replace("IGNORED_MODULES",b));return a.replace(/\\/g,"/").split("\n").filter(f=>{f=f.match(C);if(null===f||!f[1])return!0;f=f[1];return f.includes(".app/Contents/Resources/electron.asar")||f.includes(".app/Contents/Resources/default_app.asar")?!1:
!e.test(f)}).filter(f=>f.trim()).map(f=>c?f.replace(C,(g,k)=>g.replace(k,k.replace(sa,"~"))):f).join("\n")};function ta(a,b,c=!1){return function(d){var e=A(arguments),{stack:f}=Error();const g=z(f,2,!0),k=(f=d instanceof Error)?d.message:d;e=[`Error: ${k}`,...null!==e&&a===e||c?[b]:[g,b]].join("\n");e=D(e);return Object.assign(f?d:Error(),{message:k,stack:e})}};function E(a){var {stack:b}=Error();const c=A(arguments);b=qa(b,a);return ta(c,b,a)};const ua=(a,b)=>{b.once("error",c=>{a.emit("error",c)});return b};class va extends pa{constructor(a){const {binary:b=!1,rs:c=null,...d}=a||{},{f:e=E(!0),proxyError:f}=a||{},g=(k,l)=>e(l);super(d);this.a=[];this.i=new Promise((k,l)=>{this.on("finish",()=>{let h;b?h=Buffer.concat(this.a):h=this.a.join("");k(h);this.a=[]});this.once("error",h=>{if(-1==h.stack.indexOf("\n"))g`${h}`;else{const m=D(h.stack);h.stack=m;f&&g`${h}`}l(h)});c&&ua(this,c).pipe(this)})}_write(a,b,c){this.a.push(a);c()}get promise(){return this.i}}
const F=async(a,b={})=>{({promise:a}=new va({rs:a,...b,f:E(!0)}));return await a};async function H(a){a=ca(a);return await F(a)};async function I(a,b){if(!a)throw Error("No path is given.");const c=E(!0),d=da(a);await new Promise((e,f)=>{d.on("error",g=>{g=c(g);f(g)}).on("close",e).end(b)})};const wa=x("bosom"),xa=async(a,b,c)=>{const {replacer:d=null,space:e=null}=c;b=JSON.stringify(b,d,e);await I(a,b)},J=async(a,b,c={})=>{if(b)return await xa(a,b,c);wa("Reading %s",a);a=await H(a);return JSON.parse(a)};function K(a,b){if(b>a-2)throw Error("Function does not accept that many arguments.");}async function L(a,b,c){const d=E(!0);if("function"!==typeof a)throw Error("Function must be passed.");const {length:e}=a;if(!e)throw Error("Function does not accept any arguments.");return await new Promise((f,g)=>{const k=(h,m)=>h?(h=d(h),g(h)):f(c||m);let l=[k];Array.isArray(b)?(b.forEach((h,m)=>{K(e,m)}),l=[...b,k]):1<Array.from(arguments).length&&(K(e,0),l=[b,k]);a(...l)})};const {dirname:M,join:N,relative:ya,resolve:O}=path;async function za(a,b){b=b.map(async c=>{const d=N(a,c);return{lstat:await L(y,d),path:d,relativePath:c}});return await Promise.all(b)}const Aa=a=>a.lstat.isDirectory(),Ba=a=>!a.lstat.isDirectory();
async function P(a,b={}){if(!a)throw Error("Please specify a path to the directory");const {ignore:c=[]}=b;if(!(await L(y,a)).isDirectory())throw b=Error("Path is not a directory"),b.code="ENOTDIR",b;b=await L(ja,a);var d=await za(a,b);b=d.filter(Aa);d=d.filter(Ba).reduce((e,f)=>{var g=f.lstat.isDirectory()?"Directory":f.lstat.isFile()?"File":f.lstat.isSymbolicLink()?"SymbolicLink":void 0;return{...e,[f.relativePath]:{type:g}}},{});b=await b.reduce(async(e,{path:f,relativePath:g})=>{const k=ya(a,
f);if(c.includes(k))return e;e=await e;f=await P(f);return{...e,[g]:f}},{});return{content:{...d,...b},type:"Directory"}}const Q=(a,b)=>{let c=[],d=[];Object.keys(a).forEach(f=>{const {type:g}=a[f];"File"==g?c.push(N(b,f)):"Directory"==g&&d.push(f)});const e=d.reduce((f,g)=>{const {content:k}=a[g];g=Q(k,N(b,g));return[...f,...g]},[]);return[...c,...e]};async function R(a){try{await L(ea,a)}catch(b){if("ENOENT"==b.code){const c=M(a);await R(c);await R(a)}else if("EEXIST"!=b.code)throw b;}};const S=async a=>{await L(ma,a)},T=async a=>{const {content:b}=await P(a);var c=Object.keys(b).filter(e=>{({type:e}=b[e]);if("File"==e||"SymbolicLink"==e)return!0}),d=Object.keys(b).filter(e=>{({type:e}=b[e]);if("Directory"==e)return!0});c=c.map(e=>N(a,e));await Promise.all(c.map(S));d=d.map(e=>N(a,e));await Promise.all(d.map(T));await L(ka,a)};const Ca=(a,b,c,d=!1,e=!1)=>{const f=c?new RegExp(`^-(${c}|-${b})$`):new RegExp(`^--${b}$`);b=a.findIndex(g=>f.test(g));if(-1==b)return{argv:a};if(d)return{value:!0,index:b,length:1};d=a[b+1];if(!d||"string"==typeof d&&d.startsWith("--"))return{argv:a};e&&(d=parseInt(d,10));return{value:d,index:b,length:2}},Da=a=>{const b=[];for(let c=0;c<a.length;c++){const d=a[c];if(d.startsWith("-"))break;b.push(d)}return b};/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
const Ea={black:30,red:31,green:32,yellow:33,blue:34,magenta:35,cyan:36,white:37,grey:90},Fa={black:40,red:41,green:42,yellow:43,blue:44,magenta:45,cyan:46,white:47};const {createInterface:Ga}=readline;function Ha(a,b={}){const {timeout:c,password:d=!1,output:e=process.stdout,input:f=process.stdin,...g}=b;b=Ga({input:f,output:e,...g});if(d){const l=b.output;b._writeToOutput=h=>{if(["\r\n","\n","\r"].includes(h))return l.write(h);h=h.split(a);"2"==h.length?(l.write(a),l.write("*".repeat(h[1].length))):l.write("*")}}var k=new Promise(b.question.bind(b,a));k=c?w(k,c,`reloquent: ${a}`):k;b.promise=Ia(k,b);return b}const Ia=async(a,b)=>{try{return await a}finally{b.close()}};async function U(a,b){if("object"!=typeof a)throw Error("Please give an object with questions");return await Object.keys(a).reduce(async(c,d)=>{c=await c;var e=a[d];switch(typeof e){case "object":e={...e};break;case "string":e={text:e};break;default:throw Error("A question must be a string or an object.");}e.text=`${e.text}${e.text.endsWith("?")?"":":"} `;var f;if(e.defaultValue)var g=e.defaultValue;e.getDefault&&(f=await e.getDefault());let k=g||"";g&&f&&g!=f?k=`\x1b[90m${g}\x1b[0m`:g&&g==f&&(k=
"");g=f||"";({promise:g}=Ha(`${e.text}${k?`[${k}] `:""}${g?`[${g}] `:""}`,{timeout:b,password:e.password}));f=await g||f||e.defaultValue;"function"==typeof e.validation&&e.validation(f);"function"==typeof e.postProcess&&(f=await e.postProcess(f));return{...c,[d]:f}},{})};async function V(a,b){return await U(a,b)};function Ja(a){if("object"!=typeof a)return!1;const {re:b,replacement:c}=a;a=b instanceof RegExp;const d=-1!=["string","function"].indexOf(typeof c);return a&&d}const W=(a,b)=>{if(!(b instanceof Error))throw b;[,,a]=a.stack.split("\n",3);a=b.stack.indexOf(a);if(-1==a)throw b;a=b.stack.substr(0,a-1);const c=a.lastIndexOf("\n");b.stack=a.substr(0,c);throw b;};async function Ka(a,b){return X(a,b)}
class Y extends oa{constructor(a,b){super(b);this.g=(Array.isArray(a)?a:[a]).filter(Ja);this.a=!1;this.j=b}async replace(a,b){const c=new Y(this.g,this.j);b&&Object.assign(c,b);a=await Ka(c,a);c.a&&this.brake();b&&Object.keys(b).forEach(d=>{b[d]=c[d]});return a}brake(){this.a=!0}async reduce(a){return await this.g.reduce(async(b,{re:c,replacement:d})=>{b=await b;if(this.a)return b;if("string"==typeof d)b=b.replace(c,d);else{const e=[];let f;const g=b.replace(c,(k,...l)=>{f=Error();try{if(this.a)return e.length?
e.push(Promise.resolve(k)):k;const h=d.call(this,k,...l);h instanceof Promise&&e.push(h);return h}catch(h){W(f,h)}});if(e.length)try{const k=await Promise.all(e);b=b.replace(c,()=>k.shift())}catch(k){W(f,k)}else b=g}return b},`${a}`)}async _transform(a,b,c){try{const d=await this.reduce(a);this.push(d);c()}catch(d){a=D(d.stack),d.stack=a,c(d)}}}async function X(a,b){b instanceof na?b.pipe(a):a.end(b);return await F(a)};const {request:La}=https;const {request:Ma}=http;const {parse:Na}=url;const {createGunzip:Oa}=zlib;const Pa=a=>{({"content-encoding":a}=a.headers);return"gzip"==a},Qa=(a,b,c={})=>{const {justHeaders:d,binary:e,f=E(!0)}=c;let g,k,l,h,m=0,p=0;c=(new Promise((v,u)=>{g=a(b,async n=>{({headers:k}=n);const {statusMessage:q,statusCode:t}=n;l={statusMessage:q,statusCode:t};if(d)n.destroy();else{var r=Pa(n);n.on("data",G=>m+=G.byteLength);n=r?n.pipe(Oa()):n;h=await F(n,{binary:e});p=h.length}v()}).on("error",n=>{n=f(n);u(n)}).on("timeout",()=>{g.abort()})})).then(()=>({body:h,headers:k,...l,l:m,byteLength:p,
h:null}));return{m:g,promise:c}};const Ra=(a={})=>Object.keys(a).reduce((b,c)=>{const d=a[c];c=`${encodeURIComponent(c)}=${encodeURIComponent(d)}`;return[...b,c]},[]).join("&").replace(/%20/g,"+"),Sa=async(a,b,{data:c,justHeaders:d,binary:e,f=E(!0)})=>{const {m:g,promise:k}=Qa(a,b,{justHeaders:d,binary:e,f});g.end(c);a=await k;({"content-type":b=""}=a.headers);if((b=b.startsWith("application/json"))&&a.body)try{a.h=JSON.parse(a.body)}catch(l){throw f=f(l),f.response=a.body,f;}return a};let Z;try{const {version:a,name:b}=require("../package.json");Z="@rqt/aqt"==b?`@rqt/aqt/${a}`:`@rqt/aqt via ${b}/${a}`}catch(a){Z="@aqt/rqt"}const Ta=x("aqt");const {fork:Ua,spawn:Va}=child_process;const Wa=async a=>{const [b,c,d]=await Promise.all([new Promise((e,f)=>{a.on("error",f).on("exit",g=>{e(g)})}),a.stdout?F(a.stdout):void 0,a.stderr?F(a.stderr):void 0]);return{code:b,stdout:c,stderr:d}};const Xa=async a=>await new Promise((b,c)=>{la(a,d=>{d&&"ENOENT"==d.code?b(!1):d?c(d):b(!0)})});async function Ya(a,b,c){a=await V(a,c);await J(b,a,{space:2});return a};const $a=async(a,b,c,d,e)=>a?await Za(b,c,e,d):await Ya(c,b,d),Za=async(a,b,c,d)=>{const e=await J(a);return c?await ab(b,a,e,d):e},bb=async(a,b,c,d,e,f,g)=>b?await Za(d,e,g,f):(a=a?await J(c):{},await ab(e,d,a,f)),ab=async(a,b,c,d)=>{a=cb(a,c);return await Ya(a,b,d)},cb=(a,b)=>Object.keys(a).reduce((c,d)=>{const e=b[d];return{...c,[d]:{...a[d],...e?{defaultValue:e}:{}}}},{});module.exports={exists:async a=>{try{return await L(y,a)}catch(b){return null}},ensurePath:async function(a){const b=M(a);try{return await R(b),a}catch(c){if(/EEXIST/.test(c.message)&&-1!=c.message.indexOf(b))return a;throw c;}},cleanStack:D,indicatrix:async function(a,b,c={}){const {interval:d=250,writable:e=process.stdout}=c;b="function"==typeof b?b():b;const f=e.write.bind(e);({INDICATRIX_PLACEHOLDER:c}=process.env);if(c&&"0"!=c)return f(`${a}<INDICATRIX_PLACEHOLDER>`),await b;let g=1,k=`${a}${".".repeat(g)}`;
f(k);c=setInterval(()=>{g=(g+1)%4;k=`${a}${".".repeat(g)}`;f(`\r${" ".repeat(a.length+3)}\r`);f(k)},d);try{return await b}finally{clearInterval(c),f(`\r${" ".repeat(a.length+3)}\r`)}},promto:w,usually:function(a={usage:{}}){const {usage:b={},description:c,line:d,example:e}=a;a=Object.keys(b);const f=Object.values(b),[g]=a.reduce(([h=0,m=0],p)=>{const v=b[p].split("\n").reduce((u,n)=>n.length>u?n.length:u,0);v>m&&(m=v);p.length>h&&(h=p.length);return[h,m]},[]),k=(h,m)=>{m=" ".repeat(m-h.length);return`${h}${m}`};
a=a.reduce((h,m,p)=>{p=f[p].split("\n");m=k(m,g);const [v,...u]=p;m=`${m}\t${v}`;const n=k("",g);p=u.map(q=>`${n}\t${q}`);return[...h,m,...p]},[]).map(h=>`\t${h}`);const l=[c,`  ${d||""}`].filter(h=>h?h.trim():h).join("\n\n");a=`${l?`${l}\n`:""}
${a.join("\n")}
`;return e?`${a}
  Example:

    ${e}
`:a},bosom:J,readDirStructure:P,getFiles:Q,read:H,write:I,rm:async a=>{(await L(y,a)).isDirectory()?await T(a):await S(a)},argufy:function(a={},b=process.argv){let [,,...c]=b;const d=Da(c);c=c.slice(d.length);a=Object.entries(a).reduce((g,[k,l])=>{g[k]="string"==typeof l?{short:l}:l;return g},{});const e=[];a=Object.entries(a).reduce((g,[k,l])=>{let h;try{const {short:m,boolean:p,number:v,command:u,multiple:n}=l;if(u&&n&&d.length)h=d;else if(u&&d.length)h=d[0];else{const q=Ca(c,k,m,p,v);({value:h}=
q);const {index:t,length:r}=q;void 0!==t&&r&&e.push({index:t,length:r})}}catch(m){return g}return void 0===h?g:{...g,[k]:h}},{});let f=c;e.forEach(({index:g,length:k})=>{Array.from({length:k}).forEach((l,h)=>{f[g+h]=null})});f=f.filter(g=>null!==g);Object.assign(a,{o:f});return a},reduceUsage:a=>Object.keys(a).reduce((b,c)=>{const d=a[c];if("string"==typeof d)return b[`-${d}`]="",b;c=d.command?c:`--${c}`;d.short&&(c=`${c}, -${d.short}`);let e=d.description;d.default&&(e=`${e}\nDefault: ${d.default}.`);
b[c]=e;return b},{}),c:function(a,b){return(b=Ea[b])?`\x1b[${b}m${a}\x1b[0m`:a},b:function(a,b){return(b=Fa[b])?`\x1b[${b}m${a}\x1b[0m`:a},mismatch:function(a,b,c,d=!1){const e=[];b.replace(a,(f,...g)=>{f=g[g.length-2];f=d?{position:f}:{};g=g.slice(0,g.length-2).reduce((k,l,h)=>{h=c[h];if(!h||void 0===l)return k;k[h]=l;return k},f);e.push(g)});return e},askQuestions:V,askSingle:async function(a,b){({question:a}=await U({question:a},b));return a},confirm:async function(a,b={}){const {defaultYes:c=
!0,timeout:d}=b;b=a.endsWith("?");({question:a}=await U({question:{text:`${b?a.replace(/\?$/,""):a} (y/n)${b?"?":""}`,defaultValue:c?"y":"n"}},d));return"y"==a},Replaceable:Y,replace:X,aqt:async(a,b={})=>{const {data:c,type:d="json",headers:e={"User-Agent":`Mozilla/5.0 (Node.JS) ${Z}`},compress:f=!0,binary:g=!1,justHeaders:k=!1,method:l,timeout:h}=b;b=E(!0);const {hostname:m,protocol:p,port:v,path:u}=Na(a),n="https:"===p?La:Ma,q={hostname:m,port:v,path:u,headers:{...e},timeout:h,method:l};if(c){var t=
d;var r=c;switch(t){case "json":r=JSON.stringify(r);t="application/json";break;case "form":r=Ra(r),t="application/x-www-form-urlencoded"}r={data:r,contentType:t};({data:t}=r);({contentType:r}=r);q.method=l||"POST";"Content-Type"in q.headers||(q.headers["Content-Type"]=r);"Content-Length"in q.headers||(q.headers["Content-Length"]=Buffer.byteLength(t))}!f||"Accept-Encoding"in q.headers||(q.headers["Accept-Encoding"]="gzip, deflate");const {body:G,headers:db,byteLength:fa,statusCode:eb,statusMessage:fb,
l:ha,h:ia}=await Sa(n,q,{data:t,justHeaders:k,binary:g,f:b});Ta("%s %s B%s",a,fa,`${fa!=ha?` (raw ${ha} B)`:""}`);return{body:ia?ia:G,headers:db,statusCode:eb,statusMessage:fb}},spawn:function(a,b,c){if(!a)throw Error("Please specify a command to spawn.");a=Va(a,b,c);b=Wa(a);a.promise=b;a.spawnCommand=a.spawnargs.join(" ");return a},fork:function(a,b,c){if(!a)throw Error("Please specify a module to fork");a=Ua(a,b,c);b=Wa(a);a.promise=b;a.spawnCommand=a.spawnargs.join(" ");return a},africa:async function(a,
b={},c={}){if("string"!=typeof a)throw Error("Package name is required.");const {homedir:d=B(),rcNameFunction:e=h=>`.${h}rc`,force:f=!1,local:g=!1,questionsTimeout:k}=c;var l=e(a);a=O(d,l);c=await Xa(a);if(g){l=O(l);const h=await Xa(l);return await bb(c,h,a,l,b,k,f)}return await $a(c,a,b,k,f)}};

//# sourceMappingURL=index.js.map