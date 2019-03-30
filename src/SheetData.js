let sheetData = {

  load(sheetId) {

    ['2010', '2011', '2012', '2013', '2014', '2015', '2016'].map( async(sheetName) => {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=AIzaSyABrJkY9bVKLn3YB8f4kmiiGBDWhv4goYA&majorDimension=ROWS`;
        const resp = await fetch(url);
        const respJson = await resp.json();

        const districtsData = respJson.values;

        let columns = [];
        const districtsMap = new Map();
        districtsData.forEach( (item, index) => {
          if( index === 0 ) {
            columns = item;
          } else {
            const columnIndex = columns.findIndex( item => item === 'total' );
            districtsMap.set(item[0], {
              "total": parseFloat(item[columnIndex].replace(/,/g, '')),
            });
          }
        });

        this[sheetName] = {
          map: districtsMap,
          rawData: districtsData
        }
    })

  }
}

const sheetId = '1GJWgz04VTdJIPT5y4N8qkY-fkNc3lvbxATv8TeC-deA';
sheetData.load(sheetId);

export default sheetData;
