import re
import json
from pypdf import PdfReader

print("Leyendo PDF...")
reader = PdfReader('PAD_EGR_26_solo_CI.pdf')

records = {}
dept = ''
loc = ''

for page_idx, page in enumerate(reader.pages):
    text = page.extract_text()
    for l in text.split('\n'):
        l = l.strip()
        if not l:
            continue
        
        m_dept = re.search(r'Departamento:\s*([A-ZÁÉÍÓÚÑa-z\s]+?)\s+Localidad:\s*([A-ZÁÉÍÓÚÑa-z\.\s]+)', l)
        if m_dept:
            dept = m_dept.group(1).strip()
            loc = m_dept.group(2).strip()
            continue
            
        if any(h in l for h in ['UNIVERSIDAD DE LA REPUBLICA', 'ELECCIONES UNIVERSITARIAS', 'PADRON DE EGRESADOS', 'Apellidos y Nombres', 'Total Localidad', 'Total Departamento', 'Total PADRON', 'PAGINA:', 'ELEC 6']):
            continue
            
        cleaned = re.sub(r'[^\d\-]', '', l)
        if not cleaned:
            continue
            
        digits_only = cleaned.replace('-', '')
        if len(digits_only) < 5:
            continue
            
        records[digits_only] = [cleaned, dept, loc]

print(f"Total registros extraídos: {len(records)}")

# Exportar como archivo JavaScript para que funcione abriéndolo directamente (sin problemas de CORS si se abre local con file://)
with open('datos_padron.js', 'w', encoding='utf-8') as f:
    f.write('const PADRON_DATA = ')
    json.dump(records, f, ensure_ascii=False)
    f.write(';\n')

print("Archivo 'datos_padron.js' generado con éxito.")
