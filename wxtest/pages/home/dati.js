
// pages/home/dati.js


Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionC: [],
    currentQue: {},
    currentQueNum: 1,
    allQue: 10,
    myselectAnswer: "",
    myselectAnswerIndex: -1,
    myselectAnswerArray: [],
    indexArray: ["A", "B", "C", "D", "E"],
    rightAnswerIndex: -1,
  },




// 从服务器获取数据
  loadDataFromServer: function () {
    var that = this
    // console.log(this.data.currentQueNum);
    wx.request({
      url: 'https://tk.qikeya.com/api/question/getQuestionSingle/id/' + that.data.currentQueNum,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        // that.setData({
        //   currentQue: res.data.data
        // })



        // this.setData({ questionC: res.data.data })
        // console.log(res.data.data);
        // 本地缓存
        // wx.setStorage({ "key": "key", data: res.data.data.id })
        wx.setStorage({
          key: String(res.data.data.id),
          data: res.data.data,
        })
        that.loadDataFromLocal()





      }
    })
  },
  // 从本地获取数据
  loadDataFromLocal: function () {
    var that = this
    wx.getStorage({
      key: String(this.data.currentQueNum),
      success: function (res) {

        //  console.log(res.data);

        that.setData({
          currentQue: res.data,
          rightAnswerIndex: that.answerToIndex(res.data.answer)


        })

      },
    })
  },
  //加载数据
  loadData: function () {
    this.loadDataFromServer()
    this.loadDataFromLocal()
    this.myDoneTi()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.currentQueNum = 1
    this.loadData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var currentMySelect = wx.getStorageSync("currentMySelect")
    if(currentMySelect>0){
      this.setData({
        currentQueNum: currentMySelect
      })
      wx.removeStorageSync('currentMySelect')
      this.loadData()
    }
    

  },

 
// 上一题
  upTi: function () {

    var tempCurrentNum = this.data.currentQueNum - 1
    if (tempCurrentNum < 1) {
      return
    }
    this.setData({
      currentQueNum: tempCurrentNum
    })

    this.loadData()
  },
// 下一题
  downTi: function () {

    var tempCurrentNum = this.data.currentQueNum + 1
    if (tempCurrentNum > this.data.allQue) {
      return
    }
    this.setData({
      currentQueNum: tempCurrentNum
    })
    this.loadData()
    
  },
// 索引转字母
  mySelect: function (n) {

    if (n == "0") {
      return "A"
    } else if (n == "1") {
      return "B"
    } else if (n == "2") {
      return "C"
    } else if (n == "3") {
      return "D"
    } else if (n == "4") {
      return "E"
    }
  },
  // 字母转索引
  answerToIndex: function (n) {
    if (n == "A") {
      return "0"
    } else if (n == "B") {
      return "1"
    } else if (n == "C") {
      return "2"
    } else if (n == "D") {
      return "3"
    } else if (n == "E") {
      return "4"
    }
  },
// radio事件
  listenerRadioGroup: function (e) {
    // console.log(e.detail.value)
    var my = this.mySelect(e.detail.value)

    var keyId = String(this.data.currentQueNum)

    // console.log("aaa" + this.data.currentQueNum)

    for (var i = 0; i < this.data.myselectAnswerArray.length; i++) {

      if (this.data.myselectAnswerArray[i]["key"] == this.data.currentQueNum) {
        this.data.myselectAnswerArray.splice(i, 1)
      }
    }

    this.data.myselectAnswerArray.push({
      "key": keyId,
      "value": my,
      "valueIndex": e.detail.value
    })

    if (this.data.myselectAnswerArray.length == 0) {
      return
    }
    this.setData({
      myselectAnswerArray: this.data.myselectAnswerArray
    })

    this.myDoneTi()

  },
  //已经做过的题
  myDoneTi: function () {
    var my = ""
    var myIndex = -1
    for (var i = 0; i < this.data.myselectAnswerArray.length; i++) {

      if (this.data.myselectAnswerArray[i]["key"] == this.data.currentQueNum) {
        // console.log("bbb" + this.data.myselectAnswerArray[i]["value"])
        my = this.data.myselectAnswerArray[i]["value"]
        myIndex = this.data.myselectAnswerArray[i]["valueIndex"]
      }
    }


    this.setData({
      myselectAnswer: my,
      myselectAnswerIndex: myIndex
    })
  },
//答题卡
  datika: function () {

    wx.setStorageSync('allQuesNum', this.data.allQue)
    wx.setStorageSync('myAnsArr', this.data.myselectAnswerArray)
    wx.navigateTo({
      url: '../datika/datika',
    })
  },

})








