/*!
 * Infinite Ajax Scroll v2.3.1
 * A jQuery plugin for infinite scrolling
 * https://infiniteajaxscroll.com
 *
 * Commercial use requires one-time purchase of a commercial license
 * https://infiniteajaxscroll.com/docs/license.html
 *
 * Non-commercial use is licensed under the MIT License
 *
 * Copyright (c) 2018 Webcreate (Jeroen Fiege)
 */
var IASCallbacks=function(a){return this.list=[],this.fireStack=[],this.isFiring=!1,this.isDisabled=!1,this.Deferred=a.Deferred,this.fire=function(a){var b=a[0],c=a[1],d=a[2];this.isFiring=!0;for(var e=0,f=this.list.length;f>e;e++)if(void 0!=this.list[e]&&!1===this.list[e].fn.apply(b,d)){c.reject();break}this.isFiring=!1,c.resolve(),this.fireStack.length&&this.fire(this.fireStack.shift())},this.inList=function(a,b){b=b||0;for(var c=b,d=this.list.length;d>c;c++)if(this.list[c].fn===a||a.guid&&this.list[c].fn.guid&&a.guid===this.list[c].fn.guid)return c;return-1},this};IASCallbacks.prototype={add:function(a,b){var c={fn:a,priority:b};b=b||0;for(var d=0,e=this.list.length;e>d;d++)if(b>this.list[d].priority)return this.list.splice(d,0,c),this;return this.list.push(c),this},remove:function(a){for(var b=0;(b=this.inList(a,b))>-1;)this.list.splice(b,1);return this},has:function(a){return this.inList(a)>-1},fireWith:function(a,b){var c=this.Deferred();return this.isDisabled?c.reject():(b=b||[],b=[a,c,b.slice?b.slice():b],this.isFiring?this.fireStack.push(b):this.fire(b),c)},disable:function(){this.isDisabled=!0},enable:function(){this.isDisabled=!1}},function(a){"use strict";var b=-1,c=function(c,d){return this.itemsContainerSelector=d.container,this.itemSelector=d.item,this.nextSelector=d.next,this.paginationSelector=d.pagination,this.$scrollContainer=c,this.$container=window===c.get(0)?a(document):c,this.defaultDelay=d.delay,this.negativeMargin=d.negativeMargin,this.nextUrl=null,this.isBound=!1,this.isPaused=!1,this.isInitialized=!1,this.jsXhr=!1,this.listeners={next:new IASCallbacks(a),load:new IASCallbacks(a),loaded:new IASCallbacks(a),render:new IASCallbacks(a),rendered:new IASCallbacks(a),scroll:new IASCallbacks(a),noneLeft:new IASCallbacks(a),ready:new IASCallbacks(a)},this.extensions=[],this.scrollHandler=function(){if(this.isBound&&!this.isPaused){var a=this.getCurrentScrollOffset(this.$scrollContainer),c=this.getScrollThreshold();b!=c&&(this.fire("scroll",[a,c]),a>=c&&this.next())}},this.getItemsContainer=function(){return a(this.itemsContainerSelector,this.$container)},this.getLastItem=function(){return a(this.itemSelector,this.getItemsContainer().get(0)).last()},this.getFirstItem=function(){return a(this.itemSelector,this.getItemsContainer().get(0)).first()},this.getScrollThreshold=function(a){var c;return a=a||this.negativeMargin,a=a>=0?-1*a:a,c=this.getLastItem(),0===c.length?b:c.offset().top+c.height()+a},this.getCurrentScrollOffset=function(a){var b=0,c=a.height();return b=window===a.get(0)?a.scrollTop():a.offset().top,(-1!=navigator.platform.indexOf("iPhone")||-1!=navigator.platform.indexOf("iPod"))&&(c+=80),b+c},this.getNextUrl=function(b){return b=b||this.$container,a(this.nextSelector,b).last().attr("href")},this.load=function(b,c,d){function e(b){f=a(this.itemsContainerSelector,b).eq(0),0===f.length&&(f=a(b).filter(this.itemsContainerSelector).eq(0)),f&&f.find(this.itemSelector).each(function(){i.push(this)}),h.fire("loaded",[b,i]),c&&(g=+new Date-j,d>g?setTimeout(function(){c.call(h,b,i)},d-g):c.call(h,b,i))}var f,g,h=this,i=[],j=+new Date;d=d||this.defaultDelay;var k={url:b,ajaxOptions:{dataType:"html"}};return h.fire("load",[k]),this.jsXhr=a.ajax(k.url,k.ajaxOptions).done(a.proxy(e,h)),this.jsXhr},this.render=function(b,c){var d=this,e=this.getLastItem(),f=0,g=this.fire("render",[b]);g.done(function(){a(b).hide(),e.after(b),a(b).fadeIn(400,function(){++f<b.length||(d.fire("rendered",[b]),c&&c())})}),g.fail(function(){c&&c()})},this.hidePagination=function(){this.paginationSelector&&a(this.paginationSelector,this.$container).hide()},this.restorePagination=function(){this.paginationSelector&&a(this.paginationSelector,this.$container).show()},this.throttle=function(b,c){var d,e,f=0;return d=function(){function a(){f=+new Date,b.apply(d,g)}var d=this,g=arguments,h=+new Date-f;e?clearTimeout(e):a(),h>c?a():e=setTimeout(a,c)},a.guid&&(d.guid=b.guid=b.guid||a.guid++),d},this.fire=function(a,b){return this.listeners[a].fireWith(this,b)},this.pause=function(){this.isPaused=!0},this.resume=function(){this.isPaused=!1},this};c.prototype.initialize=function(){if(this.isInitialized)return!1;var a=!!("onscroll"in this.$scrollContainer.get(0)),b=this.getCurrentScrollOffset(this.$scrollContainer),c=this.getScrollThreshold();return a?(this.hidePagination(),this.bind(),this.nextUrl=this.getNextUrl(),this.nextUrl||this.fire("noneLeft",[this.getLastItem()]),this.nextUrl&&b>=c?(this.next(),this.one("rendered",function(){this.isInitialized=!0,this.fire("ready")})):(this.isInitialized=!0,this.fire("ready")),this):!1},c.prototype.reinitialize=function(){this.isInitialized=!1,this.unbind(),this.initialize()},c.prototype.bind=function(){if(!this.isBound){this.$scrollContainer.on("scroll",a.proxy(this.throttle(this.scrollHandler,150),this));for(var b=0,c=this.extensions.length;c>b;b++)this.extensions[b].bind(this);this.isBound=!0,this.resume()}},c.prototype.unbind=function(){if(this.isBound){this.$scrollContainer.off("scroll",this.scrollHandler);for(var a=0,b=this.extensions.length;b>a;a++)"undefined"!=typeof this.extensions[a].unbind&&this.extensions[a].unbind(this);this.isBound=!1}},c.prototype.destroy=function(){try{this.jsXhr.abort()}catch(a){}this.unbind(),this.$scrollContainer.data("ias",null)},c.prototype.on=function(b,c,d){if("undefined"==typeof this.listeners[b])throw new Error('There is no event called "'+b+'"');return d=d||0,this.listeners[b].add(a.proxy(c,this),d),this.isInitialized&&("ready"===b?a.proxy(c,this)():"noneLeft"!==b||this.nextUrl||a.proxy(c,this)()),this},c.prototype.one=function(a,b){var c=this,d=function(){c.off(a,b),c.off(a,d)};return this.on(a,b),this.on(a,d),this},c.prototype.off=function(a,b){if("undefined"==typeof this.listeners[a])throw new Error('There is no event called "'+a+'"');return this.listeners[a].remove(b),this},c.prototype.next=function(){var a=this.nextUrl,b=this;if(!a)return!1;this.pause();var c=this.fire("next",[a]);return c.done(function(){b.load(a,function(a,c){b.render(c,function(){b.nextUrl=b.getNextUrl(a),b.nextUrl||b.fire("noneLeft",[b.getLastItem()]),b.resume()})})}),c.fail(function(){b.resume()}),!0},c.prototype.extension=function(a){if("undefined"==typeof a.bind)throw new Error('Extension doesn\'t have required method "bind"');return"undefined"!=typeof a.initialize&&a.initialize(this),this.extensions.push(a),this.isBound&&this.reinitialize(),this},a.ias=function(b){var c=a(window);return c.ias.apply(c,arguments)},a.fn.ias=function(b){var d=Array.prototype.slice.call(arguments),e=this;return this.each(function(){var f=a(this),g=f.data("ias"),h=a.extend({},a.fn.ias.defaults,f.data(),"object"==typeof b&&b);if(g||(f.data("ias",g=new c(f,h)),h.initialize&&a(document).ready(a.proxy(g.initialize,g))),"string"==typeof b){if("function"!=typeof g[b])throw new Error('There is no method called "'+b+'"');d.shift(),g[b].apply(g,d)}e=g}),e},a.fn.ias.defaults={item:".item",container:".listing",next:".next",pagination:!1,delay:600,negativeMargin:10,initialize:!0}}(jQuery);var IASHistoryExtension=function(a){return a=jQuery.extend({},this.defaults,a),this.ias=null,this.prevSelector=a.prev,this.prevUrl=null,this.listeners={prev:new IASCallbacks(jQuery)},this.onPageChange=function(a,b,c){if(window.history&&window.history.replaceState){var d=history.state;history.replaceState(d,document.title,c)}},this.onScroll=function(a,b){var c=this.getScrollThresholdFirstItem();this.prevUrl&&(a-=this.ias.$scrollContainer.height(),c>=a&&this.prev())},this.onReady=function(){var a=this.ias.getCurrentScrollOffset(this.ias.$scrollContainer),b=this.getScrollThresholdFirstItem();a-=this.ias.$scrollContainer.height(),b>=a&&this.prev()},this.getPrevUrl=function(a){return a||(a=this.ias.$container),jQuery(this.prevSelector,a).last().attr("href")},this.getScrollThresholdFirstItem=function(){var a;return a=this.ias.getFirstItem(),0===a.length?-1:a.offset().top},this.renderBefore=function(a,b){var c=this.ias,d=c.getFirstItem(),e=0;c.fire("render",[a]),jQuery(a).hide(),d.before(a),jQuery(a).fadeIn(400,function(){++e<a.length||(c.fire("rendered",[a]),b&&b())})},this};IASHistoryExtension.prototype.initialize=function(a){var b=this;this.ias=a,jQuery.extend(a.listeners,this.listeners),a.prev=function(){return b.prev()},this.prevUrl=this.getPrevUrl()},IASHistoryExtension.prototype.bind=function(a){a.on("pageChange",jQuery.proxy(this.onPageChange,this)),a.on("scroll",jQuery.proxy(this.onScroll,this)),a.on("ready",jQuery.proxy(this.onReady,this))},IASHistoryExtension.prototype.unbind=function(a){a.off("pageChange",this.onPageChange),a.off("scroll",this.onScroll),a.off("ready",this.onReady)},IASHistoryExtension.prototype.prev=function(){var a=this.prevUrl,b=this,c=this.ias;if(!a)return!1;c.pause();var d=c.fire("prev",[a]);return d.done(function(){c.load(a,function(a,d){b.renderBefore(d,function(){b.prevUrl=b.getPrevUrl(a),c.resume(),b.prevUrl&&b.prev()})})}),d.fail(function(){c.resume()}),!0},IASHistoryExtension.prototype.defaults={prev:".prev"};var IASNoneLeftExtension=function(a){return a=jQuery.extend({},this.defaults,a),this.ias=null,this.uid=(new Date).getTime(),this.html=a.html.replace("{text}",a.text),this.showNoneLeft=function(){var a=jQuery(this.html).attr("id","ias_noneleft_"+this.uid),b=this.ias.getLastItem();b.after(a),a.fadeIn()},this};IASNoneLeftExtension.prototype.bind=function(a){this.ias=a,a.on("noneLeft",jQuery.proxy(this.showNoneLeft,this))},IASNoneLeftExtension.prototype.unbind=function(a){a.off("noneLeft",this.showNoneLeft)},IASNoneLeftExtension.prototype.defaults={text:"You reached the end.",html:'<div class="ias-noneleft" style="text-align: center;">{text}</div>'};var IASPagingExtension=function(){return this.ias=null,this.pagebreaks=[[0,document.location.toString()]],this.lastPageNum=1,this.enabled=!0,this.listeners={pageChange:new IASCallbacks(jQuery)},this.onScroll=function(a,b){if(this.enabled){var c,d=this.ias,e=this.getCurrentPageNum(a),f=this.getCurrentPagebreak(a);this.lastPageNum!==e&&(c=f[1],d.fire("pageChange",[e,a,c])),this.lastPageNum=e}},this.onNext=function(a){var b=this.ias.getCurrentScrollOffset(this.ias.$scrollContainer);this.pagebreaks.push([b,a]);var c=this.getCurrentPageNum(b)+1;this.ias.fire("pageChange",[c,b,a]),this.lastPageNum=c},this.onPrev=function(a){var b=this,c=b.ias,d=c.getCurrentScrollOffset(c.$scrollContainer),e=d-c.$scrollContainer.height(),f=c.getFirstItem();this.enabled=!1,this.pagebreaks.unshift([0,a]),c.one("rendered",function(){for(var d=1,g=b.pagebreaks.length;g>d;d++)b.pagebreaks[d][0]=b.pagebreaks[d][0]+f.offset().top;var h=b.getCurrentPageNum(e)+1;c.fire("pageChange",[h,e,a]),b.lastPageNum=h,b.enabled=!0})},this};IASPagingExtension.prototype.initialize=function(a){this.ias=a,jQuery.extend(a.listeners,this.listeners)},IASPagingExtension.prototype.bind=function(a){try{a.on("prev",jQuery.proxy(this.onPrev,this),this.priority)}catch(b){}a.on("next",jQuery.proxy(this.onNext,this),this.priority),a.on("scroll",jQuery.proxy(this.onScroll,this),this.priority)},IASPagingExtension.prototype.unbind=function(a){try{a.off("prev",this.onPrev)}catch(b){}a.off("next",this.onNext),a.off("scroll",this.onScroll)},IASPagingExtension.prototype.getCurrentPageNum=function(a){for(var b=this.pagebreaks.length-1;b>0;b--)if(a>this.pagebreaks[b][0])return b+1;return 1},IASPagingExtension.prototype.getCurrentPagebreak=function(a){for(var b=this.pagebreaks.length-1;b>=0;b--)if(a>this.pagebreaks[b][0])return this.pagebreaks[b];return null},IASPagingExtension.prototype.priority=500;var IASSpinnerExtension=function(a){return a=jQuery.extend({},this.defaults,a),this.ias=null,this.uid=(new Date).getTime(),this.src=a.src,this.html=a.html.replace("{src}",this.src),this.showSpinner=function(){var a=this.getSpinner()||this.createSpinner(),b=this.ias.getLastItem();b.after(a),a.fadeIn()},this.showSpinnerBefore=function(){var a=this.getSpinner()||this.createSpinner(),b=this.ias.getFirstItem();b.before(a),a.fadeIn()},this.removeSpinner=function(){this.hasSpinner()&&this.getSpinner().remove()},this.getSpinner=function(){var a=jQuery("#ias_spinner_"+this.uid);return a.length>0?a:!1},this.hasSpinner=function(){var a=jQuery("#ias_spinner_"+this.uid);return a.length>0},this.createSpinner=function(){var a=jQuery(this.html).attr("id","ias_spinner_"+this.uid);return a.hide(),a},this};IASSpinnerExtension.prototype.bind=function(a){this.ias=a,a.on("next",jQuery.proxy(this.showSpinner,this)),a.on("render",jQuery.proxy(this.removeSpinner,this));try{a.on("prev",jQuery.proxy(this.showSpinnerBefore,this))}catch(b){}},IASSpinnerExtension.prototype.unbind=function(a){a.off("next",this.showSpinner),a.off("render",this.removeSpinner);try{a.off("prev",this.showSpinnerBefore)}catch(b){}},IASSpinnerExtension.prototype.defaults={src:"data:image/gif;base64,R0lGODlhEAAQAPQAAP///wAAAPDw8IqKiuDg4EZGRnp6egAAAFhYWCQkJKysrL6+vhQUFJycnAQEBDY2NmhoaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAAFdyAgAgIJIeWoAkRCCMdBkKtIHIngyMKsErPBYbADpkSCwhDmQCBethRB6Vj4kFCkQPG4IlWDgrNRIwnO4UKBXDufzQvDMaoSDBgFb886MiQadgNABAokfCwzBA8LCg0Egl8jAggGAA1kBIA1BAYzlyILczULC2UhACH5BAkKAAAALAAAAAAQABAAAAV2ICACAmlAZTmOREEIyUEQjLKKxPHADhEvqxlgcGgkGI1DYSVAIAWMx+lwSKkICJ0QsHi9RgKBwnVTiRQQgwF4I4UFDQQEwi6/3YSGWRRmjhEETAJfIgMFCnAKM0KDV4EEEAQLiF18TAYNXDaSe3x6mjidN1s3IQAh+QQJCgAAACwAAAAAEAAQAAAFeCAgAgLZDGU5jgRECEUiCI+yioSDwDJyLKsXoHFQxBSHAoAAFBhqtMJg8DgQBgfrEsJAEAg4YhZIEiwgKtHiMBgtpg3wbUZXGO7kOb1MUKRFMysCChAoggJCIg0GC2aNe4gqQldfL4l/Ag1AXySJgn5LcoE3QXI3IQAh+QQJCgAAACwAAAAAEAAQAAAFdiAgAgLZNGU5joQhCEjxIssqEo8bC9BRjy9Ag7GILQ4QEoE0gBAEBcOpcBA0DoxSK/e8LRIHn+i1cK0IyKdg0VAoljYIg+GgnRrwVS/8IAkICyosBIQpBAMoKy9dImxPhS+GKkFrkX+TigtLlIyKXUF+NjagNiEAIfkECQoAAAAsAAAAABAAEAAABWwgIAICaRhlOY4EIgjH8R7LKhKHGwsMvb4AAy3WODBIBBKCsYA9TjuhDNDKEVSERezQEL0WrhXucRUQGuik7bFlngzqVW9LMl9XWvLdjFaJtDFqZ1cEZUB0dUgvL3dgP4WJZn4jkomWNpSTIyEAIfkECQoAAAAsAAAAABAAEAAABX4gIAICuSxlOY6CIgiD8RrEKgqGOwxwUrMlAoSwIzAGpJpgoSDAGifDY5kopBYDlEpAQBwevxfBtRIUGi8xwWkDNBCIwmC9Vq0aiQQDQuK+VgQPDXV9hCJjBwcFYU5pLwwHXQcMKSmNLQcIAExlbH8JBwttaX0ABAcNbWVbKyEAIfkECQoAAAAsAAAAABAAEAAABXkgIAICSRBlOY7CIghN8zbEKsKoIjdFzZaEgUBHKChMJtRwcWpAWoWnifm6ESAMhO8lQK0EEAV3rFopIBCEcGwDKAqPh4HUrY4ICHH1dSoTFgcHUiZjBhAJB2AHDykpKAwHAwdzf19KkASIPl9cDgcnDkdtNwiMJCshACH5BAkKAAAALAAAAAAQABAAAAV3ICACAkkQZTmOAiosiyAoxCq+KPxCNVsSMRgBsiClWrLTSWFoIQZHl6pleBh6suxKMIhlvzbAwkBWfFWrBQTxNLq2RG2yhSUkDs2b63AYDAoJXAcFRwADeAkJDX0AQCsEfAQMDAIPBz0rCgcxky0JRWE1AmwpKyEAIfkECQoAAAAsAAAAABAAEAAABXkgIAICKZzkqJ4nQZxLqZKv4NqNLKK2/Q4Ek4lFXChsg5ypJjs1II3gEDUSRInEGYAw6B6zM4JhrDAtEosVkLUtHA7RHaHAGJQEjsODcEg0FBAFVgkQJQ1pAwcDDw8KcFtSInwJAowCCA6RIwqZAgkPNgVpWndjdyohACH5BAkKAAAALAAAAAAQABAAAAV5ICACAimc5KieLEuUKvm2xAKLqDCfC2GaO9eL0LABWTiBYmA06W6kHgvCqEJiAIJiu3gcvgUsscHUERm+kaCxyxa+zRPk0SgJEgfIvbAdIAQLCAYlCj4DBw0IBQsMCjIqBAcPAooCBg9pKgsJLwUFOhCZKyQDA3YqIQAh+QQJCgAAACwAAAAAEAAQAAAFdSAgAgIpnOSonmxbqiThCrJKEHFbo8JxDDOZYFFb+A41E4H4OhkOipXwBElYITDAckFEOBgMQ3arkMkUBdxIUGZpEb7kaQBRlASPg0FQQHAbEEMGDSVEAA1QBhAED1E0NgwFAooCDWljaQIQCE5qMHcNhCkjIQAh+QQJCgAAACwAAAAAEAAQAAAFeSAgAgIpnOSoLgxxvqgKLEcCC65KEAByKK8cSpA4DAiHQ/DkKhGKh4ZCtCyZGo6F6iYYPAqFgYy02xkSaLEMV34tELyRYNEsCQyHlvWkGCzsPgMCEAY7Cg04Uk48LAsDhRA8MVQPEF0GAgqYYwSRlycNcWskCkApIyEAOwAAAAAAAAAAAA==",html:'<div class="ias-spinner" style="text-align: center;"><img src="{src}"/></div>'};var IASTriggerExtension=function(a){return a=jQuery.extend({},this.defaults,a),this.ias=null,this.html=a.html.replace("{text}",a.text),this.htmlPrev=a.htmlPrev.replace("{text}",a.textPrev),this.enabled=!0,this.count=0,this.offset=a.offset,this.$triggerNext=null,this.$triggerPrev=null,this.showTriggerNext=function(){if(!this.enabled)return!0;if(!1===this.offset||++this.count<this.offset)return!0;var a=this.$triggerNext||(this.$triggerNext=this.createTrigger(this.next,this.html)),b=this.ias.getLastItem();return b.after(a),a.fadeIn(),!1},this.showTriggerPrev=function(){if(!this.enabled)return!0;var a=this.$triggerPrev||(this.$triggerPrev=this.createTrigger(this.prev,this.htmlPrev)),b=this.ias.getFirstItem();return b.before(a),a.fadeIn(),!1},this.onRendered=function(){this.enabled=!0},this.createTrigger=function(a,b){var c,d=(new Date).getTime();return b=b||this.html,c=jQuery(b).attr("id","ias_trigger_"+d),c.hide(),c.on("click",jQuery.proxy(a,this)),c},this};IASTriggerExtension.prototype.bind=function(a){this.ias=a,a.on("next",jQuery.proxy(this.showTriggerNext,this),this.priority),a.on("rendered",jQuery.proxy(this.onRendered,this),this.priority);try{a.on("prev",jQuery.proxy(this.showTriggerPrev,this),this.priority)}catch(b){}},IASTriggerExtension.prototype.unbind=function(a){a.off("next",this.showTriggerNext),a.off("rendered",this.onRendered);try{a.off("prev",this.showTriggerPrev)}catch(b){}},IASTriggerExtension.prototype.next=function(){this.enabled=!1,this.ias.pause(),this.$triggerNext&&(this.$triggerNext.remove(),this.$triggerNext=null),this.ias.next()},IASTriggerExtension.prototype.prev=function(){this.enabled=!1,this.ias.pause(),this.$triggerPrev&&(this.$triggerPrev.remove(),this.$triggerPrev=null),this.ias.prev()},IASTriggerExtension.prototype.defaults={text:"Load more items",html:'<div class="ias-trigger ias-trigger-next" style="text-align: center; cursor: pointer;"><a>{text}</a></div>',textPrev:"Load previous items",htmlPrev:'<div class="ias-trigger ias-trigger-prev" style="text-align: center; cursor: pointer;"><a>{text}</a></div>',offset:0},IASTriggerExtension.prototype.priority=1e3;

