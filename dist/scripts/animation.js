(function(){this.Animation=function(){function t(t){var i,n,o,s,e,h,a,p;for(this.options=t,this.animatedElements=[],h=$(this.options.selector),s=0,e=h.length;s<e;s++){o=h[s],i=$(o),this.animatedElements.push(i),i.options=$.extend(!0,{},this.options),a=i.data();for(n in a)p=a[n],n in this.options&&(i.options[n]=p)}}return t}()}).call(this);