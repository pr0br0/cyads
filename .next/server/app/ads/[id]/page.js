(()=>{var e={};e.id=879,e.ids=[879],e.modules={2607:(e,r,s)=>{Promise.resolve().then(s.t.bind(s,49603,23))},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},5596:(e,r,s)=>{"use strict";s.r(r),s.d(r,{GlobalError:()=>n.a,__next_app__:()=>p,pages:()=>c,routeModule:()=>u,tree:()=>o});var t=s(65239),i=s(48088),a=s(88170),n=s.n(a),d=s(30893),l={};for(let e in d)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>d[e]);s.d(r,l);let o={children:["",{children:["ads",{children:["[id]",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,56890)),"/home/pro/Documents/work/cyads/app/ads/[id]/page.js"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,54295)),"/home/pro/Documents/work/cyads/app/layout.js"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,57398,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(s.t.bind(s,89999,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(s.t.bind(s,65284,23)),"next/dist/client/components/unauthorized-error"]}]}.children,c=["/home/pro/Documents/work/cyads/app/ads/[id]/page.js"],p={require:s,loadChunk:()=>Promise.resolve()},u=new t.AppPageRouteModule({definition:{kind:i.RouteKind.APP_PAGE,page:"/ads/[id]/page",pathname:"/ads/[id]",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:o}})},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},10855:(e,r,s)=>{Promise.resolve().then(s.t.bind(s,46533,23))},11997:e=>{"use strict";e.exports=require("punycode")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},27910:e=>{"use strict";e.exports=require("stream")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},34631:e=>{"use strict";e.exports=require("tls")},55511:e=>{"use strict";e.exports=require("crypto")},55591:e=>{"use strict";e.exports=require("https")},56890:(e,r,s)=>{"use strict";s.r(r),s.d(r,{default:()=>h,generateMetadata:()=>x});var t=s(37413),i=s(86345),a=s(53384),n=s(39916),d=s(35407),l=s(40918),o=s(49046),c=s(26373);let p=(0,c.A)("Phone",[["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]),u=(0,c.A)("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]),m=(0,i.UU)("https://zvyuurbieuionummrcqi.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eXV1cmJpZXVpb251bW1yY3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDA0MTIsImV4cCI6MjA1ODQxNjQxMn0.IKZgwRcmGPhYHDuvkRAco9lWk5GXjAT568ZD3XmodEU");async function x({params:e}){let{data:r}=await m.from("ads").select("title, description").eq("id",e.id).single();return r?{title:`${r.title} | CYADS`,description:r.description}:{title:"Ad Not Found"}}async function h({params:e}){let{data:r}=await m.from("ads").select(`
      *,
      user:user_id (
        id,
        email,
        phone
      )
    `).eq("id",e.id).single();return r||(0,n.notFound)(),(0,t.jsx)("div",{className:"container mx-auto px-4 py-8",children:(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-8",children:[(0,t.jsxs)("div",{className:"md:col-span-2",children:[(0,t.jsx)("div",{className:"relative aspect-video rounded-lg overflow-hidden mb-6",children:(0,t.jsx)(a.default,{src:r.image_url||"/placeholder.jpg",alt:r.title,fill:!0,className:"object-cover"})}),(0,t.jsxs)("div",{className:"bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm",children:[(0,t.jsx)("h1",{className:"text-3xl font-bold mb-4",children:r.title}),(0,t.jsxs)("div",{className:"flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-6",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(l.A,{className:"w-4 h-4"}),(0,t.jsx)("span",{children:(0,d.m)(new Date(r.created_at),{addSuffix:!0})})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(o.A,{className:"w-4 h-4"}),(0,t.jsx)("span",{children:r.location})]})]}),(0,t.jsx)("div",{className:"prose dark:prose-invert max-w-none mb-8",children:(0,t.jsx)("p",{className:"text-lg",children:r.description})}),(0,t.jsxs)("div",{className:"text-3xl font-bold text-primary mb-6",children:[r.price," ",r.currency]})]})]}),(0,t.jsx)("div",{className:"md:col-span-1",children:(0,t.jsxs)("div",{className:"bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm sticky top-4",children:[(0,t.jsx)("h2",{className:"text-xl font-semibold mb-4",children:"Contact Seller"}),(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsxs)("button",{className:"w-full flex items-center justify-center gap-2 bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors",children:[(0,t.jsx)(p,{className:"w-5 h-5"}),"Call Seller"]}),(0,t.jsxs)("button",{className:"w-full flex items-center justify-center gap-2 border border-primary text-primary py-3 px-4 rounded-lg hover:bg-primary/10 transition-colors",children:[(0,t.jsx)(u,{className:"w-5 h-5"}),"Send Message"]})]}),(0,t.jsxs)("div",{className:"mt-6 pt-6 border-t",children:[(0,t.jsx)("h3",{className:"font-semibold mb-2",children:"Safety Tips"}),(0,t.jsxs)("ul",{className:"text-sm text-gray-600 dark:text-gray-400 space-y-2",children:[(0,t.jsx)("li",{children:"• Meet in a public place"}),(0,t.jsx)("li",{children:"• Check the item before you buy"}),(0,t.jsx)("li",{children:"• Pay only after you've seen the item"}),(0,t.jsx)("li",{children:"• Trust your instincts"})]})]})]})})]})})}},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74075:e=>{"use strict";e.exports=require("zlib")},79428:e=>{"use strict";e.exports=require("buffer")},79551:e=>{"use strict";e.exports=require("url")},81630:e=>{"use strict";e.exports=require("http")},91645:e=>{"use strict";e.exports=require("net")},94735:e=>{"use strict";e.exports=require("events")}};var r=require("../../../webpack-runtime.js");r.C(e);var s=e=>r(r.s=e),t=r.X(0,[447,947,345,533,439,493],()=>s(5596));module.exports=t})();