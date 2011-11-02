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
  
  simple XPath emulator for ie
*/

window.__jb_ieXPath=function()
{
  if(document.evaluate!=null || window.ActiveXObject==null)
    return;
  
  window.XPathResult=function()
  {
    // w3c values
    this.booleanValue;
    this.invalidIteratorState; 
    this.numberValue; 
    this.resultType; 
    this.singleNodeValue; 
    this.snapshotLength; 
    this.stringValue; 

    this.xml_=new ActiveXObject(this.msXmlVers_[this.lastMsXmlVerIndex_].xmlProgId_);
    this.__initMsXml(this.xml_);

    this.xslt_=null;
    this.xsl_=null;
    
    this.root_;
    
    this.r_=null;
    this.all_=null;
    this.lastIterIndex_=null;
    
    this.nodes_=null;
  };
  
  XPathResult.prototype.__parserError=function(xml)
  {
    ((console && console.error) || alert)("MsXML Parser Error #"+xml.parseError.errorCode+":"+xml.parseError.reason);
    
    return null;
  };

  XPathResult.prototype.__cleanUpLastResult=function()
  {
    if(this.r_)
      delete this.r_;
    
    if(this.nodes_)
      delete this.nodes_;
  };

  (function()
  {
    var match=new RegExp(/([\/\[][a-z]+?)+/g);
    
    var _replacer=function(s)
    {
      return s.toUpperCase();
    };
    
    XPathResult.prototype.__prepareXPath=function(xpath)
    {
      return xpath.replace(match,_replacer);
    };
  })();  

  XPathResult.prototype.__enumNodes=function(xmlAll)
  {
    var i=xmlAll.length;
    
    while(i--)
    {
      xmlAll[i].setAttribute("jb_iexpath_id",i); // 130 ms 
      //all[i][att]=i; // 80 ms
      //all[i]["jb_iexpath_id"]=i; // 80 ms
      //xmlAll[i].jb_iexpath_id=i; // 70-80 ms
    }
  };
  
  (function()
  {
    //char span charoff align accept dir valign vspace accept-charset enctype hspace cols rows frameborder marginheight frame rules scope axis headers abbr cellpadding cellspacing marginwidth scrolling ismap width height

    var singleNodesRE=new RegExp(/<\s*(BR|INPUT|HR|LINK|META|IMG)([^\/>]*?)[\/]?>/g);
    var unquotedAttrsRE=new RegExp(/( (?:accesskey|alt|cellspacing|checked|class|colSpan|declare|defer|disabled|for|http-equiv|id|lang|maxlength|media|method|multiple|name|nohref|object|readonly|rel|rev|rowSpan|selected|shape|size|tabindex|target|title|type|value|valuetype)=)([^\"][^ \/>]*?)(?=[ \/>])/g);
    
    XPathResult.prototype.__prepareHTML=function(root)
    {
      return this.xmlHeader_+
        root.outerHTML // 70 ms
        .replace(singleNodesRE,"<$1$2/>") // 90(90) ms
        .replace(unquotedAttrsRE,"$1\"$2\"") // 130(20) ms
        //.replace(/ href=\"#/g," href=\"&#35;")
        ;
    };
  })();

  // time points for table 3x1000
  XPathResult.prototype.__evaluate=function(xpath,root,namespaceResolver,resultType)
  {
    if(resultType === XPathResult.ANY_TYPE)
    {
      ((console && console.error) || alert)("ieXPath.js not support automaic resultType detection. XPathResult.ANY_TYPE unsupported.");
      
      return;
    }
    
    var isFullDOMNeed=
    xpath.indexOf("..") !== -1 ||
    xpath.indexOf("parent") !== -1 ||
    xpath.indexOf("ancestor") !== -1;

    if(isFullDOMNeed || root.nodeType === 9)
      root=document.documentElement;
    
    var all=root.all || root.getElementsByTagName("*");
    var html=this.__prepareHTML(root);
    var xml=this.xml_,r,i;
    
    xpath=this.__prepareXPath(xpath);
    
    this.resultType=resultType;
    
    switch(resultType)
    {
      case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
      case XPathResult.ORDERED_NODE_ITERATOR_TYPE:
      
        this.__cleanUpLastResult();

        xml.loadXML(html); // 240(109) ms

        if(xml.parseError.errorCode !== 0)
          this.__parserError(xml);

        this.__enumNodes(xml.all || xml.getElementsByTagName("*")); // 401(160) ms
        
        this.r_=xml.selectNodes(xpath);
        this.lastIterIndex_=-1;
        this.all_=all;
        this.invalidIteratorState=false;
        this.root_=root;
        
        return this;
      
      case XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE:
      case XPathResult.ORDERED_NODE_SNAPSHOT_TYPE:
      
        this.__cleanUpLastResult();

        xml.loadXML(html);
        
        if(xml.parseError.errorCode != 0)
          this.__parserError(xml);
        
        this.__enumNodes(xml.all || xml.getElementsByTagName("*"));
        
        this.r_=xml.selectNodes(xpath);
        this.root_=root;
        this.all_=all;
        
        this.nodes_=[];
        
        for(i=0;i<this.r_.length;++i)
          this.nodes_[i]=this.__getRealNode(this.r_[i]);
        
        this.snapshotLength=i;
        
        delete this.r_;
        this.r_=null;
        
        return this;
        
      case XPathResult.FIRST_ORDERED_NODE_TYPE:
      case XPathResult.ANY_UNORDERED_NODE_TYPE:
      
        this.__cleanUpLastResult();

        xml.loadXML(html);

        if(xml.parseError.errorCode!=0)
          this.__parserError(xml);

        this.__enumNodes(xml.all || xml.getElementsByTagName("*"));

        this.singleNodeValue=xml.selectSingleNode(xpath);
        this.root_=root;
        this.all_=all;
        
        if(this.singleNodeValue!=null)
          this.singleNodeValue=this.__getRealNode(this.singleNodeValue);
        
        return this;
      
      case XPathResult.NUMBER_TYPE:
      case XPathResult.STRING_TYPE:
      case XPathResult.BOOLEAN_TYPE:
      
        this.__cleanUpLastResult();

        xml.loadXML(html);

        if(xml.parseError.errorCode!=0)
          this.__parserError(xml);
        
        this.__enumNodes(xml.all || xml.getElementsByTagName("*"));

        if(this.xslt_==null)
          this.xslt_=new ActiveXObject(this.msXmlVers_[this.lastMsXmlVerIndex_].xsltProgId_);
        
        if(this.xsl_==null)
        {
          this.xsl_=new ActiveXObject(this.msXmlVers_[this.lastMsXmlVerIndex_].ftXmlProgId_);
          this.__initMsXml(this.xsl_);
          this.xsl_.async=true; // ???
        }
        
        this.xsl_.loadXML(this._genXSLT(xpath));

        if(this.xsl_.parseError.errorCode !== 0)
          this.__parserError(this.xsl_);

        this.xslt_.stylesheet=this.xsl_;
        
        var xslProc=this.xslt_.createProcessor();
        
        xslProc.input=xml;
        xslProc.transform();
        
        var output=xslProc.output.toString();
        
        delete xslProc;
        
        if(resultType === XPathResult.STRING_TYPE);
          this.stringValue=output;
        if(resultType === XPathResult.NUMBER_TYPE);
          this.numberValue=parseFloat(output);
        if(resultType === XPathResult.BOOLEAN_TYPE);
          this.booleanValue=(output=="true");
        
        return this;
      
      default:
        
        ((console && console.error) || alert)("Unsupported resultType = "+resultType);
    }
  };


  XPathResult.prototype.__getRealNode=function(node)
  {
    var i=NaN;
    
    if(node.nodeType!=1)
      i=parseFloat(node.getAttribute("jb_iexpath_id"));
    
    var shift;
    
    if(isFinite(i))
    {
      if(i === 0)
        return this.root_;
      else  
        return this.all_[i-1];
    }
    
    var pn=node,nn=node;
    var j=0;
    
    while(j<5 && 
    (
      (pn && (pn=pn.previousSibling) && pn.nodeType !== 1) || 
      (nn && (nn=nn.nextSibling) && nn.nodeType !== 1)
    ))
    {
      ++j;
    }
    
    if(pn && pn.nodeType === 1)
    {
      var i=+pn.getAttribute("jb_iexpath_id");
      var rpn;
      
      if(i === 0)
        rpn=this.root_;
      else  
        rpn=this.all_[i-1];

      //if(rpn==null)
      //  _log("rpn==null");
      
      while(j--)
        rpn=rpn.nextSibling;
      
      return rpn;
    }
    if(nn && nn.nodeType === 1)
    {
      var i=+nn.getAttribute("jb_iexpath_id");
      var rnn;
      
      if(i === 0)
        rnn=this.root_;
      else  
        rnn=this.all_[i-1];

      while(j--)
        rnn=rnn.previousSibling;
      
      return rnn;
    }
    
    var p=node.parentNode;
    var pn=p.firstChild;
    j=0;
    
    //_log(pn.nodeType);
    
    while(pn && pn !== node)
      ++j,pn=pn.nextSibling;
    
    
    var i=+p.getAttribute("jb_iexpath_id");
    var rp;
    
    if(i === 0)
      rp=this.root_;
    else  
      rp=this.all_[i-1];

    var rpn=rp.firstChild;
    
    while(j--)
      rpn=rpn.nextSibling;
    
    return rpn;
  };

  XPathResult.prototype.iterateNext=function()
  {
    var i=++this.lastIterIndex_;
    var r=this.r_;
    
    if(i === r.length)
    {
      this.invalidIteratorState=true;
      delete this.r_;
      
      return null;
    }
    
    return this.__getRealNode(r[i]);
  };
  
  XPathResult.prototype.snapshotItem=function(i)
  {
    return this.nodes_[i];
  };

  XPathResult.prototype._destruct=function()
  {
    delete this.xml_;
    
    if(this.xslt_!=null)
      delete this.xslt_;

    if(this.xsl_!=null)
      delete this.xsl_;
  };
  
  XPathResult.ANY_TYPE=0;
  XPathResult.NUMBER_TYPE=1;
  XPathResult.STRING_TYPE=2;
  XPathResult.BOOLEAN_TYPE=3;
  XPathResult.UNORDERED_NODE_ITERATOR_TYPE=4;
  XPathResult.ORDERED_NODE_ITERATOR_TYPE=5;
  XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE=6;
  XPathResult.ORDERED_NODE_SNAPSHOT_TYPE=7;
  XPathResult.ANY_UNORDERED_NODE_TYPE=8;
  XPathResult.FIRST_ORDERED_NODE_TYPE=9;
  
  // big thanks to
  // http://blogs.msdn.com/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
  XPathResult.prototype.msXmlVers_=
  [
    {
      xmlProgId_:"Msxml2.DOMDocument.6.0",
      xsltProgId_:"Msxml2.XSLTemplate.6.0",
      ftXmlProgId_:"Msxml2.FreeThreadedDOMDocument.6.0"

    },
    {
      xmlProgId_:"Msxml2.DOMDocument.3.0",
      xsltProgId_:"Msxml2.XSLTemplate.3.0",
      ftXmlProgId_:"Msxml2.FreeThreadedDOMDocument.3.0"
    }
  ];
  
  XPathResult.prototype.lastMsXmlVerIndex_=null;
  
  (XPathResult.__findLastMsXmlVer=function()
  {
    //return;
    
    var vers=XPathResult.prototype.msXmlVers_;
    var xml=null;
    var i=vers.length;
    
    while(xml==null && i--)
    {
      try
      {
        xml=new ActiveXObject(vers[i].xmlProgId_);
      }
      catch(err)
      {
        xml=null;
      }
    }
    
    delete xml;
    
    XPathResult.prototype.lastMsXmlVerIndex_=i;
  })();
  
  XPathResult.prototype.__initMsXml=function(xml)
  {
    xml.async=false;
    xml.resolveExternals=false;
    xml.setProperty("SelectionLanguage", "XPath");
  };

  
  // config
  XPathResult.prototype.xmlHeader_="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
  
  XPathResult.prototype._genXSLT=function(xpath)
  {
    var touplWorkVar="";
    touplWorkVar += "<?xml version=\'1.0\'?>\r\n<xsl:stylesheet version=\"1.0\"\r\n      xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\">\r\n\r\n<xsl:output method=\"text\" />\r\n\r\n<xsl:template match=\"/\">\r\n<xsl:value-of select=\"";
    touplWorkVar +=  xpath ;
    touplWorkVar += "\"/>\r\n</xsl:template>\r\n\r\n</xsl:stylesheet>";

    return touplWorkVar;
  };  
  
  document.evaluate=function(xpath,root,namespaceResolver,resultType,result)
  {
    return (result || new XPathResult()).__evaluate(xpath,root,namespaceResolver,resultType);
  };

};

if($jb && $jb.Loader)
{
  $jb.Loader._scope().
  _willDeclared("$jb/iexpath.js").
  _completed(window.__jb_ieXPath);
}
else
{
  window.__jb_ieXPath();
}

// cleanup
window.__jb_ieXPath=null;