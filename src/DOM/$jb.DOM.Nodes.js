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
  
  cross browser support functions for DOMNode
 
*/

$jb.Loader._scope().
_require("$jb/$jb.nav.js").
_require("$jb/$G.Function.js").
_willDeclared("$jb/$jb.DOMNode.js").
_completed(function(){

/** @namespace contains set of cross browser functions */
if($jb.DOM == null)
  $jb.DOM = {};
  
// ie specific boolean flag to allow write in DOM nodes
if(typeof($d.expando) === "boolean")
  $d.expando = true;

$jb.DOM.Node = function(el)
{
  this.el = null;
};

$jb.DOM.Nodes = function()
{
  this.els=[];
};

$jb.DOM._el = function(el)
{
  return new $jb.DOM.Node(el);
};
$jb.DOM._byId = function(id, doc)
{
  return new $jb.DOM.Node((doc || $d).getElementById(id));
};

$jb.DOM._els = function(els, isCopy)
{
  if(isCopy === true)
    els = Array.prototype.slice
  return new $jb.DOM.Node(el);
};

$jb.DOM.Nodes.prototype._els=function(els)
{
  this.els=els;
  
  return this;
};

$jb.DOM.Nodes.prototype._one=function(expr, ctx, _select)
{
  if(_select==null)
  {
    // id
    if(expr.test(/^#[a-zA-Z_-]$/))
      return this._el((ctx || $d).getElementById(expr.substring(1)));
    // tag
    else if(expr.test(/^[a-zA-Z_-]$/))
      return this._el((ctx || $d).getElementsByTagName(expr));
      
    _select=$jb.DOM._cssQuery;
  }
  
};  
/**
  @fn get HTMLElement by given id and doc(optionaly)
  @param id id string
  @param doc HTMLDocument. Optionaly.
  @return HTMLElement
*/
$jb._dom=function(id,doc)
{
  return (doc || $d).getElementById(id);
};  

/**
  @fn get HTMLElement by given HTMLDocument and id
  @param doc HTMLDocument
  @param id id string
  @return HTMLElement
*/
$jb.DOMNode._id=function(doc,id)
{
  return doc.getElementById(id);
};  

/**
  @fn get all HTMLElement s in 'v' with given tag name 
  @param v HTMLElement
  @param tagName tag name string
  @return HTMLNodeList
*/
$jb.DOMNode._tags=function(v,tagName)
{
  return v.getElementsByTagName(tagName);
};

/**
  @fn get all HTMLElement s in 'v' 
  @param v HTMLElement
  @return HTMLNodeList
*/
$jb.DOMNode._all=null;


if("all" in $h)
{
  $jb.DOMNode._all=function(v)
  {
    return v.all;
  };
}
else
{
  $jb.DOMNode._all=function(v)
  {
    return v.getElementsByTagName("*");
  };
}

/**
  @fn get head HTMLElement from given doc 
  @param v HTMLElement
  @return head HTMLElement
*/
$jb.DOMNode._head=function(doc)
{
  return doc.getElementsByTagName("head")[0];
};

/**
  @fn get all HTMLElement s in 'v' with given name 
  @param v HTMLElement
  @param name name string
  @return HTMLNodeList
*/
$jb.DOMNode._names=function(v,name)
{
  return v.getElementsByName(name);
};

/**
  @fn get text content of given HTMLElement 'v' 
  @param v HTMLElement
  @param html innerHTML of 'v', useful for some browser without native text content support. Optional 
  @return string with text
*/
$jb.DOMNode._getText=null;

/**
  @fn set text content of given HTMLElement 'v' 
  @param v HTMLElement
  @param text text string to set
  @return $jb.DOMNode for queue call purposes
*/
$jb.DOMNode._setText=null;

if("innerText" in $h)
{
  $jb.DOMNode._getText=function(v,html)
  {
    return v.innerText;
  };
  $jb.DOMNode._setText=function(v,text)
  {
    v.innerText=text;
    
    return this;
  };
}
else if("textContent" in $h)
{
  $jb.DOMNode._getText=function(v,html)
  {
    return v.textContent;
  };
  $jb.DOMNode._setText=function(v,text)
  {
    v.textContent=text;
    
    return this;
  };
}
else if("innerHTML" in $h)
{
  $jb.DOMNode._getText=function(v,html)
  {
    return ((html || v.innerHTML)+"").replace(/<\/?[^>]*>/g,""); 
  };
  $jb.DOMNode._setText=function(v,text)
  {
    v.innerHTML="";
    v.appendChild(v.ownerDocument.createTextNode(text+""));
    
    return this;
  };
}

/**
  @fn erise all child Nodes in 'v'
  @param v HTMLElement 
  @return $jb.DOMNode for queue call purposes
*/  
$jb.DOMNode._eriseChilds=null;

if(!("textContent" in $h) && !("innerText" in $h))
{
  $jb.DOMNode._eriseChilds=function(v)
  {
    v.innerHTML="";
    
    return this;
  };
}
else
{
  $jb.DOMNode._eriseChilds=function(v)
  {
    this._setText("");
    
    if(v.firstChild)
      v.removeChild(v.firstChild);
    
    return this;
  };
}


/**
  @fn compare document positions given HTMLElement s using compare bit mask 
  @param v1 fiset HTMLElement to compare
  @param v2 second HTMLElement to compare
  @param mask bit mask for comparsion
  @see $jb.DOMNode.posDiffDoc
  @see $jb.DOMNode.posIn
  @see $jb.DOMNode.posInRev
  @see $jb.DOMNode.posNext
  @see $jb.DOMNode.posPrev
  @return result bit mask
*/
$jb.DOMNode._cmpPositions=null;

if(typeof($de.compareDocumentPosition)!="function" &&
  ("contains" in $de) && 
  ("sourceIndex" in $de)
)
{
  if($w.Node==null)
    $w.Node={};

  $w.Node.DOCUMENT_POSITION_DISCONNECTED = 0x01;
  $w.Node.DOCUMENT_POSITION_PRECEDING = 0x02;
  $w.Node.DOCUMENT_POSITION_FOLLOWING = 0x04;
  $w.Node.DOCUMENT_POSITION_CONTAINS = 0x08;
  $w.Node.DOCUMENT_POSITION_CONTAINED_BY = 0x10;
  
  $jb.DOMNode._cmpPositions=function(v1,v2,mask)
  {
    if(v1==null || v2==null)
      return null;
    
    if(mask==null)
      mask=0xFFFFFFFF;
      
    if(v1==v2)
      return 0;
    
    if(v1.ownerDocument!=v2.ownerDocument)
    {  
      if(mask&0x01)
        return 0x01;
      
      return 0;
    }
    
    var ret=0;
    
    if(v1.sourceIndex<v2.sourceIndex)
    {  
      if(mask&0x04)
        ret|=0x04;
      
      if(mask&0x10 && v1.contains(v2))
        ret|=0x10;
    }
    else if(v1.sourceIndex>v2.sourceIndex)
    {  
      if(mask&0x02)
        ret|=0x02;
      
      if(mask&0x08 && v2.contains(v1))
        ret|=0x08;
    }  
 
    return ret;  
  };
}
else if("compareDocumentPosition" in $de)
{
  $jb.DOMNode._cmpPositions=function(v1,v2,mask)
  {
    if(v1==null || v2==null)
      return null;
    
    return v1.compareDocumentPosition(v2);  
  };
}

$jb.DOMNode.posDiffDoc  = $w.Node.DOCUMENT_POSITION_DISCONNECTED;
$jb.DOMNode.posPrev     = $w.Node.DOCUMENT_POSITION_PRECEDING;
$jb.DOMNode.posNext     = $w.Node.DOCUMENT_POSITION_FOLLOWING;
$jb.DOMNode.posInRev    = $w.Node.DOCUMENT_POSITION_CONTAINS;
$jb.DOMNode.posIn       = $w.Node.DOCUMENT_POSITION_CONTAINED_BY;

/**
  @fn construct HTMLDocumentFragment or HTMLElement from 'html' string  in 'doc'
  @param html string that contains html
  @param doc owner HTMLDocument for result. Optional  
  @return HTMLDocumentFragment or HTMLElement depend from 'html'
*/
$jb.DOMNode._fromHTML=null;

if("applyElement" in $h)
{
  $jb.DOMNode._fromHTML=function(html,doc)
  {
    if(doc==null)
      doc=$d;
    
    var div=doc.createElement("div");
    
    div.innerHTML=html+"";
    
    if(div.childNodes.length==1)
      return div.removeChild(div.firstChild);

    var df=doc.createDocumentFragment();
    var div2=doc.createElement("div");

    df.appendChild(div);
    div2.applyElement(div,"inside");

    return df;
  };
}
else
{  
  $jb.DOMNode._fromHTML=function(html,doc)
  {
    if(doc==null)
      doc=$d;
    
    var div=doc.createElement("div");
    
    div.innerHTML=html+"";
    
    if(div.childNodes.length==1)
      return div.removeChild(div.firstChild);
    
    var df=doc.createDocumentFragment();
    var tmp;
    
    while((tmp=div.firstChild)!=null)
      df.appendChild(tmp);
      
    return df;
  };
}

$jb.DOMNode._wrapChilds=null;
$jb.DOMNode._unwrapChilds=null;

if("applyElement" in $h)
{
  $jb.DOMNode._wrapChilds=function(v,vChildsWrap)
  {
    vChildsWrap.applyElement(v,"inside");

    return this;
  };
  $jb.DOMNode._unwrapChilds=function(v)
  {
    var doc=v.ownerDocument,div=doc.createElement("div");
    
    div.applyElement(v,"inside");
    
    return this;
  };
}
else
{
  $jb.DOMNode._wrapChilds=function(v,vChildsWrap)
  {
    var temp=v.childNodes.length;
    
    if(temp==0)
    {
      v.appendChild(vChildsWrap);
      
      return this;
    }

    var d=v.ownerDocument, df=d.createDocumentFragment();
    
    df.appendChild(vChildsWrap);
    
    while((temp=v.firstChild))
      vChildsWrap.appendChild(temp);
    
    v.appendChild(df);
    
    return this;
  };
  $jb.DOMNode._unwrapChilds=function(v)
  {
    var temp=v.childNodes.length;
    
    if(temp==0)
      return this;

    var d=v.ownerDocument, df=d.createDocumentFragment();
    
    while((temp=v.firstChild))
      df.appendChild(temp);
    
    v.parentNode.insertBefore(df,v.nextSibling);
    
    return this;
  };
}


/**
  @fn get x,y position of 'v' in owner HTMLDocument
  @param v HTMLElement
  @return {x,y}
*/
$jb.DOMNode._point=null;

if("getBoundingClientRect" in $h)
{
  $jb.DOMNode._point=function(v)
  {
    var r=v.getBoundingClientRect(v);
    
    return {x:r.left,y:r.top};
  };
}
else
{  
  $jb.DOMNode._point=function(v)
  {
    var x=0,y=0;
    
    while(v!=null)
    {
      x+=v.offsetLeft;
      y+=v.offsetTop;
      v=v.offsetParent;
    }
    
    return {x:x,y:y};
  };
}

/**
  @fn insert 'newNode' after 'existingNode' in 'p'
  @param p parent HTMLElement to which insert
  @param newNode HTMLElement to  insert
  @param existingNode HTMLElement after 'newNode' insert or null to insert at the end of 'p'
  @return $jb.DOMNode for queue call purposes
*/
$jb.DOMNode._insertAfter=function(p,newNode,existingNode)
{
  if(existingNode==null)
    p.appendChild(newNode);
  else
    p.insertBefore(existingNode.nextSibling,newNode);
  
  return this;
};

/**
  @fn swap 'v1' and 'v2' HTMLElement s in DOM
  @param v1 HTMLElement to swap
  @param v2 HTMLElement to swap
  @return $jb.DOMNode for queue call purposes
*/
$jb.DOMNode._swap=null;
if("swapNode" in $h)
{
  $jb.DOMNode._swap=function(v1,v2)
  {
    if(v1==v2)
      return this;

    v1.swapNode(v2);

    return this;
  };
}
else
{
  $jb.DOMNode._swap=function(v1,v2)
  {
    if(v1==v2)
      return this;
      
    var nextV2=v2.nextSibling;
    var pV2=v2.parentNode;
    
    v1.parentNode.replaceChild(v2,v1);
    
    if(nextV2==null)
      pV2.appendChild(v1);
    else
      pV2.insertBefore(v1,nextV2);
    
    return this;
  };
}

/**
  @fn find nearest common parent HTMLElement for  'v1' and 'v2'
  @param v1 HTMLElement
  @param v2 HTMLElement
  @return nearest common parent HTMLElement for 'v1' and 'v2'
*/
$jb.DOMNode._commonParent=null;

if($jb.nav._opera())
{
  $jb.DOMNode._commonParent=function(v,v2)
  {
    if(v==null || v2==null)
      return v;
    
    if(v===v2)  
      return v;
      
    var rel=v.compareDocumentPosition(v2);
    
    if(rel & $w.Node.DOCUMENT_POSITION_CONTAINS)
      return v2;
    if(rel & $w.Node.DOCUMENT_POSITION_CONTAINED_BY)
      return v;

    var r=$d.createRange();
    
    r.selectNode(v);
      
    if(rel & $w.Node.DOCUMENT_POSITION_FOLLOWING)
      r.setEndAfter(v2);
    else
      r.setStartBefore(v2);

    var cp=r.commonAncestorContainer;
    
    r.detach();
    
    return cp;
  };
}
else
{
  $jb.DOMNode._commonParent=function(v,v2)
  {
    if(v==null)
      return v2;
    if(v2==null)
      return v;
    if(v==v2)
      return v;
    if(v.ownerDocument!=v2.ownerDocument)
      return null;
    
    /*
    if(v.parentNode==v2)
      return v2;
    if(v2.parentNode==v)
      return v;
    */
    var vps=new Array(),vpsLen=0;
    var v2ps=new Array(),v2psLen=0;;
    var vp=v.parentNode, v2p=v2.parentNode;
    
    while(vp!=null && v2p!=null)
    {
      vps[vpsLen++]=vp;
      
      if(vp===v2)
        return vp;
        
      vp=vp.parentNode;
      
      v2ps[v2psLen++]=v2p;
      
      if(v2p===v)
        return v2p;
        
      v2p=v2p.parentNode;
    }
    
    while(vp!=null)
    {
      vps[vpsLen++]=vp;
      
      if(vp===v2)
        return vp;
        
      vp=vp.parentNode;
    }

    while(v2p!=null)
    {
      v2ps[v2psLen++]=v2p;
      
      if(v2p===v)
        return v2p;
        
      v2p=v2p.parentNode;
    }
    
    var i=vpsLen-1,j=v2psLen-1;
    var minLen=Math.min(vpsLen,v2psLen);
    var ie=i-minLen;
    
    while(ie<i && vps[i]===v2ps[j])
      --i,--j;
    
    return vps[i+1];
  };
}
/**
  @fn convert lower case tag name to upper case if tag names is in upper case else no change
  @return currected tag name
*/
String.prototype._toDOMNodeTagName=null;

if($h.nodeName=="HEAD")
{
  String.prototype._toDOMNodeTagName=function()
  {
    return this.toUpperCase();
  };
}
else
{
  String.prototype._toDOMNodeTagName=function()
  {
    return this;
  };
}

/**
  @fn find free available id by format 'id'+number
  @return number
*/
$jb.DOMNode._findFreeId=function(doc,id)
{
  if(doc==null)
    doc=$d;
  
  var i=0;
  var v=doc.getElementById(id+i);
  
  while(v!=null)
  {
    ++i;
    v=doc.getElementById(id+i);
  }
  
  return i;
};

/**
  @fn find all nodes with event attribute 'onready', call and remove attribute
  @param v root HTMLElement
  @return $jb.DOMNode for queue call
*/
$jb.DOMNode._init=null;

(function()
{
  var _process=function(nodes)
  {
    var i=nodes.length,node;
    
    while(i--)
    {
      $jb._funcEvalSafe((node=nodes[i]).getAttribute("onready"),node);
      node.removeAttribute("onready");
    }
  };

  var _processXPathResult=function(nodes)
  {
    var i=nodes.snapshotLength,node;
    
    while(i--)
    {
      $jb._funcEvalSafe((node=nodes.snapshotItem(i)).getAttribute("onready"),node);
      node.removeAttribute("onready");
    }
  };

  if("querySelectorAll" in $d)
  {
    $jb.DOMNode._init=function(v)
    {
      _process(v.querySelectorAll("*[onready]"));

      return this;
    };
  }
  else if("evaluate" in $d)
  {
    $jb.DOMNode._init=function(v)
    {
      _processXPathResult(v.ownerDocument.evaluate(
        "//*[@onready!='']",
        v,
        null,
        $w.XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null
      ));
      
      return this;
    };
  }
  else
  {
    var testMethodName= ("hasAttribute" in $de) ? "hasAttribute" : "getAttribute";
    
    $jb.DOMNode._init=function(v)
    {
      var testMethodNameC=testMethodName
      var all=this._all(v);
      var nodes=[],node;
      var i=all.length,j=0;
      
      while(i--)
      {
        if((node=all[i])[testMethodNameC]("onready"))
          nodes[j++]=node;
      }
      
      if(j>0)
        _process(nodes);

      return this;
    };
  }
})();
});