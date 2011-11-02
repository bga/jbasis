$jb._namespace('$jb.Math');

$jb._defClass({
  name: '$jb.Math.AABB2',
  
  _construct: function(xb,xe,yb,ye)
  {
    this.xb = (xb == null) ? -Infinity : xb;
    this.xe = (xe == null) ? +Infinity : xe;
    this.yb = (yb == null) ? -Infinity : yb;
    this.ye = (ye == null) ? +Infinity : ye;
  }
,  

_setNull: function()
{
  this.xb_ = +Infinity;
  this.xe_ = -Infinity;
  this.yb_ = +Infinity;
  this.ye_ = -Infinity;
  
  return this;
};

_orVec2: function(p)
{
  if(this.xb > p.x)
    this.xb = p.x;
  if(this.xe < p.x)
    this.xe = p.x;
  
  if(this.yb_>p.y_)
    this.yb_=p.y_;
  if(this.ye_<p.y_)
    this.ye_=p.y_;
    
  return this;  
};

_orVec2s=function(ps,b,e)
{
  if(b==null)
    b=0;
  if(e==null)
    e=ps.length;
  
  for(;b<e;++b)
  {
    if(this.xb_>ps[b].x_)
      this.xb_=ps[b].x_;
    if(this.xe_<ps[b].x_)
      this.xe_=ps[b].x_;
    
    if(this.yb_>ps[b].y_)
      this.yb_=ps[b].y_;
    if(this.ye_<ps[b].y_)
      this.ye_=ps[b].y_;
  }  
  
  return this;
};
_orVec2sX=function(ps,b,e)
{
  if(b==null)
    b=0;
  if(e==null)
    e=ps.length;
  
  for(;b<e;++b)
  {
    if(this.xb_>ps[b].x_)
      this.xb_=ps[b].x_;
    if(this.xe_<ps[b].x_)
      this.xe_=ps[b].x_;
  }  
  
  return this;
};
_orVec2sY=function(ps,b,e)
{
  if(b==null)
    b=0;
  if(e==null)
    e=ps.length;
  
  for(;b<e;++b)
  {
    if(this.yb_>ps[b].y_)
      this.yb_=ps[b].y_;
    if(this.ye_<ps[b].y_)
      this.ye_=ps[b].y_;
  }  
  
  return this;
};


_zoom=function(zoom)
{
  var cx=0.5*(this.xb_+this.xe_),dx=0.5*(this.xe_-this.xb_);
  var cy=0.5*(this.yb_+this.ye_),dy=0.5*(this.ye_-this.yb_);
  
  this.xb_=cx-dx*zoom;
  this.xe_=cx+dx*zoom;

  this.yb_=cy-dy*zoom;
  this.ye_=cy+dy*zoom;
  
  return this;
};

_dx=function()
{
  return this.xe_-this.xb_;
};
_dy=function()
{
  return this.ye_-this.yb_;
};

_copy=function()
{
  return new $jb.Math.AABB2(this.xb_,this.xe_,this.yb_,this.ye_);
};

_andAABB2=function(bb)
{
  if(this.xb_<bb.xb_)
    this.xb_=bb.xb_;
  if(this.xe_>bb.xe_)
    this.xe_=bb.xe_;
  if(this.yb_<bb.yb_)
    this.yb_=bb.yb_;
  if(this.ye_>bb.ye_)
    this.ye_=bb.ye_;
  
  return this;
};
_orAABB2=function(bb)
{
  if(this.xb_>bb.xb_)
    this.xb_=bb.xb_;
  if(this.xe_<bb.xe_)
    this.xe_=bb.xe_;
  if(this.yb_>bb.yb_)
    this.yb_=bb.yb_;
  if(this.ye_<bb.ye_)
    this.ye_=bb.ye_;
  
  return this;
};

_isNull=function()
{
  return this._dx()<0 || this._dy()<0;
};
_notNull=function()
{
  return this._dx()>=0 && this._dy()>=0;
};

_isIntersectWith=function(bb)
{
  return this._copy()._andAABB2(bb)._notNull();
};
_notIntersectWith=function(bb)
{
  return this._copy()._andAABB2(bb)._isNull();
};

_tlVec=function()
{
  return {x_:this.xb_, y_:this.yb_};
};
_trVec=function()
{
  return new $jb.Math.Vec2(this.xe, this.yb);
};
_blVec: function()
{
  return new $jb.Math.Vec2(this.xb, this.ye);
};
_brVec: function()
{
  return {x: this.xe, y: this.ye};
};
_vec: function(xa,ya)
{
  return {x_: this.xb*(1.0 - xa) + this.xe*xa, y_:this.yb_*(1.0-ya)+this.ye_*ya};
};

_setTLVec=function(p)
{
  this.xb = p.x; this.yb = p.y; return this;
};
_setTRVec = function(p)
{
  this.xe = p.x; this.yb = p.y; return this;
};
_setBLVec: function(p)
{
  this.xb = p.x; this.ye = p.y; return this;
};
_setBRVec: function(p)
{
  this.xe = p.x; this.ye = p.y; return this;
};
