
$jb.Deploy._defConst('supportCurrentStyle', ('currentStyle' in $de));

var _styleGetComputedStyle = 
  /*#if $jb.Deploy._const('supportCurrentStyle') */
  ($jb.Deploy._const('supportCurrentStyle') && function(v, propName)
  {
    return v.currentStyle;
  }) /*#<*/ || /*#>*/ 
  /*else*/
  function(v, propName)
  {
    return $w.getComputedStyle(v);
  }
  /*#endif*/
;
 