.. _js_assembly:

Assembly
========
.. js:class:: Assembly(config)

    :param object config: Configuration object.
    :throws ArgumentError:

.. js:function:: get_assembly_id()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: string

.. js:function:: get_genome_annotations()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: list<ObjectReference>

.. js:function:: get_external_source_info()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns:  :js:class:`AssemblyExternalSourceInfo` 

.. js:function:: get_stats()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns:  :js:class:`AssemblyStats` 

.. js:function:: get_number_contigs()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: i64

.. js:function:: get_gc_content()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: double

.. js:function:: get_dna_size()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: i64

.. js:function:: get_contig_ids()

    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: list<string>

.. js:function:: get_contig_lengths(contig_id_list)

    :param list<string> contig_id_list:
    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: map<string,i64>

.. js:function:: get_contig_gc_content(contig_id_list)

    :param list<string> contig_id_list:
    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: map<string,double>

.. js:function:: get_contigs(contig_id_list)

    :param list<string> contig_id_list:
    :throws ServiceException:
    :throws AuthorizationException:
    :throws AuthenticationException:
    :throws ObjectReferenceException:
    :throws AttributeException:
    :throws TypeException:
    :returns: map<string, :js:class:`AssemblyContig` >

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

.. js:class:: AssemblyStats()

    .. js:attribute:: num_contigs (i64) Optional
    .. js:attribute:: dna_size (i64) Optional
    .. js:attribute:: gc_content (double) Optional

.. js:class:: AssemblyExternalSourceInfo()

    .. js:attribute:: external_source (string) Optional
    .. js:attribute:: external_source_id (string) Optional
    .. js:attribute:: external_source_origination_date (string) Optional

.. js:class:: AssemblyContig()

    .. js:attribute:: contig_id (string) Optional
    .. js:attribute:: sequence (string) Optional
    .. js:attribute:: length (i64) Optional
    .. js:attribute:: gc_content (double) Optional
    .. js:attribute:: md5 (string) Optional
    .. js:attribute:: name (string) Optional
    .. js:attribute:: description (string) Optional
    .. js:attribute:: is_complete (bool) Optional
    .. js:attribute:: is_circular (bool) Optional