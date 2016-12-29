export default {
  findRecordById(records, id) {
    let record = records.filter(record => record.id == id);
    if (record.length) {
      return Object.assign({}, record[0]);
    }
    return null;
  }
};
