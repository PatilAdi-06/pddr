import zipfile, xml.etree.ElementTree as ET

with zipfile.ZipFile('Personalized_Diet_Capstone_Phase1_Updated.pptx') as z:
    for i in range(1, 31):
        rel_name = f'ppt/slides/_rels/slide{i}.xml.rels'
        slide_name = f'ppt/slides/slide{i}.xml'
        if rel_name in z.namelist():
            rel_xml = z.read(rel_name)
            tree = ET.fromstring(rel_xml)
            media = [r.attrib.get('Target', '') for r in tree if 'media' in r.attrib.get('Target', '')]
            if media:
                s_tree = ET.fromstring(z.read(slide_name))
                texts = [t.text for t in s_tree.iter() if t.text and t.text.strip()]
                title = texts[0] if texts else 'No title'
                print(f'Slide {i} ("{title}"): {media}')
