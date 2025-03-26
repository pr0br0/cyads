(()=>{var e={};e.id=81,e.ids=[81],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11997:e=>{"use strict";e.exports=require("punycode")},18524:(e,t,r)=>{Promise.resolve().then(r.bind(r,23896))},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},22854:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>s});let s=(0,r(12907).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/home/pro/Documents/work/cyads/app/test/error-test/page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/home/pro/Documents/work/cyads/app/test/error-test/page.tsx","default")},23896:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>a});var s=r(60687),o=r(24934),i=r(70110);function a(){return(0,s.jsxs)("div",{className:"p-8 max-w-2xl mx-auto",children:[(0,s.jsx)("h1",{className:"text-2xl font-bold mb-6",children:"Error Handling Tests"}),(0,s.jsxs)("div",{className:"space-y-4",children:[(0,s.jsxs)("div",{className:"p-4 border rounded-lg",children:[(0,s.jsx)("h2",{className:"text-lg font-semibold mb-2",children:"API Error Test"}),(0,s.jsx)("p",{className:"text-sm text-gray-600 mb-3",children:"Click below to simulate an API error with toast notification"}),(0,s.jsx)(o.$,{onClick:()=>{(0,i.h)(Error("This is a simulated API error"))},children:"Trigger API Error"})]}),(0,s.jsxs)("div",{className:"p-4 border rounded-lg",children:[(0,s.jsx)("h2",{className:"text-lg font-semibold mb-2",children:"Success Message Test"}),(0,s.jsx)("p",{className:"text-sm text-gray-600 mb-3",children:"Click below to show a success toast notification"}),(0,s.jsx)(o.$,{onClick:()=>{(0,i.u)("This is a test success message!")},children:"Show Success Message"})]})]})]})}},24992:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>a.a,__next_app__:()=>p,pages:()=>c,routeModule:()=>u,tree:()=>l});var s=r(65239),o=r(48088),i=r(88170),a=r.n(i),n=r(30893),d={};for(let e in n)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(d[e]=()=>n[e]);r.d(t,d);let l={children:["",{children:["test",{children:["error-test",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,22854)),"/home/pro/Documents/work/cyads/app/test/error-test/page.tsx"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,32648)),"/home/pro/Documents/work/cyads/app/layout.js"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,57398,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(r.t.bind(r,89999,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(r.t.bind(r,65284,23)),"next/dist/client/components/unauthorized-error"]}]}.children,c=["/home/pro/Documents/work/cyads/app/test/error-test/page.tsx"],p={require:r,loadChunk:()=>Promise.resolve()},u=new s.AppPageRouteModule({definition:{kind:o.RouteKind.APP_PAGE,page:"/test/error-test/page",pathname:"/test/error-test",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:l}})},27910:e=>{"use strict";e.exports=require("stream")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},34631:e=>{"use strict";e.exports=require("tls")},37590:(e,t,r)=>{"use strict";r.d(t,{oR:()=>z});var s,o=r(43210);let i={data:""},a=e=>"object"==typeof window?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||i,n=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,d=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,c=(e,t)=>{let r="",s="",o="";for(let i in e){let a=e[i];"@"==i[0]?"i"==i[1]?r=i+" "+a+";":s+="f"==i[1]?c(a,i):i+"{"+c(a,"k"==i[1]?"":t)+"}":"object"==typeof a?s+=c(a,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=a&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=c.p?c.p(i,a):i+":"+a+";")}return r+(t&&o?t+"{"+o+"}":o)+s},p={},u=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+u(e[r]);return t}return e},m=(e,t,r,s,o)=>{let i=u(e),a=p[i]||(p[i]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(i));if(!p[a]){let t=i!==e?e:(e=>{let t,r,s=[{}];for(;t=n.exec(e.replace(d,""));)t[4]?s.shift():t[3]?(r=t[3].replace(l," ").trim(),s.unshift(s[0][r]=s[0][r]||{})):s[0][t[1]]=t[2].replace(l," ").trim();return s[0]})(e);p[a]=c(o?{["@keyframes "+a]:t}:t,r?"":"."+a)}let m=r&&p.g?p.g:null;return r&&(p.g=p[a]),((e,t,r,s)=>{s?t.data=t.data.replace(s,e):-1===t.data.indexOf(e)&&(t.data=r?e+t.data:t.data+e)})(p[a],t,s,m),a},f=(e,t,r)=>e.reduce((e,s,o)=>{let i=t[o];if(i&&i.call){let e=i(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":c(e,""):!1===e?"":e}return e+s+(null==i?"":i)},"");function x(e){let t=this||{},r=e.call?e(t.p):e;return m(r.unshift?r.raw?f(r,[].slice.call(arguments,1),t.p):r.reduce((e,r)=>Object.assign(e,r&&r.call?r(t.p):r),{}):r,a(t.target),t.g,t.o,t.k)}x.bind({g:1});let h,g,b,y=x.bind({k:1});function v(e,t){let r=this||{};return function(){let s=arguments;function o(i,a){let n=Object.assign({},i),d=n.className||o.className;r.p=Object.assign({theme:g&&g()},n),r.o=/ *go\d+/.test(d),n.className=x.apply(r,s)+(d?" "+d:""),t&&(n.ref=a);let l=e;return e[0]&&(l=n.as||e,delete n.as),b&&l[0]&&b(n),h(l,n)}return t?t(o):o}}var w=e=>"function"==typeof e,k=(e,t)=>w(e)?e(t):e,P=(()=>{let e=0;return()=>(++e).toString()})(),q=(()=>{let e;return()=>e})(),_=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return _(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let o=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+o}))}}},A=[],$={toasts:[],pausedAt:void 0},E=e=>{$=_($,e),A.forEach(e=>{e($)})},C={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},D=(e={})=>{let[t,r]=j($),s=Q($);H(()=>(s.current!==$&&r($),A.push(r),()=>{let e=A.indexOf(r);e>-1&&A.splice(e,1)}),[]);let o=t.toasts.map(t=>{var r,s,o;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(s=e[t.type])?void 0:s.duration)||(null==e?void 0:e.duration)||C[t.type],style:{...e.style,...null==(o=e[t.type])?void 0:o.style,...t.style}}});return{...t,toasts:o}},N=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||P()}),I=e=>(t,r)=>{let s=N(t,e,r);return E({type:2,toast:s}),s.id},z=(e,t)=>I("blank")(e,t);z.error=I("error"),z.success=I("success"),z.loading=I("loading"),z.custom=I("custom"),z.dismiss=e=>{E({type:3,toastId:e})},z.remove=e=>E({type:4,toastId:e}),z.promise=(e,t,r)=>{let s=z.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let o=t.success?k(t.success,e):void 0;return o?z.success(o,{id:s,...r,...null==r?void 0:r.success}):z.dismiss(s),e}).catch(e=>{let o=t.error?k(t.error,e):void 0;o?z.error(o,{id:s,...r,...null==r?void 0:r.error}):z.dismiss(s)}),e};var T=(e,t)=>{E({type:1,toast:{id:e,height:t}})},O=()=>{E({type:5,time:Date.now()})},S=new Map,M=1e3,R=(e,t=M)=>{if(S.has(e))return;let r=setTimeout(()=>{S.delete(e),E({type:4,toastId:e})},t);S.set(e,r)},F=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,G=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,L=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,J=(v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${F} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${G} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${L} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`),K=(v("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${J} 1s linear infinite;
`,y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`),X=y`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Z=(v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${K} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${X} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,v("div")`
  position: absolute;
`,v("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,y`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`);v("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Z} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,v("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,v("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,s=o.createElement,c.p=void 0,h=s,g=void 0,b=void 0,x`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`},55511:e=>{"use strict";e.exports=require("crypto")},55591:e=>{"use strict";e.exports=require("https")},60380:(e,t,r)=>{Promise.resolve().then(r.bind(r,22854))},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},70110:(e,t,r)=>{"use strict";r.d(t,{h:()=>o,u:()=>i});var s=r(37590);function o(e){let t=function(e){if("object"==typeof e&&null!==e&&"message"in e&&"string"==typeof e.message)return e;try{return Error(JSON.stringify(e))}catch{return Error(String(e))}}(e);console.error("API Error:",t),s.oR.error(t.message,{position:"bottom-center",duration:5e3})}function i(e){s.oR.success(e,{position:"bottom-center",duration:3e3})}},74075:e=>{"use strict";e.exports=require("zlib")},79428:e=>{"use strict";e.exports=require("buffer")},79551:e=>{"use strict";e.exports=require("url")},81630:e=>{"use strict";e.exports=require("http")},91645:e=>{"use strict";e.exports=require("net")},94735:e=>{"use strict";e.exports=require("events")}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[447,947,674],()=>r(24992));module.exports=s})();