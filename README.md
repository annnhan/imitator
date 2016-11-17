imitator
========

一个简单易用的 nodejs 服务器, 主要用于模拟 HTTP 接口数据, 请求代理与转发 。
使用imitator，可以解决前后端分离开发中的数据模拟问题，也可以作为代理服务器与静态资源服务器使用。

### 为什么会有 imitator？

前后端开发协作的过程中，为了不依赖于后端环境，我们常常会和后端童鞋定好接口，然后采用前后端分离的开发模式。
但是这样的模式，需要前端自己来实现接口数据的模拟。通常使用 nginx 可以满足我们绝大部分场景的需求了。
但是，nginx 的配置文件相对前端同学来说还是不够友好，而且有些个性的接口格式无法满足。
imitator 使用 nodejs 并基于 express.js 实现， 配置文件相当简单， 而且易于订制，前端同学使用起来非常顺手。

### 快速上手

1. 安装——首先你要先安装 nodejs 和 npm， 然后全局安装imitator。

        npm install imitator -g

2. 编写配置文件——在你的用户目录(比如我的是/User/hanan)下新建一个名为 Imitatorfile.js 的文件（这是 imitator 的默认配置文件）， 内容如下。

        module.exports = function(imitator) {
            // 返回一个json
            imitator('/json', {name: 'hello world'});
        }

3. 启动服务——命令行输入以下命令，启动 imitator server.

        imitator

4. 浏览器访问 127.0.0.1:8888/json ， 将会看到：

        {"name":"hello world"}


### 命令行参数

imitator 命令接受2参数：

-p 设置 imitator server 的端口号，默认是8888。

-f 设置配置文件的路径，支持相对路径和绝对路径，默认为：用户目录/Imitatorfile.js 。

下面的命令将使用 9000 端口， /home/myconfig.js 这个文件作为配置文件来启动 imitator server 。

    imitator -p 9000 -f /home/myconfig.js

### 配置文件

imitator 的配置文件是其实就是一个 nodejs 模块， module.exports 是一个函数，接受一个参数：imitator 。 通过调用 imitator(option) 来设置一条规则。
其中 option 是规则的参数对象。如：

    module.exports = function(imitator) {
        imitator({
            url: '/json',   // 匹配的url
            result: {name: 'json test'} // 返回的内容
        });
    }

如上，当请求地址匹配到 /json 这个路径的时候，就会返回 {name: 'json test'} 的json字符串。

当 option 中只包含 url，result 两个参数时，可以简写成 imitator(url, result) 的形式，上面的例子可以写成：

    module.exports = function(imitator) {
        imitator('/json', {name: 'json test'});
    }


### 规则参数（option）

配置文件中可以通过 imitator(option) 来制定一条规则，其中参数对象包含以下属性：

#### option.url

必填，设置请求的匹配模式，支持正则。如：

    module.exports = function(imitator) {

        imitator({
            url: '/json',
            ……
        });

        imitator({
            url: /\/\d{1,3}/,  // 支持正则
            ……
        });
    }

#### option.result

必填，设置请求的返回内容，如果是一个 object 或者 array，将会被 JSON.stringify 后返回；如果是一个 function，将会接受 req 和 res 两个参数执行，可用于实现一些个性化的返回内容。如：

    module.exports = function(imitator) {

        imitator({
            ……
            result: 'my result',  //普通字符串
        });

        imitator({
            ……
            result: {name: 'json test'}, //json
        });

        imitator({
            ……
            result: function (req, res) {  // 自定义内容
                if (req.param('name') === 'hanan') {
                    res.send('中年痴呆症患者');
                }
                else {
                    res.send('i do not know .');
                }
            },
        });
    }

#### option.type

设置通过 <a href="https://github.com/broofa/node-mime?_ga=1.127462925.164520609.1437794879#mimelookuppath" target="_blank">mime.lookup()</a> 转化的 Content-Type HTTP header。如：

    module.exports = function(imitator) {

        imitator({
            ……
            type: 'json',  ==> 'application/json'
            ……
        });

        imitator({
            ……
            type: 'html',  ==> 'text/html'
            ……
        });

    }

#### option.headers

设置 HTTP header。如：

    module.exports = function(imitator) {

        imitator({
            ……
            headers: {
                myheadername: 'myheader value'
            }
            ……
        });

    }

#### option.cookies

设置 cookie，如：

    module.exports = function(imitator) {

        imitator({
            ……
            cookies: [
                {name: 'myname', value: 'hanan', maxAge: 900000, httpOnly: true}
            ]
            ……
        });

    }

#### option.timeout

设置请求响应的延时时间，单位为毫秒，如：

     module.exports = function(imitator) {

         imitator({
             ……
             timeout: 1000
             ……
         });

     }

#### option.action

设置请求的接受类型 (GET, POST, PATCH, DELETE...)，如：

     module.exports = function(imitator) {

         imitator({
             ……
             action: 'GET'
             ……
         });

     }

### HTTP代理

通过 imitator.base() 可以将规则之外的请求，转发到其他的服务器上。这样可以在实现接口模拟的同时，使用其他服务器的返回内容。如：

    module.exports = function(imitator) {

         // 这里是各种规则========
         imitator(……);
         imitator(……);
         imitator(……);


         // 没有命中规则的请求, 转发到192.168.8.8:9000下
         imitator.base('http://192.168.8.8:9000');
    }


### 静态目录

通过 imitator.static(url, path) 可以设置静态文件目录。 url 为匹配的请求地址，支持正则；path 为静态文件的目录，路径相对于配置文件。如：

    module.exports = function(imitator) {

         imitator.static('/static', './public');
    }

### 读取文件内容

通过 imitator.file(filePath) 可以读取文件内容，filePath是文件路径，相对于配置文件。如：

    module.exports = function(imitator) {

        // 当请求匹配到 /file 时 ，返回文件 ./myfile.txt 的内容
        imitator('/file', imitator.file('./myfile.txt'));
    }

### 返回jsonp内容

通过 imitator.jsonp(context， callbackName) 可以设置返回 jsonp 内容，其中 context 是内容实体，类型为 object|string， callbackName 为回调函数名称， 默认为 'callback'。如：

    module.exports = function(imitator) {

            // 当请求匹配到 /myjsonp 时，将文件文件 ./myfile.txt 的内容经过 jsonp 包裹后返回
            imitator('/myjsonp', imitator.jsonp(imitator.file('./myfile.txt')));

            // 当请求匹配到 /myjsonp2 时，将一个对象用 'mycb' 这个回调函数名经过 jsonp 包裹后返回，
            imitator('/myjsonp', imitator.jsonp({url: 'annn.me'}, 'mycb'));
        }


### 配置文件(Imitatorfile.js)参考

详见：[https://github.com/hanan198501/imitator/blob/master/test/Imitatorfile.js](https://github.com/hanan198501/imitator/blob/master/test/Imitatorfile.js)


### LICENSE

[MIT](https://opensource.org/licenses/MIT)
