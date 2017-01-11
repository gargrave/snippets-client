export default {
  findRecordById(records, id) {
    let record = records.filter(record => record.id == id);
    if (record.length) {
      return Object.assign({}, record[0]);
    }
    return null;
  },

  getErrorObject(err) {
    if (err.response.body && err.response.body.detail) {
      return err.response.body.detail;
    }
    return null;
  }
};