// jquery cookie var COOKIE get | set | remove
jQuery.cookie=function(a,k,j){if(typeof k!="undefined"){j=j||{};if(k===null){k="";j.expires=-1}var e="";if(j.expires&&(typeof j.expires=="number"||j.expires.toUTCString)){var b;if(typeof j.expires=="number"){b=new Date();b.setTime(b.getTime()+(j.expires*24*60*60*1000))}else{b=j.expires}e="; expires="+b.toUTCString()}var m=j.path?"; path="+j.path:"";var c=j.domain?"; domain="+j.domain:"";var h=j.secure?"; secure":"";document.cookie=[a,"=",encodeURIComponent(k),e,m,c,h].join("")}else{var g=null;if(document.cookie&&document.cookie!=""){var l=document.cookie.split(";");for(var d=0;d<l.length;d++){var f=jQuery.trim(l[d]);if(f.substring(0,a.length+1)==(a+"=")){g=decodeURIComponent(f.substring(a.length+1));break}}}return g}};var COOKIE={get:function(a){if(window.localStorage){return localStorage.getItem(a)}else{return $.cookie(a)}},set:function(a,b){if(window.localStorage){localStorage[a]=b}else{$.cookie(a,b)}},remove:function(a){if(window.localStorage){localStorage.removeItem(a)}else{$.cookie(a,undefined)}}};


