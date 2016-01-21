// Application
define(['jquery', 'kb_data_taxon', 'kb_data_assembly','kb_data_genome_annotation'],
    function ($, Taxon, Assembly, GenomeAnnotation) {
        
        // This URL assumes a CORS proxy from the npm 'corsproxy' module running like this:
        // $ CORSPROXY_PORT=8000 ./node_modules/corsproxy/bin/corsproxy
        var base_url = 'http://localhost:8000/localhost';
        
        // Ports for the services. Assumes they are started like this:
        // $ for s in taxon assembly genome_annotation ; do \
	    //    data_api_start_service.py --config data_api-test.cfg --kbase_url localhost --service $s; \
        //   done
        var api_url_suffix = {
            taxon: ':9101',
            assembly: ':9102',
            annotation: ':9103'
        }

    
        function main() {
            console.log("Gentlemen, start your engines!");

            ///////////
            // Taxon //
            ///////////

            var taxon_ref = '993/674615/1';
            var taxon_obj = Taxon({ref: taxon_ref, url: base_url + api_url_suffix.taxon, token: ''});

            console.debug('Taxon object:', taxon_obj);

            $('#taxon_ref').text(taxon_ref);

            taxon_obj.get_scientific_lineage().then(function(lineage) {
                console.debug('Scientific lineage:', lineage);
                var $table = $('<ul>').css({'list-style-type': 'none'});
                lineage.forEach(function(name, i) {
                    var lmpx = i * 10;
                    var $item = $('<span>').text(name).css({'margin-left': lmpx + 'px'});
                    $table.append($('<li>').add($item));
                });
                $('#taxon_lineage').append($table);
            });

            //////////////
            // Assembly //
            //////////////

            var assembly_ref = '1013/92/2';
            var assembly_obj = Assembly({ref: assembly_ref,
                                         url: base_url + api_url_suffix.assembly,
                                         token: ''});
             $('#assembly_ref').text(assembly_ref);
             assembly_obj.get_stats().then(function(stats) {
                 console.debug('Assembly stats:', stats);
                 var $table = $('<table>');
                 Object.keys(stats).forEach(function(key) {
                     var $row = $('<tr>');
                     $row.append($('<td>').css({'font-weight': '900'}).text(key));
                     $row.append($('<td>').css({'padding-left': '1em'}).text(stats[key]));
                     $table.append($row);
                 });
                 $('#assembly_stats').append($table);
             });


            ///////////////////////
            // Genome Annotation //
            ///////////////////////
         
             var genome_ref = '1013/340/4';
             var genome_obj = GenomeAnnotation({ref: genome_ref,
                                          url: base_url + api_url_suffix.annotation,
                                          token: ''});
            $('#genome_ref').text(genome_ref);
            
            console.debug('Genome obj:', genome_obj);

            // Summary
            genome_obj.get_feature_ids().then(function(feature_ids) {
                var fid_types = feature_ids.by_type;
                var $table = $('<table>');
                var types = Object.keys(fid_types);
                // header row
                var $hdr = $('<tr>');
                $hdr.append($('<th>').text('Feature Type'))
                    .append($('<th>').text('Count'));
                $table.append($hdr);
                // body rows
                Object.keys(fid_types).forEach(function(key) {
                    var $row = $('<tr>');
                    $row.append($('<td>').text(key));
                    $row.append($('<td>').text(fid_types[key].length));
                    $table.append($row);
                });
                $('#genome_features').append($table);
                return fid_types;
            }).then(function(fid_types) {            
                // Selected features
                var fid_cds = fid_types.CDS;
                var num_cds = fid_cds.length;
                var flist = [fid_cds[0],                     // first
                            fid_cds[Math.round(num_cds/2)],  // middle
                            fid_cds[num_cds - 1]];           // last
                return flist;
            }).then(genome_obj.get_features)
            .then(function(feature_data) {
                    var $table = $('<table>').addClass('gridtable');
                    // header row
                    var $hdr = $('<tr>');
                    $hdr.append($('<th>').text('Feature ID'))
                        .append($('<th>').text('Function'))
                        .append($('<th>').text('Location(s) contig/strand/start/len'));
                    $table.append($hdr);
                    Object.keys(feature_data).forEach(function(fid) {
                        var data = feature_data[fid];
                        var $row = $('<tr>');
                        $row.append($('<td>').text(fid));
                        $row.append($('<td>').text(data.feature_function));
                        var region_str = data.feature_locations.map(function(loc) {
                            return [loc['contig_id'], loc['strand'],
                                    loc['start'], loc['length']].join('/');
                        }).join(', ');
                        $row.append($('<td>').text(region_str));
                        $table.append($row);
                    });
                    $('#genome_feature_details').append($table);
                    return feature_data;
            });
        }
    
        main();
    }
);

