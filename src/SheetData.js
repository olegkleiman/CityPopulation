let sheetData = {

  recalculateMap(sheetName, columnName) {

      const rawData = this[sheetName].rawData;
      const columns = rawData[0];
      const columnIndex = columns.findIndex( item => item === columnName );

      const districtsMap = new Map();
      rawData.forEach( (row, index) => {

          if( index != 0 ) {
            const calculated = row[columnIndex].replace(/,/g, '');
            districtsMap.set(row[0], {
                "calculated": parseFloat(calculated)
            })
          }
      })

      this[sheetName].map = districtsMap;

  },

  load(sheetId) {

    ['2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016'].map( async(sheetName) => {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=AIzaSyABrJkY9bVKLn3YB8f4kmiiGBDWhv4goYA&majorDimension=ROWS`;
        const resp = await fetch(url);
        const respJson = await resp.json();

        const districtsData = respJson.values;

        this[sheetName] = {
          rawData: districtsData
        }
        this.recalculateMap(sheetName, 'total');
    })

  }
}

const sheetId = '1GJWgz04VTdJIPT5y4N8qkY-fkNc3lvbxATv8TeC-deA';
sheetData.load(sheetId);

export default sheetData;