$.fn.serializeObject=function(){var a={},k=this.serializeArray();$.each(k,function(){void 0!==a[this.name]?(a[this.name].push||(a[this.name]=[a[this.name]]),a[this.name].push(this.value||"")):a[this.name]=this.value||""});return a};


/*! lazysizes - v4.0.1 */
!function(a,b){var c=b(a,a.document);a.lazySizes=c,"object"==typeof module&&module.exports&&(module.exports=c)}(window,function(a,b){"use strict";if(b.getElementsByClassName){var c,d,e=b.documentElement,f=a.Date,g=a.HTMLPictureElement,h="addEventListener",i="getAttribute",j=a[h],k=a.setTimeout,l=a.requestAnimationFrame||k,m=a.requestIdleCallback,n=/^picture$/i,o=["load","error","lazyincluded","_lazyloaded"],p={},q=Array.prototype.forEach,r=function(a,b){return p[b]||(p[b]=new RegExp("(\\s|^)"+b+"(\\s|$)")),p[b].test(a[i]("class")||"")&&p[b]},s=function(a,b){r(a,b)||a.setAttribute("class",(a[i]("class")||"").trim()+" "+b)},t=function(a,b){var c;(c=r(a,b))&&a.setAttribute("class",(a[i]("class")||"").replace(c," "))},u=function(a,b,c){var d=c?h:"removeEventListener";c&&u(a,b),o.forEach(function(c){a[d](c,b)})},v=function(a,d,e,f,g){var h=b.createEvent("CustomEvent");return e||(e={}),e.instance=c,h.initCustomEvent(d,!f,!g,e),a.dispatchEvent(h),h},w=function(b,c){var e;!g&&(e=a.picturefill||d.pf)?e({reevaluate:!0,elements:[b]}):c&&c.src&&(b.src=c.src)},x=function(a,b){return(getComputedStyle(a,null)||{})[b]},y=function(a,b,c){for(c=c||a.offsetWidth;c<d.minSize&&b&&!a._lazysizesWidth;)c=b.offsetWidth,b=b.parentNode;return c},z=function(){var a,c,d=[],e=[],f=d,g=function(){var b=f;for(f=d.length?e:d,a=!0,c=!1;b.length;)b.shift()();a=!1},h=function(d,e){a&&!e?d.apply(this,arguments):(f.push(d),c||(c=!0,(b.hidden?k:l)(g)))};return h._lsFlush=g,h}(),A=function(a,b){return b?function(){z(a)}:function(){var b=this,c=arguments;z(function(){a.apply(b,c)})}},B=function(a){var b,c=0,e=125,g=d.ricTimeout,h=function(){b=!1,c=f.now(),a()},i=m&&d.ricTimeout?function(){m(h,{timeout:g}),g!==d.ricTimeout&&(g=d.ricTimeout)}:A(function(){k(h)},!0);return function(a){var d;(a=a===!0)&&(g=33),b||(b=!0,d=e-(f.now()-c),0>d&&(d=0),a||9>d&&m?i():k(i,d))}},C=function(a){var b,c,d=99,e=function(){b=null,a()},g=function(){var a=f.now()-c;d>a?k(g,d-a):(m||e)(e)};return function(){c=f.now(),b||(b=k(g,d))}};!function(){var b,c={lazyClass:"lazyload",loadedClass:"lazyloaded",loadingClass:"lazyloading",preloadClass:"lazypreload",errorClass:"lazyerror",autosizesClass:"lazyautosizes",srcAttr:"data-src",srcsetAttr:"data-srcset",sizesAttr:"data-sizes",minSize:40,customMedia:{},init:!0,expFactor:1.5,hFac:.8,loadMode:2,loadHidden:!0,ricTimeout:300};d=a.lazySizesConfig||a.lazysizesConfig||{};for(b in c)b in d||(d[b]=c[b]);a.lazySizesConfig=d,k(function(){d.init&&F()})}();var D=function(){var g,l,m,o,p,y,D,F,G,H,I,J,K,L,M=/^img$/i,N=/^iframe$/i,O="onscroll"in a&&!/glebot/.test(navigator.userAgent),P=0,Q=0,R=0,S=-1,T=function(a){R--,a&&a.target&&u(a.target,T),(!a||0>R||!a.target)&&(R=0)},U=function(a,c){var d,f=a,g="hidden"==x(b.body,"visibility")||"hidden"!=x(a,"visibility");for(F-=c,I+=c,G-=c,H+=c;g&&(f=f.offsetParent)&&f!=b.body&&f!=e;)g=(x(f,"opacity")||1)>0,g&&"visible"!=x(f,"overflow")&&(d=f.getBoundingClientRect(),g=H>d.left&&G<d.right&&I>d.top-1&&F<d.bottom+1);return g},V=function(){var a,f,h,j,k,m,n,p,q,r=c.elements;if((o=d.loadMode)&&8>R&&(a=r.length)){f=0,S++,null==K&&("expand"in d||(d.expand=e.clientHeight>500&&e.clientWidth>500?500:370),J=d.expand,K=J*d.expFactor),K>Q&&1>R&&S>2&&o>2&&!b.hidden?(Q=K,S=0):Q=o>1&&S>1&&6>R?J:P;for(;a>f;f++)if(r[f]&&!r[f]._lazyRace)if(O)if((p=r[f][i]("data-expand"))&&(m=1*p)||(m=Q),q!==m&&(y=innerWidth+m*L,D=innerHeight+m,n=-1*m,q=m),h=r[f].getBoundingClientRect(),(I=h.bottom)>=n&&(F=h.top)<=D&&(H=h.right)>=n*L&&(G=h.left)<=y&&(I||H||G||F)&&(d.loadHidden||"hidden"!=x(r[f],"visibility"))&&(l&&3>R&&!p&&(3>o||4>S)||U(r[f],m))){if(ba(r[f]),k=!0,R>9)break}else!k&&l&&!j&&4>R&&4>S&&o>2&&(g[0]||d.preloadAfterLoad)&&(g[0]||!p&&(I||H||G||F||"auto"!=r[f][i](d.sizesAttr)))&&(j=g[0]||r[f]);else ba(r[f]);j&&!k&&ba(j)}},W=B(V),X=function(a){s(a.target,d.loadedClass),t(a.target,d.loadingClass),u(a.target,Z),v(a.target,"lazyloaded")},Y=A(X),Z=function(a){Y({target:a.target})},$=function(a,b){try{a.contentWindow.location.replace(b)}catch(c){a.src=b}},_=function(a){var b,c=a[i](d.srcsetAttr);(b=d.customMedia[a[i]("data-media")||a[i]("media")])&&a.setAttribute("media",b),c&&a.setAttribute("srcset",c)},aa=A(function(a,b,c,e,f){var g,h,j,l,o,p;(o=v(a,"lazybeforeunveil",b)).defaultPrevented||(e&&(c?s(a,d.autosizesClass):a.setAttribute("sizes",e)),h=a[i](d.srcsetAttr),g=a[i](d.srcAttr),f&&(j=a.parentNode,l=j&&n.test(j.nodeName||"")),p=b.firesLoad||"src"in a&&(h||g||l),o={target:a},p&&(u(a,T,!0),clearTimeout(m),m=k(T,2500),s(a,d.loadingClass),u(a,Z,!0)),l&&q.call(j.getElementsByTagName("source"),_),h?a.setAttribute("srcset",h):g&&!l&&(N.test(a.nodeName)?$(a,g):a.src=g),f&&(h||l)&&w(a,{src:g})),a._lazyRace&&delete a._lazyRace,t(a,d.lazyClass),z(function(){(!p||a.complete&&a.naturalWidth>1)&&(p?T(o):R--,X(o))},!0)}),ba=function(a){var b,c=M.test(a.nodeName),e=c&&(a[i](d.sizesAttr)||a[i]("sizes")),f="auto"==e;(!f&&l||!c||!a[i]("src")&&!a.srcset||a.complete||r(a,d.errorClass)||!r(a,d.lazyClass))&&(b=v(a,"lazyunveilread").detail,f&&E.updateElem(a,!0,a.offsetWidth),a._lazyRace=!0,R++,aa(a,b,f,e,c))},ca=function(){if(!l){if(f.now()-p<999)return void k(ca,999);var a=C(function(){d.loadMode=3,W()});l=!0,d.loadMode=3,W(),j("scroll",function(){3==d.loadMode&&(d.loadMode=2),a()},!0)}};return{_:function(){p=f.now(),c.elements=b.getElementsByClassName(d.lazyClass),g=b.getElementsByClassName(d.lazyClass+" "+d.preloadClass),L=d.hFac,j("scroll",W,!0),j("resize",W,!0),a.MutationObserver?new MutationObserver(W).observe(e,{childList:!0,subtree:!0,attributes:!0}):(e[h]("DOMNodeInserted",W,!0),e[h]("DOMAttrModified",W,!0),setInterval(W,999)),j("hashchange",W,!0),["focus","mouseover","click","load","transitionend","animationend","webkitAnimationEnd"].forEach(function(a){b[h](a,W,!0)}),/d$|^c/.test(b.readyState)?ca():(j("load",ca),b[h]("DOMContentLoaded",W),k(ca,2e4)),c.elements.length?(V(),z._lsFlush()):W()},checkElems:W,unveil:ba}}(),E=function(){var a,c=A(function(a,b,c,d){var e,f,g;if(a._lazysizesWidth=d,d+="px",a.setAttribute("sizes",d),n.test(b.nodeName||""))for(e=b.getElementsByTagName("source"),f=0,g=e.length;g>f;f++)e[f].setAttribute("sizes",d);c.detail.dataAttr||w(a,c.detail)}),e=function(a,b,d){var e,f=a.parentNode;f&&(d=y(a,f,d),e=v(a,"lazybeforesizes",{width:d,dataAttr:!!b}),e.defaultPrevented||(d=e.detail.width,d&&d!==a._lazysizesWidth&&c(a,f,e,d)))},f=function(){var b,c=a.length;if(c)for(b=0;c>b;b++)e(a[b])},g=C(f);return{_:function(){a=b.getElementsByClassName(d.autosizesClass),j("resize",g)},checkElems:g,updateElem:e}}(),F=function(){F.i||(F.i=!0,E._(),D._())};return c={cfg:d,autoSizer:E,loader:D,init:F,uP:w,aC:s,rC:t,hC:r,fire:v,gW:y,rAF:z}}});

