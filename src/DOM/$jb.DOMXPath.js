/**
  @file
  @author  Fyodorov "bga" Alexander <bga.email@gmail.com>
 
  @section LICENSE
 
  jbasis RIA javascript framework http://code.google.com/p/jbasis/
  Copyright (C) 2009-2010  Fyodorov "bga" Alexander <bga.email@gmail.com>

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 
  @section DESCRIPTION
  
  DOM XPath shortcut functions
 
*/

$jb.Build._scope().
//_require("$jb/nav.js").
_willDeclared("$jb/DOMXPath.js").
_completed(function(){

if($jb.DOMXPath==null)
  $jb.DOMXPath={};

$jb.DOMXPath._raw=function(xpath,root,type)
{
  if(xpath==null)
    return null;
  
  var doc;
  
  if(root==null)
    doc=root=$d;
  else
    doc=root.ownerDocument || root;
  
  if(type==null)
    type=$w.XPathResult.ANY_TYPE;
  
  return doc.evaluate(xpath,root,null,type,null);
};
$jb.DOMXPath._single=function(xpath,root)
{
  var xr=$jb.Dom._xpath(xpath,root,$w.XPathResult.ANY_UNORDERED_NODE_TYPE);
  
  return xr!=null ? xr.singleNodeValue : null;
};
$jb.DOMXPath._singleFirst=function(xpath,root)
{
  var xr=$jb.Dom._xpath(xpath,root,$w.XPathResult.FIRST_ORDERED_NODE_TYPE);
  
  return xr!=null ? xr.singleNodeValue : null;
};
$jb.DOMXPath._number=function(xpath,root)
{
  var xr=$jb.Dom._xpath(xpath,root,$w.XPathResult.NUMBER_TYPE);
  
  return xr!=null ? xr.numberValue : null;
};
$jb.DOMXPath._string=function(xpath,root)
{
  var xr=$jb.Dom._xpath(xpath,root,$w.XPathResult.STRING_TYPE);
  
  return xr!=null ? xr.stringValue : null;
};
$jb.DOMXPath._boolean=function(xpath,root)
{
  var xr=$jb.Dom._xpath(xpath,root,$w.XPathResult.BOOLEAN_TYPE);
  
  return xr!=null ? xr.booleanValue : null;
};

$jb.DOMXPath._all=function(xpath,root)
{
  return $jb.Dom._xpath(xpath,root,$w.XPathResult.UNORDERED_NODE_ITERATOR_TYPE);
};
$jb.DOMXPath._allOrdered=function(xpath,root)
{
  return $jb.Dom._xpath(xpath,root,$w.XPathResult.ORDERED_NODE_ITERATOR_TYPE);
};

$jb.DOMXPath._snapshot=function(xpath,root)
{
  return $jb.Dom._xpath(xpath,root,$w.XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE);
};
$jb.DOMXPath._snapshotOrdered=function(xpath,root)
{
  return $jb.Dom._xpath(xpath,root,$w.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
};

});