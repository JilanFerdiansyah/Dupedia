"""Build public/data/dupedia.json from data/perfume-database.json.

Run:  python3 scripts/build-data.py   (needs numpy)

What it precomputes for the matcher (see README):
- TF-IDF note vectors (heart/base notes weigh more than top notes)
- note embeddings learned from note co-occurrence (PPMI + SVD), so related notes partly match
- family vectors smoothed along the fragrance wheel, character vectors
- explanation data (notes, families, character attributes) for the result text
"""
import json, math, os, sys
import numpy as np
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = json.load(open(os.path.join(ROOT, 'data', 'perfume-database.json'), encoding='utf-8'))
P = d['perfumes']; N = len(P)
keys = sorted({k for p in P for k in p['note_keys']})
kid = {k: i for i, k in enumerate(keys)}
df = np.zeros(len(keys))
for p in P:
    for k in set(p['note_keys']): df[kid[k]] += 1
idf = np.log(N / df)
TIER = {'top': .7, 'middle': 1.0, 'base': 1.2}
def tf(p):
    v = {}
    for t, w in TIER.items():
        for n in p['notes'].get(t) or []:
            k = n.strip().lower()
            if k in kid: v[kid[k]] = max(v.get(kid[k], 0), w)
    for k in p['note_keys']: v.setdefault(kid[k], 1.0)
    return {i: w * idf[i] for i, w in v.items()}
TF = [tf(p) for p in P]
V = len(keys); C = np.zeros((V, V))
for p in P:
    ids = list({kid[k] for k in p['note_keys']})
    for a in ids:
        for b in ids:
            if a != b: C[a, b] += 1
tot = C.sum(); r = C.sum(1, keepdims=True); c = C.sum(0, keepdims=True)
with np.errstate(divide='ignore', invalid='ignore'):
    pmi = np.log((C * tot) / (r * c)); pmi[~np.isfinite(pmi)] = 0; pmi[pmi < 0] = 0
U, S, _ = np.linalg.svd(pmi, full_matrices=False); K = 16
E = U[:, :K] * np.sqrt(S[:K]); E /= (np.linalg.norm(E, axis=1, keepdims=True) + 1e-9)
RING = ['Aromatik','Sitrus Segar','Akuatik','Hijau Segar','Fruity','Floral','Floral Lembut','Powdery','Amber Lembut','Gourmand','Amber','Woody','Woody Lumut','Kering & Smoky']
CH = ['Hangat','Nyaman','Menyegarkan','Playful','Bersih','Misterius','Menenangkan','Elegan','Sensual','Tegas','Ringan','Energik','Earthy','Mewah','Sejuk']
def unit(v):
    n = np.linalg.norm(v); return v / n if n > 0 else None
