webpackJsonp([0,2],[function(e,t,o){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function a(){var e={state:{search_results:[],conversation_list:[],history:[],chosen_conversation_id:0,enable_table_mode:!1,enable_show_person:!0,enable_show_time:!0,enable_show_msg:!0}};s.default.component("settings-vue",{template:"#settings-vue-component",data:function(){return e.state},methods:{closeSettingsDialog:function(){var e=document.querySelector(".setting-dialog");e.classList.add("setting-not-visible")}}}),s.default.component("menu-vue",{template:"#menu-vue-component",data:function(){return e.state},methods:{switchConv:function(e){this.$root.$data.chosen_conversation_id=e;var t=document.querySelector(".mdl-layout__obfuscator");t.click()},openSettingsDialog:function(){var e=document.querySelector(".setting-dialog");e.classList.remove("setting-not-visible");var t=document.querySelector(".mdl-layout__obfuscator");t.click()}}}),s.default.component("detail-vue",{template:"#detail-vue-component",data:function(){return{sharedState:this.$root.$data,chosen_conversation_id:0,enable_table_mode:!1}},watch:{sharedState:{deep:!0,handler:function(){this.$root.$data.chosen_conversation_id!==this.chosen_conversation_id&&(this.chosen_conversation_id=this.$root.$data.chosen_conversation_id,this.$root.$data.history=u.conversations.get(this.chosen_conversation_id)),this.$root.$data.enable_table_mode!==this.enable_table_mode&&(this.enable_table_mode=this.$root.$data.enable_table_mode)}}},methods:{getImageUrl:function(e){var t=u.imageByGaiaIdMap.get(e);return t?(console.log(t),t):(console.log("bruh"),"")}}});var t=new s.default({el:"#app",data:e.state});return console.log("Vue is live!"),t}var r=o(1),i=o(5),s=n(i),c=o(6),l=n(c),u={conversations:[],imageByGaiaIdMap:new Map};!function(e){var t=a(),o=e.querySelector("#modal-example"),n=o.querySelector("button"),i=e.querySelector("#show-modal-example");o.showModal||l.default.registerDialog(o);var s=function(e){e&&o.close()},c=function(e){e&&o.showModal()};i.addEventListener("click",c),n.addEventListener("click",s);var d=(0,r.createSelectImageStream)("app-logo-container",t,u);d.subscribe(function(e){console.log(e)})}(document)},function(e,t,o){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.createSelectImageStream=void 0;var a=o(2),r=n(a),i=o(3),s=o(4),c=function(e,t,o){function n(e){t.conversation_list=e.conversation_list,o.conversation_list=e.conversation_list,o.conversations=e.conversations;var n=document.querySelector(".upload-status");n.classList.remove("upload-complete-not-visible"),n=document.querySelector(".upload-progress-bar"),n.classList.add("progress-bar-not-visible"),n=document.querySelector(".upload-dialog"),n.classList.add("upload-not-visible");var a=document.querySelector("#load-complete"),r={message:"JSON loaded",timeout:5e3,actionHandler:function(e){e&&a.classList.remove("mdl-snackbar--active")},actionText:"Close"};a.MaterialSnackbar.showSnackbar(r),n=document.querySelector(".mdl-layout__drawer-button"),n.click()}function a(){var e,t=[],n=[];return o.conversation_list.map(function(e){e.participants.map(function(e){n.push(e.name_id);var a=s.Observable.fromPromise(r.default.getJSON("https://www.googleapis.com/plus/v1/people/"+e.name_id+"?key=AIzaSyD6SrPQUrQlVpmbC3qGR8lXwNorOW_jqH4")).flatMap(function(t){return t.ok&&(console.log(t),!o.imageByGaiaIdMap.get(e.name_id)&&t.image&&o.imageByGaiaIdMap.set(e.name_id,t.image.url)),s.Observable.of(t)}).catch(function(e){return console.log("There has been an error ",e.message),s.Observable.of(e)});t.push(a)})}),console.log(o.conversations),(e=s.Observable).merge.apply(e,t)}function c(e){var t=e;if(t){var o=t[0];if(o)return v.value=o.name,l.postMessage({file:o}),s.Observable.create(function(e){l.onmessage=function(t){t.data.conversation_list&&e.next({data:t.data})}})}return s.Observable.just(0)}var l=new i,u="#"+e,d=document.querySelector(u+' input[type="file"].kev-inputFile'),v=document.querySelector(u+' input[type="text"].kev-inputFileName'),m=document.querySelector(u+" div.kev-dropzone"),f=document.querySelector(u+" .kev-img-container > img.kev-preview"),p=document.querySelector(u+" .kev-inputFile-btn"),g=s.Observable.create(function(e){p.addEventListener("click",function(t){e.next({event:t,context:this,action:"click"})},!1)}).do(function(e){console.log(e),d.click()}),b=s.Observable.create(function(e){d.addEventListener("change",function(t){e.next({event:t,context:this,action:"change"})},!1)}).flatMap(function(e){var t=document.querySelector(".upload-progress-bar");return t.classList.remove("progress-bar-not-visible"),c(e.context.files)}).do(function(e){0!==e&&n(e.data)}).flatMap(function(e){if(e)return a()}),_=s.Observable.create(function(e){m.addEventListener("dragenter",function(t){t.stopPropagation(),t.preventDefault(),e.next({event:t,context:this,action:"dragenter"})},!1)}),h=s.Observable.create(function(e){m.addEventListener("dragleave",function(t){t.stopPropagation(),t.preventDefault(),m.classList.remove("kev-dragover"),f.classList.remove("kev-dragover"),e.next({event:t,context:this,action:"dragleave"})},!1)}),y=s.Observable.create(function(e){m.addEventListener("dragover",function(t){t.stopPropagation(),t.preventDefault(),m.classList.add("kev-dragover"),f.classList.add("kev-dragover"),e.next({event:t,context:this,action:"dragover"})},!1)}),S=s.Observable.create(function(e){m.addEventListener("drop",function(t){t.stopPropagation(),t.preventDefault();var o=t.dataTransfer,n=o.files,a=document.querySelector(".upload-progress-bar");a.classList.remove("progress-bar-not-visible"),e.next({event:t,context:this,action:"drop",files:n})},!1)}).flatMap(function(e){return c(e.files)}).do(function(e){0!==e&&(n(e.data),m.classList.remove("kev-dragover"),f.classList.remove("kev-dragover"),m.classList.remove("kev-init"))}).flatMap(function(e){if(e)return a()}),k=s.Observable.merge(g,b,_,h,y,S);return k};t.createSelectImageStream=c},function(e,t){e.exports=jQuery},function(e,t,o){e.exports=function(){return new Worker(o.p+"1c6cbdb0f141e0aacbf5.worker.js")}},function(e,t){e.exports=Rx},function(e,t){e.exports=Vue},function(e,t){e.exports=dialogPolyfill}]);
//# sourceMappingURL=about_page.js.map