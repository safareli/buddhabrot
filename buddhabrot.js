function Buddhabrot(opt){
    var MAX_ITERATIONS = opt.MaxIterations,
        MAX_ITERATIONS_LOG = Math.log(MAX_ITERATIONS - 1.0);
        image = opt.image,
        height = opt.image.height,
        width = opt.image.width,
        pixels = image.data,
        MinRe = opt.realRange[0],
        MaxRe = opt.realRange[1],
        MaxIm = (MaxRe - MinRe) * height/width*0.5;
        MinIm = -1*MaxIm;
        Re_factor = (MaxRe-MinRe)/(width-1),
        Im_factor = (MaxIm-MinIm)/(height-1);
    this.draw = function (ctx) {
        ctx.putImageData(image,0,0);
    };
    this.calculate = function(){
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

var animator = new F("buddhabrot","2d").set({
    setup : function setup(ctx){

        // save width and heght
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // draw background
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillRect(0, 0, this.width, this.height);

        // get full image from canvas context 
        this.image = ctx.getImageData(0, 0, this.width, this.height);
    },
    update : function update(time){

        //create buddhabrot instance
        this.buddhabrot = new Buddhabrot({
          realRange      : [-3.0,2.0],
          MaxIterations  : 1000,
          image          : this.image
        });

        // calculate buddhabrot
        this.buddhabrot.calculate()
    },
    draw : function draw(ctx){

        // draw buddhabrot
        this.buddhabrot.draw(ctx);
    }
}).start().stop();