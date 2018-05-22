var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false,
    cards: [],
    selects: [],
    idCache: {},
    isContainA: false,
    isContainB: false,
    isContainC: false,
    isContainD: false,
    indexArray: ["A", "B", "C", "D", "E"]
  },
  lookResult: function () {

  },
  reStart: function () {

    console.log(this.data.idCache.unit_id)
    wx.navigateBack({

    })



    wx.redirectTo({
      url: '../alltest/alltest?unit_id=' + this.data.idCache.unit_id + '&subject_id=' + this.data.idCache.subject_id + '&chapter_id=' + this.data.idCache.chapter_id + '&sortType=' + this.data.idCache.sortType,
    })

  },
  endAnswer: function () {

    //章节练习直接调回首页
    console.log(this.data.sortType)
    if (this.data.idCache.sortType == 1) {

      wx.reLaunch({
        url: '../index',
      })
      return;
    }









    //     wx.showModal({
    //       title: '',
    //       confirmColor:"#3ea5ff",
    //       content: '是否要交卷？',
    //       content: '您还有100道题未答，确定交卷？',
    //       success: function (res) {
    //         if (res.confirm) {
    //           console.log('用户点击确定')

    // //调到首页






    //           this.setData({
    //             showDialog: true
    //           })
    //         } else if (res.cancel) {
    //           console.log('用户点击取消')
    //           this.setData({
    //             showDialog: false
    //           })
    //         }
    //       }
    //     })
  },
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    that.setData({
      idCache: JSON.parse(options.idCache)

    })



    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: 'http://tk.qikeya.com/api/subject/getCardS/subject_id/' + this.data.idCache.subject_id + '/chapter_id/' + this.data.idCache.chapter_id + '/unit_id/' + this.data.idCache.unit_id,
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: res => {
        wx.hideLoading()
        let tmpCardList = []
        let typeList = []
        if (Object.keys(res.data.data.List).length > 0) {
          Object.keys(res.data.data.List).forEach((questionName) => {
            res.data.data.List[questionName].forEach((question) => {

              if (options.selects.indexOf(question.id) != -1) {
                question = { "id": question.id, "type": question.type, "isS": true }
                console.log(question.id)
              } else {
                question = { "id": question.id, "type": question.type, "isS": false }
              }

              tmpCardList.push(question);

              if (question.type == 1) {
                that.setData({
                  isContainA: true
                })
              } else if (question.type == 2) {
                that.setData({
                  isContainB: true
                })

              } else if (question.type == 3) {
                that.setData({
                  isContainC: true
                })
              } else if (question.type == 4) {
                that.setData({
                  isContainD: true
                })
              }

            })
          })
        }

        let arr = [];
        if (options.selects.length > 0) {
          arr = options.selects.split(",");
        }


        console.log('cache' + options.idCache)
        that.setData({
          cards: tmpCardList,
          selects: arr

        })

      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '获取失败'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  selectTap: function (e) {

    console.log(e.target.dataset.select)
    wx.setStorageSync('currentMySelect', e.target.dataset.select)
    wx.navigateBack()
  },
})