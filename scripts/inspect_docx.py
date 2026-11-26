import zipfile
import xml.etree.ElementTree as ET

docx_path = r'Capstone Project Phase-1 Report preparation and binding Guidelines.docx'
with zipfile.ZipFile(docx_path) as z:
    rels_xml = z.read('word/_rels/document.xml.rels')
    doc_xml = z.read('word/document.xml')
    rels = ET.fromstring(rels_xml)
    doc = ET.fromstring(doc_xml)
    
    r_map = {}
    for r in rels:
        r_map[r.attrib['Id']] = r.attrib.get('Target', '')
    
    for p in doc.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
        text = ''.join([t.text for t in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if t.text])
        blips = [b.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed') 
                 for b in p.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}blip')]
        blips = [b for b in blips if b]
        if blips:
            targets = [r_map.get(b, b) for b in blips]
            print(f'Text near image: "{text}" -> Images: {targets}')
