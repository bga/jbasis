$jb.Deploy._defConst(
  'supportScreenDPI', 
  (('deviceXDPI' in screen) || ('logicalXDPI' in screen)) ||
  (('deviceYDPI' in screen) || ('logicalYDPI' in screen))
);

var screenXDPI, screenYDPI;

/*#if $jb.Deploy._const('supportScreenDPI') */ /*#<*/ if($jb.Deploy._const('supportScreenDPI')) { /*#>*/
  screenXDPI = s.deviceXDPI || s.logicalXDPI;
  screenYDPI = s.deviceYDPI || s.logicalYDPI;
/*#else*/ /*#<*/ } else { /*#<*/ 
  (function()
  {
    var s = screen;
    
    screenXDPI = s.deviceXDPI || s.logicalXDPI;
    screenYDPI = s.deviceYDPI || s.logicalYDPI;
    
    if(screenXDPI && screenYDPI)
      return;
    
    var div = $d.createElement('div');
    
    div.style.cssText = 'width:1in;height:1in';
    
    $de.appendChild(div)
    
    if(!screenXDPI)
      screenXDPI = div.offsetWidth;
    if(!screenYDPI)
      screenYDPI = div.offsetHeight;
      
    $de.removeChild(div);
  })()
/*#endif*/ /*#<*/ } /*#>*/   

var cssUnitMap = 
{
  'px': 1,
  'em': function(cssUnitName, v, orien)
  {
    return parseFloat(_styleGetComputedPropertyValue('fontSize'));
  },
  /*
  'ex': function(v, orien)
  {
    var d = v.ownerDocument, span = d.createElement('span');
    
    _setText(span, 'x');
    v.appendChild(span);
    
    var ex = span.offsetHeight;
    
    v.removeChild(span);
    
    return ex;
  },
  */
  'in': 
  {
    width: screenXDPI,
    height: screenYDPI
  },
  'pt': 
  {
    width: screenXDPI/72,
    height: screenYDPI/72
  },
  'pc':
  {
    width: screenXDPI/72*12,
    height: screenYDPI/72*12
  }
  'cm':
  {
    width: screenXDPI/2.54,
    height: screenYDPI/2.54
  },
  'mm':
  {
    width: screenXDPI/2.54/100,
    height: screenYDPI/2.54/100
  }
};

var _convertCSSUnitToPx = function(from, v, orien)
{
  var cssUnit = cssUnitMap[from];

  switch(typeof(cssUnit))
  {
    case 'undefined': return NaN;
    case 'function': return cssUnit(from, v, orien);
    case 'object':
      switch(typeof((cssUnit = cssUnit[orien])))
      {
        case 'undefined': return NaN;
        case 'function': return cssUnit(from, v, orien);
        default: return cssUnit;
      }
    default: return cssUnit;
  }  
};

var _convertCSSUnit = function(from, to, v, orien)
{
  if(to == 'px')
    return _convertCSSUnitToPx(from, v, orien);
  else if(from == 'px')
    return 1/_convertCSSUnitToPx(to, v, orien);
  else  
    return _convertCSSUnitToPx(from, v, orien)/_convertCSSUnitToPx(to, v, orien);
};
 