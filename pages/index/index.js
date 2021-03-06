//index.js
//获取应用实例
var app = getApp()
var period = 1 * 60 * 1000
var interval = 1000
var timeCounter
var flag = 0
var res = wx.getSystemInfoSync()
var sysWidth = res.windowWidth
var sysHeight = res.windowHeight 
var checkedInx
var stopPeriod 
var tmpAngle = -0.5 * Math.PI
var tomatoObj = [
    {'name': '工作', 'data': 0},
    {'name': '学习', 'data': 0},
    {'name': '思考', 'data': 0},
    {'name': '写作', 'data': 0},
    {'name': '运动', 'data': 0},
    {'name': '阅读', 'data': 0}
  ]
// var tomatoDay = [
//     {'day': 0, 'numberOf': 0}
//   ]
var tomatoDay = [{'day': 0, 'numberOf': 0}]
var tomatoArray = [0]

// 调整图片
var fitImg = function(that) {
  var sysWidth = res.windowWidth
  var sysHeight = res.windowHeight
  wx.getImageInfo({
      src: '../../images/bg.png',
      success: function (res) {
        console.log('img width', res.width)
        var scale = sysHeight / res.height
        console.log('img height', scale)
        that.setData({
          imgWidth: sysWidth,
          imgHeight: sysHeight
        })
      }
    })
}

var storeInDay = function(currentDay) {
  var tmp = {'day': currentDay, 'numberOf': 1}
  // tomatoDay.push(tmp)
  var endInx = tomatoDay.length - 1
  if (tomatoDay[endInx].day === currentDay) {
    tomatoDay[endInx].numberOf++
    console.log('in', tomatoArray[endInx])
    tomatoArray[endInx]++
    console.log('in', tomatoArray)
  } else {
    tomatoDay.push(tmp)
    tomatoArray.push(tmp.numberOf)
  }
  console.log('tomatoDay', tomatoDay)
  console.log('tomatoArray', tomatoArray)
  
  // 不到一周时，对数据补零
  var tmpArray = tomatoArray.slice(1)
  var restArray = []
  var len = 7 - tmpArray.length
  if (tmpArray.length < 7) {
    for (var i = 0; i < len; i++) {
      restArray.push(0)
    }
  }
  var result = restArray.concat(tmpArray)
  console.log('result', result)
  // return tomatoDay

  // 大于一周，即多于 7 个元素时，取后面后面 7 个元素
  if (result.length > 7) {
    var start = result.length - 7
    result = result.slice(start)
    console.log('start', start)
  }
  return result
}

var countStart = function(that) {
  // 渲染倒计时时钟
  that.setData({
    time: timeFormat(period)
  })
  if (period <= 0) {
    that.setData({
      time: '✓',
      status: '已完成',
      timeEndDisplay: 'none',
      newDisplay: 'block'
    })
    // timeout则跳出递归
    clearTimeout(timeCounter)
    tomatoObj[checkedInx].data = tomatoObj[checkedInx].data + 1
    console.log('count', tomatoObj[checkedInx].data)
    console.log('tomato obj data', tomatoObj)
    // 存储番茄钟数据
      wx.setStorage({
        key: 'tomato', data: tomatoObj})
      var now = new Date()
      var day = now.getDate()
      // storeInDay(day)
      wx.setStorage({
        key: 'tomatoDays', data: storeInDay(day)})
      return
    }
    // wx.getStorage({
    //   key: 'numberOfTomato',
    //   success: function(res) {
    //     console.log('data', res.data)
    //   } 
    // })
  timeCounter = setTimeout(function() {
    period -= interval
    countStart(that)
    progressCircle()
  }, interval)
  flag = 1
}

var countStop = function() {
  clearTimeout(timeCounter)
  // console.log('period', period)
  return period
}

var countContinue = function(tmpPeriod, that) {
  period = tmpPeriod
  countStart(that)
}

var restartTimer = function(that) {
    period = 1 * 60 * 1000
    tmpAngle = -0.5 * Math.PI
    // var ctx = wx.createCanvasContext('circleCanvas')
    // ctx.clearRect(sysWidth / 2 - 100, 180 - 100, 100, 100)
    // ctx.draw()
    countStart(that)
}

// 时间格式化输出，如 25:19。每 1000ms 都会调用一次
var timeFormat = function(wholeTime) {
  // 换算时间
  var periodSec = (wholeTime / 1000) % 60
  var periodMin = Math.floor(period / 1000 / 60)
  if(periodSec < 10) {
    periodSec = '0' + periodSec
  }
  if(periodMin < 10) {
    periodMin = '0' + periodMin
  }
  return `${periodMin}:${periodSec}`
}

