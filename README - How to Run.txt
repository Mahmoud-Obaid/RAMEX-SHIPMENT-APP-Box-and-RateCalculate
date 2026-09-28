ARAMEX SHIPMENT APP - HOW TO RUN ON WINDOWS (10 / 11)
======================================================

WHAT TO DO
-----------
1. Put these 4 files together in one folder (all in the SAME folder):
     - start.bat
     - server.js
     - box_classes.html
     - aramex_locations_data.js

2. Double-click "start.bat".

That's it. On the very first run, if Node.js isn't already installed on
the computer, start.bat will download and install it automatically
(this needs an internet connection, and Windows may show a permission
prompt - please allow it). After that first-time install, every future
double-click just starts the app straight away.

A window will open and stay open while the app runs - it's titled
"Aramex Shipment App - keep this window open". Leave it running in the
background. Your browser will open automatically to the app. Closing
that window stops the app.


FILES THAT ARE NO LONGER NEEDED
---------------------------------
"proxy.js" from the earlier setup is replaced by "server.js" (it does
the same job, plus it now also serves the web page itself, so you no
longer run a separate proxy AND separately open the HTML file - one
double-click does both). You can delete proxy.js or just leave it
sitting unused in the folder - either is fine.


IF SOMETHING GOES WRONG
-------------------------
- "Could not download Node.js automatically": the computer likely has
  no internet access, or a firewall is blocking it. Install Node.js
  yourself from https://nodejs.org (choose the LTS version, 64-bit),
  then double-click start.bat again.

- Windows Defender / your antivirus asks about "Node.js" wanting
  network access: allow it for private/home networks. The app only
  talks to localhost (your own PC) and to Aramex's servers - nothing
  else.

- The browser opens before the app is ready ("can't reach this page"):
  just wait a second or two and refresh the page.

- Nothing happens when you double-click start.bat: right-click it and
  choose "Run as administrator" once - installing Node.js the first
  time may need that.


WANT A REAL .EXE INSTEAD OF A .BAT FILE?
-------------------------------------------
start.bat already gives you the "just double-click it" experience.
If you'd like it to look like a proper Windows .exe with its own icon,
that needs a Windows packaging tool to wrap it (I can't produce a
compiled Windows binary myself). Two easy, free ways to do this
yourself on a Windows machine, whenever you're ready:

  1. IExpress (built into Windows - no download needed):
     Press Win+R, type "iexpress", and follow its wizard to package
     start.bat plus the other 3 files into a single self-extracting
     .exe with a custom icon.

  2. "Bat To Exe Converter" (free, small download): point it at
     start.bat and it produces a standalone .exe.

Either way, keep server.js, box_classes.html, and
aramex_locations_data.js alongside the resulting .exe (or have the
packaging tool bundle them in) - the launcher still needs those files
next to it to run.
