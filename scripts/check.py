"""Check generated pages, local navigation, assets, and key accessibility structure."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
ROOT=Path(__file__).resolve().parents[1]/'dist'
class Page(HTMLParser):
 def __init__(self,path):
  super().__init__();self.path=path;self.ids=set();self.links=[];self.h1=0;self.main=0;self.title=0;self.errors=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:
   if a['id'] in self.ids:self.errors.append('Duplicate id: '+a['id'])
   self.ids.add(a['id'])
  if tag=='h1':self.h1+=1
  if tag=='main':self.main+=1
  if tag=='title':self.title+=1
  if tag=='img' and 'alt' not in a:self.errors.append('Missing image alt')
  if tag=='a' and a.get('target')=='_blank' and 'noopener' not in a.get('rel',''):self.errors.append('External tab lacks noopener')
  for attr in ('href','src'):
   if attr in a:self.links.append(a[attr])
pages={}
for p in ROOT.rglob('*.html'):
 page=Page(p);page.feed(p.read_text());pages[p.resolve()]=page
errors=[]
for p,page in pages.items():
 for e in page.errors:errors.append(f'{p.name}: {e}')
 if (page.h1,page.main,page.title)!=(1,1,1):errors.append(f'{p.name}: expected one H1, main and title')
 for link in page.links:
  u=urlsplit(link)
  if u.scheme or u.netloc:continue
  target=(p.parent/unquote(u.path)).resolve() if u.path else p
  if not target.exists():errors.append(f'{p.name}: missing {link}')
  if u.fragment and target in pages and unquote(u.fragment) not in pages[target].ids:errors.append(f'{p.name}: missing fragment {link}')
if errors:raise SystemExit('\n'.join(errors))
print(f'PASS: {len(pages)} HTML pages; internal links, fragments, assets and structural checks.')
