/**
  @file
  @author  Fyodorov "bga" Alexander <bga.email@gmail.com>
 
  @section LICENSE
 
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
  
  cross browser support functions for DOM.Node
 
*/

$jb.Loader._scope().
_willDeclared("$jb/$jb.keyMap.js").
_completed(function(){

if($jb.keyMap == null)
  return;
// http://api.farmanager.com/en/winapi/virtualkeycodes.html

$jb.keyMap =
{
  "LBUTTON"	:0x01,	// Left mouse button 
  "RBUTTON"	:0x02,	// Right mouse button 
  'break'	:0x03,	// Control-break processing 
  "MBUTTON"	:0x04,	// Middle mouse button (three-button mouse) 
  "XBUTTON1"	:0x05,	// Windows 2000/XP/2003/Vista/2008/7: X1 mouse button
  "XBUTTON2"	:0x06,	// Windows 2000/XP/2003/Vista/2008/7: X2 mouse button
  //-	07	// Undefined 
  backSpace	:0x08,	// BACKSPACE key 
  tab	:0x09,	// TAB key 
  //-	0A-0B	// Reserved
  "CLEAR"	:0x0C,	// CLEAR key 
  enter	:0x0D,	// ENTER key 
  //-	0E-0F	// Undefined 
  shift	:0x10,	// SHIFT key 
  ctrl	:0x11,	// CTRL key 
  alt	:0x12,	// ALT key 
  pause	:0x13,	// PAUSE key 
  capsLock	:0x14,	// CAPS LOCK key 
  "ime:kana"	:0x15,	// Input Method Editor (IME) Kana mode
  "ime:hanguel"	:0x15,	// IME Hanguel mode (maintained for compatibility; use VK_HANGUL)
  "ime:hangul"	:0x15,	// IME Hangul mode
  //-	16	// Undefined
  "ime:junja"	:0x17,	// IME Junja mode
  "ime:final"	:0x18,	// IME final mode
  "ime:hanja"	:0x19,	// IME Hanja mode
  "ime:kanji"	:0x19,	// IME Kanji mode
  //-	1A	// Undefined 
  esc	:0x1B,	// ESC key 
  "ime:convert"	:0x1C,	// IME convert (Reserved for Kanji systems)
  "ime:nonconvert"	:0x1D,	// IME nonconvert (Reserved for Kanji systems)
  "ime:accept"	:0x1E,	// IME accept (Reserved for Kanji systems)
  "ime:modechange"	:0x1F,	// IME mode change request (Reserved for Kanji systems)
  space	:0x20,	// SPACEBAR 
  pageUp	:0x21,	// PAGE UP key 
  pageDown	:0x22,	// PAGE DOWN key 
  end	:0x23,	// END key 
  home	:0x24,	// HOME key 
  left	:0x25,	// LEFT ARROW key 
  up	:0x26,	// UP ARROW key 
  right	:0x27,	// RIGHT ARROW key 
  down	:0x28,	// DOWN ARROW key 
  select	:0x29,	// SELECT key 
  print	:0x2A,	// PRINT key
  exec	:0x2B,	// EXECUTE key 
  printScreen	:0x2C,	// PRINT SCREEN key for Windows 3.0 and later 
  ins	:0x2D,	// INS key 
  del	:0x2E,	// DEL key 
  help	:0x2F,	// HELP key 
  "0"	:0x30,	// 0 key 
  "1"	:0x31,	// 1 key 
  "2"	:0x32,	// 2 key 
  "3"	:0x33,	// 3 key 
  "4"	:0x34,	// 4 key 
  "5"	:0x35,	// 5 key 
  "6"	:0x36,	// 6 key 
  "7"	:0x37,	// 7 key 
  "8"	:0x38,	// 8 key 
  "9"	:0x39,	// 9 key 
  //-	3A-40	// Undefined 
  a	:0x41,	// a key 
  b	:0x42,	// b key 
  c	:0x43,	// c key 
  d	:0x44,	// d key 
  e	:0x45,	// e key 
  f	:0x46,	// f key 
  g	:0x47,	// g key 
  h	:0x48,	// h key 
  i	:0x49,	// i key 
  j	:0x4a,	// j key 
  k	:0x4b,	// k key 
  l	:0x4c,	// l key 
  m	:0x4d,	// m key 
  n	:0x4e,	// n key 
  o	:0x4f,	// o key 
  p	:0x50,	// p key 
  q	:0x51,	// q key 
  r	:0x52,	// r key 
  s	:0x53,	// s key 
  t	:0x54,	// t key 
  u	:0x55,	// u key 
  v	:0x56,	// v key 
  w	:0x57,	// w key 
  x	:0x58,	// x key 
  y	:0x59,	// y key 
  z	:0x5a,	// z key 
  leftWin	:0x5B,	// Left Windows key (Microsoft Natural Keyboard) 
  rightWin	:0x5C,	// Right Windows key (Microsoft Natural Keyboard)
  contextMenu	:0x5D,	// Applications key (Microsoft Natural Keyboard)
  //-	5E	// Reserved
  sleep	:0x5F,	// Computer Sleep key
  'numpad:0'	:0x60,	// Numeric keypad 0 key  alt && f1 -> !alt && !f1 -> shift && '['
  'numpad:1'	:0x61,	// Numeric keypad 1 key 
  'numpad:2'	:0x62,	// Numeric keypad 2 key 
  'numpad:3'	:0x63,	// Numeric keypad 3 key 
  'numpad:4'	:0x64,	// Numeric keypad 4 key 
  'numpad:5' :0x65,	// Numeric keypad 5 key 
  'numpad:6'	:0x66,	// Numeric keypad 6 key 
  'numpad:7'	:0x67,	// Numeric keypad 7 key 
  'numpad:8'	:0x68,	// Numeric keypad 8 key 
  'numpad:9'	:0x69,	// Numeric keypad 9 key 
  'numpad:*'	:0x6A,	// Multiply key 
  'numpad:+'	:0x6B,	// Add key 
  'numpad:del'	:0x6C,	// Separator key 
  'numpad:-'	:0x6D,	// Subtract key 
  'numpad:.'	:0x6E,	// Decimal key 
  'numpad:/'	:0x6F,	// Divide key 
  f1	:0x70,	// F1 key 
  f2	:0x71,	// F2 key 
  f3	:0x72,	// F3 key 
  f4	:0x73,	// F4 key 
  f5	:0x74,	// F5 key 
  f6	:0x75,	// F6 key 
  f7	:0x76,	// F7 key 
  f8	:0x77,	// F8 key 
  f9	:0x78,	// F9 key 
  f10	:0x79,	// F10 key 
  f11	:0x7A,	// F11 key 
  f12 :0x7B,	// F12 key 
  f13	:0x7C,	// F13 key 
  f14	:0x7D,	// F14 key 
  f15	:0x7E,	// F15 key 
  f16:0x7F,	// F16 key 
  f17	:0x80,	// F17 key 
  f18	:0x81,	// F18 key 
  f19	:0x82,	// F19 key 
  f20	:0x83,	// F20 key 
  f21	:0x84,	// F21 key 
  f22	:0x85,	// F22 key 
  f23	:0x86,	// F23 key 
  f24	:0x87,	// F24 key 
  //-	88-8F	// Unassigned 
  numLock	:0x90,	// NUM LOCK key 
  scrollLock	:0x91,	// SCROLL LOCK key 
  "OEM_NEC_EQUAL"	:0x92,	// NEC PC-9800 kbd definitions: '=' key on numpad
  "fujitsu:jisho"	:0x92,	// Fujitsu/OASYS kbd definitions: 'Dictionary' key
  "fujitsu:masshou"	:0x93,	// Fujitsu/OASYS kbd definitions: 'Unregister word' key
  "fujitsu:touroku"	:0x94,	// Fujitsu/OASYS kbd definitions: 'Register word' key
  "fujitsu:loya"	:0x95,	// Fujitsu/OASYS kbd definitions: 'Left OYAYUBI' key
  "fujitsu:roya"	:0x96,	// Fujitsu/OASYS kbd definitions: 'Right OYAYUBI' key
  //-	97-9F	// Unassigned
  leftShift	:0xA0,	// Left SHIFT key
  rightShift	:0xA1,	// Right SHIFT key
  leftCtrl	:0xA2,	// Left CONTROL key
  rightCtrl	:0xA3,	// Right CONTROL key
  leftAlt	:0xA4,	// Left MENU key
  rightAlt	:0xA5,	// Right MENU key
  "browser:back"	:0xA6,	// Windows 2000/XP/2003/Vista/2008/7: Browser Back key
  "browser:forward"	:0xA7,	// Windows 2000/XP/2003/Vista/2008/7: Browser Forward key
  "browser:refresh"	:0xA8,	// Windows 2000/XP/2003/Vista/2008/7: Browser Refresh key
  "browser:stop"	:0xA9,	// Windows 2000/XP/2003/Vista/2008/7: Browser Stop key
  "browser:search"	:0xAA,	// Windows 2000/XP/2003/Vista/2008/7: Browser Search key
  "browser:favorites"	:0xAB,	// Windows 2000/XP/2003/Vista/2008/7: Browser Favorites key
  "browser:home"	:0xAC,	// Windows 2000/XP/2003/Vista/2008/7: Browser Start and Home key
  volumeMute	:0xAD,	// Windows 2000/XP/2003/Vista/2008/7: Volume Mute key
  volumeDown	:0xAE,	// Windows 2000/XP/2003/Vista/2008/7: Volume Down key
  volumeUp	:0xAF,	// Windows 2000/XP/2003/Vista/2008/7: Volume Up key
  "media:nextTrack"	:0xB0,	// Windows 2000/XP/2003/Vista/2008/7: Next Track key
  "media:prevTrack"	:0xB1,	// Windows 2000/XP/2003/Vista/2008/7: Previous Track key
  "media:stop"	:0xB2,	// Windows 2000/XP/2003/Vista/2008/7: Stop Media key
  "media:playPause"	:0xB3,	// Windows 2000/XP/2003/Vista/2008/7: Play/Pause Media key
  "launch:mail"	:0xB4,	// Windows 2000/XP/2003/Vista/2008/7: Start Mail key
  "launch:mediaSelect"	:0xB5,	// Windows 2000/XP/2003/Vista/2008/7: Select Media key
  "launch:app1"	:0xB6,	// Windows 2000/XP/2003/Vista/2008/7: Start Application 1 key
  "launch:app2"	:0xB7,	// Windows 2000/XP/2003/Vista/2008/7: Start Application 2 key
  //-	B8-B9	// Reserved
  ';'	:0xBA,	// Windows 2000/XP/2003/Vista/2008/7: For the US standard keyboard, the ';:' key
  '+'	:0xBB,	// Windows 2000/XP/2003/Vista/2008/7: For any country/region, the '+' key
  ','	:0xBC,	// Windows 2000/XP/2003/Vista/2008/7: For any country/region, the ',' key
  '-'	:0xBD,	// Windows 2000/XP/2003/Vista/2008/7: For any country/region, the '-' key
  '.'	:0xBE,	// Windows 2000/XP/2003/Vista/2008/7: For any country/region, the '.' key
  '/'	:0xBF,	// Windows 2000/XP/2003/Vista/2008/7: For the US standard keyboard, the '/?' key
  '~'	:0xC0,	// Windows 2000/XP/2003/Vista/2008/7: For the US standard keyboard, the '`~' key
  //-	C1-D7	// Reserved 
  //-	D8-DA	// Unassigned
  "["	:0xDB,	// Windows 2000/XP/2003/Vista/2008/7: For the US standard keyboard, the '[{' key
  "\\"	:0xDC,	// Windows 2000/XP/2003/Vista/2008/7: For the US standard keyboard, the '\|' key
  "]"	:0xDD,	// Windows 2000/XP/2003/Vista/2008/7: For the US standard keyboard, the ']}' key
  "'"	:0xDE,	// Windows 2000/XP/2003/Vista/2008/7: For the US standard keyboard, the 'single-quote/double-quote' key
  "OEM_8"	:0xDF,	// Used for miscellaneous characters; it can vary by keyboard.
  //-	E0	// Reserved
  //	E1	// OEM specific
  "OEM_102"	:0xE2,	// Windows 2000/XP/2003/Vista/2008/7: Either the angle bracket key or the backslash key on the RT 102-key keyboard
  //-	E3-E4	// OEM specific 
  "PROCESSKEY"	:0xE5,	// Windows 95/98/Me, Windows NT/2000/XP/2003/Vista/2008/7: IME PROCESS key
  //-	E6	// OEM specific 
  "PACKET"	:0xE7,	// Windows 2000/XP/2003/Vista/2008/7: Used to pass Unicode characters as if they were keystrokes. The VK_PACKET key is the low word of a 32-bit Virtual Key value used for non-keyboard input methods. For more information, see Remark in KEYBDINPUT , SendInput , WM_KEYDOWN , and WM_KEYUP 
  //-	E8	// Unassigned 
  "nokia:reset"	:0xE9,	// Only used by Nokia.
  "nokia:jump"	:0xEA,	// Only used by Nokia.
  "nokia:pa1"	:0xEB,	// Only used by Nokia.
  "nokia:pa2"	:0xEC,	// Only used by Nokia.
  "nokia:pa3"	:0xED,	// Only used by Nokia.
  "nokia:wsctrl"	:0xEE,	// Only used by Nokia.
  "nokia:cusel"	:0xEF,	// Only used by Nokia.
  "nokia:attn"	:0xF0,	// Only used by Nokia.
  "nokia:finnish"	:0xF1,	// Only used by Nokia.
  "nokia:copy"	:0xF2,	// Only used by Nokia.
  "nokia:auto "	:0xF3,	// Only used by Nokia.
  "nokia:enlw"	:0xF4,	// Only used by Nokia.
  "nokia:backtab "	:0xF5,	// Only used by Nokia.
  attn	:0xF6,	// Attn key
  "CRSEL"	:0xF7,	// CrSel key
  "EXSEL"	:0xF8,	// ExSel key
  "EREOF"	:0xF9,	// Erase EOF key
  play	:0xFA,	// Play key
  zoom	:0xFB,	// Zoom key
  "NONAME"	:0xFC,	// Reserved for future use. 
  pa1	:0xFD,	// PA1 key
  'oem:clear'	:0xFE	// Clear key
  //	FF	// Multimedia keys. See ScanCode keys.
};

if($jb._const('host:name') == 'opera')
{  
  $jb.keyMap['leftWin'] = -1;
  $jb.keyMap['contextMenu'] = 0;
}

});