var progressCircle = function() {
  var ctx = wx.createCanvasContext('circleCanvas')
  // 中间圆
  ctx.beginPath()
  ctx.setStrokeStyle('#D3D3D3')
  ctx.setLineWidth(0.5)
  ctx.arc(sysWidth / 2, 180, 110, 0, 2 * Math.PI, true)
  ctx.closePath()
  ctx.stroke()
  // 最外圆
  ctx.beginPath()
  ctx.setStrokeStyle('#DCDCDC')
  ctx.setLineWidth(0.25)
  ctx.arc(sysWidth / 2, 180, 150, 0, 2 * Math.PI, true)
  ctx.closePath()
  ctx.stroke()
  // 动态画圆
  ctx.setLineWidth(2);  
  ctx.setStrokeStyle('#D3D3D3');  
  ctx.setLineCap('round')  
  ctx.beginPath();//开始一个新的路径  
  ctx.arc(sysWidth / 2, 180, 90, 0, 2*Math.PI, false);//设置一个原点(106,106)，半径为100的圆的路径到当前路径  
  ctx.stroke();//对当前路径进行描边     
  ctx.setLineWidth(2.5);  
  ctx.setStrokeStyle('#FEFEFE');  
  ctx.setLineCap('round')  
  // var tmpAngle = 0.24 * Math.PI / 180
  var step = 6 * Math.PI / 180
  tmpAngle = tmpAngle + step
  console.log('tmpAngle', tmpAngle)
  ctx.beginPath();//开始一个新的路径
  ctx.arc(sysWidth / 2, 180, 90, -0.49 * Math.PI, tmpAngle, false); 
  ctx.stroke();//对当前路径进行描边
  
  wx.drawCanvas({
      canvasId: 'circleCanvas',
      actions: ctx.getActions()
    })
}

Page({
  data: {
    status: '计时中',
    continueDisplay: 'hide',
    display: 'block',
    timerDisplay: 'none',
    newDisplay: 'none',
    radioItems: [
      {name: '工作', value: '../../images/work1.png', style: 'label-work-study'},
      {name: '学习', value: '../../images/study1.png', style: 'label-work-study', checked: 'true', font: 'black-font'},
      {name: '思考', value: '../../images/think1.png', style: 'label-think'},
      {name: '写作', value: '../../images/write1.png', style: 'label-write'},
      {name: '运动', value: '../../images/sports1.png'},
      {name: '阅读', value: '../../images/read1.png', style: 'label-read'},
    ],
    hidden: false
  },

  radioChange: function(event) {
    var checked = event.detail.value
    var changed = {}
    var blackFont = {}
    for (var i = 0; i < this.data.radioItems.length; i++) {
      if (checked.indexOf(this.data.radioItems[i].name) !== -1) {
        changed['radioItems['+i+'].checked'] = true
        blackFont['radioItems['+i+'].font'] = 'black-font'
        checkedInx = i
        console.log('check inx', checkedInx)
        // console.log('this.data', this.data.radioItems[i].checked)
        // console.log('change', checked)
        // tomatoObj.kindOf = this.data.radioItems[i].name
        // console.log('findal', tomatoObj.kindOf)
      } else {
        changed['radioItems['+i+'].checked'] = false
        blackFont['radioItems['+i+'].font'] = ''
      }
    }
    // wx.setStorage({
    //   key: 'kindOfTomato', data: count});
    // console.log('event', event)
    console.log('touched font', blackFont)
    this.setData(changed)
    this.setData(blackFont)
  },

  // 事件处理函数 开始计时
  bindViewTap: function(event) {
    console.log('event')
    this.setData({
      display: 'none',
      timerDisplay: 'block',
    })
    fitImg(this)
    // countStart(this)
    restartTimer(this)
    progressCircle()
  },
  // 暂停计时
  stopCount: function() {
    stopPeriod = countStop()
    var stopTime = this.data['time']
    this.setData({
      time: stopTime,
      continueDisplay: 'show',
      pauseDisplay: 'hide',
      status: '已暂停'
    })
    // console.log('stop count')
  },
  // 继续计时
  continueCount: function() {
    countContinue(stopPeriod, this)
    console.log('continueCount')
    this.setData({
      continueDisplay: 'hide',
      pauseDisplay: 'show',
      status: '计时中'
    })
  },
  // 放弃
  giveUp: function() {
    console.log('give up')
    countStop()
    this.setData({
      display: 'block',
      timerDisplay: 'none',
    })
  },
  // 开始新番茄
  newTimer: function() {
    this.setData({
      timeEndDisplay: 'block',
      newDisplay: 'none'
    })
    restartTimer(this)
  },
  onLoad: function () {
    console.log('onLoad')
  }
})



