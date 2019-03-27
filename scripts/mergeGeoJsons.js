import fs from 'fs';
import path from 'path';
import geojsonMerge from '@mapbox/geojson-merge';

process.on('warning', e => console.warn(e.stack));

const outputStream = fs.createWriteStream(__dirname + '/merged.geojson', { flags : 'w' });

const dir = path.join(__dirname, '/geoJson');
let filesToMerge = [];

fs.readdir(dir, (err, files) => {

  if( err ) {
    console.error(err);
    process.exit(1);
  }

  filesToMerge = files.map( item => {
    const fileName = path.join(dir, item);
    console.log(fileName);
    return fileName;
  });

  var mergedStream = geojsonMerge.mergeFeatureCollectionStream(filesToMerge);

  mergedStream._maxListeners = 100;
  // process.setMaxListeners(100);
  mergedStream.pipe(outputStream);

  // outputStream.on('close', function () {
  //   // mergedStream.unpipe(outputStream);
  //
  //   console.log('All done!');
  //   process.exit(0);
  // });

})
