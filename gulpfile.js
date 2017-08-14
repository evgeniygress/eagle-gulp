var     gulp 	     = require('gulp'),					
	sass 	     = require('gulp-sass'),			
	browserSync  = require('browser-sync'),			
	concat       = require('gulp-concat'),		
	uglify       = require('gulp-uglifyjs'),		
	cssnano      = require('gulp-cssnano'),			
	rename       = require('gulp-rename'),			
	del          = require('del'),					
	imageMin     = require('gulp-imagemin'),		
	pngquant     = require('imagemin-pngquant'),	
	cache        = require('gulp-cache'),			
	spritesmith  = require('gulp.spritesmith'),
	merge        = require('merge-stream'),
	csso         = require('gulp-csso'),
	buffer       = require('vinyl-buffer'),
	autoprefixer = require('gulp-autoprefixer');	



gulp.task('sass', function() {						
	return gulp.src('app/sass/**/*.scss')
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true }))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}))
});



gulp.task('sprites', ['delSprite'], function () {
  var spriteData = gulp.src('app/sprite/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.css'
  }));
    // Pipe image stream through image optimizer and onto disk 
  var imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin` 
    .pipe(buffer())
    .pipe(imageMin())
    .pipe(gulp.dest('app/images/sprites'));
 
  // Pipe CSS stream through CSS optimizer and onto disk 
  var cssStream = spriteData.css
    .pipe(csso())
    .pipe(gulp.dest('app/sass'));
 
  // Return a merged stream to handle both `end` events 
  return merge(imgStream, cssStream);
});

gulp.task('delSprite', function() {
	return del.sync('app/images/sprites/sprite.png')
});



gulp.task('scripts-libs', function() {					
	return gulp.src([
			'app/libs/jquery/dist/jquery.min.js',
			'app/libs/jquery-validation/dist/jquery.validate.min.js'
		])
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

gulp.task('css',['sass'], function() {			
	return gulp.src('app/css/*.css')
	.pipe(cssnano({
		 keepSpecialComments: 1
	}))
	.pipe(gulp.dest('app/css'));
});


gulp.task('browser-sync', function() {				
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false 
	});
});

gulp.task('clean', function() {					
	return del.sync('dist');
});

gulp.task('clear', function() {					
	return cache.clearAll();
});

gulp.task('img', function() {					
	return gulp.src('app/images/**/*')
	.pipe(cache(imageMin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		une:[pngquant()]
	})))
	.pipe(gulp.dest('dist/images'));
});



gulp.task('watch',['clear', 'browser-sync', 'css', 'scripts-libs'], function() {   
	gulp.watch('app/sass/**/*.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});


gulp.task('build',['clean', 'img', 'sass', 'scripts-libs'], function() {			
	var buildCss = gulp.src([
			'app/css/style.css',
		])
		.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src('app/font-icon/**/*')
		.pipe(gulp.dest('dist/font-icon'));

	var buildJs = gulp.src('app/js/**/*')
		.pipe(gulp.dest('dist/js'));

	var buildHtml = gulp.src('app/*.html')
		.pipe(gulp.dest('dist'));
		
	var buildImg = gulp.src('app/images/**')
		.pipe(gulp.dest('dist/images'));

});
