
function Buddhabrot(opt){
    var MAX_ITERATIONS = opt.MaxIterations,
        MAX_ITERATIONS_LOG = Math.log(MAX_ITERATIONS - 1.0);
        image = opt.image,
        MinRe = opt.realRange[0],
        MaxRe = opt.realRange[1],
        MaxIm = (MaxRe - MinRe) * image.height/image.width*0.5;
        MinIm = -1*MaxIm;
        Re_factor = (MaxRe-MinRe)/(image.width-1),
        Im_factor = (MaxIm-MinIm)/(image.height-1),
        pixels = image.data;
    this.calculate = function(){
        console.log('calc');
        for(var y = 0; y < image.width; ++y){
            var c_im = MinIm + y * Im_factor;
            for(var x = 0; x < image.width; ++x){
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
                    if (_x > 0 && _x < image.width && _y>0 && _y <image.height) {
                        var index = (_y*image.width + _x)*4;
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
    };//end calculate
} 

var animator = new F("buddhabrot","2d").set({
    setup : function setup(ctx){

        // save width and heght
        var width = window.innerWidth;
        var height = window.innerHeight;

        // draw background
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillRect(0, 0, width, height);

        // get full image from canvas context 
        var image = ctx.getImageData(0, 0, width, height);

        // return object for update and draw
        return {
            image:image
        };
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

        // draw image
        ctx.putImageData(this.image,0,0);
        animator.stop();
    }
}).start().stop();