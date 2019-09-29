import './css/base.css';
import './scss/main.scss';

console.log('你好,朋友！');

/**
 * 'mode'选项未设置，webpack将回退到'production'。将"mode"选项设置为'development'或'production'以启用每个环境
 * 的默认值。您还可以将其设置为'none'以用来禁止任何默认行为
 * 
 * production：开箱即用地进行了各种优化。包括压缩，作用域提升，tree-shakin等。
 * development：针对速度进行了优化，仅仅提供了一种不压缩的bundle
 */