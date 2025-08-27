# MapartCraft

A Minecraft mapart schematic and map.dat generator, designed to be feasible for both server admins and survival players on servers like 2b2t, running in your browser.

# Requirements

MapartCraft is a static website written in ReactJS; running and building requires NPM / Node. Extra scripts in `tools` are written in Python3. `tools/addColoursJSONBlock.py` optionally uses [ImageMagick](https://imagemagick.org/) to manage `src/images/textures.png`.

# Building

1. Acquire packages with `npm install`.
2. Build using `npm run build`, or run a debug version with `npm run start`.
3. Alternatively use the shell script `build.sh` for deployment on Linux. This will also copy a `.htaccess` file to the build folder for use with Apache.

The default build settings assume the app is being hosted at https://YOUR-SITE-HERE.com/mapartcraft. To change the folder from which the site is hosted modify the following:

- `homepage` in `package.json`
- `basename` in the Router in `src/app.js`
- The `RewriteRule` in `buildSources/apache/.htaccess` if using Apache

# Usage

Visit [MapartCraft](https://leinjen.github.io/mapartcraft). This is a fork of mike2b2t fork of the original tool new features.

You can find the mike2b2t fork on [mike2b2t](https://mike2b2t.github.io/mapartcraft), the original MapartCraft tool on [rebane2001.com](https://rebane2001.com/mapartcraft) or use a mirror on [web.archive.org](https://web.archive.org/web/*/https://rebane2001.com/mapartcraft).

# Credits/Thanks

- Minecraft for the block textures
- [KenPixel Mini Square](https://opengameart.org/content/kenney-fonts) font by [Kenney](https://www.kenney.nl/)
- [pako](https://www.npmjs.com/package/pako)'s zipping library
- [jszip](https://www.npmjs.com/package/jszip)'s zipping library
- [OpenMoji](https://github.com/hfg-gmuend/openmoji) for flags
- Translation credits can be seen on the translated pages
- [SelfAdjointOperator](https://github.com/SelfAdjointOperator) for some extra features
- Code contributors can be seen on the [contributions page](https://github.com/leinjen/mapartcraft/graphs/contributors)
- [mike2b2t](https://github.com/mike2b2t/mapartcraft) for some extra features
