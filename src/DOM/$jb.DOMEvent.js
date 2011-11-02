$jb.Build._scope().
_require("$jb/$jb.nav.js").
_require("$jb/DOMNode.js").
_require("$jb/$G.Function.js").
_willDeclared("$jb/$jb.DOMEvent.js").
_completed(function(){

if($jb.DOMNode==null)
  $jb.DOMNode={};

if($jb.DOMEvent==null)
  $jb.DOMEvent={};


$jb.DOMEvent._rawAttach=null;

if($w.addEventListener)
{
  $jb.DOMEvent._rawAttach=function(v,name,_func)
  {
    v.addEventListener(name,_func,false);
  };
}
else if($w.attachEvent)
{
  $jb.DOMEvent._rawAttach=function(v,name,_func)
  {
    v.attachEvent("on"+name,_func);
  };
}  


$jb.DOMEvent._rawDetach=null;

if($w.removeEventListener)
{
  $jb.DOMEvent._rawDetach=function(v,name,_func)
  {
    v.removeEventListener(name,_func,false);
  };
}
else if($w.detachEvent)  
{
  $jb.DOMEvent._rawDetach=function(v,name,_func)
  {
    v.detachEvent("on"+name,_func);
  };
}


$jb.DOMEvent._rawFire=null;

if($w.dispatchEvent)
{
  $jb.DOMEvent._rawFire=function(v,e)
  {
    return v.dispatchEvent(e);
  };
}
else if($w.fireEvent)
{
  $jb.DOMEvent._rawFire=function(v,e)
  {
    return v.fireEvent("on"+e.type,e);
  };
}


$jb.DOMEvent._rawStop=null;
$jb.DOMEvent._rawStopDefault=null;

if($w.event)
{
  $jb.DOMEvent._rawStop=function(event)
  {
    $w.event.cancelBubble=true;
  };
  $jb.DOMEvent._rawStopDefault=function(e)
  {
    $w.event.returnValue=false;
  };
}
else
{
  $jb.DOMEvent._rawStop=function(e)
  {
    e.stopPropagation();
  };
  $jb.DOMEvent._rawStopDefault=function(e)
  {
    e.preventDefault();
  };
}


$jb.DOMEventObject=null;
$jb.Dom._createEvent=null;
$jb.DOMEvent.__preFireAdaptor=null;
$jb.DOMEvent.__postFireAdaptor=null;

if($d.createEvent && $w.Event)
{
  $jb.DOMEventObject=$w.Event;
  $jb.Dom._createEvent=$d.createEvent;
  $jb.DOMEvent.__preFireAdaptor=$jb._self;
  $jb.DOMEvent.__postFireAdaptor=$jb._self;
}
else if($d.createEventObject /*&& $jb.nav._ie()*/)
{
  $jb.DOMEventObject=function()
  {
    return this;
  };
    
  $jb.DOMEventObject.CAPTURING_PHASE=1;
  $jb.DOMEventObject.AT_TARGET=2;
  $jb.DOMEventObject.BUBBLING_PHASE=3;
  
  $jb.DOMEventObject.prototype.initEvent=function(type,canBubble,cancelable)
  {
    this.type=type;
    this.bubbles=canBubble;
    this.cancelable=cancelable;
  };
  
  $jb.DOMEventObject.prototype.initUIEvent=function(type,canBubble,cancelable,view,detail)
  {
    this.initEvent(type,canBubble,cancelable)
    
    this.view=view;  
    this.detail=detail;
  };
  
  $jb.DOMEventObject.prototype.initMouseEvent=
  function(type,canBubble,cancelable,view,detail,screenX, 
    screenY,clientX,clientY,ctrlKey,altKey,shiftKey,metaKey,button,relatedTarget
  )
  {
    this.initUIEvent(type,canBubble,cancelable,view,detail);
    
    this.screenX=screenX;
    this.screenY=screenY
    this.clientX=clientX;
    this.clientY=clientY;
    this.ctrlKey=ctrlKey;
    this.altKey=altKey;
    this.shiftKey=shiftKey;
    this.metaKey=metaKey;
    this.button=button;
    this.relatedTarget=relatedTarget;
  };


  $jb.Dom._createEvent=function(groupType)
  {
    var e=new $jb.DOMEventObject();
    
    e.timeStamp=(new Date()).getTime();
    
    return e;
  };
    
  $jb.DOMEvent.firedEventObject_=null;
    
  $jb.DOMEvent.__preFireAdaptor=function(eo)
  {
    var e=$d.createEventObject();
    
    e.type=eo.type;
    e.
  };
  $jb.DOMEvent.__postFireAdaptor=function()
  {
    var e=$d.createEventObject($w.event);
    
    e.target=e.srcElement;
    if($jb.DOMEvent.firedEventObject_.jbNotCancelable_)
    e.
  };

  }
  else
  {
    $jb.Dom._createEvent=function(groupType)
    {
      var e=$d.createEventObject();
      
      e.timeStamp=(new Date()).getTime();
      e.initEvent=$jb.DOMEventObject.prototype.initEvent;
      e.initUIEvent=$jb.DOMEventObject.prototype.initUIEvent;
      e.initMouseEvent=$jb.DOMEventObject.prototype.initMouseEvent;
      
      return e;
    };
  }
    
    $w.Event=function() {};
    
    $d.createEvent=function(groupType)
    {
      var e=new $w.Event();
      
      e.timeStamp=(new Date()).getTime();
      
      return e;
    };
  }
  else
  {
    $jb.DOMEvent.hasEventObject_=true;
    
    $d.createEvent=function(groupType)
    {
      var e=$d.createEventObject();
      
      e.timeStamp=(new Date()).getTime();
      
      return e;
    };
  }

  $jb.Dom._createEvent=function()
  {
    var e=$d.createEventObject();
    
    e.timeStamp=(new Date()).getTime();
    
    return e;
  };
}

