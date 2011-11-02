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
  
  Cross browser set get style values
  Also getter setter (with copyable version) support for optimization purposes 
*/

$jb.Loader._scope().
_require("$jb/$jb.nav.js").
_willDeclared("$jb/DOM.Style.js").
_completed(function(){

/** @namespace contains getter setter and style mapping */
if($jb.DOM == null)
  $jb.DOM = {};

if($jb.DOM.Style == null)
  $jb.DOM.Style = {};

/** @var map "name" -> ("alterName" || {_set,_get}) */
var styleMap = $jb.DOM.Style.styleMap = {};

//****************************************************************************************************************
//  TRANSFORM, TRANSFORM-ORIGIN
//****************************************************************************************************************

if($h.filters && $jb.nav._ie())
{
  styleMap["transform"] = {};
  
  $jb.DOMStyle.styleMap["transform"]._get = function(v)
  {
    var matrixFilter = v.filters["DXImageTransform.Microsoft.Matrix"];
    
    if(matrixFilter)
    {
      new $jb.Math.Mat23(
        matrixFilter.M11,
        matrixFilter.M21,
        matrixFilter.M12,
        matrixFilter.M22,
        matrixFilter.Dx,
        matrixFilter.Dy
      );
    }  
    
    return null;
  };
  
  $jb.DOMStyle.styleMap["transform"]._set=function(v,m)
  {
    var matrixFilter=v.filters["DXImageTransform.Microsoft.Matrix"];
    
    if(matrixFilter!=null)
    {
      matrixFilter.M11=m.m11;
      matrixFilter.M12=m.m21;
      matrixFilter.M21=m.m12;
      matrixFilter.M22=m.m22;
      matrixFilter.Dx=m.m13;
      matrixFilter.Dy=m.m23;
    }
    else
    {
      // check hasLayout
      if(v.currentStyle.hasLayout==false)
        v.style.zoom="1";

        v.style.filter+=" progid:DXImageTransform.Microsoft.Matrix(M11="+m.m11+",M12="+m.m21+",M21="+m.m12+",M22="+m.m22+",Dx="+m.m13+",Dy="+m.m23+",SizingMethod=\'auto expand\'"+")";
    }
  };
}
else
{
  (function()
  {
    var styleName=
    (typeof($h.style["transform"])=="string") ? "transform" : null ||
    (typeof($h.style["MozTransform"])=="string") ? "MozTransform" : null ||
    (typeof($h.style["OTransform"])=="string") ? "OTransform" : null ||
    (typeof($h.style["webkitTransform"])=="string") ? "webkitTransform" : null;
  
    if(styleName==null)
      return;
      
    $jb.DOMStyle.styleMap["transform"]={};
    
    if(styleName=="webkitTransform")
    {
      $jb.DOMStyle.styleMap["transform"]._get=function(v)
      {
        var style=v.style[styleName];
        var values=style.substring(style.indexOf("(")+1,style.lastIndexOf(")")).split(",");
        
        return new $jb.Math.Mat23(
          +values[0],
          +values[1],
          +values[2],
          +values[3],
          +values[4],
          +values[5]
        );
      };

      $jb.DOMStyle.styleMap["transform"]._set=function(v,m)
      {
        v.style[styleName]="matrix( "+m.m11.toFixed(4)+" , "+m.m12.toFixed(4)+" , "+m.m21.toFixed(4)+" , "+m.m22.toFixed(4)+" , "+m.m13.toFixed(4)+" , "+m.m23.toFixed(4)+" )";
      };
    }
    else
    {
      $jb.DOMStyle.styleMap["transform"]._get=function(v)
      {
        var style=v.style[styleName];
        var values=style.substring(style.indexOf("(")+1,style.lastIndexOf(")")).split(",");
        
        return new $jb.Math.Mat23(
          +values[0],
          +values[1],
          +values[2],
          +values[3],
          +values[4].substring(0,values[4].length-2),
          +values[5].substring(0,values[5].length-2)
        );
      };

      $jb.DOMStyle.styleMap["transform"]._set=function(v,m)
      {
        v.style[styleName]="matrix( "+m.m11.toFixed(4)+" , "+m.m12.toFixed(4)+" , "+m.m21.toFixed(4)+" , "+m.m22.toFixed(4)+" , "+m.m13.toFixed(4)+"px , "+m.m23.toFixed(4)+"px )";
      };
    }
    
    
  })();
}

//****************************************************************************************************************
//  OPACITY
//****************************************************************************************************************

if(typeof($h.style["opacity"])=="string")
{
  // ok
}
else if($h.filters && $jb.nav._ie()<8.0)
{
  $jb.DOMStyle.styleMap["opacity"]={};
  
  $jb.DOMStyle.styleMap["opacity"]._get=function(v)
  {
    var alphaFilter=v.filters["DXImageTransform.Microsoft.Alpha"];
    
    if(alphaFilter)
      return 0.01*alphaFilter.opacity;
    
    return null;
  };
  
  $jb.DOMStyle.styleMap["opacity"]._set=function(v,value)
  {
    var alphaFilter=v.filters["DXImageTransform.Microsoft.Alpha"];
    
    if(alphaFilter!=null)
    {
      alphaFilter.opacity=Math.floor(100*value);
    }
    else
    {
      // check hasLayout
      if(v.currentStyle.hasLayout==false)
        v.style.zoom="1";

        v.style.filter+=" progid:DXImageTransform.Microsoft.Alpha(opacity="+Math.floor(100*value)+")";
    }
  };
}
else
{
  $jb.DOMStyle.styleMap["opacity"]=
  (typeof($h.style["MozOpacity"])=="string") ? "MozOpacity" : null ||
  (typeof($h.style["KhtmlOpacity"])=="string") ? "KhtmlOpacity" : null;
}


if($jb.DOMNode==null)
  $jb.DOMNode={};
  
/**
  @fn set 'v' style 'name' to value 'value'
  @param v HTMLElement
  @param name style name to set
  @param value value to set
  @return $jb.DOMNode namespace for queue call 
*/
$jb.DOMNode._setStyle=function(v,name,value)
{
  var temp;
  
  if((temp=$jb.DOMStyle.styleMap[name]))
  {
    if(typeof(temp)=="object")
      temp._set(v,value);
    else
      v.style[temp]=value;
  }
  else
  {
    v.style[name]=value;
  }
    
  return this;
};

/**
  @fn get 'v' style 'name' value
  @param v HTMLElement
  @param name style name to get
  @return style value 
*/
$jb.DOMNode._getStyle=function(v,name)
{
  var temp;
  
  if((temp=$jb.DOMStyle.styleMap[name]))
  {
    if(typeof(temp)=="object")
      return temp._get(v);
    else
      return v.style[temp];
  }
  else
  {
    return v.style[name];
  }
};

/**
  @fn nonCopyable setter construction
  @param name style name to set
  @return nonCopyable function(v,value) where 'v' is HTMLElement and 'value' is value to set  
*/
$jb.DOMStyle._fSetter=function(name)
{
  name=$jb.DOMStyle.styleMap[name] || name;
  
  if(typeof(name)=="object")
  {  
    name=name._set;
    
    return function(v,value)
    {
      name(v,value);
    };
  }
  else if(typeof(name)=="string")
  {  
    return function(v,value)
    {
      v.style[name]=value;
    };
  }
  
  return null;
};

/**
  @fn copyable setter construction
  @param name style name to set
  @return copyable function(v,value) where 'v' is HTMLElement and 'value' is value to set  
*/
$jb.DOMStyle._fSetterC=function(name)
{
  var _ret=null;
  
  name=$jb.DOMStyle.styleMap[name] || name;
  
  if(typeof(name)=="object")
  {  
    _ret=arguments.callee.__fObjectSetter();
    _ret._set=name._set;
  }
  else if(typeof(name)=="string")
  {  
    _ret=arguments.callee.__fStringSetter();
    _ret.name=name;
  }
  
  return _ret;
};
$jb.DOMStyle._fSetterC.__fObjectSetter=function()
{
  return function(v,value)
  {
    arguments.callee._set(v,value);
  };
};
$jb.DOMStyle._fSetterC.__fStringSetter=function()
{
  return function(v,value)
  {
    v.style[arguments.callee.name]=value;
  };
};

/**
  @fn nonCopyable getter construction
  @param name style name to get
  @return nonCopyable function(v) where 'v' is HTMLElement. Return 'v' style 'name' value.  
*/
$jb.DOMStyle._fGetter=function(name)
{
  name=$jb.DOMStyle.styleMap[name] || name;

  if(typeof(name)=="object")
  {  
    name=name._get;
    
    return function(v)
    {
      return name(v);
    };
  }
  else if(typeof(name)=="string")
  {  
    return function(v)
    {
      return v.style[name];
    };
  }
  
  return null;
};

/**
  @fn copyable getter construction
  @param name style name to get
  @return copyable function(v) where 'v' is HTMLElement. Return 'v' style 'name' value.  
*/
$jb.DOMStyle._fGetterC=function(name)
{
  var _ret=null;
  
  name=$jb.DOMStyle.styleMap[name] || name;
  
  if(typeof(name)=="object")
  {  
    _ret=arguments.callee.__fObjectGetter();
    _ret._get=name._get;
  }
  else if(typeof(name)=="string")
  {  
    _ret=arguments.callee.__fStringGetter();
    _ret.name=name;
  }
  
  return _ret;
};
$jb.DOMStyle._fGetterC.__fObjectGetter=function()
{
  return function(v)
  {
    return arguments.callee._get(v);
  };
};
$jb.DOMStyle._fGetterC.__fStringGetter=function()
{
  return function(v)
  {
    return v.style[arguments.callee.name];
  };
};


$jb._px=function(value)
{
  return value+"px";
};
$jb._em=function(value)
{
  return value+"em";
};
$jb._pt=function(value)
{
  return value+"pt";
};
$jb._percent=function(value)
{
  return value+"%";
};

if($w.getComputedStyle==null  && $de.currentStyle)
{
  $w.getComputedStyle=function(el,pseudoElt)
  {
    if(el==null)
      return null;
    
    return el.currentStyle;
  };
}

$jb.DOMNode._toggleNodeShow=function(v,a,b)
{
  if(a==null)
    a="none";
  if(b==null)
    b="block";

  if(v.style.display!=a)
    v.style.display=a;
  else
    v.style.display=b;
};

});