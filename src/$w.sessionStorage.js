/**
  @file
  @author  Fyodorov "bga" Alexander <bga.email@gmail.com>
 
  @section LICENSE
 
  Experimental common javascript RIA library http://github.com/bga/jbasis

  Copyright (c) 2009-2010, Fyodorov "Bga" Alexander <bga.email@gmail.com>
  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:
      * Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
      * Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
      * The name of the developer may not be used to endorse or promote
        products derived from this software without specific prior
        written permission.

  THIS SOFTWARE IS PROVIDED BY FYODOROV "BGA" ALEXANDER "AS IS" AND ANY EXPRESS OR
  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
  IN NO EVENT SHALL FYODOROV "BGA" ALEXANDER BE LIABLE FOR ANY DIRECT, INDIRECT,
  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 
  @section DESCRIPTION
*/

if(!("jbSessionStorage" in $w))
{
  if(!("jbStorage" in window))
    window.jbStorage=function(){};
    
  window.ss_=window.jbSessionStorage=new jbStorage();
  
  ss_.keyValueMap_={};
  
  if(window.opera)
    ss_.tSpace_=16500000;
  else if(document.recalc)
    ss_.tSpace_=55000000;
  else if(window.navigator.mozIsLocallyAvailable)
    ss_.tSpace_=25000000;
  else if(window.WebKitPoint)
    ss_.tSpace_=78000000;
  else
    ss_.tSpace_=8000000; // why???
  
  ss_.eSpace_=null;
  ss_.length=null;
  ss_.needReenum_=true;
  ss_.keys_=[];
  
  ss_._load=function()
  {
    var d=+new Date();
    var t=window.top.name;
    
    if(t.substr(0, 16) !== "jbSessionStorage")
    {
      this.eSpace_=this.tSpace_;
      this.keys_.length=this.length=0;
      this.needReenum_=false;
      this.keyValueMap_={};
      
      return;
    }
      
    var i=16, j, len=t.length, temp;
    var key, value;
    var kvm=this.keyValueMap_, ks=this.keys_;
    var n=0;
    
    while(i<len)
    {
      temp=t.charCodeAt(i++);
    
      if(temp&0x8000)
        temp+=(t.charCodeAt(i++)<<15);
        
      key=t.substring(j=i, i+=temp);

      temp=t.charCodeAt(i++);
    
      if(temp&0x8000)
        temp+=(t.charCodeAt(i++)<<15);
        
      value=t.substring(j=i, i+=temp);
      
      kvm[key]=value;
      ks[n++]=key;
    }
    
    this.eSpace_=this.tSpace_-len;
    this.length=n;
    this.needReenum_=false;
    alert("load "+(new Date()-d)+" len = "+t.length);
  };
  
  ss_._save=function()
  {
    var d=+new Date();
    var t="jbSessionStorage";
    var key, kvm=this.keyValueMap_, value, n;
    var _fromCharCode=String.fromCharCode;
    
    for(key in kvm)
    {
      if(!kvm.hasOwnProperty(key))
        continue;

      if((n=key.length)<=0x7FFF)
        t+=_fromCharCode(n);
      else
        t+=_fromCharCode((n&0x7FFF)|0x8000)+_fromCharCode(n>>15);

      t+=key;

      if((n=(value=kvm[key]).length)<=0x7FFF)
        t+=_fromCharCode(n);
      else
        t+=_fromCharCode((n&0x7FFF)|0x8000)+_fromCharCode(n>>15);

      t+=value;
    }
    
    window.top.name=t;
    alert("save "+(new Date()-d)+" len "+t.length);
  };
  
  ss_._reenum=function()
  {
    var kvm=this.keyValueMap_, ks=this.keys_, i=0;
    
    ks.length=0;
    
    for(var key in kvm)
    {
      if(kvm.hasOwnProperty(key))
        ks[i++]=key;
    }
    
    this.needReenum_=false;
  };
  
  ss_.key=function(index)
  {
    if(this.needReenum_)
      this._reenum();
      
    return this.keys_[index|0];  
  };
  
  ss_.getItem=function(key)
  {
    return this.keyValueMap_[""+key];
  };
  
  ss_.setItem=function(key, value)
  {
    key+="";
    value+="";
    
    var kvm=this.keyValueMap_;
    var delta=0, oldValue=null, isValueChanged;
    
    if(kvm.hasOwnProperty(key))
    {
      delta=value.length-(oldValue=kvm[key]);
      isValueChanged= value !== oldValue;
    }
    else
    {
      delta=key.length+value.length+2;
      ++this.length;
      this.needReenum_=true;
      isValueChanged=true;
    }
    
    if(delta>this.eSpace_)
    {
      var err=new Error();
      
      err.name="DOMException";
      err.code=22; // QUOTA_EXCEEDED_ERR
      
      throw err;
    }
    else
    {
      this.eSpace_-=delta;
    }
    
    kvm[key]=value;
    
    if(isValueChanged)
      this._afterchange();
  },
  ss_.removeItem=function(key)
  {
    key+="";
    
    var kvm=this.keyValueMap_;
    
    if(!kvm.hasOwnProperty(key))
      return;
    
    var oldValue=kvm[key];
    
    this.eSpace_+=key.length+oldValue.length+2;
    --this.length;
    this.needReenum_=true;
    delete kvm[key];
    
    this._afterchange();
  },
  ss_.clear=function()
  {
    this.keyValueMap_={};
    this.eSpace_=this.tSpace_;
    this.keys_.length=0;
    this.needReenum_=false;
    
    this._afterchange();
  }
  ss_._afterchange=function(){};
  
  ss_._load();
  
  ss_._saveBind=function(){ jbSessionStorage._save(); };
  
  if(window.opera)
  {
    try
    {
      opera.io.webserver.addEventListener('_close', ss_._saveBind, false);
    }
    catch(err)
    {
      ss_.saveDelay_=250;
      ss_.lastChangeTime_=0;
      ss_.saveTimeoutId_=null;
      
      ss_._saveTimeout=function()
      {
        if((new Date())-this.lastChangeTime_<50)
        {
          console.log("wait");
          
          return this.saveTimeoutId_=setTimeout(this._saveTimeoutBind, this.saveDelay_);
        }
        
        this.saveTimeoutId_=null;
        this._save();  
      };
      
      ss_._saveTimeoutBind=function(){ jbSessionStorage._saveTimeout(); };
      
      ss_._afterchange=function()
      {
        this.lastChangeTime_=+new Date();
        
        if(this.saveTimeoutId_==null)
          this.saveTimeoutId_=setTimeout(this._saveTimeoutBind, this.saveDelay_);
      };
    }
  }
  else
  {
    if(window.addEventListener)
      window.addEventListener("unload", ss_._saveBind, false);
    else  
      window.attachEvent("onunload", ss_._saveBind);
  }
  
  window.ss_=undefined;  
}