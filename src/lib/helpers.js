module.exports = {
  formatDate: function (date) {
    if (!date) {
      return '';
    }
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  },

  formatDate2: function (date) {
    if (!date){ 
      return '';
    }
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  eq: function (a, b) {
    return a === b;
  },

  and: function (a, b) {
    return a && b;
  },

  or: function (a, b) {
    return a || b;
  },

  hasPrivilege: function (privilegios, nombre, options) {
    if (!Array.isArray(privilegios)) {
      return options.inverse(this);
    }
    const tiene = privilegios.some(p => p.Nombre_privilegio === nombre);
    return tiene ? options.fn(this) : options.inverse(this);
  },

  json: function (context) {
    return JSON.stringify(context);
  },
  lte: function (a, b) {
    return a <= b;
  },
  times: function (n, block) {
    let accum = '';
    for (let i = 1; i <= n; ++i) {
      accum += block.fn(i);
    }
    return accum;
  },
  typeof: function(value) {
    return typeof value;
  }
};
