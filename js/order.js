// UTILITY FUNCTIONS 

function IsNumeric(n) {
    return !isNaN(n);
} 

function CleanNumber(value) {

    // Assumes string input, removes all commas, dollar signs, and spaces      
    newValue = value.replace(",","");
    newValue = newValue.replace("$","");
    newValue = newValue.replace(/ /g,'');
    return newValue;
    
}


// ORDER FORM UTILITY FUNCTIONS

function applyName(klass, numPallets) {
    var toAdd = $("td." + klass).text();
    var actualClass = $("td." + klass).attr("rel");
    $("input." + actualClass).attr("value", numPallets + " pallets");  
}

function removeName(klass) {
    var actualClass = $("td." + klass).attr("rel");
    $("input." + actualClass).attr("value", "");
}


function calcProdSubTotal() { 
    var prodSubTotal = 0;
    $(".rida-kokku-input").each(function() {
        var valString = $(this).val() || 0;
        prodSubTotal += parseFloat(valString);             
    });  
    $("#kokku").val(Math.round(prodSubTotal*100)/100 + " €");
}


// DOM READY
jQuery(document).ready(function(){
    var inc = 1;

    $(".nimi").each(function() {  
        $(this).addClass("prod-" + inc).attr("rel", "prod-" + inc);
        var prodTitle = $(this).text();      
        $("#f").append("<input type='hidden' name='" + prodTitle + "' value='' class='prod-" + inc + "' />");
        inc++;
    });
    
    
    // "The Math" is performed pretty much whenever anything happens in the quanity inputs
    $('.tk').bind("focus blur change keyup", function(){
        
        // Caching the selector for efficiency 
        var $el = $(this);
        //console.log($el.val())
        // Grab the new quantity the user entered
        var numPallets = CleanNumber($el.val());
                
        // Find the pricing
        var multiplier = $el
            .parent().parent().parent()
            .find("td.tk-hind")
            .text();
        //console.log(multiplier);
        //$el.parent().parent().parent().css( "background", "yellow" );

        // If the quantity is empty, reset everything back to empty
        if ( (numPallets == '') ) {
            $el
                .parent().parent()
                .find("td.rida-kokku input")
                .val("");
            var titleClass = $el.parent().parent().find("td.nimi").attr("rel");
            removeName(titleClass);
        
            

        // If the quantity is valid, calculate the row total
        } else if ( (IsNumeric(numPallets)) && (numPallets != '') && (numPallets >= 0) ) {
            var rowTotal = numPallets * multiplier;

            $el
                .parent().parent().parent()
                .find("td.rida-kokku input")
                //.css( "background", "yellow" )
                .val(Math.round(rowTotal*100)/100 + " €"); 
            var titleClass = $el.parent().parent().find("td.nimi").attr("rel");  
            applyName(titleClass, numPallets);
        
        // If the quantity is invalid, let the user know with UI change                                    
        } else {
            $el
                .parent().parent()
                .find("td.rida-kokku input")
                .val("");
            var titleClass = $el.parent().parent().find("td.nimi").attr("rel");
            removeName(titleClass);                                
        };
        
        // Calcuate the overal totals
        calcProdSubTotal();
    });
});