# csound-manual
A node program to convert Docbook format manual pages to AsciiDoctor syntax and to include csound-web-player in opcode pages for web based Csound manual.

## Requirements

Node, Ruby, Asciidoctor, csound-web-player, csound-engine
## Installation


``
 git clone https://github.com/eddyc/csound-manual.git
 ``

Get csound-web-player and csound-engine using npm

``
cd csound-manual &&
npm install
``

 Install Asciidoctor

 ``
 gem install asciidoctor
 ``

 Convert xml files in opcodes directory (currently just areson.xml with the corresponding example file areson.csd in the examples directory)

``
node main.js opcodes
``

The output html files will be in the opcodes directory
