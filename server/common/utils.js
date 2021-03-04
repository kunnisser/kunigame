/**
 * @Author: kunnisser
 * @Date: 2021-03-04 21:23:33
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-03-04 23:03:41
 * @FilePath: \kunigame\server\common\utils.js
 * @Description: ---- 公共操作 ----
 */

var babelParser = require('@babel/parser');
var babelTraverse = require('@babel/traverse').default;
var babelGenerator = require('@babel/generator').default;
var fs = require('fs');

 /// AST

 const fileToAst = (path) => {
  const code = fs.readFileSync(path).toString();
  const ast = babelParser.parse(code, {
    sourceType: "module",
    plugins: [
      "jsx",
      "ts",
      "flow"
    ],
  });
  return ast;
 }

 const findAstNode = (ast, visitor) => {
  babelTraverse(ast, visitor);
 }

 const astToFile = (ast, path) => {
  const code = babelGenerator(ast).code;
  fs.writeFileSync(path, code);
 }

 exports.fileToAst = fileToAst;
 exports.findAstNode = findAstNode;
 exports.astToFile = astToFile;
