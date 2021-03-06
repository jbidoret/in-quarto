

// mdé - in-quarto
// ————————————————————————————————————————————————————————————————————————————

// save booklet to disk via html2canvas

saveAndPrint = function(){
    
    document.mode = "print";

    var foliotage = 0;
    var d = new Date();
    var dirname = ISODateString(d);

    var pprint = function(iter){

        if (foliotage < pages_nb) {
            $body.addClass('print');
            //$cpage = $('.currentpage').first();
            page.setCurrentPage();
            var $cpage = $('#page' + foliotage);
            $('.page').hide();
            $cpage.show();

            var id = $cpage.attr('id');
            
            popup.txt('<p>Préparation de l’impression</p>');
            
            html2canvas(document.getElementById(id), {
                onrendered: function(canvas) {
                    var dataURL = canvas.toDataURL();
                    $.post("canvasdata.php", { data: dataURL, pages_nb:pages_nb, folio:foliotage, dirname:dirname } );   
                    foliotage++;
                    var t = setTimeout(function(){pprint(foliotage)},100);
                    
                },
                //letterRendering:true, // necessary for letter spacing
                background:"#ffffff",
                logging:true,
                //timeout:100, // fails with timeout
                //allowTaint:true,
                width:$cpage.width(),
                height:$cpage.height()
            });
        } else {
            popup.txt("<p>Impression en cours<br>Merci de patienter</p>");
            var t = setTimeout(function(){
                popup.txt("<p>Création d’un nouveau projet</p>");
                var t = setTimeout(function(){
                    //
                    location.reload();
                    //
                    // $body.removeClass('print');
                    // popup.hide();
                    // document.mode = 'layout'
                    // $('.page').show();
                },2000);
            },1000);
            
        }
        
    }

    // Todo : imprimer quatre images !
    var t = setTimeout(function(){pprint(0)},200);

};

