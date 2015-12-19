.. _js_taxon:

Taxon
=====
.. js:class:: Taxon(config)

    :param object config: Configuration object.
    :throws ArgumentError:

.. js:function:: get_info()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: ObjectInfo

.. js:function:: get_history()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: ObjectHistory

.. js:function:: get_provenance()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: ObjectProvenance

.. js:function:: get_id()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: i64

.. js:function:: get_name()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: string

.. js:function:: get_version()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: string

.. js:function:: get_parent()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: ObjectReference

.. js:function:: get_children()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: list<ObjectReference>

.. js:function:: get_genome_annotations()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: list<ObjectReference>

.. js:function:: get_scientific_lineage()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: list<string>

.. js:function:: get_scientific_name()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: string

.. js:function:: get_taxonomic_id()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: i32

.. js:function:: get_kingdom()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: string

.. js:function:: get_domain()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: string

.. js:function:: get_genetic_code()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: i32

.. js:function:: get_aliases()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: list<string>

.. js:class:: ObjectInfo()

    .. js:attribute:: object_id (i64) Optional
    .. js:attribute:: object_name (string) Optional
    .. js:attribute:: object_reference (string) Optional
    .. js:attribute:: object_reference_versioned (string) Optional
    .. js:attribute:: type_string (string) Optional
    .. js:attribute:: save_date (string) Optional
    .. js:attribute:: version (i64) Optional
    .. js:attribute:: saved_by (string) Optional
    .. js:attribute:: workspace_id (i64) Optional
    .. js:attribute:: workspace_name (string) Optional
    .. js:attribute:: object_checksum (string) Optional
    .. js:attribute:: object_size (i64) Optional
    .. js:attribute:: object_metadata (map<string,string>) Optional

.. js:class:: ExternalDataUnit()

    .. js:attribute:: resource_name (string) Optional
    .. js:attribute:: resource_url (string) Optional
    .. js:attribute:: resource_version (string) Optional
    .. js:attribute:: resource_release_date (string) Optional
    .. js:attribute:: data_url (string) Optional
    .. js:attribute:: data_id (string) Optional
    .. js:attribute:: description (string) Optional

.. js:class:: ObjectProvenanceAction()

    .. js:attribute:: time (string) Optional
    .. js:attribute:: service_name (string) Optional
    .. js:attribute:: service_version (string) Optional
    .. js:attribute:: service_method (string) Optional
    .. js:attribute:: method_parameters (list<binary>) Optional
    .. js:attribute:: script_name (string) Optional
    .. js:attribute:: script_version (string) Optional
    .. js:attribute:: script_command_line (string) Optional
    .. js:attribute:: input_object_references (list<string>) Optional
    .. js:attribute:: validated_object_references (list<string>) Optional
    .. js:attribute:: intermediate_input_ids (list<string>) Optional
    .. js:attribute:: intermediate_output_ids (list<string>) Optional
    .. js:attribute:: external_data (list<ExternalDataUnit>) Optional
    .. js:attribute:: description (string) Optional

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