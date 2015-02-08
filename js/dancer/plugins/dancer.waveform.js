/*
 * Waveform plugin for dancer.js
 *
 * var dancer = new Dancer('song.ogg'),
 *     canvas = document.getElementById('waveform');
 * dancer.waveform( canvas, { strokeStyle: '#ff0077' });
 */

(function() {
  Dancer.addPlugin( 'waveform', function( canvasEl, options ) {
    options = options || {};
    var
      ctx     = canvasEl.getContext( '2d' ),
      h       = canvasEl.height,
      w       = canvasEl.width,
      width   = options.width || 1,
      spacing = options.spacing || 0,
      count   = options.count || 1024;
      num     = options.num || 1000;

    

    var arrs = [];

    for( var i = 0; i < num ; i++ ){
      arrs.push(0);
    }

    var index = 0;
    this.bind( 'update', function() {
      if( canvasEl.getAttribute('percent') ){
        index = ~~ (canvasEl.getAttribute('percent') * num );
        canvasEl.removeAttribute('percent');
      }

      var percent = this.getTime() / this.audio.duration;
      if( index > percent * num + 1 || index < percent * num - 1 ){
        index = ~~(percent * num);
      }
      if( index >= percent * num ){
        return;
      }


      // if( index % 100 > 0 ) return;
      index ++;
      if( arrs[index] == 0 ){
        var waveform = this.getWaveform();
        arrs[index] = ( waveform[ ~~( waveform.length / 2 ) ] );
      }
      ctx.clearRect( 0, 0, w, h );
      ctx.lineWidth   = 1;
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.moveTo( 0, h / 2 );
      var lastx = 0 , lasty = 0;
      for ( var i = 0, l = arrs.length; i < l ; i++ ) {
        lastx = i * ( spacing + width );
        lasty = ( h / 2 ) + arrs[ i ] * ( h / 2 );

        if( i == index ){
          ctx.stroke();
          ctx.beginPath();
          ctx.strokeStyle = 'white';
          ctx.moveTo( lastx, lasty );
        } else {
          ctx.lineTo( lastx, lasty);
        }
      }
      ctx.stroke();
      ctx.closePath();
    });

    return this;
  });
})();
