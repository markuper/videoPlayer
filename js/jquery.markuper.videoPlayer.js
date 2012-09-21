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
      barVolumeHeight = $barVolume.height()-$barVolumeSlider.height(),
      barVolumeSliderHeight = $barVolumeSlider.height();

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
      var offsetY = e.offsetY,
          posY = offsetY-barVolumeSliderHeight/2;

      if(posY < 0) {
        posY = 0;
      }
      else if(posY > barVolumeHeight) {
        posX = barVolumeHeight;
      }

      tagVideo.volume = (100-Math.floor(posY/(barVolumeHeight/100)))/100;
    });

    tagVideo.addEventListener('timeupdate', function() {
      //if not dragged
      if(!barSeekSliderIsDragged) {
        var percent = Math.floor( tagVideo.currentTime/(tagVideo.duration/100) );
        $barSeekSlider.css({left: seekStep*percent});
      }
    });
    tagVideo.addEventListener('volumechange', function() {
      var percent = Math.floor( tagVideo.volume/0.01 )

      $barVolumeSlider.css({top: barVolumeHeight-(barVolumeHeight/100*percent)});
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
        axis: 'y',
        containment: 'parent',
        drag: function(event, ui) {
          tagVideo.volume = (100-Math.floor((ui.position.top/(barVolumeHeight/100))))/100;
        },
        stop: function(event, ui) {
          tagVideo.volume = (100-Math.floor((ui.position.top/(barVolumeHeight/100))))/100;
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
      barVolumeSliderIsDraggable: true
    }, o);

    this.each(function() {
      videoPlayerInit(this, opts);
    });
  }
})(jQuery);