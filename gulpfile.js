var gulp = require('gulp');
var through2  = require('through2');
var browserify = require('browserify');
var babalify = require('babelify');
var rename = require('gulp-rename');
var chalk = require('chalk');
var plumber = require ('gulp-plumber');

var config = {
    path:{
        mainFile: './app.js',
        bundleFileName:'bundleApp.js',
        dest: './dest',
        root:'./',
        uiFolder:'./ui/**/*.*'
    }
};


gulp.task('bundle',function(){
    console.log(chalk.green('bundling process started...'));
    
    return gulp.src(config.path.mainFile)
    .pipe(plumber())
    .pipe(through2.obj(function(file,enc,callback){
         browserify(file.path,{ debug: true})
        .transform(babalify,{presets:['es2015','react']})
        .bundle(function(err,res){
            if(err)
                return callback(err);                
            
            file.contents = res;
            callback(null,file);                     
        });              
    }))
    .on('error',function(err){
            console.log(chalk.red('Error in bundling\n' + err.stack));  
            this.emit('end');            
     })
    .pipe(rename(config.path.bundleFileName))
    .pipe(gulp.dest(config.path.dest));   
});

gulp.task('default',['bundle']);

gulp.task('watch',function(){
    gulp.watch(config.path.uiFolder,['bundle']);
})
