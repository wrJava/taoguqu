// 接口地址
// let urlHeader = 'http://test.taoguqu.com:81';
let urlHeader = 'https://www.taoguqu.com';

// let urlHeader = ''
module.exports = {
  getSessionkey: urlHeader + '/mobile/smallProgram?a=users_js_code_login&js_code=',
  requestsessionid: urlHeader + '/mobile/smallProgram?a=get_user_session_id',
  myoder: urlHeader + '/mobile/appraisal?a=myappraisal&page=',
  zhuanjialiebiao: urlHeader + '/mobile/appraisal?a=getexpertcats',
  shaixuanzhuanjia: urlHeader + '/mobile/appraisal?a=getexperts&v=2.2&page=',
  cangpinfenlei: urlHeader + '/mobile/appraisal?a=getexpertcats',
  upDataImg: urlHeader + '/mobile/smallProgram?a=appraisal_upload',
  payorder: urlHeader + '/mobile/smallProgram?a=small_pay',
  // upDataImg: urlHeader + '/mobile/explorer',
  shenqingtijiao: urlHeader + '/mobile/appraisal?a=appraisalapply',
  getMiyao: urlHeader + '/mobile/smallProgram?a=get_sign',
  cangbaoquan: urlHeader + '/mobile/appraisal?a=getappraisal',
  dianzan: urlHeader + '/mobile/appraisal?a=appraisallikes',
  zhuanjiadanye: urlHeader + '/mobile/appraisal?a=getexperts&id=',
  quxiaodingdan: urlHeader + '/mobile/appraisal?a=cancleappraisal',
  youhuijuan: urlHeader + '/mobile/person?a=getusedcoupon',
  fasong: urlHeader + '/mobile/user?a=sendmobile',
  yanzheng: urlHeader + '/mobile/user?a=check',
  zhuce: urlHeader + '/mobile/user?a=regmobile',
  jianbaojine: urlHeader + '/mobile/appraisal?a=getdfprice',
  thingevalu: urlHeader + '/mobile/appraisal?a=thingevalu',
  appraisallikes: urlHeader + '/mobile/appraisal?a=appraisallikes',
  deleteOrder: urlHeader + '/mobile/appraisal?a=delappraisal&apply_id=',
  replylikes: urlHeader + '/mobile/appraisal?a=replylikes',
  getmycoupon: urlHeader + '/mobile/person?a=getmycoupon',
  getUserUnionid: urlHeader + '/mobile/smallProgram?a=deciphering_user_info',
}