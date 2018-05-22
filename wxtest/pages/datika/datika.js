// pages/datika.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allQuesNum: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var quesNum = wx.getStorageSync("allQuesNum")
    var AnsArr = wx.getStorageSync("myAnsArr")
    // var tempAnsArr = []

    var tempNum = []
    for (var i = 0; i < quesNum; i++) {
      var isdone = false
      for (var j = 0; j < AnsArr.length; j++) {
        if (parseInt(AnsArr[j]["key"]) - 1 == i) {
          isdone = true
        }

      }
      tempNum.push({
        "quesID": i,
        "isDone": isdone
      })
    }

    this.setData({
      allQuesNum: tempNum,

    })
  },

  selectTap: function (e) {

    console.log(e.target.dataset.select)
    wx.setStorageSync('currentMySelect', e.target.dataset.select)
    wx.navigateBack()
  }
})