/*! lazysizes - v4.0.1 */
!function(a,b){var c=function(){b(a.lazySizes),a.removeEventListener("lazyunveilread",c,!0)};b=b.bind(null,a,a.document),"object"==typeof module&&module.exports?b(require("lazysizes")):a.lazySizes?c():a.addEventListener("lazyunveilread",c,!0)}(window,function(a,b,c){"use strict";function d(a,c){if(!g[a]){var d=b.createElement(c?"link":"script"),e=b.getElementsByTagName("script")[0];c?(d.rel="stylesheet",d.href=a):d.src=a,g[a]=!0,g[d.src||d.href]=!0,e.parentNode.insertBefore(d,e)}}var e,f,g={};b.addEventListener&&(f=/\(|\)|\s|'/,e=function(a,c){var d=b.createElement("img");d.onload=function(){d.onload=null,d.onerror=null,d=null,c()},d.onerror=d.onload,d.src=a,d&&d.complete&&d.onload&&d.onload()},addEventListener("lazybeforeunveil",function(a){if(a.detail.instance==c){var b,g,h,i;a.defaultPrevented||("none"==a.target.preload&&(a.target.preload="auto"),b=a.target.getAttribute("data-link"),b&&d(b,!0),b=a.target.getAttribute("data-script"),b&&d(b),b=a.target.getAttribute("data-require"),b&&(c.cfg.requireJs?c.cfg.requireJs([b]):d(b)),h=a.target.getAttribute("data-bg"),h&&(a.detail.firesLoad=!0,g=function(){a.target.style.backgroundImage="url("+(f.test(h)?JSON.stringify(h):h)+")",a.detail.firesLoad=!1,c.fire(a.target,"_lazyloaded",{},!0,!0)},e(h,g)),i=a.target.getAttribute("data-poster"),i&&(a.detail.firesLoad=!0,g=function(){a.target.poster=i,a.detail.firesLoad=!1,c.fire(a.target,"_lazyloaded",{},!0,!0)},e(i,g)))}},!1))});



// A simple JS library that detects mobile devices. https://github.com/kaimallea/isMobile
!function(a){var b=/iPhone/i,c=/iPod/i,d=/iPad/i,e=/(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,f=/Android/i,g=/(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,h=/(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,i=/IEMobile/i,j=/(?=.*\bWindows\b)(?=.*\bARM\b)/i,k=/BlackBerry/i,l=/BB10/i,m=/Opera Mini/i,n=/(CriOS|Chrome)(?=.*\bMobile\b)/i,o=/(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,p=new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)","i"),q=function(a,b){return a.test(b)},r=function(a){var r=a||navigator.userAgent,s=r.split("[FBAN");return"undefined"!=typeof s[1]&&(r=s[0]),this.apple={phone:q(b,r),ipod:q(c,r),tablet:!q(b,r)&&q(d,r),device:q(b,r)||q(c,r)||q(d,r)},this.amazon={phone:q(g,r),tablet:!q(g,r)&&q(h,r),device:q(g,r)||q(h,r)},this.android={phone:q(g,r)||q(e,r),tablet:!q(g,r)&&!q(e,r)&&(q(h,r)||q(f,r)),device:q(g,r)||q(h,r)||q(e,r)||q(f,r)},this.windows={phone:q(i,r),tablet:q(j,r),device:q(i,r)||q(j,r)},this.other={blackberry:q(k,r),blackberry10:q(l,r),opera:q(m,r),firefox:q(o,r),chrome:q(n,r),device:q(k,r)||q(l,r)||q(m,r)||q(o,r)||q(n,r)},this.seven_inch=q(p,r),this.any=this.apple.device||this.android.device||this.windows.device||this.other.device||this.seven_inch,this.phone=this.apple.phone||this.android.phone||this.windows.phone,this.tablet=this.apple.tablet||this.android.tablet||this.windows.tablet,"undefined"==typeof window?this:void 0},s=function(){var a=new r;return a.Class=r,a};"undefined"!=typeof module&&module.exports&&"undefined"==typeof window?module.exports=r:"undefined"!=typeof module&&module.exports&&"undefined"!=typeof window?module.exports=s():"function"==typeof define&&define.amd?define("isMobile",[],a.isMobile=s()):a.isMobile=s()}(this);


// qrcode
(function(r){r.fn.qrcode=function(h){var s;function u(a){this.mode=s;this.data=a}function o(a,c){this.typeNumber=a;this.errorCorrectLevel=c;this.modules=null;this.moduleCount=0;this.dataCache=null;this.dataList=[]}function q(a,c){if(void 0==a.length){throw Error(a.length+"/"+c)}for(var d=0;d<a.length&&0==a[d];){d++}this.num=Array(a.length-d+c);for(var b=0;b<a.length-d;b++){this.num[b]=a[b+d]}}function p(a,c){this.totalCount=a;this.dataCount=c}function t(){this.buffer=[];this.length=0}u.prototype={getLength:function(){return this.data.length},write:function(a){for(var c=0;c<this.data.length;c++){a.put(this.data.charCodeAt(c),8)}}};o.prototype={addData:function(a){this.dataList.push(new u(a));this.dataCache=null},isDark:function(a,c){if(0>a||this.moduleCount<=a||0>c||this.moduleCount<=c){throw Error(a+","+c)}return this.modules[a][c]},getModuleCount:function(){return this.moduleCount},make:function(){if(1>this.typeNumber){for(var a=1,a=1;40>a;a++){for(var c=p.getRSBlocks(a,this.errorCorrectLevel),d=new t,b=0,e=0;e<c.length;e++){b+=c[e].dataCount}for(e=0;e<this.dataList.length;e++){c=this.dataList[e],d.put(c.mode,4),d.put(c.getLength(),j.getLengthInBits(c.mode,a)),c.write(d)}if(d.getLengthInBits()<=8*b){break}}this.typeNumber=a}this.makeImpl(!1,this.getBestMaskPattern())},makeImpl:function(a,c){this.moduleCount=4*this.typeNumber+17;this.modules=Array(this.moduleCount);for(var d=0;d<this.moduleCount;d++){this.modules[d]=Array(this.moduleCount);for(var b=0;b<this.moduleCount;b++){this.modules[d][b]=null}}this.setupPositionProbePattern(0,0);this.setupPositionProbePattern(this.moduleCount-7,0);this.setupPositionProbePattern(0,this.moduleCount-7);this.setupPositionAdjustPattern();this.setupTimingPattern();this.setupTypeInfo(a,c);7<=this.typeNumber&&this.setupTypeNumber(a);null==this.dataCache&&(this.dataCache=o.createData(this.typeNumber,this.errorCorrectLevel,this.dataList));this.mapData(this.dataCache,c)},setupPositionProbePattern:function(a,c){for(var d=-1;7>=d;d++){if(!(-1>=a+d||this.moduleCount<=a+d)){for(var b=-1;7>=b;b++){-1>=c+b||this.moduleCount<=c+b||(this.modules[a+d][c+b]=0<=d&&6>=d&&(0==b||6==b)||0<=b&&6>=b&&(0==d||6==d)||2<=d&&4>=d&&2<=b&&4>=b?!0:!1)}}}},getBestMaskPattern:function(){for(var a=0,c=0,d=0;8>d;d++){this.makeImpl(!0,d);var b=j.getLostPoint(this);if(0==d||a>b){a=b,c=d}}return c},createMovieClip:function(a,c,d){a=a.createEmptyMovieClip(c,d);this.make();for(c=0;c<this.modules.length;c++){for(var d=1*c,b=0;b<this.modules[c].length;b++){var e=1*b;this.modules[c][b]&&(a.beginFill(0,100),a.moveTo(e,d),a.lineTo(e+1,d),a.lineTo(e+1,d+1),a.lineTo(e,d+1),a.endFill())}}return a},setupTimingPattern:function(){for(var a=8;a<this.moduleCount-8;a++){null==this.modules[a][6]&&(this.modules[a][6]=0==a%2)}for(a=8;a<this.moduleCount-8;a++){null==this.modules[6][a]&&(this.modules[6][a]=0==a%2)}},setupPositionAdjustPattern:function(){for(var a=j.getPatternPosition(this.typeNumber),c=0;c<a.length;c++){for(var d=0;d<a.length;d++){var b=a[c],e=a[d];if(null==this.modules[b][e]){for(var f=-2;2>=f;f++){for(var i=-2;2>=i;i++){this.modules[b+f][e+i]=-2==f||2==f||-2==i||2==i||0==f&&0==i?!0:!1}}}}}},setupTypeNumber:function(a){for(var c=j.getBCHTypeNumber(this.typeNumber),d=0;18>d;d++){var b=!a&&1==(c>>d&1);this.modules[Math.floor(d/3)][d%3+this.moduleCount-8-3]=b}for(d=0;18>d;d++){b=!a&&1==(c>>d&1),this.modules[d%3+this.moduleCount-8-3][Math.floor(d/3)]=b}},setupTypeInfo:function(a,c){for(var d=j.getBCHTypeInfo(this.errorCorrectLevel<<3|c),b=0;15>b;b++){var e=!a&&1==(d>>b&1);6>b?this.modules[b][8]=e:8>b?this.modules[b+1][8]=e:this.modules[this.moduleCount-15+b][8]=e}for(b=0;15>b;b++){e=!a&&1==(d>>b&1),8>b?this.modules[8][this.moduleCount-b-1]=e:9>b?this.modules[8][15-b-1+1]=e:this.modules[8][15-b-1]=e}this.modules[this.moduleCount-8][8]=!a},mapData:function(a,c){for(var d=-1,b=this.moduleCount-1,e=7,f=0,i=this.moduleCount-1;0<i;i-=2){for(6==i&&i--;;){for(var g=0;2>g;g++){if(null==this.modules[b][i-g]){var n=!1;f<a.length&&(n=1==(a[f]>>>e&1));j.getMask(c,b,i-g)&&(n=!n);this.modules[b][i-g]=n;e--;-1==e&&(f++,e=7)}}b+=d;if(0>b||this.moduleCount<=b){b-=d;d=-d;break}}}}};o.PAD0=236;o.PAD1=17;o.createData=function(a,c,d){for(var c=p.getRSBlocks(a,c),b=new t,e=0;e<d.length;e++){var f=d[e];b.put(f.mode,4);b.put(f.getLength(),j.getLengthInBits(f.mode,a));f.write(b)}for(e=a=0;e<c.length;e++){a+=c[e].dataCount}if(b.getLengthInBits()>8*a){throw Error("code length overflow. ("+b.getLengthInBits()+">"+8*a+")")}for(b.getLengthInBits()+4<=8*a&&b.put(0,4);0!=b.getLengthInBits()%8;){b.putBit(!1)}for(;!(b.getLengthInBits()>=8*a);){b.put(o.PAD0,8);if(b.getLengthInBits()>=8*a){break}b.put(o.PAD1,8)}return o.createBytes(b,c)};o.createBytes=function(a,c){for(var d=0,b=0,e=0,f=Array(c.length),i=Array(c.length),g=0;g<c.length;g++){var n=c[g].dataCount,h=c[g].totalCount-n,b=Math.max(b,n),e=Math.max(e,h);f[g]=Array(n);for(var k=0;k<f[g].length;k++){f[g][k]=255&a.buffer[k+d]}d+=n;k=j.getErrorCorrectPolynomial(h);n=(new q(f[g],k.getLength()-1)).mod(k);
i[g]=Array(k.getLength()-1);for(k=0;k<i[g].length;k++){h=k+n.getLength()-i[g].length,i[g][k]=0<=h?n.get(h):0}}for(k=g=0;k<c.length;k++){g+=c[k].totalCount}d=Array(g);for(k=n=0;k<b;k++){for(g=0;g<c.length;g++){k<f[g].length&&(d[n++]=f[g][k])}}for(k=0;k<e;k++){for(g=0;g<c.length;g++){k<i[g].length&&(d[n++]=i[g][k])}}return d};s=4;for(var j={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(a){for(var c=a<<10;0<=j.getBCHDigit(c)-j.getBCHDigit(j.G15);){c^=j.G15<<j.getBCHDigit(c)-j.getBCHDigit(j.G15)}return(a<<10|c)^j.G15_MASK},getBCHTypeNumber:function(a){for(var c=a<<12;0<=j.getBCHDigit(c)-j.getBCHDigit(j.G18);){c^=j.G18<<j.getBCHDigit(c)-j.getBCHDigit(j.G18)}return a<<12|c},getBCHDigit:function(a){for(var c=0;0!=a;){c++,a>>>=1}return c},getPatternPosition:function(a){return j.PATTERN_POSITION_TABLE[a-1]},getMask:function(a,c,d){switch(a){case 0:return 0==(c+d)%2;case 1:return 0==c%2;case 2:return 0==d%3;case 3:return 0==(c+d)%3;case 4:return 0==(Math.floor(c/2)+Math.floor(d/3))%2;case 5:return 0==c*d%2+c*d%3;case 6:return 0==(c*d%2+c*d%3)%2;case 7:return 0==(c*d%3+(c+d)%2)%2;default:throw Error("bad maskPattern:"+a)}},getErrorCorrectPolynomial:function(a){for(var c=new q([1],0),d=0;d<a;d++){c=c.multiply(new q([1,l.gexp(d)],0))}return c},getLengthInBits:function(a,c){if(1<=c&&10>c){switch(a){case 1:return 10;case 2:return 9;case s:return 8;case 8:return 8;default:throw Error("mode:"+a)}}else{if(27>c){switch(a){case 1:return 12;case 2:return 11;case s:return 16;case 8:return 10;default:throw Error("mode:"+a)}}else{if(41>c){switch(a){case 1:return 14;case 2:return 13;case s:return 16;case 8:return 12;default:throw Error("mode:"+a)}}else{throw Error("type:"+c)}}}},getLostPoint:function(a){for(var c=a.getModuleCount(),d=0,b=0;b<c;b++){for(var e=0;e<c;e++){for(var f=0,i=a.isDark(b,e),g=-1;1>=g;g++){if(!(0>b+g||c<=b+g)){for(var h=-1;1>=h;h++){0>e+h||c<=e+h||0==g&&0==h||i==a.isDark(b+g,e+h)&&f++}}}5<f&&(d+=3+f-5)}}for(b=0;b<c-1;b++){for(e=0;e<c-1;e++){if(f=0,a.isDark(b,e)&&f++,a.isDark(b+1,e)&&f++,a.isDark(b,e+1)&&f++,a.isDark(b+1,e+1)&&f++,0==f||4==f){d+=3}}}for(b=0;b<c;b++){for(e=0;e<c-6;e++){a.isDark(b,e)&&!a.isDark(b,e+1)&&a.isDark(b,e+2)&&a.isDark(b,e+3)&&a.isDark(b,e+4)&&!a.isDark(b,e+5)&&a.isDark(b,e+6)&&(d+=40)}}for(e=0;e<c;e++){for(b=0;b<c-6;b++){a.isDark(b,e)&&!a.isDark(b+1,e)&&a.isDark(b+2,e)&&a.isDark(b+3,e)&&a.isDark(b+4,e)&&!a.isDark(b+5,e)&&a.isDark(b+6,e)&&(d+=40)}}for(e=f=0;e<c;e++){for(b=0;b<c;b++){a.isDark(b,e)&&f++}}a=Math.abs(100*f/c/c-50)/5;return d+10*a}},l={glog:function(a){if(1>a){throw Error("glog("+a+")")}return l.LOG_TABLE[a]},gexp:function(a){for(;0>a;){a+=255}for(;256<=a;){a-=255}return l.EXP_TABLE[a]},EXP_TABLE:Array(256),LOG_TABLE:Array(256)},m=0;8>m;m++){l.EXP_TABLE[m]=1<<m}for(m=8;256>m;m++){l.EXP_TABLE[m]=l.EXP_TABLE[m-4]^l.EXP_TABLE[m-5]^l.EXP_TABLE[m-6]^l.EXP_TABLE[m-8]}for(m=0;255>m;m++){l.LOG_TABLE[l.EXP_TABLE[m]]=m}q.prototype={get:function(a){return this.num[a]},getLength:function(){return this.num.length},multiply:function(a){for(var c=Array(this.getLength()+a.getLength()-1),d=0;d<this.getLength();d++){for(var b=0;b<a.getLength();b++){c[d+b]^=l.gexp(l.glog(this.get(d))+l.glog(a.get(b)))}}return new q(c,0)},mod:function(a){if(0>this.getLength()-a.getLength()){return this}for(var c=l.glog(this.get(0))-l.glog(a.get(0)),d=Array(this.getLength()),b=0;b<this.getLength();b++){d[b]=this.get(b)}for(b=0;b<a.getLength();b++){d[b]^=l.gexp(l.glog(a.get(b))+c)}return(new q(d,0)).mod(a)}};p.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]];
p.getRSBlocks=function(a,c){var d=p.getRsBlockTable(a,c);if(void 0==d){throw Error("bad rs block @ typeNumber:"+a+"/errorCorrectLevel:"+c)}for(var b=d.length/3,e=[],f=0;f<b;f++){for(var h=d[3*f+0],g=d[3*f+1],j=d[3*f+2],l=0;l<h;l++){e.push(new p(g,j))}}return e};p.getRsBlockTable=function(a,c){switch(c){case 1:return p.RS_BLOCK_TABLE[4*(a-1)+0];case 0:return p.RS_BLOCK_TABLE[4*(a-1)+1];case 3:return p.RS_BLOCK_TABLE[4*(a-1)+2];case 2:return p.RS_BLOCK_TABLE[4*(a-1)+3]}};t.prototype={get:function(a){return 1==(this.buffer[Math.floor(a/8)]>>>7-a%8&1)},put:function(a,c){for(var d=0;d<c;d++){this.putBit(1==(a>>>c-d-1&1))}},getLengthInBits:function(){return this.length},putBit:function(a){var c=Math.floor(this.length/8);this.buffer.length<=c&&this.buffer.push(0);a&&(this.buffer[c]|=128>>>this.length%8);this.length++}};"string"===typeof h&&(h={text:h});h=r.extend({},{render:"canvas",width:256,height:256,typeNumber:-1,correctLevel:2,background:"#ffffff",foreground:"#000000"},h);return this.each(function(){var a;if("canvas"==h.render){a=new o(h.typeNumber,h.correctLevel);a.addData(h.text);a.make();var c=document.createElement("canvas");c.width=h.width;c.height=h.height;for(var d=c.getContext("2d"),b=h.width/a.getModuleCount(),e=h.height/a.getModuleCount(),f=0;f<a.getModuleCount();f++){for(var i=0;i<a.getModuleCount();i++){d.fillStyle=a.isDark(f,i)?h.foreground:h.background;var g=Math.ceil((i+1)*b)-Math.floor(i*b),j=Math.ceil((f+1)*b)-Math.floor(f*b);d.fillRect(Math.round(i*b),Math.round(f*e),g,j)}}}else{a=new o(h.typeNumber,h.correctLevel);a.addData(h.text);a.make();c=r("<table></table>").css("width",h.width+"px").css("height",h.height+"px").css("border","0px").css("border-collapse","collapse").css("background-color",h.background);d=h.width/a.getModuleCount();b=h.height/a.getModuleCount();for(e=0;e<a.getModuleCount();e++){f=r("<tr></tr>").css("height",b+"px").appendTo(c);for(i=0;i<a.getModuleCount();i++){r("<td></td>").css("width",d+"px").css("background-color",a.isDark(e,i)?h.foreground:h.background).appendTo(f)}}}a=c;jQuery(a).appendTo(this)})}})(jQuery);



/* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
 * @license MIT */
 
!function(n,e){"function"==typeof define&&define.amd?define(e):"object"==typeof exports?module.exports=e():n.NProgress=e()}(this,function(){var e,t,o={version:"0.2.0"},a=o.settings={minimum:.08,easing:"linear",positionUsing:"",speed:200,trickle:!0,trickleSpeed:200,showSpinner:!0,barSelector:'[role="bar"]',spinnerSelector:'[role="spinner"]',parent:"body",template:'<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'};function u(n,e,t){return n<e?e:t<n?t:n}function c(n){return 100*(-1+n)}o.configure=function(n){var e,t;for(e in n)void 0!==(t=n[e])&&n.hasOwnProperty(e)&&(a[e]=t);return this},o.status=null,o.set=function(e){var n=o.isStarted();e=u(e,a.minimum,1),o.status=1===e?null:e;var t=o.render(!n),r=t.querySelector(a.barSelector),i=a.speed,s=a.easing;return t.offsetWidth,l(function(n){""===a.positionUsing&&(a.positionUsing=o.getPositioningCSS()),f(r,function(n,e,t){var r;r="translate3d"===a.positionUsing?{transform:"translate3d("+c(n)+"%,0,0)"}:"translate"===a.positionUsing?{transform:"translate("+c(n)+"%,0)"}:{"margin-left":c(n)+"%"};return r.transition="all "+e+"ms "+t,r}(e,i,s)),1===e?(f(t,{transition:"none",opacity:1}),t.offsetWidth,setTimeout(function(){f(t,{transition:"all "+i+"ms linear",opacity:0}),setTimeout(function(){o.remove(),n()},i)},i)):setTimeout(n,i)}),this},o.isStarted=function(){return"number"==typeof o.status},o.start=function(){o.status||o.set(0);var n=function(){setTimeout(function(){o.status&&(o.trickle(),n())},a.trickleSpeed)};return a.trickle&&n(),this},o.done=function(n){return n||o.status?o.inc(.3+.5*Math.random()).set(1):this},o.inc=function(n){var e=o.status;return e?1<e?void 0:("number"!=typeof n&&(n=0<=e&&e<.2?.1:.2<=e&&e<.5?.04:.5<=e&&e<.8?.02:.8<=e&&e<.99?.005:0),e=u(e+n,0,.994),o.set(e)):o.start()},o.trickle=function(){return o.inc()},t=e=0,o.promise=function(n){return n&&"resolved"!==n.state()&&(0===t&&o.start(),e++,t++,n.always(function(){0==--t?(e=0,o.done()):o.set((e-t)/e)})),this},o.render=function(n){if(o.isRendered())return document.getElementById("nprogress");d(document.documentElement,"nprogress-busy");var e=document.createElement("div");e.id="nprogress",e.innerHTML=a.template;var t,r=e.querySelector(a.barSelector),i=n?"-100":c(o.status||0),s=document.querySelector(a.parent);return f(r,{transition:"all 0 linear",transform:"translate3d("+i+"%,0,0)"}),a.showSpinner||(t=e.querySelector(a.spinnerSelector))&&m(t),s!=document.body&&d(s,"nprogress-custom-parent"),s.appendChild(e),e},o.remove=function(){r(document.documentElement,"nprogress-busy"),r(document.querySelector(a.parent),"nprogress-custom-parent");var n=document.getElementById("nprogress");n&&m(n)},o.isRendered=function(){return!!document.getElementById("nprogress")},o.getPositioningCSS=function(){var n=document.body.style,e="WebkitTransform"in n?"Webkit":"MozTransform"in n?"Moz":"msTransform"in n?"ms":"OTransform"in n?"O":"";return e+"Perspective"in n?"translate3d":e+"Transform"in n?"translate":"margin"};var l=function(){var e=[];function t(){var n=e.shift();n&&n(t)}return function(n){e.push(n),1==e.length&&t()}}(),f=function(){var s=["Webkit","O","Moz","ms"],e={};function r(n){return n=n.replace(/^-ms-/,"ms-").replace(/-([\da-z])/gi,function(n,e){return e.toUpperCase()}),e[n]||(e[n]=function(n){var e=document.body.style;if(n in e)return n;for(var t,r=s.length,i=n.charAt(0).toUpperCase()+n.slice(1);r--;)if((t=s[r]+i)in e)return t;return n}(n))}function o(n,e,t){e=r(e),n.style[e]=t}return function(n,e){var t,r,i=arguments;if(2==i.length)for(t in e)void 0!==(r=e[t])&&e.hasOwnProperty(t)&&o(n,t,r);else o(n,i[1],i[2])}}();function i(n,e){return 0<=("string"==typeof n?n:s(n)).indexOf(" "+e+" ")}function d(n,e){var t=s(n),r=t+e;i(t,e)||(n.className=r.substring(1))}function r(n,e){var t,r=s(n);i(n,e)&&(t=r.replace(" "+e+" "," "),n.className=t.substring(1,t.length-1))}function s(n){return(" "+(n&&n.className||"")+" ").replace(/\s+/gi," ")}function m(n){n&&n.parentNode&&n.parentNode.removeChild(n)}return o});


window.lazySizesConfig = window.lazySizesConfig || {};
window.lazySizesConfig.loadHidden = false;


// document main page
$(document).ready(function(){

	

	// TBUI
	window.TBUI = window.TBUI || {}

    TBUI.bd = $('body')
    TBUI.siteurl = TBUI.siteurl
    TBUI.uri = TBUI.uri
	TBUI.ajaxpager = TBUI.ajaxpager ? Number(TBUI.ajaxpager) : 10
    TBUI.pagenum = TBUI.pagenum ? Number(TBUI.pagenum) : 20
    TBUI.shareimage = TBUI.shareimage || ''
	TBUI.shareimagethumb = TBUI.shareimagethumb ? Number(TBUI.shareimagethumb) : 1
	TBUI.is_login_popup = TBUI.is_login_popup ? Number(TBUI.is_login_popup) : 1
	TBUI.click = 'click'

	

	$(".m-navbar-start").on("click", function() {
    	TBUI.bd.toggleClass("m-navbar-on")
	});
	$(".m-mask").on("click", function() {
	    TBUI.bd.removeClass("m-navbar-on"),
	    TBUI.bd.removeClass("m-wel-on")
	});
	$(".m-wel-start").on("click", function() {
	    TBUI.bd.toggleClass("m-wel-on")
	});
	$("#search").on("click", function(e) {
	    $("#header-search-dropdown").toggleClass("is-active")
	});

	if (TBUI.is_header_fixed == 1) {
		if ($(window).width() > 1024 ) {
	 		var fixedheader = $('header.header');
	 		$(window).scroll(function() {
			    var h = document.documentElement.scrollTop + document.body.scrollTop;
			    if (h > 88) {
			    	fixedheader.addClass('fixed');
			    	$('body').addClass('fixed');
			    }else{
			    	fixedheader.removeClass('fixed')
			    	$('body').removeClass('fixed')
			    }
			})
	 	}
	}

	// 网站底部通知
   $(window).scroll(function() {
   		if($.cookie("ri_notice_cookie")==null){
            var h = document.documentElement.scrollTop + document.body.scrollTop;
            if (h > 88) {
               $(".notice-info").slideDown(); 
            }
		}
    });
    $(".notice-info .close").click(function(){
        $(".notice-info").slideUp();
        $.cookie('ri_notice_cookie', '1', { expires: 3 });
    });

	 // CONET download_popup A
    $(".download-popup").on("click",function(){
        var url = $(this).attr('data-url');
        var info = $(this).attr('data-info');
        if (!info) {info='无需密码'}
        popup.showCustomModal({
            template: "Download",  
            layerClose: 1,
            data: {
		        url: url,
		        info:info
		    }
        });
        return false;
    });


	// if (TBUI.is_header_fixed == 1) {
	// 	//自定义弹出公告
		
	// 	function timmerpopup(){
	// 	  popup.showCustomModal({
	// 	          template: "Popup",
	// 	          layerClose: 0,
	// 	          data: {
	// 	              html: TBUI.customnotehtml
	// 	          }
	// 	    });
	// 	}
	// 	setTimeout(timmerpopup,3000);　//8s后弹出
	// 	clearTimeout(timmerpopup); //取消
	// }
	// 移动端自动将下载信息放文章末尾
 	var this_max_width = $(window).width();
 	if (this_max_width < 1024 ) {
 		$(".sidebar .widget.widget-download").insertAfter($(".article-content .article-actions.clearfix"));
 	}else{
 		var t_sidebar = $('.container .sidebar') ? 1 : 0
 		if (t_sidebar) {
 			$('.container .sidebar').theiaStickySidebar({
		        additionalMarginTop: 20
		    });
 		}
 	}

 	// 弹窗登录 alert
	if (TBUI.is_login_popup == 1) {
		var etap_login = $('[etap="login_btn"]');
		var etap_register = $('[etap="register_btn"]');
		var oauth_html = '';
		var email_reg_html = '';
		if (TBUI.is_oauth_qq == 1) {
			oauth_html = '<div class="sign-qq"> <a href="'+TBUI.uri+'/oauth/qq?rurl='+window.location.href+'" title="使用QQ账户登录"></a> </div>';
		}
		if (TBUI.is_email_reg == 1) {
			email_reg_html = '<div class="item"> <input class="ipt" id="captcha" type="text" name="captcha" placeholder="输入验证码" required="" /> <span class="captcha-clk inline">发送邮箱验证码</span> </div>';
		}
		etap_login.on(TBUI.click,function(e){
			e.preventDefault();
			// $("footer .popup-login").remove();
		    popup.showCustomModal({
		        template: "Login",
		        layerClose: 1,
		        data: {
			        html: oauth_html
			    }
		    });

		});
		etap_register.on(TBUI.click,function(e){
			e.preventDefault();
			$("footer .popup-register").remove();
		    popup.showCustomModal({
		        template: "Register",
		        layerClose: 1,
		        data: {
			        html: oauth_html,
			        email_html: email_reg_html
			    }
		    });
		})

	}

	// LOGING REG
	//REMOVE THIS - it's just to show error messages 
	$('.sign-form').find('input[type="submit"]').on('click', function(event){
		event.preventDefault();
		$('.sign-form').find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
	});



	//登陆
	$(document).ready(function() {
		var _loginTipstimer
		function logtips(str){
			if( !str ) return false
			_loginTipstimer && clearTimeout(_loginTipstimer)
			$('.sign-tips').html(str).animate({
				height: 60
			}, 220)
			_loginTipstimer = setTimeout(function(){
				$('.sign-tips').animate({
					height: 0
				}, 220)
			}, 5000)
		}
		
		function is_check_name(str) {    
			return /^[\w]{3,16}$/.test(str) 
		}
		function is_check_mail(str) {
			return /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(str)
		}
			

		$('body').on('click','.captcha-clk',function(){
			if( !is_check_mail($("#user_email").val()) ){
				logtips('邮箱格式错误')
				return
			}
			
			var captcha = $(this);
			if(captcha.hasClass("disabled")){
				logtips('您操作太快了，等等吧')
			}else{
				captcha.addClass("disabled");
				captcha.html("发送中...");
				$.post(
					TBUI.uri+'/action/captcha.php?'+Math.random(),
					{
						action: "WPAY_captcha",
						email:$("#user_email").val()
					},
					function (data) {
						if($.trim(data) == "1"){
							logtips('已发送验证码至邮箱')
							var countdown=60; 
							settime()
							function settime() { 
								if (countdown == 0) { 
									captcha.removeClass("disabled");   
									captcha.html("发送验证码");
									countdown = 60; 
									return;
								} else { 
									captcha.addClass("disabled");
									captcha.html("重新发送(" + countdown + ")"); 
									countdown--; 
								} 
								setTimeout(function() { settime() },1000) 
							}

						}else if($.trim(data) == "2"){
							logtips('邮箱已存在')
							captcha.html("发送验证码");
							captcha.removeClass("disabled"); 
						}else if($.trim(data) == "3"){
							logtips('该站点未启用SMTP邮件功能')
							captcha.html("发送验证码");
							captcha.removeClass("disabled"); 
						}else{
							logtips('验证码发送失败，请稍后重试')
							captcha.html("发送验证码");
							captcha.removeClass("disabled"); 
						}
					}
				);
			}
		});

		$('body').on('click', '.login-loader',function(){
			logtips("登录中，请稍等...");									
			$.post(
				TBUI.uri+'/action/login.php',
				{
					usr: $("#username").val(),
					pwd: $("#password").val(),
					rememberme: $('#rememberme').val(),
					action: "WPAY_login"
					
				},
				function (data) {
					if (parseInt(data) != "1") {
						logtips("用户名或密码错误");
					}
					else {
						logtips("登录成功，跳转中...");
						location.reload();                     
					}
				}
			);
		})
		$('body').on('click', '.register-loader',function(){
			if( !is_check_name($("#user_name").val()) ){
				logtips('用户名只能由字母数字或下划线组成的3-16位字符')
				return
			}
			
			if( !is_check_mail($("#user_email").val()) ){
				logtips('邮箱格式错误')
				return
			}

			if( $("#user_pass").val().length < 6 ){
				logtips('密码太短，至少6位')
				return
			}
			
			if( $("#user_pass").val() != $("#user_pass2").val()){
				logtips('两次输入密码不一致')
				return
			}
			
			logtips("注册中，请稍等...");
			$.post(
				TBUI.uri+'/action/login.php',
				{
					user_register: $("#user_name").val(),
					user_email: $("#user_email").val(),
					password: $("#user_pass").val(),
					captcha: $("#captcha").val(),
					action: "WPAY_register"
				},
				function (data) {
					if (parseInt(data) == 1) {
						logtips("注册成功，登录中...");
						location.reload(); 
					}
					else {
						logtips(data);
					}
				}
			);										   
		})
	});

	//fancybox
	$(function() {
		jQuery(".gallery a").attr("data-fancybox","images");
	});

	
	// AJAXPAGING
	if( TBUI.ajaxpager > 0 ){
		var ias = $.ias({
			// thresholdMargin: 400,
			triggerPageThreshold : TBUI.ajaxpager,
			history              : true,
			container            : '.excerpts',
			item                 : '.excerpt',
			next                 : '.next-page a'
		});

	    
	    ias.extension(new IASTriggerExtension({
			offset: 0,
			text: '加载更多···',
			html: '<div class="ias-trigger ias-trigger-prev bee" style=" text-align: center; "><a class="btn btn-primary">{text}</a></div>'
		}));

	    ias.extension(new IASSpinnerExtension({
			src: TBUI.uri+'/img/loading.gif',
			html: '<div class="pagination-loading"><img src="{src}"/></div>'
		}));
    }


    // REWARDS
    $('[etap="rewards"]').on(TBUI.click, function(){
    	$('.rewards-popover-mask, .rewards-popover').fadeIn()
    })

    $('[etap="rewards-close"]').on(TBUI.click, function(){
    	$('.rewards-popover-mask, .rewards-popover').fadeOut()
    })


    


    // ROLLBAR
	TBUI.bd.append('<div class="rollbar">'+ (is_page('comment-open') ? '<div class="rollbar-item" etap="to_comments"><i class="fa">&#xe655;</i></div>' : '') +'<div class="rollbar-item" etap="to_top"><i class="fa">&#xe619;</i></div></div>')

	var scroller = $('.rollbar')
	$(window).scroll(function() {
	    var h = document.documentElement.scrollTop + document.body.scrollTop
	    h > 200 ? scroller.fadeIn() : scroller.fadeOut();
	})


	$('[etap="to_comments"]').on(TBUI.click, function(){
		$('html,body').animate({
            scrollTop: $('#comments').offset().top + 15
        }, 300, function(){
        	$('#comment').focus()
        })
	})

	$('[etap="to_top"]').on(TBUI.click, function(){
		$('html,body').animate({
            scrollTop: 0
        }, 300)
	})




    // SHARE IMAGE
    if( TBUI.shareimage ){
        if( !TBUI.shareimagethumb && $('.article-content img:first').length ){
            TBUI.shareimage = $('.article-content img:first').attr('src')
        }
        TBUI.bd.prepend('<div id="shareimage"><img src="'+ TBUI.shareimage +'"></div>')
    }



    // SHARE
	var share = {
        url: document.URL,
        pic: TBUI.shareimage,
        title: document.title || '',
        desc: $('meta[name="description"]').length ? $('meta[name="description"]').attr('content') : ''    
    }


    $('.share-weixin').each(function(){
	    if( !$(this).find('.share-popover').length ){
			$(this).append('<span class="share-popover"><span class="share-popover-inner" id="weixin-qrcode"></span></span>')
			$('#weixin-qrcode').qrcode({
				width: 80,
				height: 80,
				text: $(this).data('url')
			})
		}
	})


	$('[etap="share"]').on(TBUI.click, function(){

		var dom = $(this)
	    var to = dom.data('share')
	    var url = ''

	    switch(to){
	        case 'qq':
	            url = 'http://connect.qq.com/widget/shareqq/index.html?url='+share.url+'&desc='+share.desc+'&summary='+share.title+'&site=zeshlife&pics='+share.pic
	            break;

	        case 'weibo':
	            url = 'http://service.weibo.com/share/share.php?title='+share.title+'&url='+share.url+'&source=bookmark&pic='+share.pic
	            break;

	        case 'douban':
	            url = 'http://www.douban.com/share/service?image='+share.pic+'&href='+share.url+'&name='+share.title+'&text='+share.desc
	            break;

	        case 'qzone':
	            url = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+share.url+'&title='+share.title+'&desc='+share.desc
	            break;

	        case 'tqq':
	            url = 'http://share.v.t.qq.com/index.php?c=share&a=index&url='+share.url+'&title='+share.title
	            break;

	        case 'renren':
	            url = 'http://widget.renren.com/dialog/share?srcUrl='+share.pic+'&resourceUrl='+share.url+'&title='+share.title+'&description='+share.desc
	            break;

	        case 'line':
	            url = 'http://line.naver.jp/R/msg/text/?'+share.title+'%0D%0A'+share.url
	            break;

	        case 'twitter':
	            url = 'https://twitter.com/intent/tweet?text='+share.title+'&url='+share.url
	            break;

	        case 'facebook':
	            url = 'https://www.facebook.com/sharer/sharer.php?u='+share.url+'&title='+share.title+'&description='+share.desc
	            break;

	    }

	    if( !dom.attr('href') && !dom.attr('target') ){
	    	dom.attr('href', url).attr('target', '_blank')
	    }
	})




	// LIKE
    $('.excerpts, .article-actions').on(TBUI.click, '[etap="like"]', function(){
    	var dom = $(this)
	    var pid = dom.attr('data-pid')

	    if( dom.hasClass('actived') ) return popup.showToast({type: "text",text:"您已赞"})

	    if ( !pid || !/^\d{1,}$/.test(pid) ) return;
	    
        var likes = $.cookie('likes') || ''
        if( $.inArray(pid, likes.split('.'))!==-1 ) return popup.showToast({type: "text",text:"您已赞"})
 
	    $.ajax({
	        url: TBUI.uri + '/action/like.php',
	        type: 'POST',
	        dataType: 'json',
	        data: {
	            id: pid
	        },
	        success: function(data, textStatus, xhr) {
	        	if (data.error==6) return popup.showToast({type: "text",text:"您已赞"})
	            if (data.error) return false;
	            dom.toggleClass('actived')
	            dom.find('span').html(data.response)
	        }
	    });
    })


	function is_page(name){
	    return TBUI.bd.hasClass(name) ? true : false;
	}

	// COMMENTS
	$('.commentlist .url').attr('target','_blank')

	$('.comment-user-change').on(TBUI.click, function(){
		$('#comment-author-info').slideDown(300)
    	$('#comment-author-info input:first').focus()
	})
	$('body').on('click', '.comment-reply-link', function(){
		addComment.moveForm( "comment-"+$(this).attr('data-commentid'), $(this).attr('data-commentid'), "respond", $(this).attr('data-postid') );
		return false; // 阻止默认行为
	});

    var edit_mode = '0',
        txt1 = '<div class="comt-tip comt-loading">评论提交中...</div>',
        txt2 = '<div class="comt-tip comt-error">#</div>',
        txt3 = '">',
        cancel_edit = '取消编辑',
        edit,
        num = 1,
        comm_array = [];
    comm_array.push('');

    $comments = $('#comments-title');
    $cancel = $('#cancel-comment-reply-link');
    cancel_text = $cancel.text();
    $submit = $('#commentform #submit');
    $submit.attr('disabled', false);
    $('.comt-tips').append(txt1 + txt2);
    $('.comt-loading').hide();
    $('.comt-error').hide();
    $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
    $('#commentform').submit(function() {
        $('.comt-loading').slideDown(300);
        $submit.attr('disabled', true).fadeTo('slow', 0.5);
        if (edit) $('#comment').after('<input type="text" name="edit_id" id="edit_id" value="' + edit + '" style="display:none;" />');
        $.ajax({
            url: TBUI.uri + '/action/comment.php',
            data: $(this).serialize(),
            type: $(this).attr('method'),
            error: function(request) {
                $('.comt-loading').slideUp(300);
                $('.comt-error').slideDown(300).html(request.responseText);
                setTimeout(function() {
                        $submit.attr('disabled', false).fadeTo('slow', 1);
                        $('.comt-error').slideUp(300)
                    },
                    3000)
            },
            success: function(data) {
                $('.comt-loading').slideUp(300);
                comm_array.push($('#comment').val());
                $('textarea').each(function() {
                    this.value = ''
                });
                var t = addComment,
                    cancel = t.I('cancel-comment-reply-link'),
                    temp = t.I('wp-temp-form-div'),
                    respond = t.I(t.respondId),
                    post = t.I('comment_post_ID').value,
                    parent = t.I('comment_parent').value;
                if (!edit && $comments.length) {
                    n = parseInt($comments.text().match(/\d+/));
                    $comments.text($comments.text().replace(n, n + 1))
                }
                new_htm = '" id="new_comm_' + num + '"></';
                new_htm = (parent == '0') ? ('\n<ol style="clear:both;" class="commentlist commentnew' + new_htm + 'ol>') : ('\n<ul class="children' + new_htm + 'ul>');
                ok_htm = '\n<span id="success_' + num + txt3;
                ok_htm += '</span><span></span>\n';

                if (parent == '0') {
                    if ($('#postcomments .commentlist').length) {
                        $('#postcomments .commentlist').before(new_htm);
                    } else {
                        $('#respond').after(new_htm);
                    }
                } else {
                    $('#respond').after(new_htm);
                }

                $('#comment-author-info').slideUp()

                // console.log( $('#new_comm_' + num) )
                $('#new_comm_' + num).hide().append(data);
                $('#new_comm_' + num + ' li').append(ok_htm);
                $('#new_comm_' + num).fadeIn(1000);
                /*$body.animate({
                        scrollTop: $('#new_comm_' + num).offset().top - 200,002
                    },
                    500);*/
                $('#new_comm_' + num).find('.comt-avatar .avatar').attr('src', $('.commentnew .avatar:last').attr('src'));
                countdown();
                num++;
                edit = '';
                $('*').remove('#edit_id');
                cancel.style.display = 'none';
                cancel.onclick = null;
                t.I('comment_parent').value = '0';
                if (temp && respond) {
                    temp.parentNode.insertBefore(respond, temp);
                    temp.parentNode.removeChild(temp)
                }
            }
        });
        return false
    });
    addComment = {
        moveForm: function(commId, parentId, respondId, postId, num) {
            var t = this,
                div, comm = t.I(commId),
                respond = t.I(respondId),
                cancel = t.I('cancel-comment-reply-link'),
                parent = t.I('comment_parent'),
                post = t.I('comment_post_ID');
            if (edit) exit_prev_edit();
            num ? (t.I('comment').value = comm_array[num], edit = t.I('new_comm_' + num).innerHTML.match(/(comment-)(\d+)/)[2], $new_sucs = $('#success_' + num), $new_sucs.hide(), $new_comm = $('#new_comm_' + num), $new_comm.hide(), $cancel.text(cancel_edit)) : $cancel.text(cancel_text);
            t.respondId = respondId;
            postId = postId || false;
            if (!t.I('wp-temp-form-div')) {
                div = document.createElement('div');
                div.id = 'wp-temp-form-div';
                div.style.display = 'none';
                respond.parentNode.insertBefore(div, respond)
            }!comm ? (temp = t.I('wp-temp-form-div'), t.I('comment_parent').value = '0', temp.parentNode.insertBefore(respond, temp), temp.parentNode.removeChild(temp)) : comm.parentNode.insertBefore(respond, comm.nextSibling);
            $body.animate({
                    scrollTop: $('#respond').offset().top - 180
                },
                400);
                // pcsheight()
            if (post && postId) post.value = postId;
            parent.value = parentId;
            cancel.style.display = '';
            cancel.onclick = function() {
                if (edit) exit_prev_edit();
                var t = addComment,
                    temp = t.I('wp-temp-form-div'),
                    respond = t.I(t.respondId);
                t.I('comment_parent').value = '0';
                if (temp && respond) {
                    temp.parentNode.insertBefore(respond, temp);
                    temp.parentNode.removeChild(temp)
                }
                this.style.display = 'none';
                this.onclick = null;
                return false
            };
            try {
                t.I('comment').focus()
            } catch (e) {}
            return false
        },
        I: function(e) {
            return document.getElementById(e)
        }
    };

    function exit_prev_edit() {
        $new_comm.show();
        $new_sucs.show();
        $('textarea').each(function() {
            this.value = ''
        });
        edit = ''
    }
    var wait = 15,
        submit_val = $submit.val();

    function countdown() {
        if (wait > 0) {
            $submit.val(wait);
            wait--;
            setTimeout(countdown, 1000)
        } else {
            $submit.val(submit_val).attr('disabled', false).fadeTo('slow', 1);
            wait = 15
        }
    }


})