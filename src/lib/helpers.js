// eslint-disable-next-line no-undef
module.exports = {
    formatDate: function (date) {
        if (!date) return '';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    },

    eq: function(a, b) {
      return a === b;
    }
};