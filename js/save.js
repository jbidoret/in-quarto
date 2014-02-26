

// mdé - in-quarto
// ————————————————————————————————————————————————————————————————————————————

// save booklet to disk via html2canvas

saveAndPrint = function(){
    

    var foliotage = 0;
    var d = new Date();
    var dirname = ISODateString(d);

    var pprint = function(iter){

        if (foliotage < pages_nb) {

            //$cpage = $('.currentpage').first();
            page.setCurrentPage();
            var $cpage = $('#page' + foliotage);
            $('.page').hide();
            $cpage.show();

            var id = $cpage.attr('id');
            console.log(id);

            popup.txt('<p>Préparation de l’impression…</p>');
            
            html2canvas(document.getElementById(id), {
                onrendered: function(canvas) {
                    var dataURL = canvas.toDataURL();
                    $.post("canvasdata.php", { data: dataURL, pages_nb:pages_nb, folio:foliotage, dirname:dirname } );   
                    foliotage++;
                    var t = setTimeout(function(){pprint(foliotage)},400);
                    
                },
                //letterRendering:true, // necessary for letter spacing
                background:"#ffffff",
                logging:true,
                width:$cpage.width(),
                height:$cpage.height()
            });
        } else {
            popup.txt("<p>Impression en cours</p>");
            var t = setTimeout(function(){
                popup.txt("<p>Création d’un nouveau projet</p>");
                var t = setTimeout(function(){
                    location.reload();
                },1000);
            },1000);
            
        }
        
    }

    // Todo : imprimer quatre images !
    var t = setTimeout(function(){pprint(0)},400);

};

