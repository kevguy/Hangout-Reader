export default (csv, filename = 'hangout.csv') => {
  let csvFile = csv;
  if (csv == null) return;

  if (!csvFile.match(/^data:text\/csv/i)) {
    csvFile = `data:text/csv;charset=utf-8,${csv}`;
  }
  const data = encodeURI(csvFile);

  const link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  link.click();
};
