if(!self.define){let e,s={};const a=(a,t)=>(a=new URL(a+".js",t).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(t,i)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let c={};const u=e=>a(e,n),r={module:{uri:n},exports:c,require:u};s[n]=Promise.all(t.map((e=>r[e]||u(e)))).then((e=>(i(...e),c)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"2d302633d9825b3e79be2c6cea8c2a00"},{url:"/_next/static/GK75h-jtuIaCguNsTigxR/_buildManifest.js",revision:"fb1c5c0067fd1d7f53acaf602cd4ebcb"},{url:"/_next/static/GK75h-jtuIaCguNsTigxR/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/303-51e976271d7cf887.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/418-e13087b04fa87e28.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/468.03408b0605f02c31.js",revision:"03408b0605f02c31"},{url:"/_next/static/chunks/4bd1b696-e72b04d435da0cce.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/587-773ed1635afb2550.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/724-f7bcbf5d7ba2ba33.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/761.03cd2fc39eb99fa4.js",revision:"03cd2fc39eb99fa4"},{url:"/_next/static/chunks/8e1d74a4-390fbd0d05fc4b70.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/%5BcollegeName%5D/community/page-560c8f2a52bd40f1.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/%5BcollegeName%5D/groups/page-f416deac3151d01c.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/%5BcollegeName%5D/lost-found/page-8687180827b6b002.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/%5BcollegeName%5D/notes/page-03cda40440d2134d.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/%5BcollegeName%5D/page-8f3731a64571e499.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/%5BcollegeName%5D/posts/page-ab424c674cb46169.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/%5BcollegeName%5D/products/page-93a3c018f8879937.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/%5BcollegeName%5D/pyqs/page-b1ad9a9dd7c93faf.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/%5BcollegeName%5D/requested-pyq/page-7ca82b69174bffc6.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/%5BcollegeName%5D/seniors/page-9da19d950120ae6a.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/(auth)/login/page-14744293d7a6c6cf.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/(auth)/signup/page-6b1d30ce3504ade7.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/(reports)/add-points/page-4bf8f62251f8d23b.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/(reports)/affiliate-products/page-703d831fd72d6a62.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/(reports)/contactus/page-51d3b4b1928f3afc.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/(reports)/dashboard-users/page-259900c19605f786.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/(reports)/redemption-request/page-dd7a5cb683b8100a.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/(reports)/users/page-79566207fab93a0a.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/(resources)/branches/page-38f59d91f9102e85.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/(resources)/courses/page-e92f18fdbb45d326.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/(resources)/subjects/page-908b10bba688035f.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/_not-found/page-55bd30af15a696aa.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/layout-31f53f1510e5d757.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/page-4364094d8e9ef91d.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/profile/page-ed850a49925162c9.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/app/reports/page-f9983c3e9786614a.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/framework-859199dea06580b0.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/main-52dc83f6d1575cc9.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/main-app-0f88d572cd4158ce.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/pages/_app-fcfccf9f83138dd1.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/pages/_error-28b6473b889c2a4b.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-cff657a0ab814a98.js",revision:"GK75h-jtuIaCguNsTigxR"},{url:"/_next/static/css/68db9832ffc229a8.css",revision:"68db9832ffc229a8"},{url:"/_next/static/media/569ce4b8f30dc480-s.p.woff2",revision:"ef6cefb32024deac234e82f932a95cbd"},{url:"/_next/static/media/747892c23ea88013-s.woff2",revision:"a0761690ccf4441ace5cec893b82d4ab"},{url:"/_next/static/media/93f479601ee12b01-s.p.woff2",revision:"da83d5f06d825c5ae65b7cca706cb312"},{url:"/_next/static/media/ba015fad6dcf6784-s.woff2",revision:"8ea4f719af3312a055caf09f34c89a77"},{url:"/icons/image192.png",revision:"bf8fb17d86d6e858e0c360606ddd0b4b"},{url:"/icons/image512.png",revision:"4ff075c085e6b0d38722c0881affd0a3"},{url:"/manifest.json",revision:"97ea21c2ed2150c438629bb0c9b41b7a"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:t})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
