/**
 * User: Evgeniy Tyurin
 * Date: 20.09.12
 * Time: 21:21
 * To change this template use File | Settings | File Templates.
 */

(function($) {

  var videoPlayerInit = function(el, o)
  {
    var $el = $(el),
      tagVideo = $el.find('video').get(0),
      $btnPlay = $el.find(o.selectors.btnPlay),
      $barSeek = $el.find(o.selectors.barSeek),
      $barSeekSlider = $el.find(o.selectors.barSeekSlider),
      $barVolume = $el.find(o.selectors.barVolume),
      $barVolumeSlider = $el.find(o.selectors.barVolumeSlider),
      barSeekSliderMaxLeft = $barSeek.width()-$barSeekSlider.width(),
      barSeekSliderWidth = $barSeekSlider.width(),
      seekStep = barSeekSliderMaxLeft/100,
      barSeekSliderIsDragged = false,
      barVolumeHeight = $barVolume[o.barVolumeAxis == 'x' ? 'width' : 'height']()-$barVolumeSlider[o.barVolumeAxis == 'x' ? 'width' : 'height'](),
      barVolumeSliderHeight = $barVolumeSlider[o.barVolumeAxis == 'x' ? 'width' : 'height']();

    for(var listenerName in o.listeners) {
      tagVideo.addEventListener(listenerName, o.listeners[listenerName]);
    }

    $btnPlay.click(function() {
      if(o.btnPlayIsPause) {
        if($(this).hasClass('is-pause')) {
          tagVideo.play();
        }
        else {
          tagVideo.pause();
        }
      }
      else {
        tagVideo.play();
      }
    });

    $barSeek.click(function(e) {
      var offsetX = e.offsetX,
          posX = offsetX-barSeekSliderWidth/2;

      if(posX < 1) {
        posX = 0;
      }
      else if(posX > barSeekSliderMaxLeft) {
        posX = barSeekSliderMaxLeft;
      }

      tagVideo.currentTime = (posX/seekStep)*(tagVideo.duration/100);
    });

    $barVolume.click(function(e) {
      var offset = o.barVolumeAxis == 'x' ? e.offsetX : e.offsetY,
          pos = offset-barVolumeSliderHeight/2;

      if(pos < 0) {
        pos = 0;
      }
      else if(pos > barVolumeHeight) {
        pos = barVolumeHeight;
      }

      if(o.barVolumeAxis == 'x') {
        tagVideo.volume = (Math.floor(pos/(barVolumeHeight/100)))/100;
      }
      else {
        tagVideo.volume = (100-Math.floor(pos/(barVolumeHeight/100)))/100;
      }
    });

    tagVideo.addEventListener('timeupdate', function() {
      //if not dragged
      if(!barSeekSliderIsDragged) {
        var percent = Math.floor( tagVideo.currentTime/(tagVideo.duration/100) );
        $barSeekSlider.css({left: seekStep*percent});
      }
    });
    tagVideo.addEventListener('volumechange', function() {
      var percent = Math.floor( tagVideo.volume/0.01 );

      if(o.barVolumeAxis == 'x') {
        $barVolumeSlider.css('left', barVolumeHeight/100*percent);
      }
      else {
        $barVolumeSlider.css('top', barVolumeHeight-(barVolumeHeight/100*percent));
      }
    });

    tagVideo.addEventListener('play', function() {
      $btnPlay.removeClass('is-pause');
    });

    tagVideo.addEventListener('pause', function() {
      $btnPlay.addClass('is-pause');
    });

    tagVideo.addEventListener('ended', function() {
      tagVideo.currentTime = 0;
    })

    if(o.barSeekSliderIsDraggable) {
      $barSeekSlider.draggable({
        axis: 'x',
        containment: 'parent',
        start: function() {
          barSeekSliderIsDragged = true;
        },
        stop: function(event, ui) {
          tagVideo.currentTime = (ui.position.left/seekStep)*(tagVideo.duration/100);
          barSeekSliderIsDragged = false;
        }
      });
    }

    if(o.barVolumeSliderIsDraggable) {
      $barVolumeSlider.draggable({
        axis: o.barVolumeAxis,
        containment: 'parent',
        drag: function(event, ui) {
          if(o.barVolumeAxis == 'x') {
            tagVideo.volume = (Math.floor((ui.position.left/(barVolumeHeight/100))))/100;
          }
          else {
            tagVideo.volume = (100-Math.floor((ui.position.top/(barVolumeHeight/100))))/100;
          }
        },
        stop: function(event, ui) {
          if(o.barVolumeAxis == 'x') {
            tagVideo.volume = (Math.floor((ui.position.left/(barVolumeHeight/100))))/100;
          }
          else {
            tagVideo.volume = (100-Math.floor((ui.position.top/(barVolumeHeight/100))))/100;
          }
        }
      });
    }

    $(document).keydown(function(e) {
      if(e.keyCode == 32) {
        $btnPlay.trigger('click');
      }
    });
  };

  $.fn.videoPlayer = function(o) {
    var opts = $.extend({
      listeners: {},
      selectors: {
        btnPlay:         '.btn-play',
        barSeek:         '.bar-seek',
        barSeekSlider:   '.bar-seek-slider',
        barVolume:       '.bar-volume',
        barVolumeSlider: '.bar-volume-slider'
      },
      btnPlayIsPause: true,
      barSeekSliderIsDraggable: true,
      barVolumeSliderIsDraggable: true,
      barVolumeAxis: 'y'
    }, o);

    this.each(function() {
      videoPlayerInit(this, opts);
    });
  }
})(jQuery);