export default {
  buildRecordData: function(record) {
    return {
      first_name: record.firstName ? record.firstName.trim() : '',
      last_name: record.lastName ? record.lastName.trim() : '',
    };
  },

  checkForMatch(orig, updated) {
    if (orig.firstName.trim() !== updated.first_name.trim() ||
      orig.lastName.trim() !== updated.last_name.trim()) {
      return false;
    }
    return true;
  }
};
