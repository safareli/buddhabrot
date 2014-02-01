"use strict";

function Buddhabrot(opt){
    this.draw = function (ctx) {
        ctx.putImageData(opt.image,0,0);
    };
    this.calculate = function(){
        var MAX_ITERATIONS = opt.MaxIterations,
            MAX_ITERATIONS_LOG = Math.log(MAX_ITERATIONS - 1.0),
            height = opt.image.height,
            width = opt.image.width,
            pixels = opt.image.data,
            MinRe = opt.realRangeStart,
            MaxRe = opt.realRangeEnd,
            MaxIm = (MaxRe - MinRe) * height/width*0.5,
            MinIm = -1*MaxIm,
            Re_factor = (MaxRe-MinRe)/(width-1),
            Im_factor = (MaxIm-MinIm)/(height-1);

        var start = new Date();
        console.log('START calculate Buddhabrot',start);
        for(var y = 0; y < width; ++y){
            var c_im = MinIm + y * Im_factor;
            for(var x = 0; x < width; ++x){
                var c_re = MinRe + x * Re_factor;

                var Z_re = c_re, Z_im = c_im, iteration = 0, path = [];
                do{
                    var Z_re2 = Z_re*Z_re, Z_im2 = Z_im*Z_im;
                    if(Z_re2 + Z_im2 > 4){
                        break;
                    }
                    Z_im = 2*Z_re*Z_im + c_im;
                    Z_re = Z_re2 - Z_im2 + c_re;
                    path[iteration] = [Z_re,Z_im];

                }while(++iteration<MAX_ITERATIONS)

                for (var i = 0; i < path.length && iteration < MAX_ITERATIONS; i++) {
                    var _y = ~~((path[i][1]-MinIm)/Im_factor);//floor
                    var _x = ~~((path[i][0]-MinRe)/Re_factor);
                    if (_x > 0 && _x < width && _y>0 && _y <height) {
                        var index = (_y*width + _x)*4;
                        var r = 5,g = 2,b = 2,a=5;
                        if( pixels[index]+r < 255)
                            pixels[index] += r;
                        if( pixels[index+1]+g < 255)
                            pixels[index+1] += g;
                        if( pixels[index+2]+b < 255)
                            pixels[index+2] += b;
                        if( pixels[index+3]+a < 255)
                            pixels[index+3] += a;
                    }
                }
            }
        }
        console.log('END calculate Buddhabrot',new Date());
        console.log('DELTA calculate Buddhabrot',new Date().getTime() - start.getTime());
    };//end calculate
} 

Buddhabrot.Options = function(val) {
  this.realRangeStart = val.realRangeStart;
  this.realRangeEnd = val.realRangeEnd;
  this.MaxIterations = val.MaxIterations;
  this.image = val.image;
  this.render = val.render;
  this.save = val.save;
};
var animator = new F("buddhabrot","2d").set({
    setup : function setup(ctx){
        var self = this;
        // save width and heght
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // draw background
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillRect(0, 0, this.width, this.height);

        // get full image from canvas context 
        var image = ctx.getImageData(0, 0, this.width, this.height);

        this.buddhabrot = null;
        //create buddhabrot instance
        this.options  = new Buddhabrot.Options({
            realRangeStart : -3.0,
            realRangeEnd : 2.0,
            MaxIterations : 500,
            image : image,
            render : function() {
                ctx.fillStyle = 'rgb(0,0,0)';
                ctx.fillRect(0, 0, self.width, self.height);
                self.options.image = ctx.getImageData(0, 0, self.width, self.height);
                self.buddhabrot.calculate();
                self.buddhabrot.draw(ctx);
            },
            save:function () {
                window.open(ctx.canvas.toDataURL(), '_blank');
                window.focus();
            }
        });

        this.buddhabrot = new Buddhabrot(this.options);

        var gui = new dat.GUI();
        gui.add(this.options, 'realRangeStart',-5,-1);
        gui.add(this.options, 'realRangeEnd', 1, 5);
        gui.add(this.options, 'MaxIterations');
        gui.add(this.options, 'render');
        gui.add(this.options, 'save');
    },
    update : function update(time){
        
        // calculate buddhabrot
        this.buddhabrot.calculate();
    },
    draw : function draw(ctx){

        // draw buddhabrot
        this.buddhabrot.draw(ctx);
    }
}).start().stop();