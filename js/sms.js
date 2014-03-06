

// mdé - in-quarto
// ————————————————————————————————————————————————————————————————————————————

// create sms slot
// called by longpoll.sms 


var sms = {
	newSMS : function(msg){

		slotId = slots.length + 1;
		var smsSlot = new layout.Slot(slotId, 'sms');
		slots.push(smsSlot);
		
		//smsSlot.html(msg);	
		$currentPage.append(smsSlot);
		layout.initPositionAndSize(smsSlot);		
	}
}