$jb.DOMEvent.EventFirer=function()
{
  this.group=null;
  
  this._func=null;
  this.data=null;
  
  this.owner_=null;
};

if($jb.DOMEvent.eventFirerMap==null)
  $jb.DOMEvent.eventFirerMap={};

$jb.DOMEvent.nextEventFirerId=0;


$jb.DOMEvent.EventsFirer=function()
{
  this.eventFirers=[];
  this._domAdaptor=$jb._null;
};

$jb.DOMEvent.EventsFirer.prototype._add=function(ef)
{
  this.eventFirers.push(ef);
  ef.owner_=this;
  
  return this;
};
$jb.DOMEvent.EventsFirer.prototype._pureFire=function(e)
{
  var efs=this.eventFirers,i=efs.length,ef;
  
  while(i--)
    (ef=efs[i])._func.call(this,e,ef.data);
};
$jb.DOMEvent.EventsFirer.prototype._domFire=function(e)
{
  var self=this.jb_.domEventsFirerMap[e.type];
  
  $jb.DOMEvent._commonDOMAdaptor(e);
  self._domAdaptor(e);
  
  self._pureFire(e);
};

$jb.DOMEvent.EventFirersGroup=function()
{
  this.id_=$jb.DOMEvent.nextEventFirersGroupId++;
  this.eventFirerMap={};
};

$jb.DOMEvent.EventFirersGroup.prototype._add=function(name,ef)
{
  this.eventFirerMap[name]=ef;
};
$jb.DOMEvent.EventFirersGroup.prototype._erase=function()
{
  var efm=this.eventFirerMap,i=efm.length,ef,owner;

  while(var i in efm)
    (owner=(ef=efm[i]).owner_).splice(owner.indexOf(ef),1);
};

if($jb.DOMEvent.eventFirersGroupMap==null)
  $jb.DOMEvent.eventFirersGroupMap={};

$jb.DOMEvent.nextEventFirersGroupId=0;

  
if($jb.DOMEvent.eventMap==null)
  $jb.DOMEvent.eventMap={};


$jb.DOMEvent._fDOMAdaptorSetter=function()
{
  return function(v,name,eventsFirer)
  {
    eventsFirer._domAdaptor=arguments.callee._domAdaptor;
  };
};
  
// mouse wheel support
// http://www.switchonthecode.com/tutorials/javascript-tutorial-the-scroll-wheel
if($jb.nav._ff())
{  
  $jb.DOMEvent.eventMap["mousewheel"]="DOMMouseScroll";
}
else if($jb.nav._ie())
{
  $jb.DOMEvent.eventMap["mousewheel"]=$jb.DOMEvent._fDOMAdaptorSetter();
  $jb.DOMEvent.eventMap["mousewheel"]._domAdaptor=function(e)
  {
    e.detail=-e.wheelDelta/40;
  };
}

$jb.DOMEvent._commonDOMAdaptor=$jb._null;

if($jb.nav._ie())
{
  $jb.DOMEvent._commonRawAdaptor=function(e,v)
  {
    e=$d.createEventObject($w.event);
    
    e.target=e.srcElement;
    e.currentTarget=v;
    e.eventPhase= (e.target==e.currentTarget) ? $w.Event.AT_TARGET : $w.Event.BUBBLING_PHASE;
  }
}

$jb.Dom._attachEvent=function(v,name,_func)
{
  var _wrap=_func;
  var event;
  
  if((event=$jb.DOMEvent.eventMap[name])!=null)
  {
    if(event.constructor==String)
      $jb.DOMEvent._attach(v,event,_wrap);
    
    if(event.constructor==Function)
      _wrap=event(v,name,_wrap);
  }
  else
    $jb.DOMEvent._attach(v,name,_wrap);

  return v;
};

$jb.Dom._detachEvent=function(v,name,_wrap)
{
  $jb.DOMEvent._rawDetach(v,name,_wrap);
};

$jb.Dom._stopEvent=$jb.DOMEvent._rawStop;
$jb.Dom._stopEventDefault=$jb.DOMEvent._rawStopDefault;
$jb.Dom._fireEvent=$jb.DOMEvent._rawFire;

});