q = lambda v: [int(round(x * 100)) for x in v]
FAMKEY = {'Floral':'floral','Floral Lembut':'floral','Powdery':'powdery','Sitrus Segar':'citrus','Hijau Segar':'green','Woody':'woody','Amber':'amber','Kering & Smoky':'smoky','Aromatik':'aromatic','Fruity':'fruity','Gourmand':'gourmand','Akuatik':'aquatic','Woody Lumut':'woody','Amber Lembut':'amber'}
FAMEN = {'Floral':'Floral','Floral Lembut':'Soft floral','Sitrus Segar':'Citrus','Hijau Segar':'Green','Woody':'Woody','Amber':'Amber','Kering & Smoky':'Smoky','Aromatik':'Aromatic','Fruity':'Fruity','Gourmand':'Gourmand','Powdery':'Powdery','Akuatik':'Aquatic','Woody Lumut':'Mossy','Amber Lembut':'Soft amber'}
FA = {'Aromatik':{'fresh':.6,'dry':.3},'Sitrus Segar':{'fresh':1},'Akuatik':{'fresh':.9},'Hijau Segar':{'fresh':.8},'Fruity':{'sweet':.6,'fresh':.3},'Floral':{'floral':1},'Floral Lembut':{'floral':.8,'warm':.2},'Powdery':{'floral':.4,'warm':.3,'sweet':.2},'Amber Lembut':{'warm':.6,'sweet':.4},'Gourmand':{'sweet':1,'warm':.5},'Amber':{'warm':1,'sweet':.4},'Woody':{'warm':.5,'dry':.5},'Woody Lumut':{'dry':.6,'fresh':.2},'Kering & Smoky':{'dry':1,'warm':.4}}
CA = {'Hangat':{'warm':1},'Menyegarkan':{'fresh':1},'Bersih':{'fresh':.6},'Sejuk':{'fresh':.8},'Ringan':{'fresh':.4},'Misterius':{'dry':.4,'warm':.3},'Sensual':{'warm':.6,'sweet':.3},'Nyaman':{'warm':.5,'sweet':.3},'Earthy':{'dry':.6},'Tegas':{'dry':.4}}
AX = ['fresh','warm','sweet','floral','dry']
picks, img, fam, notes_s, pinfo, dbv, shop = [], [], [], [], [], [], []
for p, t in zip(P, TF):
    ids = sorted(t); w = np.array([t[i] for i in ids]); w = w / (np.linalg.norm(w) or 1)
    emb = unit(sum(t[i] * E[i] for i in ids)) if ids else None
    if emb is None: emb = np.zeros(K)
    fv = np.zeros(len(RING))
    for f in p['families']:
        if f in RING:
            j = RING.index(f); fv[j] += 1; fv[(j-1) % len(RING)] += .45; fv[(j+1) % len(RING)] += .45
    fv = unit(fv)
    cv = np.zeros(len(CH))
    for ch in p['characters']:
        if ch in CH: cv[CH.index(ch)] = 1
    cv = unit(cv)
    dbv.append([ids, q(w), q(emb), q(fv) if fv is not None else 0, q(cv) if cv is not None else 0])
    picks.append([p['name'], p['brand']])
    img.append(p.get('image_url') or '')
    fam.append(FAMKEY.get(p['families'][0], 'unknown') if p['families'] else 'unknown')
    nl = []
    for tier in ['top', 'middle', 'base']:
        for n in p['notes'].get(tier) or []:
            k = n.strip().lower()
            if k in kid and all(x[1] != k for x in nl): nl.append([n.strip(), k, round(float(idf[kid[k]]), 2), tier[0]])
    notes_s.append(', '.join(x[0] for x in nl[:3]))
    a = dict.fromkeys(AX, 0.0); cnt = 0
    for f in p['families']:
        for k, v in FA.get(f, {}).items(): a[k] += v
        cnt += 1
    for ch in p['characters']:
        for k, v in CA.get(ch, {}).items(): a[k] += v * .7
        cnt += .7
    pinfo.append({'n': nl, 'f': [FAMEN.get(f, f) for f in p['families']], 'a': [round(a[x] / cnt, 2) if cnt else 0 for x in AX], 'has': cnt > 0})
    shop.append(p.get('purchase_url') or '')
# curated sphere photos: clean bottle shots first, then the rest with images
CURATED = ['Lumiere du Soleil','High Tide Low Tide','Out West P.M.','1963','Capri in Summer','Ardour','Paradiso','Day','Tuberose','Sunpetal','Kembang Sinantara','01 IVY','Olgaline','Sanguine','AV. MONTAIGNE','Lychee Crush','Kashmir Oud','Muskmallow','Whisper of Rice','Rose Pepper Scissors','Shelby','Kenangan Tea Blend','The Prestige','Forbidden Bloom','Imperfection','Pina Colada in Havana','A Bouquet For Me','HUMARA','Rose de Praline',"JEAN de l'Ours",'Majestic Night','AMIRAH','Arumanis','Pearadise','Firenze','Aura Ubud','Florian','Solace','Aquamarine','Crave For Vanilla','Tangled Thread','The ORNs']
byname = {}
for i, p in enumerate(P): byname.setdefault(p['name'], i)
clean = [byname[n] for n in CURATED if n in byname and img[byname[n]]]
out = {'n': N, 'picks': picks, 'img': img, 'fam': fam, 'notes': notes_s, 'pinfo': pinfo, 'dbv': dbv, 'clean': clean, 'shop': shop}
os.makedirs(os.path.join(ROOT, 'public', 'data'), exist_ok=True)
json.dump(out, open(os.path.join(ROOT, 'public', 'data', 'dupedia.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('perfumes', N, 'with images', sum(1 for x in img if x), 'curated', len(clean))
