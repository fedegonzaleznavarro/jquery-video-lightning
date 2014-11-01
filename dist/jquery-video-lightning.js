/*
 *  jQuery Video Lightning - vpre2.1
 *  Turn any element into a lightbox or popover link for Youtube and Vimeo videos.
 *  https://github.com/musocrat/jquery-video-lightning
 *
 *  Made by Andrew Carpenter
 *  Under MIT License
 */
// Generated by CoffeeScript 1.7.1
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($, window, document) {
    var JQVideoLightning, coords, defaults, gravity, pluginName, testEl;
    pluginName = "jqueryVideoLightning";
    defaults = {
      id: "y-dQw4w9WgXcQ",
      width: "640px",
      height: "390px",
      autoplay: 0,
      autohide: 2,
      controls: 1,
      iv_load_policy: 1,
      loop: 0,
      modestbranding: 0,
      playlist: "",
      related: 0,
      showinfo: 1,
      start_time: 0,
      theme: "dark",
      color: "",
      byline: 1,
      portrait: 1,
      effect_in: "fadeIn",
      ease_in: 300,
      ease_out: 0,
      z_index: 21000,
      backdrop_color: "#000",
      backdrop_opacity: 1,
      glow: 0,
      glow_color: "#fff",
      rick_roll: 0,
      cover: 0,
      popover: 0,
      popover_x: "auto",
      popover_y: "auto",
      peek: 0
    };
    JQVideoLightning = (function() {
      function JQVideoLightning(element, options) {
        this.destroy = __bind(this.destroy, this);
        this.vimeoPlayer = __bind(this.vimeoPlayer, this);
        this.youtubePlayer = __bind(this.youtubePlayer, this);
        this.coverImage = __bind(this.coverImage, this);
        this.fullHex = __bind(this.fullHex, this);
        this.prepHex = __bind(this.prepHex, this);
        this.colorConverter = __bind(this.colorConverter, this);
        this.popoverPosition = __bind(this.popoverPosition, this);
        this.popover = __bind(this.popover, this);
        this.getSettings = __bind(this.getSettings, this);
        this.player = __bind(this.player, this);
        this.init = __bind(this.init, this);
        this.element = element;
        this.target = $(this.element);
        if (this.target.parent(".video-target").length > 0) {
          this.target_wrapper = this.target.parent(".video-target");
        } else {
          this.target_wrapper = this.target.wrap("<span class='video-target'></span>").parent(".video-target");
        }
        this.base_settings = $.extend({}, defaults, options);
        this.settings = this.getSettings();
        this.vendor = this.settings.videoId.charAt(0).toLowerCase() === "v" ? "vimeo" : "youtube";
        this.video_id = this.settings.videoId.substring(2);
        this.init();
      }

      JQVideoLightning.prototype.init = function() {
        var styles;
        this.target_wrapper.css("cursor", "pointer");
        if ($("style:contains('.video-wrapper')").length < 1) {
          styles = "<style type='text/css'> .video-wrapper{ display: none; position: fixed; min-width: 100%; min-height: 100%; top: 0; bottom: 0; left: 0; z-index: " + this.settings.videoZIndex + "; } .video-frame{ background: #000000; } </style>";
          $(styles).appendTo("head");
        }
        if (this.settings.videoCover === 1) {
          this.coverImage(this.vendor, this.video_id, this.target_wrapper);
        }
        this.target_wrapper.on("click", (function(_this) {
          return function() {
            return _this.player();
          };
        })(this));
        if (this.settings.videoPeek === 1) {
          this.target_wrapper.on('mouseenter', (function(_this) {
            return function() {
              return _this.player();
            };
          })(this));
          this.target_wrapper.on('mouseleave', (function(_this) {
            return function() {
              return _this.player();
            };
          })(this));
        }
        if (this.settings.videoPopover === 1) {
          $(document).on("scroll mousewheel DOMMouseScroll MozMousePixelScroll", (function(_this) {
            return function() {
              return _this.popoverPosition();
            };
          })(this));
          return $(window).on('resize', (function(_this) {
            return function() {
              return _this.popoverPosition();
            };
          })(this));
        }
      };

      JQVideoLightning.prototype.player = function() {
        var divs, vBdColor, video_wrapper;
        if (this.target_wrapper.find('.video-frame').is(':visible') || this.target_wrapper.find('.video-wrapper').is(':visible')) {
          if (this.settings.videoRickRoll !== 1) {
            this.destroy();
          }
          return;
        }
        if (this.settings.videoPopover === 1) {
          divs = '<div class="video-frame"><div class="video"></div></div>';
          this.target_wrapper.append(divs);
          this.video_frame = this.target_wrapper.find('.video-frame');
          video_wrapper = this.video_frame;
          this.video_frame.css({
            position: 'fixed'
          });
          this.popover();
        } else {
          divs = '<div class="video-wrapper"><div class="video-frame"><div class="video"></div></div></div>';
          this.target_wrapper.append(divs);
          vBdColor = this.colorConverter(this.settings.videoBackdropColor);
          this.video_frame = this.target_wrapper.find('.video-frame');
          video_wrapper = this.target_wrapper.find('.video-wrapper');
          video_wrapper.css({
            backgroundColor: "rgba(" + vBdColor.red + "," + vBdColor.blue + "," + vBdColor.green + "," + this.settings.videoBackdropOpacity + ")"
          });
          this.video_frame.css({
            position: 'absolute',
            top: this.settings.videoFrameTop,
            left: this.settings.videoFrameLeft
          });
        }
        this.video_frame.css({
          width: "" + this.settings.videoWidth + "px",
          height: "" + this.settings.videoHeight + "px",
          marginTop: this.settings.videoFrameMarginTop,
          marginLeft: this.settings.videoFrameMarginLeft,
          boxShadow: "0px 0px " + this.settings.videoGlow + "px " + (this.settings.videoGlow / 5) + "px " + (this.fullHex(this.settings.videoGlowColor))
        });
        video_wrapper[this.settings.videoEffectIn](this.settings.videoEaseIn);
        return this.target_wrapper.find('.video').append(this["" + this.vendor + "Player"]());
      };

      JQVideoLightning.prototype.getSettings = function() {
        var display_ratio, remapSettings, settings;
        remapSettings = function(settings) {
          $.each(settings, (function(_this) {
            return function(key, value) {
              var setting_key;
              setting_key = "video" + key.toLowerCase().charAt(0).toUpperCase() + key.slice(1).replace(/_([a-z])/g, function(m, w) {
                return w.toUpperCase();
              });
              return $(_this).data(setting_key, value);
            };
          })(this));
          return $(this).data();
        };
        settings = this.base_settings;
        settings = this.target.extend({}, remapSettings(settings), this.target.data());
        settings.videoWidth = parseInt(settings.videoWidth, 10);
        settings.videoHeight = parseInt(settings.videoHeight, 10);
        display_ratio = settings.videoHeight / settings.videoWidth;
        if (settings.videoWidth > $(window).width() - 30) {
          settings.videoWidth = $(window).width() - 30;
          settings.videoHeight = Math.round(display_ratio * settings.videoWidth);
        }
        settings.videoFrameTop = '50%';
        settings.videoFrameLeft = '50%';
        settings.videoFrameMarginTop = "-" + (settings.videoHeight / 2) + "px";
        settings.videoFrameMarginLeft = "-" + (settings.videoWidth / 2) + "px";
        return settings;
      };

      JQVideoLightning.prototype.popover = function() {
        this.settings.videoFrameMarginTop = 0;
        this.settings.videoFrameMarginLeft = 0;
        return this.popoverPosition();
      };

      JQVideoLightning.prototype.popoverPosition = function() {
        var center, coord, gravitate, screen, x, y;
        if (!this.video_frame) {
          return;
        }
        screen = testEl();
        coord = coords(this.element);
        gravitate = gravity(coord, this.settings.videoHeight, this.settings.videoWidth);
        if (!gravitate.x || !gravitate.y) {
          center = true;
        }
        y = center ? (screen.height / 2) - (this.settings.videoHeight / 2) : gravitate.y;
        x = center ? (screen.width / 2) - (this.settings.videoWidth / 2) : gravitate.x;
        this.settings.videoFrameTop = "" + y + "px";
        this.settings.videoFrameLeft = "" + x + "px";
        return this.video_frame.animate({
          top: this.settings.videoFrameTop,
          left: this.settings.videoFrameLeft
        }, {
          duration: 100,
          easing: "linear",
          queue: false
        });
      };

      JQVideoLightning.prototype.colorConverter = function(hex) {
        var blue, green, red;
        red = parseInt((this.prepHex(hex)).substring(0, 2), 16);
        blue = parseInt((this.prepHex(hex)).substring(2, 4), 16);
        green = parseInt((this.prepHex(hex)).substring(4, 6), 16);
        return {
          red: red,
          blue: blue,
          green: green
        };
      };

      JQVideoLightning.prototype.prepHex = function(hex) {
        hex = (hex.charAt(0) === "#" ? hex.split("#")[1] : hex);
        if (hex.length === 3) {
          hex = hex + hex;
        }
        return hex;
      };

      JQVideoLightning.prototype.fullHex = function(hex) {
        hex = "#" + this.prepHex(hex);
        return hex;
      };

      JQVideoLightning.prototype.coverImage = function(vendor, video_id, target_wrapper) {
        var vimeo_api_url, youtube_img_url;
        this.target_wrapper = target_wrapper;
        vimeo_api_url = "http://www.vimeo.com/api/v2/video/" + video_id + ".json?callback=?";
        youtube_img_url = "http://img.youtube.com/vi/" + video_id + "/hqdefault.jpg";
        if (vendor === "youtube") {
          return $("<img class='video-cover'>").attr("src", youtube_img_url).appendTo(this.target_wrapper);
        } else {
          return $.getJSON(vimeo_api_url, {
            format: "jsonp"
          }).done(function(data) {
            return $("<img class='video-cover'>").attr("src", data[0].thumbnail_large).appendTo(this.target_wrapper);
          });
        }
      };

      JQVideoLightning.prototype.youtubePlayer = function() {
        var params, url;
        params = "width='" + this.settings.videoWidth + "' height='" + this.settings.videoHeight + "' frameborder='0' allowfullscreen";
        url = ("https://www.youtube.com/embed/" + this.video_id + "?") + ("autoplay=" + this.settings.videoAutoplay + "&") + ("autohide=" + this.settings.videoAutohide + "&") + ("controls=" + this.settings.videoControls + "&") + ("iv_load_policy=" + this.settings.videoIvLoadPolicy + "&") + ("loop=" + this.settings.videoLoop + "&") + ("modestbranding=" + this.settings.videoModestbranding + "&") + ("playlist=" + this.settings.videoPlaylist + "&") + ("rel=" + this.settings.videoRelated + "&") + ("showinfo=" + this.settings.videoShowinfo + "&") + ("start=" + this.settings.videoStartTime + "&") + ("theme=" + this.settings.videoTheme + "&") + ("color=" + (this.prepHex(this.settings.videoColor)));
        return $("<iframe src='" + url + "' " + params + "></iframe>");
      };

      JQVideoLightning.prototype.vimeoPlayer = function() {
        var params, url;
        params = "width='" + this.settings.videoWidth + "' height='" + this.settings.videoHeight + "' frameborder='0' allowfullscreen";
        url = ("http://player.vimeo.com/video/" + this.video_id + "?") + ("autoplay=" + this.settings.videoAutoplay + "&") + ("loop=" + this.settings.videoLoop + "&title=" + this.settings.videoShowinfo + "&") + ("byline=" + this.settings.videoByline + "&") + ("portrait=" + this.settings.videoPortrait + "&") + ("color=" + (this.prepHex(this.settings.videoColor)));
        return $("<iframe src='" + url + "' " + params + "></iframe>");
      };

      JQVideoLightning.prototype.destroy = function() {
        this.target_wrapper.find(".video-wrapper").hide(this.getSettings().videoEaseOut);
        return setTimeout(((function(_this) {
          return function() {
            _this.target_wrapper.find(".video").remove();
            _this.target_wrapper.find(".video-frame").remove();
            _this.target_wrapper.find(".video-wrapper").remove();
            $(_this).off();
            return $(_this).removeData();
          };
        })(this)), this.getSettings().videoEaseOut);
      };

      return JQVideoLightning;

    })();
    testEl = function() {
      var test;
      if (!(test = document.getElementById('jqvl-size-test'))) {
        test = document.createElement("div");
        test.id = 'jqvl-size-test';
        test.style.cssText = "position:fixed;top:0;left:0;bottom:0;right:0;visibility:hidden;";
        document.body.appendChild(test);
      }
      return {
        height: test.offsetHeight,
        width: test.offsetWidth
      };
    };
    coords = function(el) {
      var hl_border, rect;
      rect = el.getBoundingClientRect();
      hl_border = 0;
      return {
        top: rect.top - hl_border,
        right: rect.right + hl_border,
        bottom: rect.bottom + hl_border,
        left: rect.left - hl_border,
        width: rect.width || rect.right - rect.left,
        height: rect.height || rect.bottom - rect.top
      };
    };
    gravity = function(coords, height, width) {
      var box_center, center, page_height, page_width, points, sort, x, y, _i, _j, _ref, _ref1, _ref2, _ref3;
      center = {
        x: (page_width = testEl().width) / 2,
        y: (page_height = testEl().height) / 2
      };
      box_center = {
        x: width / 2,
        y: height / 2
      };
      points = [];
      for (x = _i = _ref = coords.left, _ref1 = coords.right + width; _i <= _ref1; x = _i += 30) {
        points.push([x - width, coords.top - height]);
        points.push([x - width, coords.bottom]);
      }
      for (y = _j = _ref2 = coords.top, _ref3 = coords.bottom + height; _j <= _ref3; y = _j += 30) {
        points.push([coords.left - width, y - height]);
        points.push([coords.right, y - height]);
      }
      sort = function(a, b) {
        var ary, dax, day, obja, objb, _k, _len, _ref4;
        _ref4 = [[a, obja = {}], [b, objb = {}]];
        for (_k = 0, _len = _ref4.length; _k < _len; _k++) {
          ary = _ref4[_k];
          x = ary[0][0];
          y = ary[0][1];
          ary[1].diffx = (dax = x + box_center.x) > center.x ? dax - center.x : center.x - dax;
          ary[1].diffy = (day = y + box_center.y) > center.y ? day - center.y : center.y - day;
          ary[1].diff = ary[1].diffx + ary[1].diffy;
          if (x < 0 || x + width > page_width) {
            ary[1].diff = +10000;
          }
          if (y < 0 || y + height > page_height) {
            ary[1].diff = +10000;
          }
        }
        return obja.diff - objb.diff;
      };
      points.sort(sort);
      return {
        x: (x = points[0][0]) < 0 || x + width > page_width ? null : x,
        y: (y = points[0][1]) < 0 || y + height > page_height ? null : y
      };
    };
    $.fn[pluginName] = function(options) {
      return this.each(function() {
        if (!$.data(this, "plugin_" + pluginName)) {
          $.data(this, "plugin_" + pluginName, new JQVideoLightning(this, options));
        }
      });
    };
    return this;
  })(jQuery, window, document);

}).call(this);
