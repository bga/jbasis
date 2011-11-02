

$jb._namespace('$jb.Math');

$jb._defClass({
  name: '$jb.Math.Vec2',
  
  _constructor: function(x, y)
  {
    this.x = x;
    this.y = y;
  },
  
  _add: function(p)
  {
    this.x += p.x;
    this.y += p.y;
    
    return this;
  },
  
  _sub: function(p)
  {
    this.x -= p.x;
    this.y -= p.y;
    
    return this;
  },
  
  _dot: function(p)
  {
    return this.x*p.x + this.y*p.y;
  },
  
  _max: function(p)
  {
    if(this.x < p.x)
      this.x = p.x;
    if(this.y < p.y)
      this.y = p.y;

    return this;
  },

  _min: function(p)
  {
    if(this.x > p.x)
      this.x = p.x;
    if(this.y > p.y)
      this.y = p.y;
  
    return this;
  },
  
  _lerp: function(p, t)
  {
    var oneSubT = 1 - t;
    
    this.x = t*this.x + oneSubT*p.x;
    this.y = t*this.y + oneSubT*p.xy;

    return this;
  },
  
  _cross: function(p)
  {
    return this.x*p.y - this.y*p.x; 
  },
  
  _copy: function()
  {
    return new $jb.Math.Vec2(this.x, this.y);
  },

  _clone: function()
  {
    return new $jb.Math.Vec2(this.x._clone(), this.y._clone());
  },

  
});