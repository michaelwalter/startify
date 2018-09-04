import {Gulpclass, Task, SequenceTask} from "gulpclass/Decorators";

const gulp = require('gulp');
const gulpif = require('gulp-if');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const del = require('del');
const nunjucks = require('gulp-nunjucks-render');
const data = require('gulp-data');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const moduleImporter  = require('sass-module-importer');
const htmlbeautify  = require('gulp-html-beautify');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const uglify = require('gulp-uglify');

let reload: any = false;
let browsersync: any = false;
let processEnvMode = 'development';

const DIR = {
    SRC: 'src/',
    BUILD: 'dist/'
};

const HTML = {
    SRC: DIR.SRC + 'templates/*.njk',
    WATCH: DIR.SRC + 'templates/**/*.njk',
    BUILD: DIR.BUILD
};

const CSS = {
    SRC: DIR.SRC + 'assets/styles/main.scss',
    BUILD: DIR.BUILD + 'assets/styles/',
    ROOT: DIR.SRC + 'assets/styles/',
    WATCH: DIR.SRC + 'assets/styles/**/*'
};

const JS = {
    SRC: DIR.SRC + 'assets/scripts/scripts.ts',
    BUILD: DIR.BUILD + 'assets/scripts/',
    WATCH: DIR.SRC + 'assets/scripts/**/*.ts',
    ROOT: DIR.SRC + 'assets/scripts/'
};

const IMG = {
    SRC: DIR.SRC + 'assets/images/**/*',
    EXCLUDE: '!' + DIR.SRC + 'assets/images/vendors{,/**/*}',
    BUILD: DIR.BUILD + 'assets/images/'
};

const VENDORS = {
    SRC: DIR.SRC + 'assets/vendors/**/*',
    BUILD: DIR.BUILD + 'assets/vendors/'
};

const FONTS = {
    SRC: DIR.SRC + 'assets/fonts/**/*',
    BUILD: DIR.BUILD + 'assets/fonts/'
};

const isProductionMode = (): Boolean => {
    return processEnvMode === 'production';
};


@Gulpclass()
export class Gulpfile {

    @Task()
    templates() {
        return gulp.src(HTML.SRC)
            .pipe(plumber())
            .pipe(data({
                name: 'Front End' || '',
                title: 'Front End' || '',
                description: 'Front End' || ''
            }))
            .pipe(nunjucks({
                path: ['./src/templates/']
            }))
            .pipe(htmlbeautify({
                indentSize: 4
            }))
            .pipe(rename(path => {
                path.extname = ".html"
            }))
            .pipe(gulp.dest(HTML.BUILD));
    }

    @SequenceTask('templates:watch')
    templatesWatch() {
        return ['templates', 'reload'];
    }

    @Task('styles')
    styles() {
        return gulp.src(CSS.SRC)
            .pipe(plumber())
            .pipe(gulpif(!isProductionMode(), sourcemaps.init()))
            .pipe(sass({
                outputStyle: 'compressed',
                imagePath: IMG.BUILD,
                precision: 3,
                sourcemap: !isProductionMode(),
                importer: moduleImporter()
            }))
            .pipe(autoprefixer('last 2 versions'))
            .pipe(gulpif(!isProductionMode(), sourcemaps.write()))
            .pipe(rename({
                basename: 'styles',
                suffix: '.min'
            }))
            .pipe(gulp.dest(CSS.BUILD));
    }

    @SequenceTask('styles:watch')
    stylesWatch() {
        return ['styles', 'reload'];
    }

    @Task()
    scripts() {
        return gulp.src(JS.SRC)
            .pipe(plumber())
            .pipe(webpackStream(webpackConfig, webpack))
            .pipe(gulpif(isProductionMode(), uglify()))
            .pipe(gulp.dest(JS.BUILD));
    }

    @SequenceTask('scripts:watch')
    scriptsWatch() {
        return ['scripts', 'reload'];
    }


    /**
     * Minify and compress images
     *
     * @returns {NodeJS.WritableStream}
     */
    @Task()
    images() {
        return gulp.src(IMG.SRC)
            .pipe(imagemin())
            .pipe(gulp.dest(IMG.BUILD))
    }

    /**
     * Move vendors to dist folder
     *
     * @returns {NodeJS.WritableStream}
     */
    @Task()
    vendors() {
        return gulp.src(VENDORS.SRC)
            .pipe(gulp.dest(VENDORS.BUILD));
    }

    /**
     * Move all fonts to dist folder
     *
     * @returns {NodeJS.WritableStream}
     */
    @Task()
    fonts() {
        return gulp.src(FONTS.SRC)
            .pipe(gulp.dest(FONTS.BUILD));
    }

    /**
     * Remove DIST (BUILD) folder
     *
     * @returns {any}
     */
    @Task()
    clean() {
        return del([DIR.BUILD]);
    }

    /**
     * Build stable, compressed application
     *
     * @param {Function} done
     * @returns {any}
     */
    @SequenceTask()
    build() {
        return ['clean', 'fonts', 'images', 'styles', 'scripts', 'templates'];
    }

    /**
     * Build stable, compressed application
     *
     * @param {Function} done
     * @returns {any}
     */
    @SequenceTask('build:prod')
    buildProduction() {
        return ['setProdEnv', 'clean', 'fonts', 'images', 'styles', 'scripts', 'templates'];
    }

    /**
     * Open project in browser
     *
     */
    @Task()
    browser() {
        if (browsersync === false) {
            browsersync = browserSync.create();
            reload = browsersync.reload;
            browsersync.init({
                notify: false,
                server: {
                    baseDir: DIR.BUILD,
                }
            });
        }
    }

    /**
     * Reload task
     *
     * @param {Function} done
     */
    @Task()
    reload(done: Function) {
        if (!!reload) {
            reload();
        } else {
            browserSync.reload();
        }
        done();
    }

    @Task()
    setProdEnv (done: Function) {
        processEnvMode = 'production';
        done();
    }

    /**
     * Watch files with live reloading aon changes
     *
     * @param {Function} done
     */
    @Task()
    watch(done: Function) {
        gulp.watch(HTML.WATCH, ['templates:watch']);
        gulp.watch(CSS.WATCH, ['styles:watch']);
        gulp.watch(JS.WATCH, ['scripts:watch']);
        gulp.watch([IMG.SRC, IMG.EXCLUDE], ['images:watch']);
        gulp.watch(VENDORS.SRC, ['scripts:watch']);
        gulp.watch(FONTS.SRC, ['fonts:watch']);
        done();
    }

    /**
     * Run gulp default task
     *
     * @returns {string[]}
     */
    @SequenceTask()
    default() {
        return ['build', 'watch', 'browser'];
    }

    @SequenceTask()
    serve() {
        return ['build', 'watch', 'browser'];
    }
}