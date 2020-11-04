// gulpプラグインの読み込み
const gulp = require("gulp");
// Sassをコンパイルするプラグインの読み込み
const sass = require("gulp-sass");
// add vender prifix
var autoprefixer = require('gulp-autoprefixer');

// error handling
var plumber = require('gulp-plumber');

var nunjucksRender = require("gulp-nunjucks-render");

var data = require('gulp-data');
var htmlbeautify = require('gulp-html-beautify');

var beautify_options = {
  'indent_size': 2,
  'indent_with_tabs': false,
  'end_with_newline': true
}

var browserSync = require("browser-sync").create();

// style.scssの監視タスクを作成する
gulp.task("default", function() {
  browserSync.init({
    server: {
      baseDir: "./html/"
    }
  });

  // ★ style.scssファイルを監視
  gulp.watch("./scss/**/*.scss", function() {
    // style.scssファイルを取得
    gulp
      .src(["./scss/**/*.scss"])
      .pipe(plumber())
      // Sassのコンパイルを実行
      .pipe(
        // CSS output style (nested | expanded | compact | compressed)
        sass({
          outputStyle: "expanded"
        })
          .on("error", sass.logError)
      )
      .pipe(autoprefixer({
        cascade: false
      }))
      .pipe(gulp.dest("html"))
      .pipe(browserSync.stream());
  });

  gulp.watch("./page/**/*.html", function() {
    gulp
      .src(["./page/**/*.html", "!./page/**/_*.html"])
      .pipe(
        nunjucksRender({
          path: ["./page"],
          data: {
            image_path: './img'
          }
        })
      )
      .pipe(htmlbeautify(beautify_options)) //生成されたhtmlをきれいに
      .pipe(gulp.dest("html"))
      .pipe(browserSync.stream());
  });
});
