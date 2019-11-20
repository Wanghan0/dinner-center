/*---------过滤器---------*/

//毫秒转换时间
export function timeTrans(my_time){
  let result='0';
  if(my_time){
    let hours = my_time / 1000 / 60 / 60 ;
    let hoursRound = Math.floor(hours)>0?`${ Math.floor(hours)}小时`:'';
    let minutes = my_time / 1000 / 60  - (60 * Math.floor(hours));
    let minutesRound = Math.floor(minutes)>0?`${ Math.floor(minutes)}分钟`:'';
    let seconds = my_time / 1000  - (60 * 60 * Math.floor(hours)) - (60 * Math.floor(minutes));
    let secondsRound = Math.floor(seconds)>0?`${ Math.floor(seconds)}秒`:'';
    result = `${hoursRound}${minutesRound}${secondsRound}`;
  }
  if(!result){
    result='0秒';
  }
  return result;
}
//标准时间转换时间
export function standardTimeTrans(time){
  if(time){
    let date = new Date(time);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes()< 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
    let s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
    return Y+M+D+h+m+s;
  }else {
    return '';
  }

}
