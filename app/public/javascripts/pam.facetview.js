function replaceNumbers(){
    var possibleContainers = ['a', 'td', 'th'];
    var chemsMapping = {'CH4':'CH<sub>4</sub>',
                        'CO2':'CO<sub>2</sub>',
                        'N2O':'N<sub>2</sub>O',
                        'SF6':'SF<sub>6</sub>'};
    jQuery.each(possibleContainers, function(idx, container){
        var elems = jQuery(container);
        jQuery.each(elems, function(idx, elem){
            if ((jQuery(elem).children().length === 0) || (container === 'a')){
                var shouldReplace = false;
                var replacedText = jQuery(elem).html();
                jQuery.each(chemsMapping, function(key, value){
                    if (replacedText.indexOf(key) !== -1){
                        replacedText = replacedText.replace(key, value);
                        shouldReplace = true;
                    }
                });
                if (shouldReplace){
                    jQuery(elem).html(replacedText);
                }
            }
        });
    });
}

function fixDataTitles(){
    var th_list = [];
    $("#facetview_results thead th").each(function(idx, th){
        th_list.push($(th).text());

    })
    $("#facetview_results tr").each(function(tr_idx, tr){
        $(tr).find("td").each(function(td_idx, td){
            $(td).attr("data-title", th_list[td_idx]);
        });
    });
}

function removeMissingDetails(){
    $.each($(".details_link"), function(idx, link){
        if (($(link).attr("href") === undefined) || ($(link).attr("href") === "")){
            var tmp_text = $(link).text();
            var container = $(link).parent()
            $(container).text(tmp_text);
            $(link).remove();
        }
    });
}

function viewReady(){
    addHeaders("#facetview_results");
    replaceNumbers();
    fixDataTitles();
    removeMissingDetails();
}

jQuery(document).ready(function($) {
    eea_facetview('.facet-view-simple', 
        {
            search_url: './api',
            search_index: 'elasticsearch',
            datatype: 'json',
            initial_search: false,
            enable_rangeselect: true,
            enable_geoselect: true,
            post_init_callback: function() {
              add_EEA_settings();
            },
            post_search_callback: function() {
              add_EEA_settings();
              viewReady();
            },
            paging: {
                from: 0,
                size: 10
            }
        });
    replaceNumbers();
});
