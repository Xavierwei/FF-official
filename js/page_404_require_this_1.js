// Copyright 2013 Clark DuVall
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var COMMANDS = COMMANDS || {};

// COMMANDS.cat = function (argv, cb) {
//   var filenames = this._terminal.parseArgs(argv).filenames,
//     stdout;

//   this._terminal.scroll();
//   if (!filenames.length) {
//     this._terminal.returnHandler = function () {
//       stdout = this.stdout();
//       if (!stdout)
//         return;
//       stdout.innerHTML += '<br>' + stdout.innerHTML + '<br>';
//       this.scroll();
//       this.newStdout();
//     }.bind(this._terminal);
//     return;
//   }
//   filenames.forEach(function (filename, i) {
//     var entry = this._terminal.getEntry(filename);

//     if (!entry)
//       this._terminal.write('cat: ' + filename + ': No such file or directory');
//     else if (entry.type === 'dir')
//       this._terminal.write('cat: ' + filename + ': Is a directory.');
//     else
//       this._terminal.write(entry.contents);
//     if (i !== filenames.length - 1)
//       this._terminal.write('<br>');
//   }, this);
//   cb();
// }
// COMMANDS.cd = function (argv, cb) {
//   var filename = this._terminal.parseArgs(argv).filenames[0],
//     entry;

//   if (!filename)
//     filename = '~';
//   entry = this._terminal.getEntry(filename);
//   if (!entry)
//     this._terminal.write('bash: cd: ' + filename + ': No such file or directory');
//   else if (entry.type !== 'dir')
//     this._terminal.write('bash: cd: ' + filename + ': Not a directory.');
//   else
//     this._terminal.cwd = entry;
//   cb();
// }

// COMMANDS.ls = function (argv, cb) {
//   var result = this._terminal.parseArgs(argv),
//     args = result.args,
//     filename = result.filenames[0],
//     entry = filename ? this._terminal.getEntry(filename) : this._terminal.cwd,
//     maxLen = 0,
//     writeEntry;

//   writeEntry = function (e, str) {
//     this.writeLink(e, str);
//     if (args.indexOf('l') > -1) {
//       if ('description' in e)
//         this.write(' - ' + e.description);
//       this.write('<br>');
//     } else {
//       // Make all entries the same width like real ls. End with a normal
//       // space so the line breaks only after entries.
//       this.write(Array(maxLen - e.name.length + 2).join('&nbsp') + ' ');
//     }
//   }.bind(this._terminal);

//   if (!entry)
//     this._terminal.write('ls: cannot access ' + filename + ': No such file or directory');
//   else if (entry.type === 'dir') {
//     var dirStr = this._terminal.dirString(entry);
//     maxLen = entry.contents.reduce(function (prev, cur) {
//       return Math.max(prev, cur.name.length);
//     }, 0);

//     for (var i in entry.contents) {
//       var e = entry.contents[i];
//       if (args.indexOf('a') > -1 || e.name[0] !== '.')
//         writeEntry(e, dirStr + '/' + e.name);
//     }
//   } else {
//     maxLen = entry.name.length;
//     writeEntry(entry, filename);
//   }
//   cb();
// }
// COMMANDS.gimp = function (argv, cb) {
//   var filename = this._terminal.parseArgs(argv).filenames[0],
//     entry,
//     imgs;

//   if (!filename) {
//     this._terminal.write('gimp: please specify an image file.');
//     cb();
//     return;
//   }

//   entry = this._terminal.getEntry(filename);
//   if (!entry || entry.type !== 'img') {
//     this._terminal.write('gimp: file ' + filename + ' is not an image file.');
//   } else {
//     this._terminal.write('<img src="' + entry.contents + '"/>');
//     imgs = this._terminal.div.getElementsByTagName('img');
//     imgs[imgs.length - 1].onload = function () {
//       this.scroll();
//     }.bind(this._terminal);
//     if ('caption' in entry)
//       this._terminal.write('<br/>' + entry.caption);
//   }
//   cb();
// }
COMMANDS.clear = function (argv, cb) {
  this._terminal.div.innerHTML = '';
  cb();
}

