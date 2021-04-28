Component({
  properties: {
    // wancheng | jifen | jifen1 | paiming | jifen2 | gate | youbian | youyong | jita | yinle | ziyuan | ziyuan1 | ziyuan2 | ziyuan3 | ziyuan4 | ziyuan5 | ziyuan6 | ziyuan7 | ziyuan8 | ziyuan9 | ziyuan10 | ziyuan11 | ziyuan12 | ziyuan13 | ziyuan14 | ziyuan15 | ziyuan16 | ziyuan17 | ziyuan18 | ziyuan19 | ziyuan20 | ziyuan21 | ziyuan22 | ziyuan23 | eyu
    name: {
      type: String,
    },
    // string | string[]
    color: {
      type: null,
      observer: function(color) {
        this.setData({
          colors: this.fixColor(),
          isStr: typeof color === 'string',
        });
      }
    },
    size: {
      type: Number,
      value: 50,
      observer: function(size) {
        this.setData({
          svgSize: size / 750 * wx.getSystemInfoSync().windowWidth,
        });
      },
    },
  },
  data: {
    colors: '',
    svgSize: 50 / 750 * wx.getSystemInfoSync().windowWidth,
    quot: '"',
    isStr: true,
  },
  methods: {
    fixColor: function() {
      var color = this.data.color;
      var hex2rgb = this.hex2rgb;

      if (typeof color === 'string') {
        return color.indexOf('#') === 0 ? hex2rgb(color) : color;
      }

      return color.map(function (item) {
        return item.indexOf('#') === 0 ? hex2rgb(item) : item;
      });
    },
    hex2rgb: function(hex) {
      var rgb = [];

      hex = hex.substr(1);

      if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
      }

      hex.replace(/../g, function(color) {
        rgb.push(parseInt(color, 0x10));
        return color;
      });

      return 'rgb(' + rgb.join(',') + ')';
    }
  }
});
