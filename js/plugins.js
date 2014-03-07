
// negative or positive ?
function plusOrMinus(){
    plusminus = Math.random() <= 0.5 ? -1 : 1;
    return plusminus;
}



// datebased naming
function ISODateString(d){
    
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'-'
      + pad(d.getUTCHours())+'-'
      + pad(d.getUTCMinutes())+'-'
      + pad(d.getUTCSeconds())
}

// random time range
function randRange(data) {
   var newTime = data[Math.floor(data.length * Math.random())];
   return newTime;	
}

// shuffle array
function Shuffle(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};