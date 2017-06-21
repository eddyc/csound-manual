# csound-manual
A node program to convert Docbook format manual pages to AsciiDoctor syntax and to include csound-web-player in opcode pages for web based Csound manual.

## Requirements

Node, Ruby, Asciidoctor, csound-web-player, csound-engine
## Installation


``
 git clone https://github.com/eddyc/csound-manual.git
 ``

Get csound-player and extract to root directory


``
https://github.com/eddyc/csound-player/releases/download/v1.0/Csound-Player-1.0.zip
``

 Install Asciidoctor

 ``
 gem install asciidoctor
 ``

 Convert xml files in opcodes directory (currently just areson.xml with the corresponding example file areson.csd in the examples directory)

``
node main.js opcodes
``

The output html files will be in the opcodes directory.
