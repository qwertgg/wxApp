
var app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [
      { name: '横断面调查', value: '横断面调查3' },
      { name: '横断面调查43', value: '横断面调查4', checked: 'true' },
      { name: '横断面调查44', value: '横断面调查5' },
      { name: '横断面调查45', value: '横断面调查6' },
      { name: '横断面调查46', value: '横断面调查7' },
      { name: '横断面调查47', value: '横断面调查8' },
    ],
    
    hidden: false,
    hiddenmodalput: true,//可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框        
  },
  modalinput: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  
  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认  
  confirm: function () {
    this.setData({
      confirmColor: "#3ea5ff",
      hiddenmodalput: true,
      jsInput: function (e) { 
          this.setData({ inpval: e.detail.value })
       }
      
    })
  },  
  radioChange: function (e) {
    var checked = e.detail.value
    var changed = {}
    for (var i = 0; i < this.data.radioItems.length; i++) {
      if (checked.indexOf(this.data.radioItems[i].name) !== -1) {
        changed['radioItems[' + i + '].checked'] = true
      } else {
        changed['radioItems[' + i + '].checked'] = false
      }
    }
    this.setData(changed)
  },
  lookResult: function (e){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    
  }
})