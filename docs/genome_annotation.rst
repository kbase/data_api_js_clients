.. _js_genome_annotation:

Genome annotation
=================
.. js:class:: Genome_annotation(config)

    :param object config: Configuration object.
    :throws ArgumentError:

.. js:function:: get_taxon()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: ObjectReference

.. js:function:: get_assembly()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: ObjectReference

.. js:function:: get_feature_types()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: list<string>

.. js:function:: get_feature_type_descriptions(feature_type_list)

    :param list<string> feature_type_list:
    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: map<string,string>

.. js:function:: get_feature_type_counts(feature_type_list)

    :param list<string> feature_type_list:
    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: map<string,i64>

.. js:function:: get_feature_ids(filters, group_type)

    :param Feature_id_filters filters:
    :param string group_type:
    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: Feature_id_mapping

.. js:function:: get_features(feature_id_list)

    :param list<string> feature_id_list:
    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: map<string,Feature_data>

.. js:function:: get_proteins()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: map<string,Protein_data>

.. js:function:: get_feature_locations(feature_id_list)

    :param list<string> feature_id_list:
    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: map<string,list<Region>>

.. js:function:: get_feature_publications(feature_id_list)

    :param list<string> feature_id_list:
    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: map<string,list<string>>

.. js:function:: get_feature_dna(feature_id_list)

    :param list<string> feature_id_list:
    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: map<string,string>

.. js:function:: get_feature_functions(feature_id_list)

    :param list<string> feature_id_list:
    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: map<string,string>

.. js:function:: get_feature_aliases(feature_id_list)

    :param list<string> feature_id_list:
    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: map<string,list<string>>

.. js:function:: get_cds_by_gene(gene_id_list)

    :param list<string> gene_id_list:
    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: map<string,list<string>>

.. js:function:: get_cds_by_mrna(mrna_id_list)

    :param list<string> mrna_id_list:
    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: map<string,string>

.. js:function:: get_gene_by_cds(cds_id_list)

    :param list<string> cds_id_list:
    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: map<string,string>

.. js:function:: get_gene_by_mrna(mrna_id_list)

    :param list<string> mrna_id_list:
    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: map<string,string>

.. js:function:: get_mrna_by_cds(gene_id_list)

    :param list<string> gene_id_list:
    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: map<string,string>

.. js:function:: get_mrna_by_gene(gene_id_list)

    :param list<string> gene_id_list:
    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: map<string,list<string>>

.. js:class:: ServiceException()

    .. js:attribute:: message (string) Required
    .. js:attribute:: stacktrace (string) Optional
    .. js:attribute:: inputs (map<string,string>) Optional

.. js:class:: AuthorizationException()

    .. js:attribute:: message (string) Required
    .. js:attribute:: stacktrace (string) Optional

.. js:class:: AuthenticationException()

    .. js:attribute:: message (string) Required
    .. js:attribute:: stacktrace (string) Optional

.. js:class:: ObjectReferenceException()

    .. js:attribute:: message (string) Required
    .. js:attribute:: stacktrace (string) Optional

.. js:class:: AttributeException()

    .. js:attribute:: message (string) Required
    .. js:attribute:: stacktrace (string) Optional

.. js:class:: TypeException()

    .. js:attribute:: message (string) Required
    .. js:attribute:: stacktrace (string) Optional
    .. js:attribute:: valid_types (list<string>) Optional

.. js:class:: Region()

    .. js:attribute:: contig_id (string) Optional
    .. js:attribute:: strand (string) Optional
    .. js:attribute:: start (i64) Optional
    .. js:attribute:: length (i64) Optional

.. js:class:: Feature_id_filters()

    .. js:attribute:: type_list (list<string>) Optional
    .. js:attribute:: region_list (list<Region>) Optional
    .. js:attribute:: function_list (list<string>) Optional
    .. js:attribute:: alias_list (list<string>) Optional

.. js:class:: Feature_id_mapping()

    .. js:attribute:: by_type (map<string,list<string>>) Optional
    .. js:attribute:: by_region (map<string,map<string,map<string,list<string>>>>) Optional
    .. js:attribute:: by_function (map<string,list<string>>) Optional
    .. js:attribute:: by_alias (map<string,list<string>>) Optional

.. js:class:: Feature_data()

    .. js:attribute:: feature_id (string) Optional
    .. js:attribute:: feature_type (string) Optional
    .. js:attribute:: feature_function (string) Optional
    .. js:attribute:: feature_aliases (map<string,list<string>>) Optional
    .. js:attribute:: feature_dna_sequence_length (i64) Optional
    .. js:attribute:: feature_dna_sequence (string) Optional
    .. js:attribute:: feature_md5 (string) Optional
    .. js:attribute:: feature_locations (list<Region>) Optional
    .. js:attribute:: feature_publications (list<string>) Optional
    .. js:attribute:: feature_quality_warnings (list<string>) Optional
    .. js:attribute:: feature_quality_score (list<string>) Optional
    .. js:attribute:: feature_notes (list<string>) Optional
    .. js:attribute:: feature_inference (string) Optional

.. js:class:: Protein_data()

    .. js:attribute:: protein_id (string) Optional
    .. js:attribute:: protein_amino_acid_sequence (string) Optional
    .. js:attribute:: protein_function (string) Optional
    .. js:attribute:: protein_aliases (list<string>) Optional
    .. js:attribute:: protein_md5 (string) Optional
    .. js:attribute:: protein_domain_locations (list<string>) Optional