const jsonld = require("jsonld");
const _ = require("lodash");

module.exports = {
  props: {
    "view": {
      type: String,
      default: "compacted"
    },
    "inputLabel": {
      type: String,
      default: "JSON-LD Document"
    },
    "inputLabel2": {
      type: String,
      default: "JSON-LD Document 2"
    },
    "frameLabel": {
      type: String,
      default: "JSON-LD Frame (Matching & Mapping)"
    },
    "outputLabel": {
      type: String,
      default: "Output"
    }
  },
  data() {
    return {
      cid: `${Math.random()}`.replace("0.", ""),
      layout: "cols",
      message: "",
      jsonldInput: "{}",
      jsonldInput2: "{}",
      jsonldFrame: "{}",
      output: "{}",
      rdfStatements: []
    }
  },
  mounted() {
    const me = this;
    me.jsonldInput  = fromSlot(me.$slots.default) || "{}";
    me.jsonldInput2 = fromSlot(me.$slots.doc2) || "{}";
    me.jsonldFrame  = fromSlot(me.$slots.frame) || "{}";
    me.formatInput();
  },
  created() {
    this.processDebounced = _.debounce(this.process, 500);
  },
  watch: {
    view: function() {
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
    id: function(suffix) {
      return `${this.cid}-${suffix}`;
    },
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
      my.jsonldInput  = my.locateErr(my.$props.inputLabel , () => JSON.stringify(JSON.parse(my.jsonldInput), null, 2));
      my.jsonldInput2 = my.locateErr(my.$props.inputLabel2, () => JSON.stringify(JSON.parse(my.jsonldInput2), null, 2));
      my.jsonldFrame  = my.locateErr(my.$props.frameLabel , () => JSON.stringify(JSON.parse(my.jsonldFrame), null, 2));
    },
    formatOutput: function () {
      const my        = this;
      const input     = my.locateErr(my.$props.inputLabel , () => JSON.parse(my.jsonldInput));
      const input2    = my.locateErr(my.$props.inputLabel2, () => JSON.parse(my.jsonldInput2));
      const frame     = my.locateErr(my.$props.frameLabel , () => JSON.parse(my.jsonldFrame));
      let result;
      switch(my.view) {
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
        .then(str => my.output = str);
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
