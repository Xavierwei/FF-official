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
      width   = options.width || 2,
      spacing = options.spacing || 0,
      count   = options.count || 1024;

    

    var arrs = [];
    var index = 0;
    this.bind( 'update', function() {
      var percent = this.getTime() / this.audio.duration;
      if( index >= percent * 1000 ){
        return;
      }
      // if( index % 100 > 0 ) return;
      index ++;
      var waveform = this.getWaveform();
      arrs.push( waveform[ ~~Math.random() * waveform.length ] );
      waveform = arrs;
      ctx.clearRect( 0, 0, w, h );
      ctx.lineWidth   = options.strokeWidth || 10;
      ctx.strokeStyle = options.strokeStyle || "white";
      ctx.beginPath();
      ctx.moveTo( 0, h / 2 );
      for ( var i = 0, l = waveform.length; i < l ; i++ ) {
        ctx.lineTo( i * ( spacing + width ), ( h / 2 ) + waveform[ i ] * ( h / 2 ));
      }
      ctx.stroke();
      ctx.closePath();
    });

    return this;
  });
})();