// COMMANDS.sudo = function (argv, cb) {
//   var count = 0;
//   this._terminal.returnHandler = function () {
//     if (++count < 3) {
//       this.write('<br/>Sorry, try again.<br/>');
//       this.write('[sudo] password for ' + this.config.username + ': ');
//       this.scroll();
//     } else {
//       this.write('<br/>sudo: 3 incorrect password attempts');
//       cb();
//     }
//   }.bind(this._terminal);
//   this._terminal.write('[sudo] password for ' + this._terminal.config.username + ': ');
//   this._terminal.scroll();
// }

// COMMANDS.login = function (argv, cb) {
//   this._terminal.returnHandler = function () {
//     var username = this.stdout().innerHTML;

//     this.scroll();
//     if (username)
//       this.config.username = username;
//     this.write('<br>Password: ');
//     this.scroll();
//     this.returnHandler = function () {
//       cb();
//     }
//   }.bind(this._terminal);
//   this._terminal.write('Username: ');
//   this._terminal.newStdout();
//   this._terminal.scroll();
// }

// COMMANDS.tree = function (argv, cb) {
//   var term = this._terminal,
//     home;

//   function writeTree(dir, level) {
//     dir.contents.forEach(function (entry) {
//       var str = '';

//       if (entry.name.startswith('.'))
//         return;
//       for (var i = 0; i < level; i++)
//         str += '|  ';
//       str += '|&mdash;&mdash;';
//       term.write(str);
//       term.writeLink(entry, term.dirString(dir) + '/' + entry.name);
//       term.write('<br>');
//       if (entry.type === 'dir')
//         writeTree(entry, level + 1);
//     });
//   };
//   home = this._terminal.getEntry('~');
//   this._terminal.writeLink(home, '~');
//   this._terminal.write('<br>');
//   writeTree(home, 0);
//   cb();
// }

// COMMANDS.help = function (argv, cb) {
//   this._terminal.write(
//     'You can navigate either by clicking on anything that ' +
//     '<a href="javascript:void(0)">underlines</a> when you put your mouse ' +
//     'over it, or by typing commands in the terminal. Type the name of a ' +
//     '<span class="exec">link</span> to view it. Use "cd" to change into a ' +
//     '<span class="dir">directory</span>, or use "ls" to list the contents ' +
//     'of that directory. The contents of a <span class="text">file</span> ' +
//     'can be viewed using "cat". <span class="img">Images</span> are ' +
//     'displayed using "gimp".<br><br>If there is a command you want to get ' +
//     'out of, press Ctrl+C or Ctrl+D.<br><br>');
//   this._terminal.write('Commands are:<br>');
//   for (var c in this._terminal.commands) {
//     if (this._terminal.commands.hasOwnProperty(c) && !c.startswith('_'))
//       this._terminal.write(c + '  ');
//   }
//   cb();
// }


