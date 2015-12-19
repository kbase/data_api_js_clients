#!/usr/bin/env python
"""
Generate a fake JavaScript file from the Thrift-generated
JSON and the existing source code documentation.
The resulting JavaScript file can be fed to 'jsdoc' to create
documentation webpages.

For example, to document the Assembly.js wrapper of the assembly.thrift spec:

    thrift -gen json -out . /path/to/assembly.thrift
    ./fakejs.py assembly.json /path/to/Assembly.js asm.js
    jsdoc asm.js

"""
__author__ = 'Dan Gunter <dkgunter@lbl.gov>'

import argparse
import json
import re
import sys

def write_fake_js(input_json, output_stream):
    services = input_json['services']
    module = input_json['name'].capitalize()

    structs = input_json['structs']
    for struct_count, struct_dict in enumerate(structs):
        struct_dict['module'] = module
        doc = JsDocStruct(**struct_dict)
        if struct_count:
            output_stream.write('\n')
        output_stream.write(str(doc))

    main_service = services[0]
    functions = main_service['functions']
    for fn_count, fn_dict in enumerate(functions):
        fn_dict['module'] = module
        doc = JsDocFunction(**fn_dict)
        if fn_count:
            output_stream.write('\n')
        output_stream.write(str(doc))

class JsDocFunction(object):
    """Create a JavaScript documented function from the JSON output
    of the command 'thrift -gen json'.
    """
    def __init__(self, name=None, doc="", arguments=None, returnType=None,
                 exceptions=None, module=None):
        assert name is not None
        assert arguments is not None
        assert returnType is not None
        assert exceptions is not None
        assert module is not None
        arguments = arguments[2:]  # strip token, ref from beginning

        expr = '({}\w+)'.format(module)
        print('@@@ returntype = "{}" expr="{}"'.format(returnType, expr))
        m = re.search(expr, returnType)
        see_also = '\n'.join([' * @see {}~{}'.format(module, g)
                             for g in m.groups()]) if m else ''
        # rearrange the information for formatting
        self.info = {
            'description': (doc.strip() or 'No description.'),
            'args': '\n'.join([' * @param {name} {{{type}}}'.format(**a)
                               for a in arguments]),
            'return': ' * @returns {{{rtype}}}'.format(rtype=returnType),
            'throws': '\n'.join([' * @throws {type}'.format(**e)
                                 for e in exceptions]),
            'name': name,
            'fnargs': ', '.join([a['name'] for a in arguments]),
            'see': see_also
        }
        self._jsdoc = None  # generate the docstring on-demand
        
    def __str__(self):
        if self._jsdoc is None:
            self._jsdoc = '\n'.join([
                '/**',
                ' * {description}',
                ' *',
                ' * @public',
                '{args}',
                '{return}',
                '{throws}',
                '{see}',
                ' */',
                'function {name}({fnargs}) {{ }}',
                ''
            ]).format(**self.info)
        return self._jsdoc

class JsDocStruct(object):
    def __init__(self, module=None, fields=None, name=None, isException=None):
        assert module is not None
        assert fields is not None
        assert name is not None
        self._exc = isException is not None
        self.info = {
            'module': module,
            'name': name,
            'required': [f for f in fields if f['required']],
            'optional': [f for f in fields if not f['required']]
        }
        self._jsdoc = None
        
    def __str__(self):
        if self._exc:
            return ''
            
        if self._jsdoc is None:
            lines = [
                '/**', 
                #' * @namespace',
                ' * @class',
                '*/',
                'var {name} = {{'.format(**self.info),
                '/** @lends {name}.prototype */'.format(**self.info)
            ]
            for vartype in ('required', 'optional'):
                for f in self.info[vartype]:
                    f['desc'] = vartype.capitalize()
                    lines.extend(['/**', #' * {name} field.'.format(**f), ' *',
                       # ' * @module {module}'.format(**self.info),
                        ' * @type {{{type}}}'.format(**f),
                        '*/',
                        '{name} : null,'.format(**f)])
            lines[-1] = lines[-1][:-1]  # strip last comma
            lines.append('}')
            self._jsdoc = '\n'.join(lines)
            
        return self._jsdoc

class SourceFileParser(object):
    def __init__(self, fileobj):
        self._f = fileobj
        self._header_called = False
        
    def header(self):
        self._header_called = True
        header_lines = []

        # pluck out initial module comment
        in_comment = False
        while not in_comment:
            line = self._f.readline()
            if re.match('/\*\*', line):
                header_lines.append(line)
                in_comment = True
        while in_comment:
            line = self._f.readline()
            header_lines.append(line)
            if re.match('\s*\*/', line):
                in_comment = False
                break

        # add simplified require wrapper
        header_lines.append('define([], function () {\n')

        # pluck out class declaration and its comment
        in_comment = False
        while 1:
            line = self._f.readline()
            if in_comment:
                header_lines.append(line)
                if re.match('\s*\*/', line):
                    in_comment = False
            elif re.match('\s*/\*\*', line):
                header_lines.append(line)
                in_comment = True
            elif re.match('\s*var\s*\w+\s*=\s*function\s*\(.*\)', line):
                header_lines.append(line)
                break

        return ''.join(header_lines)
        
    def footer(self):
        assert self._header_called

        # pluck out return statement
        prev_return = None
        while 1:
            line = self._f.readline()
            if not line:
                break
            m = re.search('(return\s+[a-zA-Z]+)', line)
            if m:
                prev_return = m.group(1)
        assert prev_return
        
        return '\n'.join([
            '};',
            prev_return,
            '});'
        ])
        
def cmdline():
    p = argparse.ArgumentParser()
    p.add_argument('json_file')
    p.add_argument('source_file')
    p.add_argument('output_file')
    args = p.parse_args()
    return dict(jsfile=args.json_file, srcfile=args.source_file, 
                outfile=args.output_file)
    
def main():
    args = cmdline()
    with open(args['jsfile']) as infile:
        json_data = json.load(infile)
    with open(args['srcfile']) as srcfile:
        src = SourceFileParser(srcfile)
        with open(args['outfile'], 'w') as outfile:
            outfile.write(src.header())
            write_fake_js(json_data, outfile)
            outfile.write(src.footer())
    return 0
    
if __name__ == '__main__':
    sys.exit(main())