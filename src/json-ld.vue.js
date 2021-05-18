const jsonld = require("jsonld");
const _ = require("lodash");

const DATA_TITLE  = "Datasource";
const DATA2_TITLE = "Datasource 2";
const FRAME_TITLE = "JSON-LD Frame";
module.exports = {
  name: "json-ld",
  data() {
    return {
      mode: this.$attrs.view || "compacted",
      layout: "cols",
      message: "",
      jsonldInput: "{}",
      jsonldInput2: "{}",
      jsonldFrame: "{}",
      jsonldProcessed: "{}",
      rdfStatements: []
    }
  },
  mounted() {
    const me = this;
    me.jsonldInput  = fromSlot(me.$slots.default) || "{}";
    me.jsonldInput2 = fromSlot(me.$slots.data2) || "{}";
    me.jsonldFrame  = fromSlot(me.$slots.frame) || "{}";
    me.formatInput();
  },
  created() {
    this.processDebounced = _.debounce(this.process, 500);
  },
  watch: {
    mode: function() {
      return this.process();
    },
    jsonldInput: function () {
      return this.processDebounced();
    },
    jsonldInput2: function () {
      return this.processDebounced();
    },
    jsonldFrame: function () {
      return this.processDebounced();
    }
  },
  methods: {
    process: function() {
      const my = this;
      try {
        my.formatOutput().catch(err => my.message = err.message);
        my.message = "";
      } catch (err) {
        my.message = err.message;
      }
    },
    formatInput: function () {
      const my        = this;
      my.jsonldInput  = my.locateErr(my.$attrs.data  || DATA_TITLE,  () => JSON.stringify(JSON.parse(my.jsonldInput), null, 2));
      my.jsonldInput2 = my.locateErr(my.$attrs.data2 || DATA2_TITLE, () => JSON.stringify(JSON.parse(my.jsonldInput2), null, 2));
      my.jsonldFrame  = my.locateErr(my.$attrs.frame || FRAME_TITLE, () => JSON.stringify(JSON.parse(my.jsonldFrame), null, 2));
    },
    formatOutput: function () {
      const my        = this;
      const input     = my.locateErr(my.$attrs.data  || DATA_TITLE , () => JSON.parse(my.jsonldInput));
      const input2    = my.locateErr(my.$attrs.data2 || DATA2_TITLE, () => JSON.parse(my.jsonldInput2));
      const frame     = my.locateErr(my.$attrs.frame || FRAME_TITLE, () => JSON.parse(my.jsonldFrame));
      let result;
      switch(my.mode) {
        case "rdf":
          result = jsonld.toRDF(input, { base: location.href });
          result.then(rdf => this.rdfStatements = rdf);
          break;
        case "expanded":  result = jsonld.expand(input); break;
        case "flattened": result = jsonld.flatten(input, input); break;
        case "framed":
          result = jsonld
            .expand([input, input2])
            .then(xpd => jsonld.frame(xpd, frame, { embed: "@always" }));
          break;
        default: result = jsonld.compact(input, {});
      }
      return result
        .then(obj => JSON.stringify(obj, null, 2))
        .then(str => my.jsonldProcessed = str);
      // ========================================
    },
    locateErr: function(prefix, cb) {
      try {
        return cb.call(this);
      } catch (err) {
        err.message = `${prefix}: ${err.message}`;
        throw err;
      }
    }
  }
};

function fromSlot(strArray) {
  return strArray?.filter(e => !!e.text)
      .map(e => e.text)
      .reduce((prev, curr) => {
        return prev + curr;
      }, "")
      .trim();
}