// COMMANDS.show_title = function (argv, cb) {
//   this._terminal.write('••• STOP: OxOOOOOOlE (Ox80000003,0x80106fc0,0x8025ea21,0xfd6829e8) <br>' +
//     'unhandled Kernel exception c0000047 from fa8418b4 (8025ea21,fd6829e8) <br>');
//   cb();
// }
COMMANDS.y = function (argv, cb) {
  window.location.replace('http://preprod.fredfarid.com/ff/views/');
}
COMMANDS.yes = function (argv, cb) {
  window.location.replace('http://preprod.fredfarid.com/ff/views/');
}
COMMANDS.Y = function (argv, cb) {
  window.location.replace('http://preprod.fredfarid.com/ff/views/');
}
COMMANDS.YES = function (argv, cb) {
  window.location.replace('http://preprod.fredfarid.com/ff/views/');
}
COMMANDS.find_page = function (argv, cb) {
  this._terminal.write('••• STOP: OxOOOOOOlE (Ox80000003,0x80106fc0,0x8025ea21,0xfd6829e8) <br>' +
    'unhandled Kernel exception c0000047 from fa8418b4 (8025ea21,fd6829e8) <br>');
  this._terminal.write('<table>' +
    '<tr><td>Dll Base Date Stamp - Name </td><td>Dll Base Date stamp - Name</td></tr>' +
    '<tr><td>80100000 2be154c9 - ntoskrnl .exe</td><td>80400000 2bcl53b0 - hal .dll</td></tr>' +
    '<tr><td>80258000 2bd49628 - ncrc710.sys</td><td>8025c000 2bd49688 - SCSIPORT. SYS</td></tr>' +
    '<tr><td>80267000 2bd49683 - scsidisk . sys</td><td>802a6000 2bd496b9 - Fastfat.sys</td></tr>' +
    '<tr><td>fa800000 2bd49666 - Floppy.SYS</td><td>fa810000 2bd496db - Hpfs_Rec.SYS</td></tr>' +
    '<tr><td>fa820000 2bd49676 - Nul l.SYS</td><td>fa830000 2bd4965a - Beep.SYS</td></tr>' +
    '<tr><td>fa840000 2bdaab00 - i8042prt . SYS</td><td>fa850000 2bd5a020 - SERMOUSE . SYS</td></tr>' +
    '<tr><td>fa860000 2bd4966f - kbdclass . SYS</td><td>fa870000 2bd49671 - MOUCLASS . SYS</td></tr>' +
    '<tr><td>fa880000 2bd9c0be - Videoprt . SYS</td><td>fa890000 2bd49638 - NCC1701E . SYS</td></tr>' +
    '<tr><td>fa8a0000 2bd4a4ce - Vga . SYS</td><td>fa8b0000 2bd496d0 - Msfs . SYS</td></tr>' +
    '<tr><td>fa8c0000 2bd496c3 - llpfs.SYS</td><td>fa8e0000 2bd496c9 - Ntfs.SYS</td></tr>' +
    '<tr><td>fa940000 2bd496df - NDI S.SYS</td><td>fa930000 2bd49707 - wdl an . sys</td></tr>' +
    '<tr><td>fa970000 2bd49712 - TOI.SYS</td><td>fa950000 2bd5a7fb - nbf . sys</td></tr>' +
    '<tr><td>fa980000 2bd72406 - streams.sys</td><td>fa9b0000 2bd4975f - ubnb . sys</td></tr>' +
    '<tr><td>fa9c0000 2bd5bfd7 - usbser . sys</td><td>fa9d0000 2bd497ld - netbios.sys</td></tr>' +
    '<tr><td>fa9e0000 2bd49678 - Parallel . sys</td><td>fa9f0000 2bd4969f - serial . SYS</td></tr>' +
    '<tr><td>faaOOOOO 2bd49739 - mup . sys</td><td>faa40000 2bd497lf - SMBTRSUP . SYS</td></tr>' +
    '<tr><td>faalOOOO 2bd6f2a2 - srv.sys</td><td>faa50000 2bd497l a - a f d . sys</td></tr>' +
    '<tr><td>faa60000 2bd6fd80 - rdr.sys</td><td>faaaOOOO 2bd49735 - bowser.sys</td></tr>' +
    '</table>' + '<br>' +
    '<table>' +
    '<tr><td>Address dword dump Dll Base </td><td> - Name</td></tr>' +
    '<tr><td>801afc20 80106fc0 80106fc0 00000000 00000000 80149905 : fa840000 </td><td> - i8042prt . SYS</td></tr>' +
    '<tr><td>801afc24 80149905 80149905 ff8e6b8c 80129c2c ff8e6b94 : 8025c000 </td><td> - SCSIPORT . SYS</td></tr>' +
    '<tr><td>801afc2c 80129c2c 80129c2c ff8e6b94 00000000 ff8e6b94 : 80100000 </td><td> - ntoskrnl.exe</td></tr>' +
    '<tr><td>801afc34 801240f2 80124f02 ff8e6df 4 ff8e6f60 ff8e6c58 : 80100000 </td><td> - ntoskrnl .exe</td></tr>' +
    '<tr><td>801afc54 80124f16 80124f16 ff8e6f60 ff8e6c3c 8015ac7e : 80100000 </td><td> - ntoskrnl .exe</td></tr>' +
    '<tr><td>801afc64 8015ac7e 8015ac7e ff8e6df 4 ff8e6f60 ff8e6c58 : 80100000 </td><td> - ntoskrnl .exe</td></tr>' +
    '<tr><td>80lafc70 80129bda 80129bda 00000000 80088000 80106fc0 : 80100000 </td><td> - ntoskrnl .exe</td></tr>' +
    '</table><br>' +
    'Kernel Debugger Using : COM2 (Port Ox2f8, Baud Rate 19200)' +
    'Restart and set the recovery options in the system control panel' +
    'or the /CRASHDEBUG system start option. If this message reappears,' +
    'contact your system administrator or technical support group .<br>');
  this._terminal.write('<br>page error 404 <br>');
  this._terminal.write('press y/n <br>');
  cb();
}