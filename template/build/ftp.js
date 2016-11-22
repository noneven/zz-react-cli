'use strict';

var client = require('scp2');
var fs = require( 'fs' );

var vfs = require( 'vinyl-fs' );
var ftp = require( 'vinyl-ftp' );
var path = require("path");

var _HTMLOptions = {
  port: '21',
  host: '192.168.185.104',
  username: 'qatest',
  password: 'ftp@fe',
  path: path.join(__dirname, '../dist/index.html'),
  remotePath: '/static.58.com/ui7/post/pc/rukou',
  parallel: 10,
};

var _STATICOptions = {
  port: '21',
  host: '192.168.185.104',
  username: 'qatest',
  password: 'ftp@fe',
  path: path.join(__dirname, '../dist/static/**'),
  remotePath: '/static.58.com/ui7/post/pc/rukou',
  parallel: 10,
};

var HTMLOptions = {
  port: '21',
  host: '',//远程ftp服务器地址
  username: '',//用户名
  password: '',//密码
  path: path.join(__dirname, '../dist/index.html'),//需要传的文件
  remotePath: '',//需要传到远程服务器的相对路径
  parallel: 10,//并发上传数
};

var STATICOptions = {
  port: '21',
  host: '',//远程ftp服务器地址
  username: '',//用户名
  password: '',//密码
  path: path.join(__dirname, '../dist/static/**'),//需要传的文件路径
  remotePath: '',//需要传到远程服务器的相对路径
  parallel: 10,//并发上传数
};

function run(options){

  var conn = ftp.create({
    host: options.host,//远程ftp服务器地址
    user: options.username,//用户名
    password: options.password,//密码
    parallel: options.parallel,//并发传输数
  });
  var path = options.path;
  var remotePath = options.remotePath;

  if(options.sftp==true){
    client.scp(options.path, options.username + ':' + options.password + '@' + options.host + ':' + options.port + ':' + options.remotePath, function (err) {
      if (err) {
        console.log(err);
      } else console.log('Transfer with SFTP Completd!')
    });
  }else{
    vfs.src([path]).pipe(conn.dest(remotePath))
  }
}

run(_HTMLOptions);
run(_STATICOptions);
