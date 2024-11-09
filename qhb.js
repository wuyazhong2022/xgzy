auto.waitFor(); //mode = "fast"
var delay_time = 3000;
device.wakeUpIfNeeded();

// 读取自定义配置
var TTXS_PRO_CONFIG = storages.create("TTXS_PRO_CONFIG");
var watchdog = TTXS_PRO_CONFIG.get("watchdog", "2000");
var pinglun = TTXS_PRO_CONFIG.get("pinglun", true);
var shipin = TTXS_PRO_CONFIG.get("shipin", true);
var meiri = TTXS_PRO_CONFIG.get("meiri", true);
var comment = TTXS_PRO_CONFIG.get("comment", "全心全意为人民服务|不忘初心，牢记使命|不忘初心，方得始终|永远坚持党的领导|富强、民主、文明、和谐|自由，平等，公正，法治");



importClass(android.provider.Settings);
/*****************更新内容弹窗部分*****************/
var storage = storages.create('songgedodo');
// 脚本版本号
var last_version = "V1.0";
var engine_version = "V1.0";
var newest_version = "V1.0";
if (storage.get(engine_version, true)) {
  storage.remove(last_version);
  let gengxin_rows = "脚本有风险，仅供学习交流;（点击取消不再提示）".split(";");
  let is_show = confirm(engine_version + "版更新内容", gengxin_rows.join("\n"));
  if (!is_show) {
    storage.put(engine_version, false);
  }
}
var w = fInit();

fInfo("微信抢红包" + newest_version + "脚本初始化");

device.keepScreenOn(3600 * 1000);

var packageName = "com.tencent.mm";
events.observeNotification();

// 处理通知事件
events.onNotification(function (notification) {
    // 只处理来自com.tencent.mm的通知
    if (notification.getPackageName() === packageName) {
        printNotification(notification);
    }
});

fInfo("监听中，请在日志中查看记录的通知及其内容");
//console.show();
sleep(random(200, 500));


function printNotification(notification) {
    fInfo("收到新通知:\n 标题: %s, 内容: %s, \n包名: %s", notification.getTitle(), notification.getText(), notification.getPackageName());
    if (notification.getText() && notification.getPackageName()) {
        if (notification.getText().match("\\[微信红包\\]") && notification.getPackageName().match("com.tencent.mm")) {
            device.wakeUpIfNeeded(); // 亮屏
            sleep(random(1000, 1500)); // 等待屏幕亮起
            swipeToUnlock(500, 1600, 200, 300, 500); // 上滑解锁屏幕
            sleep(random(1000, 1500));
            notification.click();
            fInfo("点击了红包消息页面");
            sleep(random(2500, 2800));     
            searchNewRedpacket();//找有几个红包
        }
        
    }
    
}
//fInfo("监听中，请在日志中查看记录的通知及其内容");



//进入聊天界面查找红包控件有几个，输出

function searchNewRedpacket() {
  var rp_msg_list = id('a3u').find();
 // fInfo("调试信息3" + rp_msg_list);
  if (rp_msg_list.length != 0) {
    fInfo("检测到的红包个数: " + rp_msg_list.length);
    for (var i = 0; i < rp_msg_list.length; i++) {
      var rp_auk = rp_msg_list[i];
      var rp_auk_parent = rp_auk.parent();
      if (rp_auk_parent.childCount() == 1) {
        fInfo("### 发现新红包");
        var rpB = rp_auk_parent.bounds();
        click(rpB.centerX(), rpB.centerY());
        fInfo("成功打开红包消息");
        sleep(random(1500, 1800));
        openBox()
        fClear();
        // back();
      } else if (i == (rp_msg_list.length - 1)) {
        fInfo("当前页面已检测完");

        break;
      } else {
        fInfo("无效红包, 跳过");
      }
      //  back();
      // fInfo("返回页");
    }
  } else if (rp_msg_list.empty()) {
    fInfo("未检测到红包消息" + rp_msg_list.length);
  } else {


    return;
  }
  back();
  home();
  fInfo("返回到主页");
  fClear();
}


function openBox() {
  fClear();
  fInfo("尝试打开新红包")
  sleep(watchdog);
  fInfo("停留5秒");
  var open = desc("开")
  // 判断控件“开”是否存在
  if (open.exists()) {
    var bounds = open.findOne().bounds();
    var x = bounds.centerX();
    var y = bounds.centerY();
    click(x, y);

    fInfo("成功领取一个新红包!!!");
    fInfo("----------------------------------------------")
    sleep(2000);
    fInfo("返回聊天页面");
    back();
    sleep(random(1500, 1800))
  } else {
    fInfo("红包已领取或过期")
    sleep(random(1500, 1800))
    back();
    fInfo("返回聊天窗口");
     sleep(random(1500, 1800))
  }

}


function swipeToUnlock(startX, startY, endX, endY, duration) {
  var randomStartX = startX + random(-50, 50);
  var randomStartY = startY + random(-50, 50);
  var randomEndX = endX + random(-50, 50);
  var randomEndY = endY + random(-50, 50);
  swipe(randomStartX, randomStartY, randomEndX, randomEndY, duration);
}

function 上滑动作() {
  var xyArr = [300]
  var x0 = device.width / 2
  var y0 = device.height / 4 * 3
  x0 = x0 + rndNum(-30, 30)
  y0 = y0 + rndNum(-30, 30)
  //  fInfo('x0,y0',x0,y0)
  var angle = 0
  var x = 0
  var y = 0
  for (let i = 0; i < 30; i++) {
    y = x * tan(angle)
    y = Math.floor(y)
    //  fInfo(y)
    if ((y0 - y) < 0) {
      break
    }
    var xy = [x0 + x, y0 - y]
    xyArr.push(xy)
    x += 5;
    angle += 3
  }
  fInfo(xyArr)
  gesture.apply(null, xyArr)
  function tan(angle) {
    return Math.tan(angle * Math.PI / 180);
  }
}
function rndNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}








/*******************悬浮窗*******************/
function fInit() {
  // ScrollView下只能有一个子布局
  var w = floaty.rawWindow(
    <card cardCornerRadius='8dp' alpha="0.8">
      <vertical>
        <horizontal bg='#FF000000' padding='10 5'>
          <text id='version' textColor="#FFFFFF" textSize="18dip">微信抢红包+</text>
          <text id='title' h="*" textColor="#FFFFFF" textSize="13dip" layout_weight="1" gravity="top|right"></text>
        </horizontal>
        <ScrollView>
          <vertical bg='#AA000000' id='container' minHeight='20' gravity='center'></vertical>
        </ScrollView>
      </vertical>
      <relative gravity="right|bottom">
        <text id="username" textColor="#FFFFFF" textSize="12dip" padding='5 0'></text>
      </relative>
    </card>
  );
  ui.run(function () {
    //w.title.setFocusable(true);
    w.version.setText("微信抢红包+" + newest_version);
  });
  w.setSize(720, -2);
  w.setPosition(10, 10);
  w.setTouchable(false);
  return w;
}

function fSet(id, txt) {
  ui.run(function () {
    w.findView(id).setText(txt);
  });
}

function fInfo(str) {
  ui.run(function () {
    let textView = ui.inflate(<text id="info" maxLines="2" textColor="#7CFC00" textSize="15dip" padding='5 0'></text>, w.container);
    textView.setText(str.toString());
    w.container.addView(textView);
  });
  console.info(str);
}

function fError(str) {
  ui.run(function () {
    let textView = ui.inflate(<text id="error" maxLines="2" textColor="#FF0000" textSize="15dip" padding='5 0'></text>, w.container);
    textView.setText(str.toString());
    w.container.addView(textView);
  });
  console.error(str);
}

function fTips(str) {
  ui.run(function () {
    let textView = ui.inflate(<text id="tips" maxLines="2" textColor="#FFFF00" textSize="15dip" padding='5 0'></text>, w.container);
    textView.setText(str.toString());
    w.container.addView(textView);
  });
  console.info(str);
}

function fClear() {
  ui.run(function () {
    w.container.removeAllViews();
  });
}

function fRefocus() {
  threads.start(function () {
    ui.run(function () {
      w.requestFocus();
      w.title.requestFocus();
      ui.post(function () {
        w.title.clearFocus();
        w.disableFocus();
      }, 200);
    });
  });
  sleep(500);
}

